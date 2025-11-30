import { Terminal, Play } from "lucide-react";
import { useEffect, useRef } from "react";

interface LogsPanelProps {
  logs: string[];
  status: string;
  onDeploy: () => void;
}

export function LogsPanel({ logs, status, onDeploy }: LogsPanelProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="w-[30%] bg-black flex flex-col">
      <div className="p-3 border-b border-gray-800 text-xs font-bold text-green-500 flex justify-between items-center">
        <span className="flex items-center gap-2">
          <Terminal size={14} /> SYSTEM LOGS
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-500"
          }`}
        ></span>
      </div>

      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="break-words border-l-2 border-green-900 pl-2">
            <span className="text-green-600 mr-2">$</span>
            <span className="text-gray-400">{log}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <button
          onClick={onDeploy}
          className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            status === "completed"
              ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
          disabled={status !== "completed"}
        >
          {status === "completed" ? (
            <>
              <Play size={16} /> DEPLOY TO NPM
            </>
          ) : (
            "WAITING FOR BUILD..."
          )}
        </button>
      </div>
    </div>
  );
}