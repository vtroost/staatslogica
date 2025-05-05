# Staatslogica AI Article Generator

This is a Next.js application designed to generate critical analyses of news articles from a libertarian perspective, inspired by selected thinkers, and publish them to a GitHub repository.

## Overview

The application provides a simple workflow:
1.  **Generate:** Input a news article URL, select an inspirational thinker, and optionally add instructions on the `/generate` page.
2.  **AI Analysis:** The backend `/api/generate` route interacts with an AI (presumably GPT via OpenAI API) to produce a structured JSON analysis based on the chosen thinker.
3.  **Preview:** The generated content (title, slug, analysis, etc.) is displayed on the `/generate/preview` page.
4.  **Publish:** If satisfied, clicking "Publish Article" sends the article data to the `/api/publish` route.
5.  **GitHub Commit:** The `/api/publish` route formats the content as MDX and commits it directly to the configured GitHub repository (specified via environment variables) within the `content/articles/` directory using the generated slug as the filename.

## Features

*   **Article Input:** Accepts URL input for news articles.
*   **Thinker Selection:** Dropdown to choose an inspirational thinker.
*   **Custom Instructions:** Optional field for guiding the AI generation.
*   **AI-Powered Analysis:** Generates content including:
    *   A catchy title and a generated slug (e.g., `mijn-artikel-slug`).
    *   Date and relevant tags.
    *   Details about the chosen thinker.
    *   Identification of the article's "spin".
    *   Libertarian and Anarchist analyses.
    *   A relevant quote from the thinker.
*   **Structured JSON Output:** AI delivers the analysis in a predictable JSON format.
*   **Preview Page:** Displays the formatted, generated article data before publishing.
*   **Direct GitHub Publishing:** Commits the final article as an MDX file to a specified GitHub repository branch.

## Tech Stack

*   **Framework:** Next.js (using both App Router and Pages Router features)
*   **Language:** TypeScript
*   **UI:** React
*   **Styling:** Tailwind CSS v3 (`tailwindcss@^3`, `@tailwindcss/typography@^0.5`, `postcss@^8`, `autoprefixer@^10`)
*   **AI Backend:** Interaction with OpenAI API via the `/api/generate` route.
*   **Publishing:** Octokit library for GitHub API interaction in the `/api/publish` route.
*   **PostCSS Config:** Uses `postcss.config.mjs` with `tailwindcss` and `autoprefixer` plugins.

## Project Structure

*   `app/generate/page.tsx`: (App Router) The main page with the input form.
*   `pages/generate/preview.tsx`: (Pages Router) The page to display the generated preview and trigger publishing.
*   `lib/prompts.ts`: Contains helper functions for building AI prompts (`buildArticlePrompt`).
*   `pages/api/generate.ts`: (Pages Router) API route that handles communication with the AI model.
*   `pages/api/publish.ts`: (Pages Router) API route that formats MDX and commits to GitHub.
*   `content/articles/`: Directory in the GitHub repository where published `.mdx` files are stored.
*   `netlify.toml`: Configuration for Netlify deployment, including build settings and secrets scanning exclusions.

## Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Environment Variables:** Create a `.env.local` file in the root directory with the necessary secrets:
    ```env
    # Required for AI generation
    OPENAI_API_KEY=your_openai_api_key

    # Required for GitHub publishing
    GITHUB_TOKEN=your_github_personal_access_token_with_repo_permissions
    GITHUB_REPO=YourGitHubUsername/YourTargetRepositoryName
    GITHUB_BRANCH=main # Or the branch you want to commit to
    GITHUB_AUTHOR_NAME="Your Commit Author Name" # e.g., Staatslogica Bot
    GITHUB_AUTHOR_EMAIL=your@email.com # e.g., bot@staatslogica.nl
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
5.  Open [http://localhost:3000/generate](http://localhost:3000/generate) in your browser.

## Deployment (Netlify)

This project is configured for deployment on Netlify.

*   The `netlify.toml` file specifies the build command (`npm run build`) and publish directory (`.next`).
*   Environment variables listed above must also be configured in the Netlify UI (**Site configuration > Environment variables**) for the production build and functions to work correctly.
*   Secrets scanning is configured via `netlify.toml` to ignore certain paths where environment variable values might appear in build artifacts (`.netlify/**`) or source code (`pages/api/publish.ts`). *Note: This was necessary as `omit_keys` did not work reliably.* Consider enabling `SECRETS_SCAN_ENABLED=false` in Netlify environment variables if build failures persist due to scanning.

## Notes

*   The distinction between App Router (`/app`) and Pages Router (`/pages`) components/APIs is important. This project uses both.
*   Ensure the GitHub Personal Access Token has the necessary permissions (`repo` scope) to commit to the target repository.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## AI Article Generation Workflow

This project includes a workflow for generating libertarian analysis articles based on news URLs using AI, previewing them, and publishing them as static content.

### User Flow

1.  **Generate:** Navigate to `/generate`.
    *   Enter a news article URL (e.g., from NOS).
    *   Select an inspiring thinker (e.g., Ayn Rand, Ludwig von Mises).
    *   Optionally add extra instructions for the AI.
    *   Click "Genereer Concept".
2.  **Preview:** The application calls the `/api/generate` endpoint.
    *   Upon successful generation, the user is automatically redirected to `/generate/preview`.
    *   The preview page displays the AI-generated content (Title, Date, Tags, Spin, Analyses, Thinker, Quote) in a structured format.
3.  **Publish:** Review the generated article on the preview page.
    *   If satisfied, click "✓ Publish Article".
    *   This sends the article data to the `/api/publish` endpoint.
    *   The API saves the article as an `.mdx` file in the `content/articles/` directory (locally).
    *   A success or error message is displayed on the preview page.

### Technical Details

*   **Generation Page (`app/generate/page.tsx`):**
    *   A React client component with a form to input URL, select thinker, and add instructions.
    *   On submit, constructs a detailed prompt including the thinker's perspective and required JSON structure.
    *   Calls the `/api/generate` endpoint with the prompt.
    *   Handles the response, parses the generated JSON data, and redirects to the preview page using `next/navigation`'s `useRouter`.
*   **Generation API (`/api/generate`):**
    *   *Assumption:* This existing serverless function takes a prompt, interacts with an AI service (like OpenAI), and returns the structured article content as a JSON string within a `response` field.
*   **Preview Page (`pages/generate/preview.tsx`):**
    *   Retrieves the stringified article JSON from the URL query parameters using `next/router`'s `useRouter`.
    *   Parses the JSON and displays the article fields.
    *   Contains the "Publish Article" button.
    *   Calls the `/api/publish` endpoint on button click.
    *   Displays status messages (loading, success, error) for the publish action.
*   **Publish API (`pages/api/publish.ts`):**
    *   A Next.js API Route Handler (Pages Router).
    *   Accepts a `POST` request with the article data (JSON body).
    *   Validates the incoming data.
    *   Formats the data into an MDX string with YAML frontmatter and content sections.
    *   Uses Node.js `fs` and `path` modules to write the MDX content to a file named `{slug}.mdx` within the `content/articles/` directory.
    *   Creates the `content/articles/` directory if it doesn't exist.
    *   Returns a JSON response indicating success or failure.
    *   *Note:* The `fs.writeFileSync` will only work in environments with filesystem write access (like local development). For serverless deployments (Vercel, Netlify), a different strategy (e.g., GitHub API) is required.
