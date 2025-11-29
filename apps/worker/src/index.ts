





// import { Worker, Job } from 'bullmq';
// import { generatePackageCode, fixPackageCode } from './ai';
// import { runInSandbox } from './sandbox';
// import fs from 'fs/promises';
// import path from 'path';
// import dotenv from 'dotenv';

// dotenv.config();

// interface PackageJobData {
//   prompt: string;
//   user?: string;
// }

// const connection = {
//   host: 'localhost',
//   port: 6379
// };

// console.log("👷 Worker is running! Waiting for jobs...");

// function cleanCode(content: string, fileName: string) {
//   return content;
// }

// const worker = new Worker<PackageJobData>(
//   'package-generation',
//   async (job: Job<PackageJobData>) => {
//     console.log(`\n[Job ${job.id}] 🚀 Start processing...`);

//     let attempts = 0;
//     const MAX_RETRIES = 3;
//     let isSuccess = false;
//     let currentLogs = "";
//     let result = await generatePackageCode(job.data.prompt);

//     try {
//       // while (attempts < MAX_RETRIES && !isSuccess) {
//       //   attempts++;
//       //   console.log(`\n--- Attempt ${attempts}/${MAX_RETRIES} ---`);

//       //   if (attempts > 1) {
//       //     result = await fixPackageCode(job.data.prompt, currentLogs);
//       //     console.log(`[Job ${job.id}] Fixes applied.`);
//       //   }

//       //   const tempDir = path.join(__dirname, '../temp', result.packageName);

//       //   if (attempts === 1) {
//       //     await fs.rm(tempDir, { recursive: true, force: true });
//       //     await fs.mkdir(tempDir, { recursive: true });
//       //   }

//       //   for (const file of result.files) {
//       //     const safeContent = cleanCode(file.content, file.name);
//       //     const filePath = path.join(tempDir, file.name);
//       //     await fs.writeFile(filePath, safeContent);
//       //   }

//       //   console.log(`[Job ${job.id}] Testing in Sandbox...`);
//       //   const testResult = await runInSandbox(tempDir);
//       //   currentLogs = testResult.logs;

//       //   if (testResult.success) {
//       //     isSuccess = true;
//       //     console.log(`[Job ${job.id}] PASSED on Attempt ${attempts}`);
//       //   } else {
//       //     console.log(`[Job ${job.id}] Failed Attempt ${attempts}`);
//       //   }
//       // }

//       // if (!isSuccess) {
//       //   console.log(`[Job ${job.id}] Gave up after ${MAX_RETRIES} attempts`);
//       // }

//       while (attempts < MAX_RETRIES && !isSuccess) {
//   attempts++;
//   console.log(`\n--- 🔄 Attempt ${attempts}/${MAX_RETRIES} ---`);

//   if (attempts > 1) {
//     result = await fixPackageCode(job.data.prompt, currentLogs);
//     console.log(`[Job ${job.id}] 🚑 Applied Fixes. New Name: ${result.packageName}`);
//   }

//   const tempDir = path.join(__dirname, '../temp', result.packageName);


//   await fs.rm(tempDir, { recursive: true, force: true });
//   await fs.mkdir(tempDir, { recursive: true });

//   for (const file of result.files) {
//     const safeContent = cleanCode(file.content, file.name);
//     const filePath = path.join(tempDir, file.name);
//     await fs.writeFile(filePath, safeContent);
//   }

//   console.log(`[Job ${job.id}] 🐳 Testing: ${result.packageName}...`);
//   const testResult = await runInSandbox(tempDir);

//   currentLogs = testResult.logs;

//   if (testResult.success) {
//     isSuccess = true;
//     console.log(`[Job ${job.id}] ✅ PASSED on Attempt ${attempts}!`);
//   } else {
//     console.log(`[Job ${job.id}] ❌ Attempt ${attempts} Failed.`);
//   }
// }


//     } catch (error) {
//       console.error(`[Job ${job.id}] Critical Error:`, error);
//     }
//   },
//   { connection }
// );







// import { Worker, Job } from 'bullmq';
// import { generatePackageCode, fixPackageCode } from './ai';
// import { runInSandbox } from './sandbox';
// import fs from 'fs/promises';
// import path from 'path';
// import dotenv from 'dotenv';
// import { publishPackage } from './publisher';

// dotenv.config();

// interface PackageJobData {
//   prompt: string;
//   user?: string;
// }

// const connection = {
//   host: 'localhost',
//   port: 6379
// };

// function cleanCode(content: string, fileName: string): string {
//   let clean = content;
//   if (clean.includes('\\"')) clean = clean.replace(/\\"/g, '"');
//   if (clean.includes('\\n')) clean = clean.replace(/\\n/g, '\n');
//   if (fileName === 'package.json') {
//     try { return JSON.stringify(JSON.parse(clean), null, 2); } catch { return clean; }
//   }
//   return clean;
// }

// async function log(job: Job, message: string) {
//   console.log(message);
//   await job.log(message);
// }

// console.log("👷 Worker is running! Waiting for jobs...");

// const worker = new Worker<PackageJobData>(
//   'package-generation',
//   async (job: Job<PackageJobData>) => {
//     await log(job, `[Job ${job.id}] 🚀 Start processing...`);

//     let attempts = 0;
//     const MAX_RETRIES = 3;
//     let isSuccess = false;
//     let currentLogs = "";

//     try {
//       await log(job, `🤖 Gemini is thinking about: "${job.data.prompt}"...`);
//       let result = await generatePackageCode(job.data.prompt);

//       while (attempts < MAX_RETRIES && !isSuccess) {
//         attempts++;
//         await log(job, `\n--- 🔄 Attempt ${attempts}/${MAX_RETRIES} ---`);

//         if (attempts > 1) {
//           await log(job, `🚑 Asking Gemini to fix the build error...`);
//           result = await fixPackageCode(job.data.prompt, currentLogs);
//           await log(job, `🚑 Applied Fixes. New Name: ${result.packageName}`);
//         }

//         const tempDir = path.join(__dirname, '../temp', result.packageName);
//         await fs.rm(tempDir, { recursive: true, force: true });
//         await fs.mkdir(tempDir, { recursive: true });

//         for (const file of result.files) {
//           const safeContent = cleanCode(file.content, file.name);
//           const filePath = path.join(tempDir, file.name);
//           await fs.writeFile(filePath, safeContent);
//         }
//         await log(job, `📄 Files written to disk.`);

//         await log(job, `🐳 Testing: ${result.packageName}...`);
//         const testResult = await runInSandbox(tempDir);

//         currentLogs = testResult.logs;

//         if (testResult.success) {
//           isSuccess = true;
//           await log(job, `✅ PASSED on Attempt ${attempts}!`);
//         } else {
//           await log(job, `❌ Attempt ${attempts} Failed.`);
//           await log(job, `🔎 Error Log Preview: ${currentLogs.slice(0, 200)}...`);
//         }
//       }

//       if (!isSuccess) {
//         await log(job, `💀 GAVE UP after ${MAX_RETRIES} attempts.`);
//         throw new Error("Build Failed");
//       }

//     } catch (error: any) {
//       await log(job, `❌ Critical Error: ${error.message}`);
//       throw error;
//     }
//   },
//   { connection,
//     lockDuration: 1000 * 60 * 5,
//     lockRenewTime: 1000 * 20,
//     stalledInterval: 1000 * 60 * 60 }
// );
















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
// }

// const connection = {
//   host: 'localhost',
//   port: 6379
// };

// // function cleanCode(content: string, fileName: string): string {
// //   let clean = content;
// //   if (clean.includes('\\"')) clean = clean.replace(/\\"/g, '"');
// //   if (clean.includes('\\n')) clean = clean.replace(/\\n/g, '\n');
// //   if (fileName === 'package.json') {
// //     try { return JSON.stringify(JSON.parse(clean), null, 2); } catch { return clean; }
// //   }
// //   return clean;
// // }


// function cleanCode(content: string, fileName: string): string {
//   let clean = content;

//   const ext = fileName.split('.').pop();

//   // --------------------------------------
//   // 1. Normalize escaped sequences everywhere
//   // --------------------------------------
//   clean = clean.replace(/\\r\\n/g, '\n');
//   clean = clean.replace(/\\n/g, '\n');
//   clean = clean.replace(/\\t/g, '\t');

//   // --------------------------------------
//   // 2. Detect and fix stringified files
//   // --------------------------------------
//   const isStringLiteral =
//     (clean.startsWith('"') && clean.endsWith('"')) ||
//     (clean.startsWith("'") && clean.endsWith("'"));

//   if (isStringLiteral) {
//     clean = clean.slice(1, -1);
//     clean = clean.replace(/\\"/g, '"');
//     clean = clean.replace(/\\n/g, '\n');
//   }

//   // --------------------------------------
//   // 3. Clean package.json safely
//   // --------------------------------------
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

//   // --------------------------------------
//   // 4. Fix Shebang for CLI main file
//   // --------------------------------------
//   if (fileName === "index.js") {
//     clean = fixShebang(clean);
//   }

//   // --------------------------------------
//   // 5. Normalize final newlines
//   // --------------------------------------
//   clean = clean.replace(/\r\n/g, '\n');

//   // DO NOT TRIM — trimming breaks indentation & shebang spacing
//   return clean;
// }

// function fixShebang(code: string): string {
//   const lines = code.split(/\r?\n/);

//   // Remove any existing shebang (safe version)
//   if (lines[0].startsWith("#!")) {
//     lines.shift();
//   }

//   // Reconstruct
//   return `#!/usr/bin/env node\n\n${lines.join("\n").trimStart()}`;
// }





// async function log(job: Job, message: string) {
//   console.log(message);
//   await job.log(message);
// }

// console.log("👷 Worker is running! Waiting for jobs...");

// const worker = new Worker<PackageJobData>(
//   'package-generation',
//   async (job: Job<PackageJobData>) => {
//     await log(job, `[Job ${job.id}] 🚀 Start processing...`);

//     let attempts = 0;
//     const MAX_RETRIES = 3;
//     let isSuccess = false;
//     let currentLogs = "";

//     try {
//       await log(job, `🤖 Gemini is thinking about: "${job.data.prompt}"...`);
//       let result = await generatePackageCode(job.data.prompt);

//       while (attempts < MAX_RETRIES && !isSuccess) {
//         attempts++;
//         await log(job, `\n--- 🔄 Attempt ${attempts}/${MAX_RETRIES} ---`);

//         if (attempts > 1) {
//           result = await fixPackageCode(job.data.prompt, currentLogs);
//           await log(job, `🚑 Applied Fixes. New Name: ${result.packageName}`);
//         }

//         const tempDir = path.join(__dirname, '../temp', result.packageName);
//         await fs.rm(tempDir, { recursive: true, force: true });
//         await fs.mkdir(tempDir, { recursive: true });

//         for (const file of result.files) {
//           const safeContent = cleanCode(file.content, file.name);
//           const filePath = path.join(tempDir, file.name);
//           await fs.writeFile(filePath, safeContent);
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
//             const finalPath = path.join(__dirname, '../temp', result.packageName);
//             const pubResult = await publishPackage(finalPath, token);

//             if (pubResult.success) {
//               await log(job, `📦 PUBLISH SIMULATION SUCCESSFUL!`);
//               await log(job, `🔎 Registry Response: \n${pubResult.logs}`);
//             } else {
//               await log(job, `❌ PUBLISH FAILED: ${pubResult.logs}`);
//             }
//           }

//         } else {
//           await log(job, `❌ Attempt ${attempts} Failed.`);
//           await log(job, `🔎 Error Log Preview: ${currentLogs.slice(0, 200)}...`);
//         }
//       }

//       if (!isSuccess) {
//         await log(job, `💀 GAVE UP after ${MAX_RETRIES} attempts.`);
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
  packageName?: string; // Added optional field
}

const connection = {
  host: 'localhost',
  port: 6379
};

// function cleanCode(content: string, fileName: string): string {
//   let clean = content.trim(); 
//   const ext = fileName.split('.').pop();

//   // ---------------------------------------------------------
//   // 1. UNWRAP "STRINGIFIED" CODE (The Only Place We Fix \n)
//   // ---------------------------------------------------------
//   // If Gemini returns "const a=1;\nconst b=2", we MUST fix the newlines.
//   const looksStringified =
//     (clean.startsWith('"') && clean.endsWith('"')) ||
//     (clean.startsWith("'") && clean.endsWith("'"));

//   if (looksStringified) {
//     clean = clean.slice(1, -1);         // Remove wrapper quotes
//     clean = clean.replace(/\\"/g, '"'); // Unescape internal quotes
//     clean = clean.replace(/\\n/g, '\n'); // HERE is the only safe place to do this
//   }

//   // ---------------------------------------------------------
//   // 2. PACKAGE.JSON FIXES
//   // ---------------------------------------------------------
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

//   // ---------------------------------------------------------
//   // 3. FORCE SHEBANG ON INDEX.JS
//   // ---------------------------------------------------------
//   if (fileName === "index.js") {
//      clean = fixShebang(clean);
//   }

//   // ---------------------------------------------------------
//   // 4. FINAL CLEANUP
//   // ---------------------------------------------------------
//   // ❌ REMOVED: The global replace(/\\n/g, '\n') is GONE.
//   // It was breaking valid code like: output.split('\n')
  
//   clean = clean.replace(/\r\n/g, '\n'); 
//   return clean;
// }



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
    await log(job, `[Job ${job.id}] 🚀 Start processing...`);

    let attempts = 0;
    const MAX_RETRIES = 3;
    let isSuccess = false;
    let currentLogs = "";

    try {
      await log(job, `🤖 Gemini is thinking about: "${job.data.prompt}"...`);
      let result = await generatePackageCode(job.data.prompt);
      
      // 🔥 THE CRITICAL FIX: Tell the Frontend the name IMMEDIATELY
      await job.updateData({ ...job.data, packageName: result.packageName });

      while (attempts < MAX_RETRIES && !isSuccess) {
        attempts++;
        await log(job, `\n--- 🔄 Attempt ${attempts}/${MAX_RETRIES} ---`);

        if (attempts > 1) {
          result = await fixPackageCode(job.data.prompt, currentLogs);
          // Update name again in case AI changed it
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

          const token = process.env.NPM_TOKEN;
          if (!token) {
            await log(job, `⚠️ No NPM_TOKEN found. Skipping publish.`);
          } else {
            await log(job, `🚀 Starting Publication Sequence (Simulation Mode)...`);

            const finalPath = path.join(__dirname, "../temp", result.packageName);
            const pubResult = await publishPackage(finalPath, token);

            if (pubResult.success) {
              await log(job, `📦 PUBLISH SIM SUCCESSFUL!`);
              await log(job, `🔎 Registry Response:\n${pubResult.logs}`);
            } else {
              await log(job, `❌ PUBLISH FAILED:\n${pubResult.logs}`);
            }
          }
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