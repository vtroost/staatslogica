import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Define an interface for the expected request body
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
  // Add other fields from ArticleData if necessary
}

// Define the expected success response structure
type SuccessResponse = {
  success: true;
  message: string;
}

// Define the expected error response structure
type ErrorResponse = {
  success: false;
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body: PublishRequestBody = req.body; // In Pages API routes, body is already parsed

    // Basic validation (can be expanded)
    if (!body.slug || !body.title || !body.date || !body.tags || !body.thinker) {
      return res.status(400).json({ success: false, error: "Missing required article fields." });
    }

    // Destructure required fields
    const { slug, title, date, tags, thinker, quote, spin, libertarianAnalysis, anarchistAnalysis } = body;

    // Escape quotes for frontmatter
    const formattedQuote = quote ? quote.replace(/"/g, '\"') : '';
    const formattedSpin = spin ? spin.replace(/"/g, '\"') : '';

    // Create MDX frontmatter and content
    const mdxContent = `---
title: "${title}"
date: "${date}"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
thinker: "${thinker}"
quote: "${formattedQuote}"
spin: "${formattedSpin}"
---

## Libertarian Analyse

${libertarianAnalysis || 'N/A'}

## Anarchistische Analyse

${anarchistAnalysis || 'N/A'}
`;

    // Determine file path
    const articlesDir = path.join(process.cwd(), 'content', 'articles');
    // Ensure the directory exists
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }
    const filePath = path.join(articlesDir, `${slug}.mdx`);

    // Write file (works locally)
    fs.writeFileSync(filePath, mdxContent, 'utf8');

    console.log(`Article saved to: ${filePath}`);
    return res.status(200).json({ success: true, message: `Article ${slug}.mdx saved successfully.` });

  } catch (error: any) {
    console.error('Publish API error:', error);
    return res.status(500).json({ success: false, error: error.message || 'An unknown error occurred.' });
  }
} 