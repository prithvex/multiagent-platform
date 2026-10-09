import { useRef, useEffect } from "react";
import {
  ArrowUp,
  Globe,
  Code2,
  Network,
  Cpu,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

const ChatInput = ({
  inputPrompt = "",
  setInputPrompt,
  onSendMessage,
  isGenerating = false,
  activeChip = "Swarm",
  setActiveChip,
}) => {
  const textareaRef = useRef(null);

  const chips = [
    { name: "Swarm", icon: Network, tooltip: "Auto-routes via LangGraph" },
    { name: "Code", icon: Code2, tooltip: "Coding & Architecture Node" },
    { name: "Search", icon: Globe, tooltip: "Web Knowledge & Research" },
    { name: "Canvas", icon: Cpu, tooltip: "Interactive Artifact Generator" },
    { name: "Vision", icon: ImageIcon, tooltip: "Image & Visual Analysis" },
  ];

  const getPlaceholder = () => {
    switch (activeChip) {
      case "Code":
        return "Describe code, architecture, or a refactor to generate...";
      case "Canvas":
        return "Describe an interactive React component to preview...";
      case "Search":
        return "Ask a research question for web synthesis...";
      case "Vision":
        return "Ask to generate or analyze images...";
      default:
        return "Ask CortexAI anything or assign a multi-agent task...";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputPrompt.trim() && !isGenerating) {
        onSendMessage();
      }
    }
  };

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [inputPrompt]);

  return (
    <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-2.5 flex flex-col gap-2 shrink-0 select-none shadow-lg">
      {/* Top row: Mode chips */}
      <div className="flex items-center gap-1.5 px-1 overflow-x-auto custom-scrollbar pb-0.5">
        {chips.map(({ name, icon: Icon, tooltip }) => (
          <button
            key={name}
            type="button"
            title={tooltip}
            onClick={() => setActiveChip && setActiveChip(name)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer shrink-0 ${
              activeChip === name
                ? "bg-[#282828] border-[#404040] text-white shadow-sm"
                : "bg-[#202020] border-[#2b2b2b] text-[#8e8e8e] hover:text-[#e4e4e7] hover:border-[#383838]"
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{name}</span>
          </button>
        ))}
      </div>

      {/* Bottom row: Input textarea & send button */}
      <div className="flex items-end gap-2 bg-[#222222] border border-[#2f2f2f] focus-within:border-[#4b4b4b] rounded-xl px-3.5 py-2 transition shadow-inner">
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-white placeholder-[#71717a] focus:outline-none transition leading-relaxed custom-scrollbar max-h-36 py-1"
        />

        <button
          type="button"
          onClick={() => onSendMessage()}
          disabled={!inputPrompt.trim() || isGenerating}
          title="Send prompt (Enter)"
          className="w-8 h-8 rounded-lg bg-white text-black hover:bg-[#e4e4e7] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition cursor-pointer shadow-md mb-0.5"
        >
          {isGenerating ? (
            <Sparkles className="w-4 h-4 text-black animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="flex items-center justify-between px-2 text-[10px] text-[#52525b] font-mono">
        <span>Use Shift + Enter for new line</span>
        <span className="hidden sm:inline">Cortex 4.0 Engine</span>
      </div>
    </div>
  );
};

export default ChatInput;
