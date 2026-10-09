import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Cpu,
  FileText,
  Image as ImageIcon,
  Globe,
} from "lucide-react";

// Sub-component for code blocks inside assistant markdown
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
    const compMatch = code.match(
      /function\s+([A-Za-z0-9_]+)|const\s+([A-Za-z0-9_]+)\s*=/
    );
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
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
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

const MessageBubble = ({
  message,
  onSelectArtifact,
  onToggleArtifact,
  isArtifactOpen,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getAgentIcon = (agentName = "") => {
    const name = agentName.toLowerCase();
    if (name.includes("code")) return <Code2 className="w-3 h-3 text-cyan-400" />;
    if (name.includes("pdf") || name.includes("rag"))
      return <FileText className="w-3 h-3 text-amber-400" />;
    if (name.includes("img") || name.includes("vision"))
      return <ImageIcon className="w-3 h-3 text-rose-400" />;
    if (name.includes("search")) return <Globe className="w-3 h-3 text-emerald-400" />;
    return <Bot className="w-3 h-3 text-indigo-400" />;
  };

  const markdownComponents = {
    code({ className, children, ...props }) {
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
          className="text-indigo-300 underline underline-offset-2 hover:text-white transition-colors"
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
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
    >
      <div
        className={`rounded-2xl border px-4 py-3 text-xs sm:text-sm leading-relaxed transition ${
          isUser
            ? "bg-[#282828] border-[#383838] text-[#f4f4f5] ml-auto max-w-[85%] sm:max-w-[72%] shadow-sm"
            : "bg-[#191919] border-[#262626] text-[#d4d4d8] mr-auto max-w-[95%] sm:max-w-[85%] shadow-md"
        }`}
      >
        {/* Assistant Header Badge */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#262626] text-[10px] font-mono text-[#8e8e8e]">
            <div className="flex items-center gap-1.5">
              {getAgentIcon(message.agent)}
              <span className="text-[#a1a1aa] uppercase tracking-wider font-semibold">
                {message.agent || "Cortex Swarm"}
              </span>
            </div>
            {message.artifact && (
              <button
                onClick={() => {
                  if (onSelectArtifact) onSelectArtifact(message.artifact);
                  if (!isArtifactOpen && onToggleArtifact) onToggleArtifact();
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#242424] hover:bg-[#2e2e2e] text-[#a1a1aa] hover:text-white text-[10px] transition cursor-pointer border border-[#333333]"
              >
                <Cpu className="w-2.5 h-2.5 text-indigo-400" />
                <span>Open Canvas</span>
              </button>
            )}
          </div>
        )}

        {/* Message Content */}
        {isUser ? (
          <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-xs sm:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Assistant Action Footer */}
        {!isUser && (
          <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-[#242424] text-[#71717a]">
            <span className="text-[10px] font-mono text-[#52525b]">
              {message.createdAt
                ? new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyMessage}
                title="Copy message"
                className="hover:text-white transition p-1 rounded-md hover:bg-[#252525] cursor-pointer"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
