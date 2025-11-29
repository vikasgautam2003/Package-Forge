// 'use client'

// import { useState, useEffect } from "react";
// import { createJob, checkJobStatus } from "./actions";

// export default function Home() {
//   const [jobId, setJobId] = useState<string | null>(null);
//   const [logs, setLogs] = useState<string[]>([]);
//   const [status, setStatus] = useState<string>("idle");

//   useEffect(() => {
//     if (!jobId || status === 'completed' || status === 'failed') return;

//     const interval = setInterval(async () => {
//       const data = await checkJobStatus(jobId);
//       setLogs(data.logs);
//       setStatus(data.status);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [jobId, status]);

//   async function handleSubmit(formData: FormData) {
//     setLogs(["Starting job..."]);
//     setStatus("active");
//     const result = await createJob(formData);
//     setJobId(result.jobId ?? null);

//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-black text-green-500 font-mono p-10">
//       <h1 className="text-4xl font-bold mb-8 tracking-tighter">📦 PACKAGE_FORGE v1.0</h1>

//       {!jobId && (
//         <form action={handleSubmit} className="w-full max-w-2xl flex gap-4">
//           <input 
//             name="prompt" 
//             type="text" 
//             placeholder="Describe your package (e.g., 'A CLI snake game')..." 
//             className="flex-1 bg-gray-900 border border-green-700 p-4 rounded text-white focus:outline-none focus:border-green-400"
//             required
//           />
//           <button type="submit" className="bg-green-700 text-black font-bold px-8 py-4 hover:bg-green-600 rounded">
//             INITIALIZE
//           </button>
//         </form>
//       )}

//       {jobId && (
//         <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl mt-8">
//           <div className="bg-gray-800 p-2 flex gap-2 items-center">
//             <div className="w-3 h-3 rounded-full bg-red-500"/>
//             <div className="w-3 h-3 rounded-full bg-yellow-500"/>
//             <div className="w-3 h-3 rounded-full bg-green-500"/>
//             <span className="ml-4 text-xs text-gray-400">root@package-forge:~/build-logs</span>
//           </div>
          
//           <div className="p-6 h-96 overflow-y-auto flex flex-col-reverse bg-black/90">
//             <div className="flex flex-col gap-1">
//               {logs.map((log, i) => (
//                 <div key={i} className="border-l-2 border-green-900 pl-2">
//                   <span className="text-green-600 mr-2">$</span>
//                   <span className="text-gray-300">{log}</span>
//                 </div>
//               ))}
              
//               {status === 'active' && (
//                 <div className="animate-pulse text-green-500 mt-2">_ Processing...</div>
//               )}
              
//               {status === 'completed' && (
//                 <div className="mt-4 p-4 bg-green-900/30 border border-green-500 text-green-400 font-bold text-center">
//                   ✅ BUILD SUCCESSFUL. READY FOR DEPLOYMENT.
//                 </div>
//               )}

//               {status === 'failed' && (
//                 <div className="mt-4 p-4 bg-red-900/30 border border-red-500 text-red-400 font-bold text-center">
//                   ❌ BUILD FAILED. SYSTEM TERMINATED.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






'use client';

import { useState, useEffect, useRef } from "react";
import { createJob, checkJobStatus, getGeneratedFiles } from "./actions";
import { Folder, FileCode, Terminal, Play, Rocket, Loader2, Send } from "lucide-react";

export default function MissionControl() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("idle");
  const [packageName, setPackageName] = useState<string | null>(null);
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const data = await checkJobStatus(jobId);

      setLogs(data.logs);
      setStatus(data.status);

      if (data.packageName) {
        setPackageName(data.packageName);

        const fetchedFiles = await getGeneratedFiles(data.packageName);
        if (fetchedFiles.length > 0) {
          setFiles(fetchedFiles);
          if (!selectedFile) setSelectedFile("index.js");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, selectedFile]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  async function handleSubmit(formData: FormData) {
    setLogs(["Initializing system..."]);
    setFiles([]);
    setPackageName(null);
    setStatus("active");

    const result = await createJob(formData);

    if (result.jobId) {
      setJobId(result.jobId);
    } else {
      console.error("Job ID missing from createJob response");
    }
  }

  const activeFileContent =
    files.find((f) => f.name === selectedFile)?.content || "";

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex overflow-hidden font-mono">
      <div className="w-1/5 border-r border-gray-800 flex flex-col bg-black">
        <div className="p-4 border-b border-gray-800 font-bold flex items-center gap-2 text-blue-400">
          <Rocket size={18} /> ARCHITECT AI
        </div>

        <div className="flex-1 p-4 text-sm text-gray-400 overflow-y-auto">
          {jobId && (
            <div className="mb-4">
              <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 mb-2">
                <span className="text-green-500 font-bold">USER:</span>
                <br />
                Generating package...
              </div>
              <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800">
                <span className="text-blue-400 font-bold">AI:</span>
                <br />
                Blueprint received. Starting construction...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <form action={handleSubmit} className="flex gap-2">
            <input
              name="prompt"
              placeholder="Describe your package..."
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
              disabled={status === "active"}
            />
            <button
              type="submit"
              disabled={status === "active"}
              className="bg-blue-600 hover:bg-blue-500 p-2 rounded text-white disabled:opacity-50"
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
                  onClick={() => setSelectedFile(file.name)}
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

      <div className="w-[35%] border-r border-gray-800 bg-[#1e1e1e] flex flex-col">
        <div className="flex bg-[#0a0a0a] border-b border-gray-800 overflow-x-auto">
          {files.map((file) => (
            <div
              key={file.name}
              onClick={() => setSelectedFile(file.name)}
              className={`px-4 py-2 text-xs cursor-pointer border-r border-gray-800 ${
                selectedFile === file.name
                  ? "bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500"
                  : "text-gray-500 hover:bg-gray-900"
              }`}
            >
              {file.name}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {selectedFile ? (
            <pre className="text-xs font-mono text-gray-300 leading-relaxed">
              <code>{activeFileContent}</code>
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-600 text-sm">
              Select a file to view code
            </div>
          )}
        </div>
      </div>

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
            <div
              key={i}
              className="break-words border-l-2 border-green-900 pl-2"
            >
              <span className="text-green-600 mr-2">$</span>
              <span className="text-gray-400">{log}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900">
          <button
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
    </div>
  );
}
