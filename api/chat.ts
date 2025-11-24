import Anthropic from '@anthropic-ai/sdk';

// Vercel serverless function
export const config = {
  runtime: 'edge',
};

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt: string;
}

// Simple in-memory rate limiting (resets on deploy/restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number; dailyCount: number; dailyResetTime: number }>();

function getRateLimitKey(req: Request): string {
  // Use IP address or fallback to a header
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function checkRateLimit(key: string, maxRequests = 5, windowMs = 60000, maxDailyRequests = 20): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  // Initialize or reset counters
  if (!record) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
      dailyCount: 1,
      dailyResetTime: now + 86400000 // 24 hours
    });
    return true;
  }

  // Check daily limit
  if (now > record.dailyResetTime) {
    record.dailyCount = 1;
    record.dailyResetTime = now + 86400000;
  } else if (record.dailyCount >= maxDailyRequests) {
    return false; // Daily limit exceeded
  }

  // Check per-minute limit
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    record.dailyCount++;
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Per-minute limit exceeded
  }

  record.count++;
  record.dailyCount++;
  return true;
}

export default async function handler(req: Request) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Rate limiting
  const rateLimitKey = getRateLimitKey(req);
  if (!checkRateLimit(rateLimitKey)) {
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'You\'ve reached your chat limit. Please try again later. (Limit: 5 per minute, 20 per day)'
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body: ChatRequest = await req.json();
    const { messages, systemPrompt } = body;

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Limit conversation length (20 messages = ~10 back-and-forth exchanges)
    if (messages.length > 20) {
      return new Response(JSON.stringify({
        error: 'Conversation too long',
        message: 'Please start a new conversation. (Max 10 exchanges)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate message content length
    for (const msg of messages) {
      if (msg.content.length > 500) {
        return new Response(JSON.stringify({
          error: 'Message too long',
          message: 'Please keep messages under 500 characters.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize Anthropic client
    const client = new Anthropic({
      apiKey: apiKey,
    });

    // Call Claude API with cost-conscious settings
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 400, // Shorter responses = lower cost
      system: systemPrompt,
      messages: messages,
    });

    // Extract text content
    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Sorry, I had trouble understanding that.';

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific Anthropic errors
    if (error instanceof Anthropic.APIError) {
      return new Response(JSON.stringify({
        error: 'AI service error',
        details: error.message
      }), {
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
