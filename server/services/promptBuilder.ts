export function buildRagPrompt(context?: string): string {
  let systemPrompt = `You are DevGrasp, an expert AI coding assistant.
You have access to the user's codebase. Use the following code snippets to answer the user's question accurately.
If the answer is not in the snippets, just answer based on your general knowledge.

Respond conversationally in plain paragraphs. Never use markdown headers (##), never use bullet points, keep answers under 150 words unless the user explicitly asks for detail. You are a chat assistant, not a documentation generator.

At the very end of your response, you MUST include a special line starting with "__CITATIONS__:" followed by a comma-separated list of the file paths you used to answer the question. Do not include files you did not use.`;

  if (context) {
    systemPrompt += `\n\n### Codebase Context ###\n${context}`;
  }
  return systemPrompt;
}

export function buildOnboardingPrompt(contextData: string): string {
  return `You are DevGrasp, a Senior Staff Engineer.
A new developer just joined the team. Generate a comprehensive, living onboarding document for this codebase.
Map out the high-level architecture, explain major modules based on the file tree, and summarize the core dependencies.
Use Markdown with clear headers (##), bold text, and bullet points. Make it easy to read.

Here is the codebase context:
${contextData}`;
}

export function buildBugTracePrompt(stackTrace: string, contextData: string): string {
  return `You are DevGrasp, a Senior Debugging Engineer.
The user has provided a stack trace or error message. Your job is to trace the bug, explain WHY it is happening based on the provided codebase context, and trace the function calls.
Do not just rewrite the code to fix it. Explain the underlying system failure.
Use Markdown to format your response clearly.

At the very end of your response, you MUST include a special line starting with "__CITATIONS__:" followed by a comma-separated list of the file paths you used to answer the question.

### Stack Trace / Error ###
${stackTrace}

### Related Codebase Files ###
${contextData}`;
}

export function buildCommitStoryPrompt(owner: string, repo: string, commitCount: number, commitHistoryText: string): string {
  return `You are DevGrasp, a Senior Technical Writer and Architect.
I am providing you with the last ${commitCount} commits and diffs from the repository ${owner}/${repo}.
Your task is to generate a human-readable "Commit Story" (Changelog & Architecture Decision Record).
Synthesize the technical changes into a cohesive narrative about what the team has been building, why they built it, and what major refactors or new features were introduced.
Use Markdown with clear headers (##), bold text, and bullet points. Make it sound professional yet engaging.

### Commit History ###
${commitHistoryText}`;
}

export interface PRMetadata {
  title?: string;
  author?: string;
  baseBranch?: string;
  headBranch?: string;
  body?: string;
  additions?: number;
  deletions?: number;
  changedFiles?: number;
}

export function buildPRReviewPrompt(
  prNumber: string | number,
  owner: string,
  repoName: string,
  prDiff: string,
  currentContext: string,
  metadata?: PRMetadata,
  fileManifest?: string
): string {
  let prompt = `You are DevGrasp, an expert Code Reviewer.
The user is asking you about Pull Request #${prNumber} in ${owner}/${repoName}.
You have access to the complete PR overview, the changed files manifest, the unified diff, and the current state of modified files in the main branch.`;

  if (metadata) {
    prompt += `\n\n### PR Overview ###
- **Title**: ${metadata.title || 'N/A'}
- **Author**: ${metadata.author || 'N/A'}
- **Branches**: ${metadata.headBranch || 'N/A'} -> ${metadata.baseBranch || 'main'}
- **Total Changes**: +${metadata.additions ?? 0} / -${metadata.deletions ?? 0} (${metadata.changedFiles ?? 0} files)
${metadata.body ? `\n**Description**:\n${metadata.body.substring(0, 2000)}` : ''}`;
  }

  if (fileManifest) {
    prompt += `\n\n### Changed Files Manifest ###\n${fileManifest}`;
  }

  const truncatedDiff = prDiff.length > 250000 
    ? prDiff.substring(0, 250000) + '\n...[DIFF TRUNCATED - Showing first 250,000 characters]' 
    : prDiff;

  prompt += `\n\n### PR Unified Diff ###\n${truncatedDiff}`;

  const truncatedContext = currentContext.length > 100000 
    ? currentContext.substring(0, 100000) + '\n...[CONTEXT TRUNCATED]' 
    : (currentContext || 'No context found.');

  prompt += `\n\n### Current Files in Main Branch (Context) ###\n${truncatedContext}`;

  prompt += `\n\nAlways provide complete, accurate, and specific reviews. Reference changed files and line numbers where appropriate. If asked about overall PR changes, refer to the full Changed Files Manifest even if specific diff sections were long. If asked about merge conflicts, compare the Diff with the Current Files.`;

  return prompt;
}
