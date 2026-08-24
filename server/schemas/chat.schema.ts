import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty'),
  repoId: z.string().optional().nullable(),
  conversationId: z.string().optional().nullable(),
  chatModel: z.string().optional(),
  embeddingModel: z.string().optional(),
});

export const onboardingSchema = z.object({
  repoUrl: z.string().trim().min(1, 'Repository URL is required'),
  chatModel: z.string().optional(),
});

export const bugTraceSchema = z.object({
  repoUrl: z.string().trim().min(1, 'Repository URL is required'),
  stackTrace: z.string().trim().min(1, 'Stack trace or error description is required'),
  chatModel: z.string().optional(),
});

export const commitStorySchema = z.object({
  repoUrl: z.string().trim().min(1, 'Repository URL is required'),
  commitCount: z.number().int().positive().max(100).optional().default(20),
  chatModel: z.string().optional(),
});

export const prReviewSchema = z.object({
  repoUrl: z.string().trim().min(1, 'Repository URL is required'),
  prNumber: z.union([z.number().int().positive(), z.string().regex(/^\d+$/).transform(Number)]),
  message: z.string().optional(),
  conversationId: z.string().optional().nullable(),
  chatModel: z.string().optional(),
});

export const conversationIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Conversation ID is required'),
});

export const truncateConversationSchema = z.object({
  messageIndex: z.number().int().min(0, 'messageIndex must be non-negative integer'),
});

export const historyQuerySchema = z.object({
  repoId: z.string().trim().min(1, 'repoId query parameter is required'),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type BugTraceInput = z.infer<typeof bugTraceSchema>;
export type PrReviewInput = z.infer<typeof prReviewSchema>;
