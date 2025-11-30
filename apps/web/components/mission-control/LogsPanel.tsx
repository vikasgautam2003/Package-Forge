// import { Terminal, Play } from "lucide-react";
// import { useEffect, useRef } from "react";

// interface LogsPanelProps {
//   logs: string[];
//   status: string;
//   onDeploy: () => void;
// }

// export function LogsPanel({ logs, status, onDeploy }: LogsPanelProps) {
//   const logsEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [logs]);

//   return (
//     <div className="w-[30%] bg-black flex flex-col">
//       <div className="p-3 border-b border-gray-800 text-xs font-bold text-green-500 flex justify-between items-center">
//         <span className="flex items-center gap-2">
//           <Terminal size={14} /> SYSTEM LOGS
//         </span>
//         <span
//           className={`w-2 h-2 rounded-full ${
//             status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-500"
//           }`}
//         ></span>
//       </div>

//       <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1">
//         {logs.map((log, i) => (
//           <div key={i} className="break-words border-l-2 border-green-900 pl-2">
//             <span className="text-green-600 mr-2">$</span>
//             <span className="text-gray-400">{log}</span>
//           </div>
//         ))}
//         <div ref={logsEndRef} />
//       </div>

//       <div className="p-4 border-t border-gray-800 bg-gray-900">
//         <button
//           onClick={onDeploy}
//           className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
//             status === "completed"
//               ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20"
//               : "bg-gray-800 text-gray-500 cursor-not-allowed"
//           }`}
//           disabled={status !== "completed"}
//         >
//           {status === "completed" ? (
//             <>
//               <Play size={16} /> DEPLOY TO NPM
//             </>
//           ) : (
//             "WAITING FOR BUILD..."
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }








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
    <div className="w-[30%] bg-[#05070D] flex flex-col border-l border-[#1e3a8a]/20 shadow-[inset_0_0_20px_rgba(30,58,138,0.15)]">
      
      <div className="p-3 border-b border-[#1e3a8a]/30 text-xs font-bold text-[#60a5fa] flex justify-between items-center bg-[#02040A]/60 backdrop-blur-sm">
        <span className="flex items-center gap-2 tracking-widest">
          <Terminal size={14} /> TERMINAL
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            status === "active"
              ? "bg-[#3b82f6] animate-pulse shadow-[0_0_6px_#3b82f6]"
              : "bg-gray-600"
          }`}
        ></span>
      </div>

      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 bg-[#03050b]">
        {logs.map((log, i) => (
          <div
            key={i}
            className="break-words border-l-2 border-[#1e3a8a] pl-2"
          >
            <span className="text-[#60a5fa] mr-2">$</span>
            <span className="text-gray-300">{log}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      <div className="p-4 border-t border-[#1e3a8a]/30 bg-[#04060A]">
        <button
          onClick={onDeploy}
          className={`w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            status === "completed"
              ? "bg-[#3b82f6] hover:bg-[#60a5fa] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
              : "bg-[#0b0f18] text-gray-600 cursor-not-allowed border border-[#1e3a8a]/20"
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
