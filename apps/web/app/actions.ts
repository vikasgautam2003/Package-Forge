'use server'

import { packageQueue } from "../lib/queue";

export async function createJob(formdata: FormData) {
  const prompt = formdata.get('prompt') as string;

  const job = await packageQueue.add('generate-package', { 
    prompt: prompt,
    user: "Vikas"
  });

  console.log("Job sent to queue!");
  return { success: true, jobId: job.id };
}




export async function checkJobStatus(jobId: string) {
  const job = await packageQueue.getJob(jobId);

  if (!job) {
    return { status: 'unknown', logs: [] };
  }

  const logs = await packageQueue.getJobLogs(jobId);
  const state = await job.getState();

  return {
    status: state,
    logs: logs.logs,
    result: job.returnvalue
  };
}
