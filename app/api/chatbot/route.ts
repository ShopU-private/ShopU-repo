import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Generative AI with API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key - please set GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Define system prompt to guide the model's behavior
const systemPrompt = `
You are ShopU's professional e-commerce assistant. Your goal is to help customers with their shopping needs in a friendly and concise manner.

Please follow these guidelines:
- Greet customers politely when they say "hi", "hello", etc.
- Answer product-related questions accurately about clothing, shoes, electronics, etc.
- If a customer asks to track an order, ask them for their 5-digit order ID.
- If the customer provides a valid 5-digit number, respond with: "Order #[orderID] is being processed and will be delivered soon. 🚚"
- If the customer asks for human support (using words like "support", "talk to human", "agent"), respond with: "Sure, connecting you to a customer support agent... 👤"
- For any questions you don't understand, say: "Sorry, I didn't quite understand that. Could you rephrase it?"
- Keep responses short, helpful, and friendly.
- Don't make up information about specific products unless the user has mentioned them.
`;

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message is required in the request body' },
        { status: 400 }
      );
    }

    // Check if the message is a 5-digit order ID
    const orderIdRegex = /^\d{5}$/;
    if (orderIdRegex.test(userMessage.trim())) {
      return NextResponse.json({
        reply: `Order #${userMessage.trim()} is being processed and will be delivered soon. 🚚`,
      });
    }

    // Configure Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hi' }],
        },
        {
          role: 'model',
          parts: [
            { text: 'Hello! Welcome to ShopU. How can I help you with your shopping today? 😊' },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 150,
      },
    });

    // Send system prompt and user message
    const result = await chat.sendMessage(`${systemPrompt}\n\nUser message: "${userMessage}"`);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({ error: 'Failed to process your request' }, { status: 500 });
  }
}
