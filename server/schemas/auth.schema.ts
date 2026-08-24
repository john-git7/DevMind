import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email('A valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().trim().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('A valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export const githubTokenSchema = z.object({
  githubToken: z.string().min(1, 'GitHub token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GithubTokenInput = z.infer<typeof githubTokenSchema>;
