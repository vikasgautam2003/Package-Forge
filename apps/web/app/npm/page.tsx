"use client";

import { useState, useEffect, useRef } from "react";
import { createJob, checkJobStatus, getGeneratedFiles, publishProject } from "../actions";

import { ChatInterface } from "../../components/mission-control/ChatInterface";
import { FileExplorer } from "../../components/mission-control/FileExplorer";
import { CodeEditor } from "../../components/mission-control/CodeEditor";
import { LogsPanel } from "../../components/mission-control/LogsPanel";

export default function MissionControl() {

  const [jobId, setJobId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("idle");
  const [packageName, setPackageName] = useState<string | null>(null);
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  
  // useEffect(() => {
  //   if (!jobId) return;

  //   const interval = setInterval(async () => {
  //     const data = await checkJobStatus(jobId);

  //     setLogs(data.logs);
  //     setStatus(data.status);

  //     if (data.packageName) {
  //       setPackageName(data.packageName);

       
  //       const fetchedFiles = await getGeneratedFiles(data.packageName);
  //       if (fetchedFiles.length > 0) {
  //         setFiles(fetchedFiles);
          
  //         if (!selectedFile) setSelectedFile("index.js");
  //       }
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [jobId, selectedFile]);



  useEffect(() => {
  if (!jobId) return;

  const interval = setInterval(async () => {
    const data = await checkJobStatus(jobId);

    setLogs(data.logs);
    setStatus(data.status);

    if (data.packageName) {
      setPackageName(data.packageName);
    }

    if (data.status === 'completed') {
      const fetchedFiles = await getGeneratedFiles(jobId);

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

  async function handleDeploy() {
    if (!packageName) return;

    setLogs(["Initializing Deployment Sequence..."]);
    setStatus("active");

    const result = await publishProject(packageName);

    if (result.jobId) {
      setJobId(result.jobId);
    }
  }

  
  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex overflow-hidden font-mono">
      <ChatInterface 
        jobId={jobId} 
        status={status} 
        onSubmit={handleSubmit} 
      />
      
      <FileExplorer 
        packageName={packageName} 
        files={files} 
        selectedFile={selectedFile} 
        onSelectFile={setSelectedFile} 
      />
      
      <CodeEditor 
        files={files} 
        selectedFile={selectedFile} 
        onSelectFile={setSelectedFile} 
      />
      
      <LogsPanel 
        logs={logs} 
        status={status} 
        onDeploy={handleDeploy} 
      />
    </div>
  );
}