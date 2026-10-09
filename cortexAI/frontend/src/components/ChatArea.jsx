import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./Nav.jsx";
import MessageList from "./MessageList.jsx";
import ChatInput from "./ChatInput.jsx";
import { getMessages } from "../features/getMessages";
import { sendAgentMessage } from "../features/sendAgentMessage";
import { updateConversation } from "../features/updateConversation";
import { createconversation } from "../features/createConversation";
import {
  updateConversationTitle,
  addConversation,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { setMessages as setReduxMessages } from "../redux/messageSlice";

// Helper to extract component code for default canvas selection
const extractArtifact = (text) => {
  if (!text) return null;
  const match = text.match(/```(?:jsx|tsx|javascript|js|html)?\n([\s\S]*?)```/);
  if (match && match[1] && match[1].trim().length > 30) {
    const code = match[1].trim();
    let title = "ComponentArtifact.jsx";
    const compMatch = code.match(
      /function\s+([A-Za-z0-9_]+)|const\s+([A-Za-z0-9_]+)\s*=/
    );
    if (compMatch) {
      title = `${compMatch[1] || compMatch[2]}.jsx`;
    }
    return {
      title,
      language: "jsx",
      code,
    };
  }
  return null;
};

const ChatArea = ({
  userData,
  isSidebarOpen = false,
  onToggleSidebar,
  onNewChat,
  isArtifactOpen,
  onToggleArtifact,
  onSelectArtifact,
  onOpenBilling,
}) => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const conversationId = selectedConversation?._id || selectedConversation?.id;

  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeChip, setActiveChip] = useState("Swarm");
  const [statusMessage, setStatusMessage] = useState(
    "Orchestrating agent swarm..."
  );

  // Fetch messages from backend when conversation changes
  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        dispatch(setReduxMessages([]));
        return;
      }
      try {
        const msgs = await getMessages(conversationId);
        if (isMounted) {
          const formatted = (msgs || []).map((m, idx) => ({
            id: m._id || `${Date.now()}-${idx}`,
            role: m.role || "assistant",
            content: m.content || "",
            createdAt: m.createdAt,
            artifact: extractArtifact(m.content),
            agent: m.agent || "swarm",
          }));
          setMessages(formatted);
          dispatch(setReduxMessages(formatted));
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [conversationId, dispatch]);

  const handleSendMessage = async (textToSend) => {
    const rawText = (textToSend || inputPrompt).trim();
    if (!rawText || isGenerating) return;

    let promptWithMode = rawText;
    if (activeChip === "Code" && !rawText.toLowerCase().startsWith("code:")) {
      promptWithMode = `Please provide complete working code: ${rawText}`;
    } else if (
      activeChip === "Search" &&
      !rawText.toLowerCase().startsWith("search:")
    ) {
      promptWithMode = `Search and analyze: ${rawText}`;
    } else if (
      activeChip === "Canvas" &&
      !rawText.toLowerCase().startsWith("ui:")
    ) {
      promptWithMode = `Create an interactive React component artifact for: ${rawText}`;
    } else if (
      activeChip === "Vision" &&
      !rawText.toLowerCase().startsWith("vision:")
    ) {
      promptWithMode = `Vision and visual analysis: ${rawText}`;
    }

    const tempUserMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: rawText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputPrompt("");
    setIsGenerating(true);
    setStatusMessage("Routing request through agent nodes...");

    try {
      const statusTimer = setTimeout(() => {
        setStatusMessage("Agent specialist synthesizing response...");
      }, 1200);

      // Lazily create conversation if this is a fresh chat
      let activeConvId = conversationId;
      if (!activeConvId) {
        const smartTitle =
          rawText.length > 28 ? `${rawText.substring(0, 26)}...` : rawText;
        try {
          const newConv = await createconversation();
          if (newConv) {
            newConv.title = smartTitle;
            activeConvId = newConv._id || newConv.id;
            dispatch(addConversation(newConv));
            dispatch(setSelectedConversation(newConv));
            await updateConversation(activeConvId, smartTitle);
          }
        } catch (createErr) {
          console.error("Failed to create conversation:", createErr);
        }
      }

      const response = await sendAgentMessage(
        promptWithMode,
        activeConvId || "default-conv"
      );
      clearTimeout(statusTimer);

      const replyContent =
        response?.response ||
        response?.message ||
        "Task processed by Cortex AI Swarm.";
      const detectedArtifact = extractArtifact(replyContent);

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        agent: response?.agent || activeChip.toLowerCase(),
        artifact: detectedArtifact,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (detectedArtifact && onSelectArtifact) {
        onSelectArtifact(detectedArtifact);
      }

      if (
        conversationId &&
        (!selectedConversation?.title ||
          selectedConversation?.title === "New Chat" ||
          selectedConversation?.title === "New chat")
      ) {
        const smartTitle =
          rawText.length > 28 ? `${rawText.substring(0, 26)}...` : rawText;
        try {
          await updateConversation(conversationId, smartTitle);
          dispatch(
            updateConversationTitle({
              conversationId,
              title: smartTitle,
            })
          );
        } catch (e) {
          console.warn("Could not update conversation title:", e);
        }
      }
    } catch (err) {
      console.error("Agent error:", err);
      const fallbackReply = `Agent response error (${
        err?.response?.data?.message || err.message
      }). Please verify that backend services and Redis are active.`;
      const fallbackArtifact = extractArtifact(rawText);

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: fallbackReply,
          artifact: fallbackArtifact,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex-1 h-full rounded-2xl border border-[#262626] bg-[#141414] p-3 flex flex-col justify-between overflow-hidden relative select-none shadow-2xl transition-all">
      {/* Top Header Bar */}
      <Nav
        title={selectedConversation?.title || "CortexAI"}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={onToggleSidebar}
        onNewChat={onNewChat}
        isArtifactOpen={isArtifactOpen}
        onToggleArtifact={onToggleArtifact}
        onOpenBilling={onOpenBilling}
        userData={userData}
      />

      {/* Main Message Canvas & Message Stream */}
      <MessageList
        messages={messages}
        isGenerating={isGenerating}
        statusMessage={statusMessage}
        onSelectArtifact={onSelectArtifact}
        onToggleArtifact={onToggleArtifact}
        isArtifactOpen={isArtifactOpen}
        onQuickPromptSelect={(prompt) => handleSendMessage(prompt)}
      />

      {/* Bottom Input Dock */}
      <ChatInput
        inputPrompt={inputPrompt}
        setInputPrompt={setInputPrompt}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        activeChip={activeChip}
        setActiveChip={setActiveChip}
      />
    </main>
  );
};

export default ChatArea;
