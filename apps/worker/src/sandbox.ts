import Docker from 'dockerode';
import path from 'path';

const docker = new Docker();

export async function runInSandbox(packagePath: string) {
  const containerName = `sandbox-${Date.now()}`;
  const absolutePath = path.resolve(packagePath);
  let fullLogs = '';

  try {
    const container = await docker.createContainer({
      Image: 'node:18-alpine',
      name: containerName,
      Tty: false,
      HostConfig: {
        Binds: [`${absolutePath}:/app`],
        AutoRemove: true,
        NetworkMode: 'host'
      },
      WorkingDir: '/app',
      Cmd: ['sh', '-c', 'npm install && npm test']
    });

    await container.start();

    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true
    });

    container.modem.demuxStream(
      stream,
      {
        write: (chunk:any) => {
          const log = chunk.toString();
          fullLogs += log;
          process.stdout.write(log);
        }
      },
      {
        write: (chunk: any) => {
          const log = chunk.toString();
          fullLogs += log;
          process.stderr.write(log);
        }
      }
    );

    const data = await container.wait();

    return {
      success: data.StatusCode === 0,
      logs: fullLogs
    };

  } catch (error) {
    return { success: false, logs: `Docker Error: ${error}` };
  }
}
