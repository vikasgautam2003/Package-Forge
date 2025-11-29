import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { PackageSchema } from './schema';
import dotenv from 'dotenv';
import { object } from 'zod';


dotenv.config();

export async function generatePackageCode(prompt: string) {
  console.log(`🤖 Gemini is thinking about: "${prompt}"...`);

  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: PackageSchema,
    prompt: `
You are a Senior Node.js Engineer and code author. Produce a complete, production-ready npm CLI package that implements the feature described below.

USER REQUEST:
"${prompt}"

CRITICAL TECHNICAL RULES (MUST be satisfied):
1. Use ESM exclusively. All source files must use the import/export syntax. Do NOT use require().
2. package.json must contain: "type": "module".
3. index.js must start with the exact shebang on its own line:
   #!/usr/bin/env node
   (You MUST leave a blank line immediately after the shebang line).
4. Do NOT minify code. Use readable indentation and newlines.
5. Support Node.js >= 18. Provide "engines": { "node": ">=18" } in package.json.
6. Provide a top-level "bin" entry in package.json pointing to index.js.
   Example: "bin": { "my-cli-name": "./index.js" }
7. Prefer the ESM-friendly versions of dependencies. If using chalk, use Chalk v5+ and its ESM API:
   import chalk from 'chalk';
   console.log(chalk.blue.bold('text'));
8. Ensure cross-platform stability (Windows/Linux/Mac). The shebang must be on line 1 with a blank line after it.
9. Do NOT use sudo, hardcoded paths, or network calls in tests.


4. **NO MINIFICATION**: You MUST NOT minify the code. 
         - Use real newlines. 
         - Do NOT write code on a single line. 
         - Code must be readable.

OUTPUT FORMATTING RULES (Crucial for JSON parsing):
1. Return PURE JSON. Do not include markdown formatting outside the JSON object.
2. Inside the JSON values, return RAW code strings (no markdown fences).
3. Proper escaping: Ensure all quotes inside the code strings are properly escaped so the JSON is valid.

CONTENT REQUIREMENTS:
1. package.json: Valid JSON with name, version, bin, type, dependencies, and scripts.
2. index.js: The main CLI logic. Start with shebang. Use import.
3. test.js: A simple script using child_process to verify the CLI runs (e.g., node index.js --help).
4. README.md: Instructions on how to install and use.

SELF-CORRECTION CHECKS (must pass before returning):
- No 'require' usages.
- Shebang present on line 1 and line 2 is blank.
- package.json is valid JSON and contains required fields.
- test.js is executable by 'node test.js' and exits 0 on success.

Return the package object now.
    `,
  });

  if (!object) {
    throw new Error('generateObject returned no object');
  }

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
