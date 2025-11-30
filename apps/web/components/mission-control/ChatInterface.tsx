// import { Rocket, Loader2, Send } from "lucide-react";

// interface ChatInterfaceProps {
//   jobId: string | null;
//   status: string;
//   onSubmit: (formData: FormData) => void;
// }

// export function ChatInterface({ jobId, status, onSubmit }: ChatInterfaceProps) {
//   return (
//     <div className="w-1/5 border-r border-gray-800 flex flex-col bg-black">
//       <div className="p-4 border-b border-gray-800 font-bold flex items-center gap-2 text-blue-400">
//         <Rocket size={18} /> ARCHITECT AI
//       </div>

//       <div className="flex-1 p-4 text-sm text-gray-400 overflow-y-auto">
//         {jobId && (
//           <div className="mb-4">
//             <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-2">
//               <span className="text-green-500 font-bold">USER:</span>
//               <br />
//               Generating package...
//             </div>
//             <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800">
//               <span className="text-blue-400 font-bold">AI:</span>
//               <br />
//               Blueprint received. Starting construction...
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-t border-gray-800">
//         <form action={onSubmit} className="flex gap-2">
//           <input
//             name="prompt"
//             placeholder="Describe your package..."
//             className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
//             disabled={status === "active"}
//           />
//           <button
//             type="submit"
//             disabled={status === "active"}
//             className="bg-blue-600 hover:bg-blue-500 p-2 rounded text-white disabled:opacity-50"
//           >
//             {status === "active" ? (
//               <Loader2 className="animate-spin" size={18} />
//             ) : (
//               <Send size={18} />
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }










import { Rocket, Loader2, Send } from "lucide-react";

interface ChatInterfaceProps {
  jobId: string | null;
  status: string;
  onSubmit: (formData: FormData) => void;
}

export function ChatInterface({ jobId, status, onSubmit }: ChatInterfaceProps) {
  return (
    <div className="w-1/5 border-r border-[#0f0]/20 flex flex-col bg-[#020202] shadow-[0_0_30px_rgba(0,255,0,0.07)]">
      
      {/* HEADER */}
      <div className="p-4 border-b border-[#0f0]/30 font-bold flex items-center gap-2 text-[#00ff84] tracking-tighter">
        <Rocket size={18} className="text-[#00ff84] drop-shadow-[0_0_8px_#00ff84]" />
        <span className="drop-shadow-[0_0_8px_#00ff84]">PACKAGEFORGE</span>
      </div>

      {/* CHAT LOG */}
      <div className="flex-1 p-4 text-sm text-gray-400 overflow-y-auto font-mono">
        {jobId && (
          <div className="mb-4">
            <div className="bg-black/60 p-3 rounded-lg border border-[#00ff84]/30 shadow-[0_0_10px_rgba(0,255,132,0.2)]">
              <span className="text-[#00ff84] font-bold">USER:</span>
              <br />
              Generating package...
            </div>
            <div className="bg-[#001b1b] p-3 rounded-lg mt-2 border border-[#0080ff]/40 shadow-[0_0_12px_rgba(0,128,255,0.2)]">
              <span className="text-[#0080ff] font-bold">AI:</span>
              <br />
              Blueprint received. Initializing forge systems...
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-[#0f0]/20 bg-black/40">
        <form action={onSubmit} className="flex gap-2">
          <input
            name="prompt"
            placeholder="Describe your package..."
            className="w-full bg-black/70 border border-[#0f0]/30 rounded px-3 py-2 text-sm 
                       focus:outline-none focus:border-[#00ff84] transition-all text-[#00ff84] 
                       placeholder-gray-500 font-mono shadow-[inset_0_0_8px_rgba(0,255,0,0.2)]"
            disabled={status === "active"}
          />
          <button
            type="submit"
            disabled={status === "active"}
            className="bg-[#00aa55] hover:bg-[#00cc66] p-2 rounded text-black font-bold 
                       disabled:opacity-50 transition-all shadow-[0_0_12px_rgba(0,255,132,0.3)]"
          >
            {status === "active" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
