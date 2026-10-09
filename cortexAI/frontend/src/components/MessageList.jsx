import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble.jsx";
import LoadingAnimation from "./LoadingAnimation.jsx";
import {
  Sparkles,
  Code2,
  Network,
  Terminal,
  FileText,
} from "lucide-react";

const MessageList = ({
  messages = [],
  isGenerating = false,
  statusMessage = "Orchestrating agent swarm...",
  onSelectArtifact,
  onToggleArtifact,
  isArtifactOpen,
  onQuickPromptSelect,
}) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, statusMessage]);

  const quickPrompts = [
    {
      title: "Interactive UI Artifact",
      desc: "Build a responsive React counter widget with live preview",
      prompt:
        "Create an interactive counter React component artifact with increment, decrement, and reset buttons.",
      icon: Code2,
    },
    {
      title: "Agent Swarm Architecture",
      desc: "Explain the LangGraph router and node graph pipeline",
      prompt:
        "How does the CortexAI LangGraph router coordinate specialized agents (Chat, Code, Vision, Search)?",
      icon: Network,
    },
    {
      title: "PDF & Document RAG",
      desc: "Inquire about document indexing and vector search",
      prompt:
        "Explain how the PDF RAG agent chunks documents and performs semantic vector retrieval.",
      icon: FileText,
    },
    {
      title: "Full-Stack API Design",
      desc: "Review Gateway proxy and microservice auth headers",
      prompt:
        "Explain how Express Gateway forwards authentication headers like x-user-id to microservices.",
      icon: Terminal,
    },
  ];

  return (
    <div className="flex-1 my-2.5 rounded-xl border border-[#262626] bg-[#171717] p-4 sm:p-5 overflow-y-auto space-y-4 flex flex-col custom-scrollbar">
      {messages.length === 0 ? (
        /* ================= WELCOME / EMPTY STATE ================= */
        <div className="h-full flex flex-col items-center justify-center text-center p-4 my-auto max-w-lg mx-auto select-none animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[#212121] border border-[#2e2e2e] flex items-center justify-center mb-3 shadow-inner text-white">
            <Sparkles className="w-6 h-6 stroke-[1.75] text-indigo-400" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight mb-1">
            What can I help with?
          </h2>
          <p className="text-xs text-[#8e8e8e] mb-6 max-w-sm">
            CortexAI Multi-Agent orchestrator with specialized reasoning nodes
            and real-time interactive canvas artifacts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
            {quickPrompts.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => onQuickPromptSelect && onQuickPromptSelect(item.prompt)}
                  className="p-3 rounded-xl border border-[#262626] bg-[#1e1e1e] hover:bg-[#252525] hover:border-[#383838] transition cursor-pointer group flex items-start gap-3 text-left shadow-sm hover:shadow-md"
                >
                  <div className="p-2 rounded-lg bg-[#262626] border border-[#333333] text-white shrink-0 group-hover:bg-[#2e2e2e]">
                    <IconComponent className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#ececec] group-hover:text-white transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#71717a] line-clamp-2 mt-0.5 leading-snug">
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
        <>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id || msg._id}
              message={msg}
              onSelectArtifact={onSelectArtifact}
              onToggleArtifact={onToggleArtifact}
              isArtifactOpen={isArtifactOpen}
            />
          ))}

          {isGenerating && (
            <LoadingAnimation statusMessage={statusMessage} />
          )}
        </>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
