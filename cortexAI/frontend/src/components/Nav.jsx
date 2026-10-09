import {
  PanelLeft,
  SquarePen,
  Bot,
  PanelRight,
  Zap,
} from "lucide-react";

const Nav = ({
  title = "CortexAI",
  isSidebarOpen = false,
  onToggleSidebar,
  onNewChat,
  isArtifactOpen = false,
  onToggleArtifact,
  onOpenBilling,
}) => {
  return (
    <header className="h-11 rounded-xl border border-[#262626] bg-[#1a1a1a] px-3 flex items-center justify-between text-xs text-[#a1a1aa] shrink-0 select-none shadow-sm">
      {/* Left controls */}
      <div className="flex items-center gap-2 min-w-0">
        {!isSidebarOpen && (
          <div className="flex items-center gap-1 shrink-0 mr-1">
            <button
              onClick={onToggleSidebar}
              title="Open sidebar"
              className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#262626] transition cursor-pointer"
            >
              <PanelLeft className="w-4 h-4 stroke-[1.75]" />
            </button>
            <button
              onClick={onNewChat}
              title="New chat"
              className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#262626] transition cursor-pointer"
            >
              <SquarePen className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        )}

        <div className="w-6 h-6 rounded-lg bg-[#242424] border border-[#333333] flex items-center justify-center text-white shrink-0 shadow-inner">
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
        </div>

        <span className="font-medium text-white tracking-wide truncate max-w-[140px] sm:max-w-xs">
          {title || "CortexAI"}
        </span>

        <span className="text-[#666] font-mono text-[11px] hidden md:inline shrink-0">
          • 4.0 Multi-Agent Swarm
        </span>
      </div>

      {/* Right controls: Billing & Canvas */}
      <div className="flex items-center gap-2 shrink-0">
        {onOpenBilling && (
          <button
            onClick={onOpenBilling}
            title="Subscription & Credits"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#2e2e2e] bg-[#222222] hover:bg-[#2a2a2a] hover:border-[#383838] text-[11px] font-medium text-[#d4d4d8] hover:text-white transition cursor-pointer shadow-sm group"
          >
            <Zap className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Billing</span>
          </button>
        )}

        <button
          onClick={onToggleArtifact}
          title="Toggle Canvas Preview"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
            isArtifactOpen
              ? "bg-[#282828] border-[#454545] text-white shadow-sm"
              : "bg-[#202020] border-[#2e2e2e] text-[#a1a1aa] hover:text-white hover:bg-[#262626]"
          }`}
        >
          <PanelRight className="w-3.5 h-3.5 text-indigo-400" />
          <span>Canvas</span>
        </button>
      </div>
    </header>
  );
};

export default Nav;
