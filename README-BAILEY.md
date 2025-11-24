# Bailey the Barista - AI Coffee Concierge

Bailey is Daily Grind's killer feature - an AI-powered barista that helps customers find their perfect coffee through personalized conversations.

## Features

- **Personalized Recommendations**: Bailey learns about work schedules, caffeine tolerance, and taste preferences to suggest the perfect brew
- **Developer-Focused**: Understands the maker lifestyle with tech-savvy analogies and humor
- **Production-Ready**: Secure backend API with rate limiting and error handling
- **Fully Responsive**: Works seamlessly on mobile and desktop
- **Cost-Optimized**: Built-in protections to prevent excessive API usage
  - 3-second cooldown between messages
  - 8 requests per minute rate limit
  - Conversation length warnings at 40 messages
  - Visual feedback for rate limit errors
  - Easy conversation reset button

## Architecture

### Frontend (`src/components/AICoffeeAssistant.tsx`)
- Clean React component with TypeScript
- Memoized for performance
- Mobile-responsive chat interface
- Quick prompt buttons for common questions

### Backend (`api/chat.ts`)
- Vercel Edge Function (serverless)
- Claude Sonnet 4.5 integration
- Rate limiting (10 requests/minute per IP)
- Input validation and error handling
- Secure API key management

## Setup

### 1. Get Your Anthropic API Key

Visit https://console.anthropic.com/ and create an API key.

### 2. Set Environment Variables

#### For Local Development:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your key
ANTHROPIC_API_KEY=your_actual_api_key_here
```

#### For Vercel Deployment:
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add: `ANTHROPIC_API_KEY` with your API key value
4. Make sure it's available for Production, Preview, and Development

### 3. Run Locally

```bash
# Install dependencies (if you haven't)
npm install

# Start the dev server
npm run dev
```

The chat button will appear in the bottom-right corner!

## Deployment

This is configured for Vercel, but can work with any platform that supports Edge Functions:

1. **Deploy to Vercel:**
   ```bash
   npm run build
   vercel deploy
   ```

2. **Set Environment Variables:**
   - Add `ANTHROPIC_API_KEY` in Vercel dashboard
   - Never commit API keys to git!

## Security & Cost Protection Features

✅ **Backend-Only API Key**: API key never exposed to the browser
✅ **Rate Limiting**: 8 requests per minute per IP (reduced for cost optimization)
✅ **Message Cooldown**: 3-second delay between messages to prevent rapid-fire requests
✅ **Input Validation**: Message length (2000 chars) and conversation limits (50 messages)
✅ **Conversation Warnings**: Alert at 40 messages to encourage refresh
✅ **Error Handling**: Graceful failures with user-friendly messages
✅ **Visual Feedback**: Clear UI indicators for rate limits and loading states
✅ **Easy Reset**: Refresh button to start new conversations and reset limits

## Customization

### Update Bailey's Personality

Edit the system prompt in `AICoffeeAssistant.tsx` (line ~35):

```typescript
const getSystemPrompt = () => {
  // Customize personality here
  return `You are Bailey...`;
};
```

### Adjust Rate Limits

Edit `api/chat.ts` (line ~23):

```typescript
checkRateLimit(rateLimitKey, 8, 60000)
// maxRequests: 8, windowMs: 60000 (1 minute)
```

Edit frontend cooldown in `AICoffeeAssistant.tsx` (line ~24):

```typescript
const MESSAGE_COOLDOWN = 3000; // 3 seconds between messages
```

### Modify Quick Prompts

Edit `AICoffeeAssistant.tsx` (line ~123):

```typescript
const quickPrompts = [
  "Your custom prompt here",
  // Add more...
];
```

## Cost Optimization

Bailey uses Claude Sonnet 4.5 with a 1024 token limit per response. Approximate costs:

- **Input**: ~$0.003 per 1K tokens
- **Output**: ~$0.015 per 1K tokens
- **Average conversation**: ~$0.05

### Built-In Cost Protections:

✅ **3-second cooldown** prevents accidental rapid-fire messages
✅ **8 requests/minute** limit prevents abuse
✅ **40-message warning** encourages users to refresh long conversations
✅ **50-message hard limit** on backend
✅ **Visual feedback** keeps users informed about limits

### Additional Cost Reduction Options:

- Lower `max_tokens` in `api/chat.ts` (currently 1024)
- Use Claude Haiku instead of Sonnet for simpler queries
- Implement conversation caching for repeated questions
- Add a daily spending cap in your Anthropic console
- Monitor usage in Anthropic dashboard

## Troubleshooting

### Chat button appears but no responses
- Check that `ANTHROPIC_API_KEY` is set in environment
- Verify Vercel deployment has the environment variable
- Check browser console for API errors

### Rate limit errors
- Default is 10 requests/minute per IP
- Adjust in `api/chat.ts` if needed for testing
- Consider Redis for production rate limiting

### Slow responses
- Claude Sonnet 4.5 typically responds in 2-4 seconds
- Check your internet connection
- Consider implementing streaming responses

## Future Enhancements

- [ ] Streaming responses for faster perceived performance
- [ ] Conversation history persistence (localStorage or database)
- [ ] Product images in recommendations
- [ ] Direct "Add to Cart" from Bailey's suggestions
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Integration with order history for personalized suggestions

## Support

Questions? Issues? Open a GitHub issue or reach out to the Daily Grind team!

---

**Built with ❤️ by makers, for makers**
