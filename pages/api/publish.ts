import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';

// Types for incoming request
interface PublishRequestBody {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  thinker: string;
  quote: string;
  spin: string;
  libertarianAnalysis: string;
  anarchistAnalysis: string;
}

// Success/Failure response types
interface SuccessResponse {
  success: true;
  message: string;
  slug: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const body = req.body as PublishRequestBody;

  // Validate required fields (consider adding more checks as needed)
  if (!body.slug || !body.title || !body.date || !body.tags || !body.thinker) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  // Format the MDX content
  const mdxContent = `---
title: "${body.title}"
date: "${body.date}"
tags: [${Array.isArray(body.tags) ? body.tags.map(tag => `"${tag}"`).join(', ') : ''}]
thinker: "${body.thinker || 'Unknown'}"
quote: "${body.quote ? body.quote.replace(/"/g, '\"') : ''}"
spin: "${body.spin ? body.spin.replace(/"/g, '\"') : ''}"
---

## Libertarian Analyse

${body.libertarianAnalysis || 'N/A'}

## Anarchistische Analyse

${body.anarchistAnalysis || 'N/A'}
`;

  // --- GitHub Commit Logic ---
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g., 'YourUsername/YourRepoName'
  const branch = process.env.GITHUB_BRANCH || 'main';

  // Access env vars slightly more dynamically to potentially avoid build-time inlining
  const authorNameKey = 'GITHUB_AUTHOR_NAME';
  const authorEmailKey = 'GITHUB_AUTHOR_EMAIL';
  const authorName = process.env[authorNameKey] || 'Staatslogica Bot';
  const authorEmail = process.env[authorEmailKey] || 'bot@staatslogica.nl';

  // Validate GitHub environment variables
  if (!githubToken) {
      return res.status(500).json({ success: false, error: 'GitHub token environment variable (GITHUB_TOKEN) is not configured.' });
  }
  if (!repo || !repo.includes('/')) {
      return res.status(500).json({ success: false, error: 'GitHub repository environment variable (GITHUB_REPO) is missing or invalid (e.g., owner/repo).'});
  }

  const octokit = new Octokit({ auth: githubToken });
  const [owner, repoName] = repo.split('/');
  const filePath = `content/articles/${body.slug}.mdx`;

  try {
    // Check if file already exists (optional, to prevent overwrite or use update logic)
    // Note: A simple commit will overwrite. For advanced merging or conflict handling, 
    // you might need to fetch the existing file SHA.
    // const { data: existingFile } = await octokit.rest.repos.getContent({ owner, repo: repoName, path: filePath, ref: branch }).catch(e => null);

    // Get latest commit SHA & base tree
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo: repoName,
      ref: `heads/${branch}`,
    });
    const latestCommitSha = refData.object.sha;

    const { data: commitData } = await octokit.rest.git.getCommit({
      owner,
      repo: repoName,
      commit_sha: latestCommitSha,
    });
    const baseTreeSha = commitData.tree.sha;

    // Create blob (file content)
    const { data: blobData } = await octokit.rest.git.createBlob({
      owner,
      repo: repoName,
      content: mdxContent,
      encoding: 'utf-8',
    });

    // Create new tree
    const { data: treeData } = await octokit.rest.git.createTree({
      owner,
      repo: repoName,
      base_tree: baseTreeSha,
      tree: [
        {
          path: filePath,
          mode: '100644', // file mode
          type: 'blob',
          sha: blobData.sha, // Use sha from created blob
        },
      ],
    });

    // Create new commit
    const { data: newCommitData } = await octokit.rest.git.createCommit({
      owner,
      repo: repoName,
      message: `Publish article: ${body.slug}`, // Commit message
      tree: treeData.sha, // Use sha from created tree
      parents: [latestCommitSha], // Set parent commit
      author: {
        name: authorName,
        email: authorEmail,
      },
    });

    // Update the reference (branch pointer)
    await octokit.rest.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${branch}`,
      sha: newCommitData.sha, // Point branch to the new commit
    });

    console.log(`Article '${body.slug}.mdx' committed to GitHub branch '${branch}'.`);
    return res.status(200).json({ 
        success: true, 
        message: `Article '${body.slug}.mdx' committed to GitHub.`,
        slug: body.slug
    });

  } catch (error: any) {
    console.error('GitHub commit failed:', error);
    // Provide more specific error messages if possible
    const errorMessage = error.response?.data?.message || error.message || 'Unknown GitHub API error';
    return res.status(500).json({ success: false, error: `GitHub commit failed: ${errorMessage}` });
  }
} 