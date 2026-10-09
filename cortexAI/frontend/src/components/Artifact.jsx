import { useState } from "react";
import {
  Code2,
  Play,
  Copy,
  Check,
  Download,
  X,
  RotateCcw,
  Plus,
  Minus,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

const Artifact = ({
  artifact = {
    title: "InteractiveCounter.jsx",
    language: "jsx",
    code: `import React, { useState } from "react";

export default function InteractiveCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center text-white">
      <h3 className="text-sm font-semibold tracking-wider uppercase text-[#a3a3a3] mb-2">
        Active Artifact
      </h3>
      <div className="text-5xl font-mono font-bold my-4 text-white tracking-widest">
        {count}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="px-3 py-1.5 rounded-lg bg-[#262626] border border-[#383838] hover:bg-[#303030] text-xs font-medium text-white transition cursor-pointer"
        >
          - Decrement
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-3 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] hover:bg-[#282828] text-xs text-[#888] hover:text-white transition cursor-pointer"
        >
          Reset
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-semibold transition cursor-pointer"
        >
          + Increment
        </button>
      </div>
    </div>
  );
}`,
  },
  onClose,
}) => {
  const [viewMode, setViewMode] = useState("preview"); // "preview" | "code"
  const [demoCount, setDemoCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const codeToSave = artifact.code || "";
    const blob = new Blob([codeToSave], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = artifact.title || "artifact.jsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const codeLines = (artifact.code || "").split("\n");

  return (
    <aside className="w-72 sm:w-80 lg:w-[360px] xl:w-[400px] h-full rounded-2xl border border-[#262626] bg-[#141414] p-3 flex flex-col justify-between select-none shrink-0 overflow-hidden shadow-2xl transition-all">
      {/* Top Bar: Title on left, toggle preview/code on right */}
      <div className="h-10 px-1 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 truncate min-w-0">
          <div className="w-5 h-5 rounded-md bg-[#242424] border border-[#333333] flex items-center justify-center text-white shrink-0">
            <Code2 className="w-3 h-3" />
          </div>
          <span className="text-xs font-medium text-white truncate tracking-wide">
            {artifact.title || "Artifact Canvas"}
          </span>
        </div>

        {/* Small pill button on top right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setViewMode(viewMode === "preview" ? "code" : "preview")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#333333] bg-[#1e1e1e] hover:bg-[#262626] text-white text-[11px] font-medium transition cursor-pointer shadow-sm group hover:border-[#444444]"
          >
            {viewMode === "preview" ? (
              <>
                <Code2 className="w-3 h-3 text-[#a1a1aa] group-hover:text-white" />
                <span>Code</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#a1a1aa] group-hover:text-white" />
                <span>Preview</span>
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Close canvas"
              className="p-1.5 rounded-lg border border-[#2e2e2e] bg-[#1c1c1c] hover:bg-[#252525] text-[#8e8e8e] hover:text-white text-xs transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 my-2.5 rounded-xl border border-[#262626] bg-[#181818] p-4 overflow-auto flex flex-col justify-between custom-scrollbar">
        {viewMode === "preview" ? (
          /* ================= LIVE INTERACTIVE PREVIEW ================= */
          <div className="h-full flex flex-col items-center justify-center p-2 text-center my-auto">
            <div className="w-12 h-12 rounded-xl bg-[#212121] border border-[#2e2e2e] flex items-center justify-center mb-3 text-white shadow-inner">
              <Cpu className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h4 className="text-sm font-semibold text-white tracking-wide mb-1">
              Active Artifact Sandbox
            </h4>
            <p className="text-[11px] text-[#71717a] mb-6">
              Interactive state synchronized with LangGraph node
            </p>

            {/* Interactive Demo Sandbox Card */}
            <div className="w-full max-w-[280px] p-5 rounded-2xl bg-[#1e1e1e] border border-[#2b2b2b] shadow-xl">
              <div className="text-[11px] font-mono text-[#a1a1aa] mb-2 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>State Engine</span>
              </div>
              <div className="text-4xl font-mono font-bold text-white tracking-widest my-2">
                {demoCount}
              </div>
              <div className="text-[10px] text-[#71717a] font-mono mb-4">
                Component: {artifact.title || "InteractiveCounter.jsx"}
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setDemoCount((c) => c - 1)}
                  className="p-2 rounded-lg bg-[#262626] hover:bg-[#303030] border border-[#333333] text-white transition cursor-pointer"
                  title="Decrement"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDemoCount(0)}
                  className="p-2 rounded-lg bg-[#202020] hover:bg-[#2a2a2a] border border-[#2e2e2e] text-[#8e8e8e] hover:text-white transition cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDemoCount((c) => c + 1)}
                  className="p-2 rounded-lg bg-white text-black hover:bg-[#e4e4e7] border border-white transition cursor-pointer shadow-sm"
                  title="Increment"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Micro Sandbox Console */}
            <div className="w-full max-w-[280px] mt-4 p-2.5 rounded-xl bg-[#141414] border border-[#262626] text-left">
              <div className="flex items-center justify-between text-[10px] text-[#666] font-mono mb-1">
                <span>Output Log</span>
                <span className="text-[#a1a1aa]">ready</span>
              </div>
              <div className="text-[11px] font-mono text-[#8e8e8e] truncate">
                &gt; state.count = {demoCount} (react 19.x)
              </div>
            </div>
          </div>
        ) : (
          /* ================= CODE VIEW ================= */
          <div className="h-full overflow-auto font-mono text-[11px] leading-relaxed p-1 custom-scrollbar">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262626]">
              <span className="text-[#71717a] text-[10px] uppercase font-mono flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[#71717a]" />
                <span>{artifact.language || "React JSX"}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] text-[#8e8e8e] hover:text-white cursor-pointer transition"
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
                <button
                  onClick={handleDownload}
                  title="Download File"
                  className="text-[#8e8e8e] hover:text-white cursor-pointer transition p-0.5"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <table className="w-full border-collapse">
              <tbody>
                {codeLines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-[#202020]/50">
                    <td className="w-6 pr-3 text-right text-[#52525b] select-none text-[10px] align-top font-mono">
                      {idx + 1}
                    </td>
                    <td className="text-[#d4d4d8] whitespace-pre font-mono">
                      {line || " "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom indicator */}
        <div className="pt-2 border-t border-[#232323] flex items-center justify-between text-[10px] text-[#71717a]">
          <span className="flex items-center gap-1 font-mono">
            <Sparkles className="w-2.5 h-2.5 text-[#a1a1aa]" />
            <span>Artifact Engine</span>
          </span>
          <span className="font-mono text-[#a1a1aa]">Live & Synced</span>
        </div>
      </div>
    </aside>
  );
};

export default Artifact;