# Staatslogica AI Article Generator

This is a Next.js application designed to generate critical analyses of news articles from a libertarian perspective, inspired by selected thinkers.

## Overview

The application provides a simple interface where users can:
1.  Input the URL of a news article (intended for NOS articles).
2.  Select a libertarian thinker (e.g., Ayn Rand, Ludwig von Mises) to frame the analysis.
3.  Optionally provide extra instructions for the AI.

Upon submission, the application constructs a detailed prompt and sends it to a backend API (`/api/generate`). This API (presumably interacting with an AI model like GPT) generates an analysis structured in a specific JSON format.
The resulting JSON data is then passed to a preview page for review.

## Features

*   **Article Input:** Accepts URL input for news articles.
*   **Thinker Selection:** Dropdown to choose an inspirational thinker.
*   **Custom Instructions:** Optional field for guiding the AI generation.
*   **AI-Powered Analysis:** Generates content including:
    *   A catchy title and slug.
    *   Date and relevant tags.
    *   Details about the chosen thinker.
    *   Identification of the article's "spin".
    *   Libertarian and Anarchist analyses.
    *   A relevant quote from the thinker.
*   **Structured Output:** Delivers the analysis in a predictable JSON format.
*   **Preview:** Displays the generated article data before further use.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI:** React
*   **Styling:** Tailwind CSS (based on class names used)
*   **AI Backend:** (Presumed) Interaction with an AI service via the `/api/generate` route.

## Project Structure

*   `app/generate/page.tsx`: The main page with the input form.
*   `app/generate/preview/page.tsx`: (Presumed) The page to display the generated preview.
*   `lib/prompts.ts`: Contains helper functions for building AI prompts (`buildArticlePrompt`).
*   `pages/api/generate.ts`: (Presumed) The API route that handles communication with the AI model.

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
3.  **Environment Variables:** Create a `.env.local` file in the root directory. If the API route requires authentication (e.g., an OpenAI API key), add it here:
    ```env
    # Example: If using OpenAI
    OPENAI_API_KEY=your_api_key_here 
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
5.  Open [http://localhost:3000/generate](http://localhost:3000/generate) in your browser.

## How it Works

1.  The user fills out the form on `/generate`.
2.  On submit, `app/generate/page.tsx` calls the `buildArticlePrompt` function from `lib/prompts.ts` to create the prompt string.
3.  A POST request is made to `/api/generate` with the prompt.
4.  The API route `/api/generate` processes the prompt (likely sending it to an external AI service).
5.  The API route returns the AI-generated JSON string.
6.  The frontend parses the JSON string.
7.  The user is redirected to `/generate/preview` with the parsed article data passed as a query parameter.

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
*   **Publish API (`app/api/publish/route.ts`):**
    *   A Next.js API Route Handler (App Router).
    *   Accepts a `POST` request with the article data (JSON body).
    *   Validates the incoming data.
    *   Formats the data into an MDX string with YAML frontmatter and content sections.
    *   Uses Node.js `fs` and `path` modules to write the MDX content to a file named `{slug}.mdx` within the `content/articles/` directory.
    *   Creates the `content/articles/` directory if it doesn't exist.
    *   Returns a JSON response indicating success or failure.
    *   *Note:* The `fs.writeFileSync` will only work in environments with filesystem write access (like local development). For serverless deployments (Vercel, Netlify), a different strategy (e.g., GitHub API) is required.
