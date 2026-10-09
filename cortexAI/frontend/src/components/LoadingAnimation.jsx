import { Sparkles, Bot } from "lucide-react";

const LoadingAnimation = ({
  statusMessage = "Orchestrating agent swarm...",
  agent = "Swarm",
}) => {
  return (
    <div className="flex items-start gap-3 w-full my-2 animate-in fade-in duration-300">
      {/* Agent Avatar with glowing ring */}
      <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-[#1c1c1c] border border-[#2f2f2f] text-white shrink-0 shadow-md">
        <Bot className="w-4 h-4 text-[#e4e4e7]" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
      </div>

      {/* Bubble with status & multi-agent indicator */}
      <div className="rounded-2xl border border-[#282828] bg-[#1a1a1a] px-4 py-3 text-xs text-[#a1a1aa] shadow-lg flex flex-col gap-2 max-w-sm sm:max-w-md">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse [animation-delay:400ms]" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">
            {agent} Reasoning Node
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[#e4e4e7] font-medium text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span className="truncate">{statusMessage}</span>
        </div>

        {/* Shimmer progress bar */}
        <div className="w-full h-1 bg-[#262626] rounded-full overflow-hidden mt-0.5">
          <div className="h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-full animate-[shimmer_1.5s_infinite] -translate-x-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
