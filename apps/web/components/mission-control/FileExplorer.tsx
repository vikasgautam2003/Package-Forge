// import { Folder, FileCode } from "lucide-react";

// interface FileExplorerProps {
//   packageName: string | null;
//   files: { name: string; content: string }[];
//   selectedFile: string | null;
//   onSelectFile: (fileName: string) => void;
// }

// export function FileExplorer({
//   packageName,
//   files,
//   selectedFile,
//   onSelectFile,
// }: FileExplorerProps) {
//   return (
//     <div className="w-[15%] border-r border-gray-800 bg-[#0F0F0F] flex flex-col">
//       <div className="p-3 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
//         Explorer
//       </div>

//       <div className="flex-1 overflow-y-auto p-2">
//         {packageName ? (
//           <div>
//             <div className="flex items-center gap-2 text-yellow-500 mb-2 px-2 text-sm font-bold">
//               <Folder size={16} /> {packageName}
//             </div>
//             {files.map((file) => (
//               <div
//                 key={file.name}
//                 onClick={() => onSelectFile(file.name)}
//                 className={`flex items-center gap-2 px-4 py-1.5 text-sm cursor-pointer hover:bg-gray-800 rounded ${
//                   selectedFile === file.name
//                     ? "text-blue-400 bg-blue-900/20"
//                     : "text-gray-400"
//                 }`}
//               >
//                 <FileCode size={14} /> {file.name}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-gray-600 text-xs text-center mt-10 italic">
//             Waiting for files...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import { Folder, FileCode } from "lucide-react";

interface FileExplorerProps {
  packageName: string | null;
  files: { name: string; content: string }[];
  selectedFile: string | null;
  onSelectFile: (fileName: string) => void;
}

export function FileExplorer({
  packageName,
  files,
  selectedFile,
  onSelectFile,
}: FileExplorerProps) {
  return (
    <div className="w-[15%] border-r border-[#3b82f6]/30 bg-[#06080F] flex flex-col shadow-[0_0_25px_rgba(59,130,246,0.07)]">
      
      
      <div className="p-3 border-b border-[#3b82f6]/30 text-xs font-bold text-[#60a5fa] uppercase tracking-widest bg-[#02040A]/60 shadow-[0_0_10px_rgba(59,130,246,0.25)]">
        Explorer
      </div>


      <div className="flex-1 overflow-y-auto p-2">
        {packageName ? (
          <div>
          
            <div className="flex items-center gap-2 text-[#93c5fd] mb-3 px-2 text-sm font-bold drop-shadow-[0_0_6px_rgba(147,197,253,0.25)]">
              <Folder size={16} /> {packageName}
            </div>

          
            {files.map((file) => (
              <div
                key={file.name}
                onClick={() => onSelectFile(file.name)}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm cursor-pointer rounded transition-all duration-150
                  ${
                    selectedFile === file.name
                      ? "bg-[#1e3a8a]/20 text-[#60a5fa] border border-[#3b82f6]/40 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                      : "text-gray-400 hover:bg-[#0e1520] hover:text-[#93c5fd] hover:shadow-[0_0_8px_rgba(147,197,253,0.20)]"
                  }`}
              >
                <FileCode size={14} className="text-[#60a5fa]" /> {file.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600 text-xs text-center mt-10 italic font-mono">
            Waiting for files...
          </div>
        )}
      </div>
    </div>
  );
}
