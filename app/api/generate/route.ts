import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

// Zorg ervoor dat de server weet dat dit een edge runtime is (optioneel, maar kan helpen met cold starts)
// export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    // Haal de prompt uit de request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is missing in request body' }, { status: 400 });
    }

    // Maak de API call naar OpenAI (deze code draait veilig server-side)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Of je voorkeursmodel
      messages: [
        {
          role: 'system',
          content: 'You are a libertarian analyst. Always respond in valid JSON only based on the user request. Do not add any introductory text or explanations outside the JSON structure.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      // response_format: { type: "json_object" }, // Uncomment als je GPT-4 Turbo of later gebruikt en JSON mode wilt forceren
    });

    const responseContent = completion.choices[0].message?.content;

    if (!responseContent) {
      return NextResponse.json({ error: 'No content received from OpenAI' }, { status: 500 });
    }

    // Stuur het resultaat terug naar de client
    return NextResponse.json({ response: responseContent });

  } catch (error) {
    console.error("Error in API route calling OpenAI API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Stuur een generieke foutmelding terug om interne details te verbergen
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
} 