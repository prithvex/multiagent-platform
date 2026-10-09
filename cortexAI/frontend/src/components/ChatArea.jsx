import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getMessages } from "../features/getMessages";
import { sendAgentMessage } from "../features/sendAgentMessage";
import { updateConversation } from "../features/updateConversation";
import { createconversation } from "../features/createConversation";
import {
  updateConversationTitle,
  addConversation,
  setSelectedConversation,
} from "../redux/conversationSlice";
import {
  ArrowUp,
  Globe,
  Code2,
  Network,
  Bot,
  PanelRight,
  PanelLeft,
  SquarePen,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Terminal,
  Cpu,
} from "lucide-react";

// Helper to extract component code for default canvas selection
const extractArtifact = (text) => {
  if (!text) return null;
  const match = text.match(/```(?:jsx|tsx|javascript|js|html)?\n([\s\S]*?)```/);
  if (match && match[1] && match[1].trim().length > 30) {
    const code = match[1].trim();
    let title = "ComponentArtifact.jsx";
    const compMatch = code.match(/function\s+([A-Za-z0-9_]+)|const\s+([A-Za-z0-9_]+)\s*=/);
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

// Custom CodeBlock rendered by ReactMarkdown
const CodeBlock = ({
  language,
  code,
  onSelectArtifact,
  onToggleArtifact,
  isArtifactOpen,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUIArtifact =
    ["jsx", "tsx", "javascript", "js", "html"].includes(
      (language || "").toLowerCase()
    ) ||
    code.includes("import React") ||
    code.includes("export default function") ||
    (code.includes("const ") && code.includes("return ("));

  const handleOpenCanvas = () => {
    let title = "ComponentArtifact.jsx";
    const compMatch = code.match(/function\s+([A-Za-z0-9_]+)|const\s+([A-Za-z0-9_]+)\s*=/);
    if (compMatch) {
      title = `${compMatch[1] || compMatch[2]}.jsx`;
    }
    if (onSelectArtifact) {
      onSelectArtifact({
        title,
        language: language || "jsx",
        code,
      });
    }
    if (!isArtifactOpen && onToggleArtifact) {
      onToggleArtifact();
    }
  };

  return (
    <div className="my-3 rounded-xl border border-[#2d2d2d] bg-[#121212] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1b1b1b] border-b border-[#262626] text-xs text-[#8e8e8e]">
        <span className="font-mono text-[11px] text-[#a1a1aa] lowercase">
          {language || "code"}
        </span>
        <div className="flex items-center gap-1.5">
          {isUIArtifact && (
            <button
              onClick={handleOpenCanvas}
              title="Preview in Canvas"
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#252525] hover:bg-[#303030] text-[#ececec] text-[11px] font-medium transition cursor-pointer border border-[#333333]"
            >
              <span>Canvas</span>
              <ExternalLink className="w-3 h-3 text-[#a1a1aa]" />
            </button>
          )}
          <button
            onClick={handleCopyCode}
            title="Copy code"
            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-[#252525] text-[#a1a1aa] hover:text-white text-[11px] transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span className="text-white">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[11px] sm:text-xs font-mono leading-relaxed text-[#e4e4e7] custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ChatArea = ({
  userData,
  isSidebarOpen = false,
  onToggleSidebar,
  onNewChat,
  isArtifactOpen,
  onToggleArtifact,
  onSelectArtifact,
}) => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const conversationId = selectedConversation?._id || selectedConversation?.id;

  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeChip, setActiveChip] = useState("Swarm");
  const [copiedId, setCopiedId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Orchestrating agent swarm...");

  const messagesEndRef = useRef(null);

  // Fetch messages from backend when conversation changes
  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      if (!conversationId) {
        setMessages([]);
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
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend) => {
    const rawText = (textToSend || inputPrompt).trim();
    if (!rawText || isGenerating) return;

    let promptWithMode = rawText;
    if (activeChip === "Code" && !rawText.toLowerCase().startsWith("code:")) {
      promptWithMode = `Please provide complete working code: ${rawText}`;
    } else if (activeChip === "Search" && !rawText.toLowerCase().startsWith("search:")) {
      promptWithMode = `Search and analyze: ${rawText}`;
    } else if (activeChip === "Canvas" && !rawText.toLowerCase().startsWith("ui:")) {
      promptWithMode = `Create an interactive React component artifact for: ${rawText}`;
    }

    const tempUserMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: rawText,
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
        response?.response || response?.message || "Task processed by Cortex AI Swarm.";
      const detectedArtifact = extractArtifact(replyContent);

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        agent: response?.agent || "swarm",
        artifact: detectedArtifact,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (detectedArtifact && onSelectArtifact) {
        onSelectArtifact(detectedArtifact);
      }

      if (
        conversationId &&
        (!selectedConversation.title ||
          selectedConversation.title === "New Chat" ||
          selectedConversation.title === "New chat")
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
      const fallbackReply = `Agent response error (${err?.response?.data?.message || err.message}). Please ensure your backend services and Redis are running.`;
      const fallbackArtifact = extractArtifact(rawText);

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: fallbackReply,
          artifact: fallbackArtifact,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    {
      title: "Interactive UI Artifact",
      desc: "Build a responsive React counter widget with live preview",
      prompt: "Create an interactive counter React component artifact with increment, decrement, and reset buttons.",
      icon: Code2,
    },
    {
      title: "Agent Swarm Architecture",
      desc: "Explain the LangGraph router and node graph pipeline",
      prompt: "How does the CortexAI LangGraph router coordinate specialized agents (Chat, Code, Vision, Search)?",
      icon: Network,
    },
    {
      title: "Full-Stack API Design",
      desc: "Review Gateway proxy and microservice auth headers",
      prompt: "Explain how Express Gateway forwards authentication headers like x-user-id to microservices.",
      icon: Terminal,
    },
  ];

  // Custom markdown component overrides for ChatGPT-style typography
  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");
      const isMultiline = codeString.includes("\n") || Boolean(match);

      if (isMultiline) {
        return (
          <CodeBlock
            language={match ? match[1] : ""}
            code={codeString}
            onSelectArtifact={onSelectArtifact}
            onToggleArtifact={onToggleArtifact}
            isArtifactOpen={isArtifactOpen}
          />
        );
      }
      return (
        <code
          className="bg-[#262626] text-[#e4e4e7] px-1.5 py-0.5 rounded font-mono text-[11px] sm:text-xs border border-[#333333]"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre({ children }) {
      return <div className="my-2">{children}</div>;
    },
    p({ children }) {
      return <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-5 mb-2.5 space-y-1">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-5 mb-2.5 space-y-1">{children}</ol>;
    },
    li({ children }) {
      return <li className="leading-relaxed">{children}</li>;
    },
    h1({ children }) {
      return (
        <h1 className="text-base sm:text-lg font-bold text-white mt-4 mb-2 first:mt-0 tracking-tight">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="text-sm sm:text-base font-semibold text-white mt-3.5 mb-1.5 first:mt-0 tracking-tight">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="text-xs sm:text-sm font-semibold text-white mt-2.5 mb-1 first:mt-0">
          {children}
        </h3>
      );
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-2 border-[#52525b] pl-3 my-2.5 italic text-[#a1a1aa]">
          {children}
        </blockquote>
      );
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto my-3 border border-[#2e2e2e] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="bg-[#202020] text-white">{children}</thead>;
    },
    th({ children }) {
      return (
        <th className="p-2.5 border-b border-[#2e2e2e] text-[#ececec] font-semibold text-xs">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="p-2.5 border-b border-[#262626] text-[#d4d4d8] text-xs">
          {children}
        </td>
      );
    },
    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline underline-offset-2 hover:text-[#d4d4d8] transition-colors"
        >
          {children}
        </a>
      );
    },
    hr() {
      return <hr className="my-4 border-[#2a2a2a]" />;
    },
  };

  return (
    <main className="flex-1 h-full rounded-2xl border border-[#262626] bg-[#141414] p-3 flex flex-col justify-between overflow-hidden relative select-none shadow-2xl transition-all">
      {/* Top Header Bar */}
      <header className="h-10 rounded-xl border border-[#262626] bg-[#1c1c1c] px-3 flex items-center justify-between text-xs text-[#a1a1aa] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {!isSidebarOpen && (
            <div className="flex items-center gap-1 shrink-0 mr-1">
              <button
                onClick={onToggleSidebar}
                title="Open sidebar"
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#282828] transition cursor-pointer"
              >
                <PanelLeft className="w-4 h-4 stroke-[1.75]" />
              </button>
              <button
                onClick={onNewChat}
                title="New chat"
                className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#282828] transition cursor-pointer"
              >
                <SquarePen className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          )}

          <div className="w-5 h-5 rounded-md bg-[#252525] border border-[#333333] flex items-center justify-center text-white shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-white tracking-wide truncate">
            {selectedConversation?.title || "CortexAI"}
          </span>
          <span className="text-[#666] font-mono text-[11px] hidden sm:inline shrink-0">
            • 4.0 Multi-Agent
          </span>
        </div>

        {/* Right action button: Canvas */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleArtifact}
            title="Toggle Canvas"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${isArtifactOpen
                ? "bg-[#282828] border-[#404040] text-white shadow-sm"
                : "bg-[#202020] border-[#2e2e2e] text-[#a1a1aa] hover:text-white hover:bg-[#262626]"
              }`}
          >
            <PanelRight className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>
        </div>
      </header>

      {/* Main Message Canvas: Central rounded container */}
      <div className="flex-1 my-2.5 rounded-xl border border-[#262626] bg-[#181818] p-4 sm:p-5 overflow-y-auto space-y-4 flex flex-col custom-scrollbar">
        {messages.length === 0 ? (
          /* ================= WELCOME / EMPTY STATE ================= */
          <div className="h-full flex flex-col items-center justify-center text-center p-4 my-auto max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#212121] border border-[#2e2e2e] flex items-center justify-center mb-3 shadow-inner text-white">
              <Sparkles className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight mb-1">
              What can I help with?
            </h2>
            <p className="text-xs text-[#8e8e8e] mb-6 max-w-sm">
              CortexAI Multi-Agent orchestrator with specialized reasoning nodes and real-time interactive canvas artifacts.
            </p>

            <div className="grid grid-cols-1 gap-2 w-full text-left">
              {quickPrompts.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3 rounded-xl border border-[#282828] bg-[#1e1e1e] hover:bg-[#252525] hover:border-[#383838] transition cursor-pointer group flex items-start gap-3 text-left"
                  >
                    <div className="p-2 rounded-lg bg-[#262626] border border-[#333333] text-white shrink-0 group-hover:bg-[#2e2e2e]">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#ececec] group-hover:text-white transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#71717a] truncate">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ================= MESSAGE STREAM ================= */
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl border px-4 py-3 text-xs sm:text-sm leading-relaxed transition ${isUser
                      ? "bg-[#282828] border-[#383838] text-[#f4f4f5] ml-auto max-w-[82%] sm:max-w-[70%] shadow-sm"
                      : "bg-[#1c1c1c] border-[#282828] text-[#d4d4d8] mr-auto max-w-[92%] sm:max-w-[82%] shadow-sm"
                    }`}
                >
                  {/* Assistant agent badge */}
                  {!isUser && (
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#262626] text-[10px] font-mono text-[#8e8e8e]">
                      <Bot className="w-3 h-3 text-[#d4d4d8]" />
                      <span className="text-[#a1a1aa] uppercase tracking-wider">
                        {msg.agent || "Cortex Agent"}
                      </span>
                    </div>
                  )}

                  {/* Message content formatted with ReactMarkdown & remarkGfm */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {/* Assistant quick copy action */}
                  {!isUser && (
                    <div className="flex items-center justify-end gap-1.5 mt-2 pt-1 border-t border-[#242424] text-[#71717a]">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        title="Copy message"
                        className="hover:text-white transition p-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isGenerating && (
          <div className="mr-auto rounded-2xl border border-[#282828] bg-[#1c1c1c] px-4 py-2 text-xs text-[#a1a1aa] flex items-center gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            <span className="animate-pulse">{statusMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Dock */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-2.5 flex flex-col gap-2 shrink-0">
        {/* Top row: Mode chips */}
        <div className="flex items-center gap-1.5 px-1 overflow-x-auto custom-scrollbar">
          {[
            { name: "Swarm", icon: Network, tooltip: "Auto-routes via LangGraph" },
            { name: "Code", icon: Code2, tooltip: "Coding & Architecture Node" },
            { name: "Search", icon: Globe, tooltip: "Web Knowledge & Research" },
            { name: "Canvas", icon: Cpu, tooltip: "Interactive Artifact Generator" },
          ].map(({ name, icon: Icon, tooltip }) => (
            <button
              key={name}
              title={tooltip}
              onClick={() => setActiveChip(name)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer shrink-0 ${activeChip === name
                  ? "bg-[#2a2a2a] border-[#404040] text-white shadow-sm"
                  : "bg-[#202020] border-[#2b2b2b] text-[#8e8e8e] hover:text-[#e4e4e7] hover:border-[#383838]"
                }`}
            >
              <Icon className="w-3 h-3" />
              <span>{name}</span>
            </button>
          ))}
        </div>

        {/* Bottom row: Input bar and send button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeChip === "Code"
                ? "Describe code or architecture to generate..."
                : activeChip === "Canvas"
                  ? "Describe an interactive React component to build..."
                  : activeChip === "Search"
                    ? "Ask a question for web synthesis..."
                    : "Ask CortexAI anything or assign a task..."
            }
            className="flex-1 bg-[#222222] border border-[#2f2f2f] focus:border-[#4b4b4b] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#71717a] focus:outline-none transition shadow-inner"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isGenerating}
            title="Send task"
            className="w-9 h-9 rounded-full bg-white text-black hover:bg-[#e4e4e7] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition cursor-pointer shadow-md"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatArea;
