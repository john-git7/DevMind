import { z } from 'zod';

const githubUrlRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w.-]+(\/)?$/;

export const repoUrlSchema = z.object({
  url: z.string().trim().regex(githubUrlRegex, 'Invalid GitHub repository URL (e.g. https://github.com/owner/repo)'),
});

export const indexRepoSchema = z.object({
  url: z.string().trim().regex(githubUrlRegex, 'Invalid GitHub repository URL (e.g. https://github.com/owner/repo)'),
  embeddingModel: z.string().optional().default('gemini-embedding-001'),
  excludedExtensions: z.array(z.string()).optional(),
});

export const skipFileSchema = z.object({
  url: z.string().trim().min(1, 'Repository URL is required'),
  filePath: z.string().trim().min(1, 'File path is required'),
});

export const getFileSchema = z.object({
  repoUrl: z.string().trim().regex(githubUrlRegex, 'Invalid GitHub repository URL'),
  filePath: z.string().trim().min(1, 'File path is required'),
});

export const statusQuerySchema = z.object({
  url: z.string().trim().min(1, 'Repository URL query parameter is required'),
});

export type IndexRepoInput = z.infer<typeof indexRepoSchema>;
export type RepoUrlInput = z.infer<typeof repoUrlSchema>;
