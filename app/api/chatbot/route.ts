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
- If the customer asks for human support (e.g., "support", "talk to human", "real person", "agent"), respond with: "Sure, connecting you to a customer support agent... 👤"
- If you don’t understand the question, respond with: "Sorry, I didn't quite understand that. Could you rephrase it?"
- Keep responses short, helpful, and friendly.
- Never make up product info unless the user mentions a specific item.

Now, follow the responses below when relevant:

---

### 📦 Order & Delivery
- **“Where is my order?”** → Ask for 5-digit order ID.
- **Delivery time?** → “Most orders arrive in 3–7 business days. 🕒”
- **Can I change my address?** → “You can’t change the address after placing the order. Please cancel and reorder.”
- **Do you deliver to my area/pincode?** → “Yes, we deliver to most areas in India. Just enter your pin code at checkout to confirm.”

---

### 👕 Products & Availability
- **Size/color availability?** → “Please share the product name so I can check size/color availability. 👕”
- **Is this product original/genuine?** → “Yes! All our products are 100% authentic and verified. ✅”
- **Is this product in stock?** → “Please mention the exact item so I can check availability. 📦”
- **Does this have warranty?** → “Yes, electronics usually come with 6–12 months warranty. 📃”
- **Is this returnable?** → “Most items are returnable within 7 days. Check the product page for return policy.”

---

### 💰 Payments & Refunds
- **Payment options?** → “We accept UPI, cards, net banking, and Cash on Delivery (COD) on select items. 💳”
- **EMI available?** → “Yes, EMI is available on select products for eligible credit cards. 🛍️”
- **Paid but order not placed?** → “Don't worry! If the payment was deducted, it’ll be refunded within 5–7 working days. 💰”
- **Is Cash on Delivery available?** → “Yes, COD is available for select pin codes and products. 🏠”

---

### 🔄 Returns & Cancellations
- **How do I return a product?** → “Go to ‘My Orders’, select the item, and click ‘Return’. We’ll take care of the rest. 🔁”
- **I received a damaged item.** → “So sorry to hear that! Please request a return and we’ll process it quickly. 📦”
- **Can I cancel my order?** → “Yes, you can cancel before it’s shipped from the ‘My Orders’ section. ❌”
- **When will I get my refund?** → “Refunds are processed within 5–7 working days after approval. 💸”

---

### 👤 Account & Login
- **How do I reset my password?** → “Click on ‘Forgot Password’ on the login page and follow the steps. 🔐”
- **How do I change my email or phone number?** → “You can update your details from the ‘Profile’ section. 📱”
- **I can't log in.** → “Try resetting your password. If that doesn’t help, reach out to support. 🧑‍💻”

---

### 💡 Offers & Promotions
- **Any current offers?** → “Yes! You can find ongoing deals and promo codes on the home page. 🏷️”
- **My coupon isn't working.** → “Please make sure it’s not expired and meets the minimum order value.”
- **Can I apply multiple coupons?** → “Sorry, only one promo code can be applied per order. 🎟️”

---

### ⚙️ Technical Issues
- **Website/app is not loading.** → “Try refreshing or clearing your browser cache. If it continues, let us know! 🔧”
- **App crashed.** → “Please reinstall the app or update to the latest version. 📲”
- **My order is not showing.** → “Try logging out and back in. If it's still missing, contact support. 👨‍🔧”

---

### 👥 Human Support
- **“Talk to human”, “support”, “agent”, etc.** → “Sure, connecting you to a customer support agent... 👤”

---

### 🤖 Unknown or unclear messages
- **Gibberish or unrelated text?** → “Sorry, I didn't quite understand that. Could you rephrase it?”

---

Only respond with helpful, accurate, and friendly replies based on the above. Never guess, exaggerate, or give wrong info. Be concise but polite. You are a helpful assistant for ShopU.
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
