import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';


const execAsync = util.promisify(exec);


export async function publishPackage(packagePath: string, token: string) {

     console.log(`🚀 Preparing to publish from: ${packagePath}`);

     try{

        const npmrcPath = path.join(packagePath, '.npmrc');
        const npmrcContent = `//registry.npmjs.org/:_authToken=${token}`;
        await fs.writeFile(npmrcPath, npmrcContent);

        console.log(`    📦 Running npm publish...`);

        const command = 'npm publish --access public';
    
        const { stdout, stderr } = await execAsync(command, { 
        cwd: packagePath 
        });

        await fs.rm(npmrcPath);

        return { success: true, logs: stdout + stderr };


     } catch (error: any) {
        return { success: false, logs: error.message || error.stderr };
    }
}