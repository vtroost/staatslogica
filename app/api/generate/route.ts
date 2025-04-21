import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

// Zorg ervoor dat de server weet dat dit een edge runtime is (optioneel, maar kan helpen met cold starts)
// export const runtime = 'edge';

export async function POST(request: Request) {
  // Add runtime logging for the API key
  console.log('API key loaded?', !!process.env.OPENAI_API_KEY);

  try {
    // Haal de prompt uit de request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      console.error('Prompt missing from request body');
      return NextResponse.json({ error: 'Prompt is missing in request body' }, { status: 400 });
    }

    // Log prompt length
    console.log('Received prompt length:', prompt.length);

    // Construct the messages payload
    const messages = [
        {
          role: 'system' as const, // Use 'as const' for stricter typing
          content: 'You are a libertarian analyst. Always respond in valid JSON only based on the user request. Do not add any introductory text or explanations outside the JSON structure.'
        },
        {
          role: 'user' as const,
          content: prompt
        }
      ];
    
    // Log the payload being sent
    console.log('Sending messages to OpenAI:', JSON.stringify(messages, null, 2));

    const completionPayload = {
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
    };

    // Log the full payload object
    console.log('Full OpenAI request payload:', JSON.stringify(completionPayload, null, 2));

    const completion = await openai.chat.completions.create(completionPayload);

    // Log the *entire* raw response from OpenAI
    console.log('Raw OpenAI completion response:', JSON.stringify(completion, null, 2));

    const responseContent = completion.choices?.[0]?.message?.content;

    if (!responseContent) {
      console.error('No content found in OpenAI response choice.');
      return NextResponse.json({ error: 'No content received from OpenAI' }, { status: 500 });
    }

    console.log('Successfully extracted response content.');
    return NextResponse.json({ response: responseContent });

  } catch (error) {
    console.error("!!! Critical Error in API route calling OpenAI API !!!");
    console.error("Error object:", error);

    // Check for specific API error structure if available
    if (error && typeof error === 'object') {
      if ('status' in error) {
        console.error("API Error Status:", error.status);
      }
      if ('headers' in error && error.headers) { // Check for existence before logging
        console.error("API Error Response Headers:", error.headers);
      }
      // Attempt to log error data if present (structure varies)
      // Use type assertion carefully or check for response property
      const errorResponse = (error as any).response;
      if (errorResponse && typeof errorResponse.json === 'function') {
        try {
          const errorData = await errorResponse.json();
          console.error("API Error Data:", errorData);
        } catch (parseError) {
            console.error("Could not parse API error response body.");
        }
      }
    } 
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error, check function logs.';
    return NextResponse.json({ error: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
} 