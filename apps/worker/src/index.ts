











// import { Worker, Job } from 'bullmq';
// import { generatePackageCode, fixPackageCode } from './ai';
// import { runInSandbox } from './sandbox';
// import { publishPackage } from './publisher';
// import fs from 'fs/promises';
// import path from 'path';
// import dotenv from 'dotenv';

// dotenv.config();

// interface PackageJobData {
//   prompt: string;
//   user?: string;
//   packageName?: string; // Added optional field
// }

// const connection = {
//   host: 'localhost',
//   port: 6379
// };





// function cleanCode(content: string, fileName: string): string {
//   let clean = content.trim();
//   const ext = fileName.split('.').pop();

//   const looksStringified =
//     (clean.startsWith('"') && clean.endsWith('"')) ||
//     (clean.startsWith("'") && clean.endsWith("'"));

//   if (looksStringified) {
//     clean = clean.slice(1, -1);
//     clean = clean.replace(/\\"/g, '"');
//     clean = clean.replace(/\\n/g, '\n');
//   }

//   if (fileName === "package.json") {
//     try {
//       return JSON.stringify(JSON.parse(clean), null, 2);
//     } catch {
//       try {
//         const unescaped = clean.replace(/\\"/g, '"');
//         return JSON.stringify(JSON.parse(unescaped), null, 2);
//       } catch {
//         return clean;
//       }
//     }
//   }

//   if (fileName === "index.js") {
//     clean = fixShebang(clean);
//   }

//   clean = clean.replace(/\r\n/g, '\n');
//   return clean;
// }




// function fixShebang(code: string): string {
//   let clean = code.replace(/^#!.*\n?/, '').trim();
//   return `#!/usr/bin/env node\n\n${clean}`;
// }

// async function log(job: Job, message: string) {
//   console.log(message);
//   await job.log(message);
// }

// console.log("👷 Worker is running! Waiting for jobs...");

// const worker = new Worker<PackageJobData>(
//   "package-generation",
//   async (job: Job<PackageJobData>) => {
//     await log(job, `[Job ${job.id}] 🚀 Start processing...`);

//     let attempts = 0;
//     const MAX_RETRIES = 3;
//     let isSuccess = false;
//     let currentLogs = "";

//     try {
//       await log(job, `🤖 Gemini is thinking about: "${job.data.prompt}"...`);
//       let result = await generatePackageCode(job.data.prompt);
      
//       // 🔥 THE CRITICAL FIX: Tell the Frontend the name IMMEDIATELY
//       await job.updateData({ ...job.data, packageName: result.packageName });

//       while (attempts < MAX_RETRIES && !isSuccess) {
//         attempts++;
//         await log(job, `\n--- 🔄 Attempt ${attempts}/${MAX_RETRIES} ---`);

//         if (attempts > 1) {
//           result = await fixPackageCode(job.data.prompt, currentLogs);
//           // Update name again in case AI changed it
//           await job.updateData({ ...job.data, packageName: result.packageName });
//           await log(job, `🚑 Applied Fixes. New Name: ${result.packageName}`);
//         }

//         const tempDir = path.join(__dirname, "../temp", result.packageName);
//         await fs.mkdir(tempDir, { recursive: true });

//         for (const file of result.files) {
//           const cleaned = cleanCode(file.content, file.name);
//           await fs.writeFile(path.join(tempDir, file.name), cleaned);
//         }

//         await log(job, `📄 Files written to disk.`);
//         await log(job, `🐳 Testing: ${result.packageName}...`);

//         const testResult = await runInSandbox(tempDir);
//         currentLogs = testResult.logs;

//         if (testResult.success) {
//           isSuccess = true;
//           await log(job, `✅ PASSED on Attempt ${attempts}!`);

//           const token = process.env.NPM_TOKEN;
//           if (!token) {
//             await log(job, `⚠️ No NPM_TOKEN found. Skipping publish.`);
//           } else {
//             await log(job, `🚀 Starting Publication Sequence (Simulation Mode)...`);

//             const finalPath = path.join(__dirname, "../temp", result.packageName);
//             const pubResult = await publishPackage(finalPath, token);

//             if (pubResult.success) {
//               await log(job, `📦 PUBLISH SIM SUCCESSFUL!`);
//               await log(job, `🔎 Registry Response:\n${pubResult.logs}`);
//             } else {
//               await log(job, `❌ PUBLISH FAILED:\n${pubResult.logs}`);
//             }
//           }
//         } else {
//           await log(job, `❌ Attempt ${attempts} Failed.`);
//           await log(job, `🔎 Error Preview: ${currentLogs.slice(0, 200)}...`);
//         }
//       }

//       if (!isSuccess) {
//         await log(job, `💀 GAVE UP AFTER ${MAX_RETRIES} ATTEMPTS.`);
//         throw new Error("Build Failed");
//       }

//     } catch (error: any) {
//       await log(job, `❌ Critical Error: ${error.message}`);
//       throw error;
//     }
//   },
//   {
//     connection,
//     lockDuration: 1000 * 60 * 5,
//     lockRenewTime: 1000 * 20,
//     stalledInterval: 1000 * 60 * 60
//   }
// );




























import { Worker, Job } from 'bullmq';
import { generatePackageCode, fixPackageCode } from './ai';
import { runInSandbox } from './sandbox';
import { publishPackage } from './publisher';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface PackageJobData {
  prompt: string;
  user?: string;
  packageName?: string;
   status?: string;
}

const connection = {
  host: 'localhost',
  port: 6379
};

function cleanCode(content: string, fileName: string): string {
  let clean = content.trim();
  const ext = fileName.split('.').pop();

  const looksStringified =
    (clean.startsWith('"') && clean.endsWith('"')) ||
    (clean.startsWith("'") && clean.endsWith("'"));

  if (looksStringified) {
    clean = clean.slice(1, -1);
    clean = clean.replace(/\\"/g, '"');
    clean = clean.replace(/\\n/g, '\n');
  }

  if (fileName === "package.json") {
    try {
      return JSON.stringify(JSON.parse(clean), null, 2);
    } catch {
      try {
        const unescaped = clean.replace(/\\"/g, '"');
        return JSON.stringify(JSON.parse(unescaped), null, 2);
      } catch {
        return clean;
      }
    }
  }

  if (fileName === "index.js") {
    clean = fixShebang(clean);
  }

  clean = clean.replace(/\r\n/g, '\n');
  return clean;
}

function fixShebang(code: string): string {
  let clean = code.replace(/^#!.*\n?/, '').trim();
  return `#!/usr/bin/env node\n\n${clean}`;
}

async function log(job: Job, message: string) {
  console.log(message);
  await job.log(message);
}

console.log("👷 Worker is running! Waiting for jobs...");

const worker = new Worker<PackageJobData>(
  "package-generation",
  async (job: Job<PackageJobData>) => {

    // if (job.name === 'publish-component') {
    //   await log(job, `[Job ${job.id}] 🚀 STARTING FINAL DEPLOYMENT...`);
    //   const { packageName } = job.data;

    //   if (!packageName) throw new Error("Package name missing");

    //   const token = process.env.NPM_TOKEN;
    //   if (!token) throw new Error("NPM_TOKEN is missing in Worker .env");

    //   const projectPath = path.join(__dirname, "../temp", packageName);

    //   await log(job, `📦 Publishing '${packageName}' to npm registry...`);

    //   const pubResult = await publishPackage(projectPath, token);

    //   if (pubResult.success) {
    //     await log(job, `✅ SUCCESS! Package is live.`);
    //     await log(job, `🌐 Link: https://www.npmjs.com/package/${packageName}`);
    //   } else {
    //     await log(job, `❌ PUBLISH FAILED:\n${pubResult.logs}`);
    //     throw new Error(pubResult.logs);
    //   }
    //   return;
    // }



    if (job.name === 'publish-component') {
       await log(job, `[Job ${job.id}] 🚀 STARTING FINAL DEPLOYMENT...`);
       const { packageName } = job.data;
       
       if (!packageName) throw new Error("Package name missing");
       
       const token = process.env.NPM_TOKEN;
       if (!token) throw new Error("NPM_TOKEN is missing in Worker .env");

       const projectPath = path.join(__dirname, "../temp", packageName);
       
       await log(job, `📦 Publishing '${packageName}' to npm registry...`);
       
       const pubResult = await publishPackage(projectPath, token);

       if (pubResult.success) {
         await log(job, `✅ SUCCESS! Package is live.`);
         await log(job, `🌐 Link: https://www.npmjs.com/package/${packageName}`);
         await job.updateData({ ...job.data, status: 'deployed' });
       } else {
         await log(job, `❌ PUBLISH FAILED:\n${pubResult.logs}`);
         throw new Error(pubResult.logs);
       }
       return;
    }

    await log(job, `[Job ${job.id}] 🚀 Start processing...`);

    let attempts = 0;
    const MAX_RETRIES = 3;
    let isSuccess = false;
    let currentLogs = "";

    try {
      await log(job, `🤖 Gemini is thinking about: "${job.data.prompt}"...`);
      let result = await generatePackageCode(job.data.prompt);

      await job.updateData({ ...job.data, packageName: result.packageName });

      while (attempts < MAX_RETRIES && !isSuccess) {
        attempts++;
        await log(job, `\n--- 🔄 Attempt ${attempts}/${MAX_RETRIES} ---`);

        if (attempts > 1) {
          result = await fixPackageCode(job.data.prompt, currentLogs);
          await job.updateData({ ...job.data, packageName: result.packageName });
          await log(job, `🚑 Applied Fixes. New Name: ${result.packageName}`);
        }

        const tempDir = path.join(__dirname, "../temp", result.packageName);
        await fs.mkdir(tempDir, { recursive: true });

        for (const file of result.files) {
          const cleaned = cleanCode(file.content, file.name);
          await fs.writeFile(path.join(tempDir, file.name), cleaned);
        }

        await log(job, `📄 Files written to disk.`);
        await log(job, `🐳 Testing: ${result.packageName}...`);

        const testResult = await runInSandbox(tempDir);
        currentLogs = testResult.logs;

        if (testResult.success) {
          isSuccess = true;
          await log(job, `✅ PASSED on Attempt ${attempts}!`);
          await log(job, `📦 Package Ready. Waiting for user deployment...`);
        } else {
          await log(job, `❌ Attempt ${attempts} Failed.`);
          await log(job, `🔎 Error Preview: ${currentLogs.slice(0, 200)}...`);
        }
      }

      if (!isSuccess) {
        await log(job, `💀 GAVE UP AFTER ${MAX_RETRIES} ATTEMPTS.`);
        throw new Error("Build Failed");
      }

    } catch (error: any) {
      await log(job, `❌ Critical Error: ${error.message}`);
      throw error;
    }
  },
  {
    connection,
    lockDuration: 1000 * 60 * 5,
    lockRenewTime: 1000 * 20,
    stalledInterval: 1000 * 60 * 60
  }
);