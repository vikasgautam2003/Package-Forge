'use client'

import { useState, useEffect } from "react";
import { createJob, checkJobStatus } from "./actions";

export default function Home() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    if (!jobId || status === 'completed' || status === 'failed') return;

    const interval = setInterval(async () => {
      const data = await checkJobStatus(jobId);
      setLogs(data.logs);
      setStatus(data.status);
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, status]);

  async function handleSubmit(formData: FormData) {
    setLogs(["Starting job..."]);
    setStatus("active");
    const result = await createJob(formData);
    setJobId(result.jobId ?? null);

  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-green-500 font-mono p-10">
      <h1 className="text-4xl font-bold mb-8 tracking-tighter">📦 PACKAGE_FORGE v1.0</h1>

      {!jobId && (
        <form action={handleSubmit} className="w-full max-w-2xl flex gap-4">
          <input 
            name="prompt" 
            type="text" 
            placeholder="Describe your package (e.g., 'A CLI snake game')..." 
            className="flex-1 bg-gray-900 border border-green-700 p-4 rounded text-white focus:outline-none focus:border-green-400"
            required
          />
          <button type="submit" className="bg-green-700 text-black font-bold px-8 py-4 hover:bg-green-600 rounded">
            INITIALIZE
          </button>
        </form>
      )}

      {jobId && (
        <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl mt-8">
          <div className="bg-gray-800 p-2 flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-red-500"/>
            <div className="w-3 h-3 rounded-full bg-yellow-500"/>
            <div className="w-3 h-3 rounded-full bg-green-500"/>
            <span className="ml-4 text-xs text-gray-400">root@package-forge:~/build-logs</span>
          </div>
          
          <div className="p-6 h-96 overflow-y-auto flex flex-col-reverse bg-black/90">
            <div className="flex flex-col gap-1">
              {logs.map((log, i) => (
                <div key={i} className="border-l-2 border-green-900 pl-2">
                  <span className="text-green-600 mr-2">$</span>
                  <span className="text-gray-300">{log}</span>
                </div>
              ))}
              
              {status === 'active' && (
                <div className="animate-pulse text-green-500 mt-2">_ Processing...</div>
              )}
              
              {status === 'completed' && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-500 text-green-400 font-bold text-center">
                  ✅ BUILD SUCCESSFUL. READY FOR DEPLOYMENT.
                </div>
              )}

              {status === 'failed' && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-500 text-red-400 font-bold text-center">
                  ❌ BUILD FAILED. SYSTEM TERMINATED.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
