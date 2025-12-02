




















// import { Worker, Job } from 'bullmq';
// import IORedis from 'ioredis';
// import { generatePackageCode, fixPackageCode } from './ai';
// import { runInSandbox } from './sandbox';
// import { publishPackage } from './publisher';
// import fs from 'fs/promises';
// import path from 'path';
// import dotenv from 'dotenv';


// const envResult = dotenv.config();
// if (envResult.error) {
//   console.warn("⚠️  Warning: .env file not found or failed to load in apps/worker!");
// }

// interface PackageJobData {
//   prompt: string;
//   user?: string;
//   packageName?: string;
//   status?: string;
// }


// const redisUrl = process.env.REDIS_CONNECTION_URL;
// let connection: IORedis;

// console.log("---------------------------------------------------");
// console.log("🕵️  DIAGNOSTICS MODE");
// console.log(`📂 Current Directory: ${process.cwd()}`);

// if (redisUrl && redisUrl.startsWith('rediss://')) {
//   console.log(`✅ Found REDIS_CONNECTION_URL: ${redisUrl.slice(0, 25)}... (Hidden)`);
//   console.log("☁️  Connecting to UPSTASH (Cloud)...");
//   connection = new IORedis(redisUrl, { 
//     maxRetriesPerRequest: null,
//     enableReadyCheck: false
//   });
// } else {
//   console.log("❌ REDIS_CONNECTION_URL is missing or invalid (must start with rediss://).");
//   console.log("🏠 Defaulting to LOCALHOST (127.0.0.1:6379)...");
//   console.log("⚠️  IF YOUR WEBSITE IS ON VERCEL, THIS WORKER WILL NOT RECEIVE JOBS!");
//   connection = new IORedis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: Number(process.env.REDIS_PORT || 6379),
//     maxRetriesPerRequest: null
//   });
// }
// console.log("---------------------------------------------------");


// const statusClient = new IORedis(redisUrl || 'redis://localhost:6379');
// setInterval(async () => {
//   try {
//     await statusClient.set('WORKER_STATUS', 'ONLINE', 'EX', 15);
//   } catch (err) {
//     console.error(err);
//   }
// }, 10000);

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


// const QUEUE_NAME = "project-generation-queue";
// console.log(`👷 Initializing Worker for Queue: "${QUEUE_NAME}"`);

// const worker = new Worker<PackageJobData>(
//   QUEUE_NAME,
//   async (job: Job<PackageJobData>) => {

//     if (job.name === 'publish-component') {
//        await log(job, `[Job ${job.id}] STARTING FINAL DEPLOYMENT...`);
//        const { packageName } = job.data;
       
//        if (!packageName) throw new Error("Package name missing");
       
//        const token = process.env.NPM_TOKEN;
//        if (!token) throw new Error("NPM_TOKEN is missing in Worker .env");

//        const projectPath = path.join(__dirname, "../temp", packageName);
       
//        await log(job, `Publishing '${packageName}' to npm registry...`);
       
//        const pubResult = await publishPackage(projectPath, token);

//        if (pubResult.success) {
//          await log(job, `SUCCESS! Package is live.`);
//          await log(job, `Link: https://www.npmjs.com/package/${packageName}`);
//          await job.updateData({ ...job.data, status: 'deployed' });
//        } else {
//          await log(job, `PUBLISH FAILED:\n${pubResult.logs}`);
//          throw new Error(pubResult.logs);
//        }
//        return;
//     }

//     await log(job, `[Job ${job.id}] 🚀 Start processing...`);

//     let attempts = 0;
//     const MAX_RETRIES = 3;
//     let isSuccess = false;
//     let currentLogs = "";

//     try {
//       await log(job, `🤖 Gemini is thinking about: "${job.data.prompt}"...`);
//       let result = await generatePackageCode(job.data.prompt);

//       await job.updateData({ ...job.data, packageName: result.packageName });

//       while (attempts < MAX_RETRIES && !isSuccess) {
//         attempts++;
//         await log(job, `\n--- 🔄 Attempt ${attempts}/${MAX_RETRIES} ---`);

//         if (attempts > 1) {
//           result = await fixPackageCode(job.data.prompt, currentLogs);
//           await job.updateData({ ...job.data, packageName: result.packageName });
//           await log(job, `🚑 Applied Fixes. New Name: ${result.packageName}`);
//         }

//         const tempDir = path.join(__dirname, "../temp", result.packageName);
        
      
//         await fs.mkdir(path.join(__dirname, "../temp"), { recursive: true });
//         await fs.mkdir(tempDir, { recursive: true });

//         for (const file of result.files) {
//           const cleaned = cleanCode(file.content, file.name);
//           await fs.writeFile(path.join(tempDir, file.name), cleaned);
//         }

//         await log(job, `📄 Files written to disk at: ${tempDir}`);
//         await log(job, `🐳 Testing: ${result.packageName}...`);

//         const testResult = await runInSandbox(tempDir);
//         currentLogs = testResult.logs;

//         if (testResult.success) {
//           isSuccess = true;
//           await log(job, `✅ PASSED on Attempt ${attempts}!`);
//           await log(job, `📦 Package Ready.`);
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


// worker.on('ready', () => {
//   console.log("✅ Worker is READY and connected to Redis!");
// });

// worker.on('error', (err) => {
//   console.error("❌ Worker Connection Error:", err);
// });

// worker.on('failed', (job, err) => {
//   console.error(`❌ Job ${job?.id} failed immediately:`, err);
// });

























import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { generatePackageCode, fixPackageCode } from './ai';
import { runInSandbox } from './sandbox';
import { publishPackage } from './publisher';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

const envResult = dotenv.config();
if (envResult.error) {
  console.warn("⚠️  Warning: .env file not found or failed to load in apps/worker!");
}

interface PackageJobData {
  prompt: string;
  user?: string;
  packageName?: string;
  status?: string;
}

const redisUrl = process.env.REDIS_CONNECTION_URL;
let connection: IORedis;

console.log("---------------------------------------------------");
console.log("🕵️  DIAGNOSTICS MODE");
console.log(`📂 Current Directory: ${process.cwd()}`);

if (redisUrl && redisUrl.startsWith('rediss://')) {
  console.log(`✅ Found REDIS_CONNECTION_URL: ${redisUrl.slice(0, 25)}... (Hidden)`);
  console.log("☁️  Connecting to UPSTASH (Cloud)...");
  connection = new IORedis(redisUrl, { 
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });
} else {
  console.log("❌ REDIS_CONNECTION_URL is missing or invalid (must start with rediss://).");
  console.log("🏠 Defaulting to LOCALHOST (127.0.0.1:6379)...");
  console.log("⚠️  IF YOUR WEBSITE IS ON VERCEL, THIS WORKER WILL NOT RECEIVE JOBS!");
  connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null
  });
}

try {
  execSync('docker info', { stdio: 'ignore' });
  console.log("🐳 Docker is running and ready.");
} catch (e) {
  console.error("❌ FATAL: Docker is not running!");
  console.error("   The worker cannot run sandboxed code without Docker.");
  console.error("   Please start Docker Desktop and try again.");
  process.exit(1); 
}

console.log("---------------------------------------------------");

const statusClient = new IORedis(redisUrl || 'redis://localhost:6379');
setInterval(async () => {
  try {
    await statusClient.set('WORKER_STATUS', 'ONLINE', 'EX', 15);
  } catch (err) {
    // Silent fail
  }
}, 10000);

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

const QUEUE_NAME = "project-generation-queue";
console.log(`👷 Initializing Worker for Queue: "${QUEUE_NAME}"`);

const worker = new Worker<PackageJobData>(
  QUEUE_NAME,
  async (job: Job<PackageJobData>) => {

    if (job.name === 'publish-component') {
       await log(job, `[Job ${job.id}] STARTING FINAL DEPLOYMENT...`);
       const { packageName } = job.data;
       
       if (!packageName) throw new Error("Package name missing");
       
       const token = process.env.NPM_TOKEN;
       if (!token) throw new Error("NPM_TOKEN is missing in Worker .env");

       const projectPath = path.join(__dirname, "../temp", packageName);
       
       await log(job, `Publishing '${packageName}' to npm registry...`);
       
       const pubResult = await publishPackage(projectPath, token);

       if (pubResult.success) {
         await log(job, `SUCCESS! Package is live.`);
         await log(job, `Link: https://www.npmjs.com/package/${packageName}`);
         await job.updateData({ ...job.data, status: 'deployed' });
       } else {
         await log(job, `PUBLISH FAILED:\n${pubResult.logs}`);
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
        
        await fs.mkdir(path.join(__dirname, "../temp"), { recursive: true });
        await fs.mkdir(tempDir, { recursive: true });

        for (const file of result.files) {
          const cleaned = cleanCode(file.content, file.name);
          await fs.writeFile(path.join(tempDir, file.name), cleaned);
        }

        await log(job, `📄 Files written to disk at: ${tempDir}`);
        await log(job, `🐳 Testing: ${result.packageName}...`);

        const testResult = await runInSandbox(tempDir);
        currentLogs = testResult.logs;

        if (testResult.success) {
          isSuccess = true;
          await log(job, `✅ PASSED on Attempt ${attempts}!`);
          await log(job, `📦 Package Ready. Returning files via Redis...`);

          const outputFiles = [];
          const filesOnDisk = await fs.readdir(tempDir);
          
          for (const fileName of filesOnDisk) {
            if (fileName === 'node_modules' || fileName.startsWith('.')) continue;
            
            const filePath = path.join(tempDir, fileName);
            const stats = await fs.stat(filePath);
            
            if (stats.isFile()) {
              const content = await fs.readFile(filePath, 'utf-8');
              outputFiles.push({ name: fileName, content });
            }
          }

          return { 
            success: true, 
            packageName: result.packageName, 
            files: outputFiles 
          };
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

worker.on('ready', () => {
  console.log("✅ Worker is READY and connected to Redis!");
});

worker.on('error', (err) => {
  console.error("❌ Worker Connection Error:", err);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed immediately:`, err);
});