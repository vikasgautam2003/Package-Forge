// import fs from 'fs/promises';
// import path from 'path';
// import { exec } from 'child_process';
// import util from 'util';


// const execAsync = util.promisify(exec);


// export async function publishPackage(packagePath: string, token: string) {

//      console.log(`🚀 Preparing to publish from: ${packagePath}`);

//      try{

//         const npmrcPath = path.join(packagePath, '.npmrc');
//         const npmrcContent = `//registry.npmjs.org/:_authToken=${token}`;
//         await fs.writeFile(npmrcPath, npmrcContent);

//         console.log(`    📦 Running npm publish...`);

//         const command = 'npm publish --access public ';
    
//         const { stdout, stderr } = await execAsync(command, { 
//         cwd: packagePath 
//         });

//         await fs.rm(npmrcPath);

//         return { success: true, logs: stdout + stderr };


//      } catch (error: any) {
//         return { success: false, logs: error.message || error.stderr };
//     }
// }






import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export async function publishPackage(packagePath: string, token: string) {
  console.log(`🚀 Preparing to publish from: ${packagePath}`);
  
  const npmrcPath = path.join(packagePath, '.npmrc');

  try {
    // 1. Create .npmrc file with the token
    // We forces the registry to be npmjs.org to avoid accidental private registry publishes
    const npmrcContent = `//registry.npmjs.org/:_authToken=${token}`;
    await fs.writeFile(npmrcPath, npmrcContent);

    console.log(`    📦 Running npm publish...`);

    // 2. Run Publish Command
    // --access public is crucial for scoped packages (@user/pkg)
    const command = 'npm publish --access public';
    
    // We capture both stdout and stderr because npm writes status updates to stderr
    const { stdout, stderr } = await execAsync(command, { 
      cwd: packagePath 
    });

    return { success: true, logs: stdout + "\n" + stderr };

  } catch (error: any) {
    // If it fails, we return the error log so the user knows why (e.g. "Name taken")
    const errorLog = error.stderr || error.message || "Unknown error during publish";
    return { success: false, logs: errorLog };

  } finally {
    // 3. ALWAYS Clean up .npmrc (Security)
    // This runs even if the publish fails, so your token is never left on disk.
    try {
        await fs.rm(npmrcPath, { force: true });
    } catch (e) {
        console.error("⚠️ Failed to cleanup .npmrc file:", e);
    }
  }
}