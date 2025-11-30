




// 'use server';

// import { packageQueue } from "../lib/queue";
// import fs from "fs/promises";
// import path from "path";
// import { existsSync } from "fs";

// export async function createJob(formData: FormData) {
//   const prompt = formData.get("prompt") as string;
//   const job = await packageQueue.add("generate-package", { 
//     prompt,
//     user: "Vikas"
//   });
//   return { success: true, jobId: job.id };
// }

// export async function checkJobStatus(jobId: string) {
//   const job = await packageQueue.getJob(jobId);
//   if (!job) {
//     return { status: "unknown", logs: [], packageName: null };
//   }
//   const logs = await packageQueue.getJobLogs(jobId);
//   const state = await job.getState();
  
//   // Check 'data' (Live) or 'returnvalue' (Finished)
//   const packageName = job.data.packageName || job.returnvalue?.packageName;

//   return {
//     status: state,
//     logs: logs.logs,
//     packageName: packageName || null
//   };
// }

// export async function getGeneratedFiles(packageName: string) {
//   try {
//     // 1. Find Monorepo Root
//     // Assuming we run from apps/web, going up 2 levels gets to root
//     const repoRoot = path.resolve(process.cwd(), '../../'); 
    
//     // 2. Construct path to worker temp folder
//     const projectPath = path.join(repoRoot, 'apps/worker/temp', packageName);

//     // DEBUG LOGS (Look at your Next.js terminal)
//     console.log(`🕵️ Fetching files from: ${projectPath}`);

//     try {
//       await fs.access(projectPath);
//     } catch {
//       return []; // Folder doesn't exist yet
//     }

//     const files = await fs.readdir(projectPath);
    
//     const fileData = [];
//     for (const file of files) {
//       if (file.startsWith('.') || file === 'node_modules') continue;
      
//       const filePath = path.join(projectPath, file);
//       // Only read files, skip folders
//       if ((await fs.stat(filePath)).isFile()) {
//           const content = await fs.readFile(filePath, 'utf-8');
//           fileData.push({ name: file, content });
//       }
//     }

//     return fileData;

//   } catch (e: any) {
//     console.error("🔥 CRITICAL READ ERROR:", e.message);
//     return [];
//   }
// }

// export async function publishProject(jobId: string) {
//   return { success: true, message: "Deploying..." };
// }







'use server';

import { packageQueue } from "../lib/queue";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function createJob(formData: FormData) {
  const prompt = formData.get("prompt") as string;
  const job = await packageQueue.add("generate-package", { 
    prompt,
    user: "Vikas"
  });
  return { success: true, jobId: job.id };
}

export async function checkJobStatus(jobId: string) {
  const job = await packageQueue.getJob(jobId);
  if (!job) {
    return { status: "unknown", logs: [], packageName: null };
  }
  const logs = await packageQueue.getJobLogs(jobId);
  const state = await job.getState();
  
  const packageName = job.data.packageName || job.returnvalue?.packageName;

  return {
    status: state,
    logs: logs.logs,
    packageName: packageName || null
  };
}

export async function getGeneratedFiles(packageName: string) {
  try {
    const repoRoot = path.resolve(process.cwd(), '../../'); 
    const projectPath = path.join(repoRoot, 'apps/worker/temp', packageName);

    console.log(`🕵️ Fetching files from: ${projectPath}`);

    try {
      await fs.access(projectPath);
    } catch {
      return [];
    }

    const files = await fs.readdir(projectPath);
    
    const fileData = [];
    for (const file of files) {
      if (file.startsWith('.') || file === 'node_modules') continue;
      
      const filePath = path.join(projectPath, file);
      if ((await fs.stat(filePath)).isFile()) {
          const content = await fs.readFile(filePath, 'utf-8');
          fileData.push({ name: file, content });
      }
    }

    return fileData;

  } catch (e: any) {
    console.error("🔥 CRITICAL READ ERROR:", e.message);
    return [];
  }
}

// export async function publishProject(packageName: string) {

//   console.log("SERVER publishProject CALLED with:", packageName);

//   const job = await packageQueue.add('publish-component', { 
//     prompt: "DEPLOY_ONLY",
//     packageName: packageName,
//     user: "Vikas" 
//   });
  
//   return { success: true, jobId: job.id };
// }






export async function publishProject(packageName: string) {
  console.log("SERVER publishProject CALLED with:", packageName);

  const job = await packageQueue.add('publish-component', { 
    prompt: "DEPLOY_ONLY",
    packageName: packageName,
    user: "Vikas" 
  });
  
  return { success: true, jobId: job.id };
}