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
      You are a Senior Node.js Engineer and CLI Architect.
      Your task is to generate a robust, production-ready npm CLI package.

      USER REQUEST:
      "${prompt}"

      --------------------------------------------------------
      🛑 CRITICAL ANTI-PATTERNS (DO NOT DO THESE):
      --------------------------------------------------------
      1. **NO MINIFICATION**: Never write code on a single line.
         - BAD:  #!/usr/bin/env node import x from 'y';console.log(x);
         - GOOD: 
           #!/usr/bin/env node
           
           import x from 'y';
           console.log(x);

      2. **NO REQUIRE**: Do NOT use 'require()'. Use ESM 'import'.
      3. **NO MARKDOWN**: Do NOT wrap code in \`\`\` blocks inside the JSON string values.
      4. **NO PLACEHOLDERS**: Do not write "// code goes here". Write the actual implementation.

      --------------------------------------------------------
      ✅ TECHNICAL REQUIREMENTS (MUST FOLLOW):
      --------------------------------------------------------
      1. **package.json**: 
         - Must include "type": "module".
         - Must have a "bin" entry pointing to "./index.js".
         - Must have "engines": { "node": ">=18" }.
      
      2. **index.js**: 
         - Must start with exactly: #!/usr/bin/env node
         - Followed immediately by a blank line.
         - Use 'chalk', 'inquirer', 'boxen', 'open' if needed.
      
      3. **test.js**: 
         - A simple, deterministic test using 'node:child_process'.
         - It should run 'node index.js --help' or a safe command.
         - It MUST exit with code 0 on success, and 1 on failure.

      --------------------------------------------------------
      📦 OUTPUT FORMAT (STRICT JSON):
      --------------------------------------------------------
      Return ONLY a JSON object matching this schema. 
      Ensure all strings inside the JSON are properly escaped (e.g., usage of quotes inside code).

      Example of valid JSON structure for 'files':
      [
        {
          "name": "index.js",
          "content": "#!/usr/bin/env node\\n\\nimport chalk from 'chalk';\\n\\nconsole.log('Hello');"
        }
      ]

      Generate the package now.
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
      You are a Senior Node.js Engineer.
      
      CONTEXT:
      You previously wrote a CLI tool for the user request: "${prompt}".
      However, the build FAILED during the test phase.
      
      --------------------------------------------------------
      🛑 THE ERROR LOG:
      ${errorLog}
      --------------------------------------------------------
      
      YOUR MISSION (STRICT):
      1. ANALYZE the error log to find the root cause (e.g., missing dependency, syntax error, wrong bin path).
      2. FIX the specific error.
      3. ♻️ RE-GENERATE THE FULL SOURCE CODE. 
         - **CRITICAL**: Do NOT return a "stub" or "empty" index.js. 
         - You MUST rewrite the complete logic for "${prompt}".
         - If the index.js was working before, COPY IT BACK exactly as it was (but fix the error).
         - Do not be lazy. The user needs the full feature set.
         
      FORMATTING RULES:
      - Use ESM ('import').
      - index.js MUST start with '#!/usr/bin/env node'.
      - No minification.
      - Ensure package.json "bin" matches the filename.

      Generate the FIXED, COMPLETE package now.
    `,
  });

  return object;
}