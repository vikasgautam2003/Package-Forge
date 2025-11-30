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
    <div className="w-[15%] border-r border-gray-800 bg-[#0F0F0F] flex flex-col">
      <div className="p-3 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Explorer
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {packageName ? (
          <div>
            <div className="flex items-center gap-2 text-yellow-500 mb-2 px-2 text-sm font-bold">
              <Folder size={16} /> {packageName}
            </div>
            {files.map((file) => (
              <div
                key={file.name}
                onClick={() => onSelectFile(file.name)}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm cursor-pointer hover:bg-gray-800 rounded ${
                  selectedFile === file.name
                    ? "text-blue-400 bg-blue-900/20"
                    : "text-gray-400"
                }`}
              >
                <FileCode size={14} /> {file.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600 text-xs text-center mt-10 italic">
            Waiting for files...
          </div>
        )}
      </div>
    </div>
  );
}