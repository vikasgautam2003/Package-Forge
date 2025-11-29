import {z} from "zod"


export const PackageSchema = z.object({
    packageName: z.string().describe("The name of the npm package (kebab-case, no spaces)"),
    version: z.string().default("1.0.0"),
    description: z.string(),
    files: z.array(z.object({
    name: z.string().describe("Filename (e.g., index.js, package.json, README.md)"),
    content: z.string().describe("The code content of the file"),
  })),
})


export type GeneratedPackage = z.infer<typeof PackageSchema>;