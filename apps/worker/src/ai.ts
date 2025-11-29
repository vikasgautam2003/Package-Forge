import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { PackageSchema } from './schema';
import dotenv from 'dotenv';
import { object } from 'zod';


dotenv.config();

export async function generatePackageCode(prompt: string){
    console.log(`🤖 Gemini is thinking about: "${prompt}"...`);

    const { object } = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: PackageSchema,
        prompt: `
        You are an expert Node.js developer.
        Create a production-ready npm package for: ${prompt}.
        
        Requirements:
        1. 'package.json': Must have valid "scripts" (test, start) and "dependencies".
        2. 'index.js': The main entry point. Clean, error-free code.
        3. 'README.md': Clear instructions on how to use it.
        4. 'test.js': A simple script to verify the package works.
        
        Ensure all code is safe and does not contain malicious patterns.
      `,
    })

    return object;
}




export async function fixPackageCode(prompt: string, errorLog: string) {
  console.log(`🚑 Asking Gemini to fix the build error...`);

  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: PackageSchema,
    prompt: `
      You previously wrote code for: "${prompt}".
      However, it FAILED in the CI/CD pipeline.
      
      HERE IS THE ERROR LOG:
      ${errorLog}
      
      TASK:
      Rewrite the package to fix the error. 
      Keep the logic simple.
      Ensure dependencies in package.json match the imports.
      Fix any syntax errors shown in the logs.
    `,
  });

  return object;
}
