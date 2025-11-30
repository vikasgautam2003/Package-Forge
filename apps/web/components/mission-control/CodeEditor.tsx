// interface CodeEditorProps {
//   files: { name: string; content: string }[];
//   selectedFile: string | null;
//   onSelectFile: (fileName: string) => void;
// }

// export function CodeEditor({
//   files,
//   selectedFile,
//   onSelectFile,
// }: CodeEditorProps) {
//   const activeFileContent =
//     files.find((f) => f.name === selectedFile)?.content || "";

//   return (
//     <div className="w-[35%] border-r border-gray-800 bg-[#1e1e1e] flex flex-col">
//       <div className="flex bg-[#0a0a0a] border-b border-gray-800 overflow-x-auto">
//         {files.map((file) => (
//           <div
//             key={file.name}
//             onClick={() => onSelectFile(file.name)}
//             className={`px-4 py-2 text-xs cursor-pointer border-r border-gray-800 ${
//               selectedFile === file.name
//                 ? "bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500"
//                 : "text-gray-500 hover:bg-gray-900"
//             }`}
//           >
//             {file.name}
//           </div>
//         ))}
//       </div>

//       <div className="flex-1 overflow-auto p-4">
//         {selectedFile ? (
//           <pre className="text-xs font-mono text-gray-300 leading-relaxed">
//             <code>{activeFileContent}</code>
//           </pre>
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-600 text-sm">
//             Select a file to view code
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


interface CodeEditorProps {
  files: { name: string; content: string }[];
  selectedFile: string | null;
  onSelectFile: (fileName: string) => void;
}

export function CodeEditor({
  files,
  selectedFile,
  onSelectFile,
}: CodeEditorProps) {
  const activeFileContent =
    files.find((f) => f.name === selectedFile)?.content || "";

  return (
    <div className="w-[35%] border-r border-[#3b82f6]/30 bg-[#0A0D14] flex flex-col shadow-[0_0_25px_rgba(59,130,246,0.05)]">
      <div className="flex bg-[#04060A] border-b border-[#3b82f6]/30 overflow-x-auto no-scrollbar">
        {files.map((file) => (
          <div
            key={file.name}
            onClick={() => onSelectFile(file.name)}
            className={`px-4 py-2 text-xs cursor-pointer border-r border-[#3b82f6]/20 transition-all duration-150
              ${
                selectedFile === file.name
                  ? "bg-[#0A0D14] text-[#60a5fa] border-t-2 border-t-[#60a5fa] shadow-[0_0_10px_rgba(96,165,250,0.35)]"
                  : "text-gray-500 hover:bg-[#0c1320] hover:text-[#93c5fd] hover:shadow-[0_0_8px_rgba(147,197,253,0.15)]"
              }`}
          >
            {file.name}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4 bg-[#080B12]">
        {selectedFile ? (
          <pre className="text-xs font-mono text-[#d8e1ff] leading-relaxed whitespace-pre-wrap">
            <code>{activeFileContent}</code>
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-600 text-sm font-mono">
            Select a file to view code
          </div>
        )}
      </div>
    </div>
  );
}
