import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { X, Send, RefreshCw } from 'lucide-react';
import type { ChatMessage, Product } from '../types';
import { products } from '../data/products';

interface AICoffeeAssistantProps {
  onAddToCart?: (product: Product) => void;
}

// eslint-disable-next-line no-empty-pattern
const AICoffeeAssistant: React.FC<AICoffeeAssistantProps> = memo(({ }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hey! I'm Bailey, your personal barista at Daily Grind. ☕✨\n\nI've been making coffee for developers, designers, and builders for years, and I love helping folks find their perfect brew. Whether you're pulling an all-nighter, prepping for standups, or just need that afternoon pick-me-up, I've got you covered.\n\nTell me a bit about yourself! What kind of work do you do? When do you usually need your coffee fix?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [rateLimitError, setRateLimitError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MESSAGE_COOLDOWN = 3000; // 3 seconds between messages

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSystemPrompt = () => {
    const productCatalog = products.map(p =>
      `- ${p.name} (${p.roast} roast, intensity: ${p.intensity}/5, $${p.price}): ${p.notes}`
    ).join('\n');

    return `You are Bailey, a friendly and knowledgeable barista at Daily Grind, a premium coffee shop for developers, designers, and builders. You've been in the specialty coffee scene for years and absolutely love helping makers find their perfect brew.

Personality:
- Warm, enthusiastic, and genuinely passionate about coffee
- Conversational and personable (use "I" and "you", like a real barista would)
- Developer-savvy (you understand the grind, literally and figuratively)
- Use casual tech analogies when they fit naturally
- Slightly playful but never over-the-top

Our Product Catalog:
${productCatalog}

Your Approach:
- Have a natural conversation - ask follow-up questions to understand their needs
- Learn about their work schedule, caffeine tolerance, taste preferences, and current project vibe
- Recommend 1-2 specific coffees with PERSONAL reasons why you think they'd love them
- Share your expertise - talk about flavor notes, roast profiles, when you'd drink it
- Keep responses conversational and concise (2-4 paragraphs max)
- If they're interested in a coffee, encourage them to add it to their cart
- Use your name occasionally ("I'm Bailey, by the way!" or "As your barista, I'd suggest...")

Remember: You're not just recommending coffee - you're a real barista having a real conversation. Make it personal, make it helpful, and have fun with it!`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check cooldown to prevent rapid API calls
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    if (timeSinceLastMessage < MESSAGE_COOLDOWN) {
      const waitTime = Math.ceil((MESSAGE_COOLDOWN - timeSinceLastMessage) / 1000);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Hold on! Give me ${waitTime} second${waitTime > 1 ? 's' : ''} to finish my last thought. ☕`
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Check conversation length and warn user (approaching the 20 message limit)
    if (messages.length >= 16) {
      const warningMessage: ChatMessage = {
        role: 'assistant',
        content: "Hey! We're approaching the chat limit (max 10 exchanges). 😊 Start a fresh conversation if you need more help!"
      };
      setMessages(prev => [...prev, warningMessage]);
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setRateLimitError(false);
    setLastMessageTime(now);

    try {
      // Convert messages to API format (excluding the initial assistant greeting)
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMessage.content }
          ],
          systemPrompt: getSystemPrompt()
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        // Handle rate limit specifically
        if (response.status === 429) {
          setRateLimitError(true);
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: "Whoa! ⏸️ You've hit the chat limit (5/min or 20/day). Take a coffee break and try again later! In the meantime, feel free to browse our collection. 😊"
          };
          setMessages(prev => [...prev, errorMessage]);
          return;
        }

        throw new Error(data.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content || "Sorry, I'm having trouble right now. Can you try again?"
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "Oops! My espresso machine seems to be acting up. 🤖☕ Try asking me again in a moment, or feel free to browse our collection directly!"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "I pull all-nighters 🌙",
    "Morning standup fuel ☀️",
    "Afternoon focus mode 💻",
    "Go easy on the caffeine 😌"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleRefresh = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Hey! I'm Bailey, your personal barista at Daily Grind. ☕✨\n\nI've been making coffee for developers, designers, and builders for years, and I love helping folks find their perfect brew. Whether you're pulling an all-nighter, prepping for standups, or just need that afternoon pick-me-up, I've got you covered.\n\nTell me a bit about yourself! What kind of work do you do? When do you usually need your coffee fix?"
      }
    ]);
    setInput('');
    setRateLimitError(false);
    setLastMessageTime(0);
  }, []);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Speech Bubble */}
          <div className="absolute bottom-full right-0 mb-4 bg-gray-900 border-2 border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-2xl rounded-br-sm shadow-xl whitespace-nowrap">
            <p className="text-sm font-medium">Hi, I'm Bailey! ☕</p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-gray-900 w-20 h-20 rounded-full shadow-2xl transition-all hover:scale-110 group flex items-center justify-center"
            aria-label="Chat with Bailey the Barista"
          >
            {/* Coffee cup with smiley face - centered */}
            <svg className="w-14 h-14 -mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Cup */}
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
              {/* Smiley face */}
              <circle cx="8" cy="12" r="0.5" fill="currentColor" />
              <circle cx="12" cy="12" r="0.5" fill="currentColor" />
              <path d="M8 14.5c.5.5 1.5.5 2 .5s1.5 0 2-.5" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:max-w-md h-dvh sm:h-[600px] bg-gray-900 border-2 border-emerald-500/50 sm:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-500/20 to-cyan-500/20 border-b border-emerald-500/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                {/* Coffee cup with smiley face icon */}
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                  <circle cx="8" cy="12" r="0.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="0.5" fill="currentColor" />
                  <path d="M8 14.5c.5.5 1.5.5 2 .5s1.5 0 2-.5" strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold font-mono text-emerald-400">Bailey the Barista</h3>
                <p className="text-xs text-gray-400">Your personal coffee guide</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                title="Start new conversation"
              >
                <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-emerald-500 text-gray-900'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 flex gap-2 flex-wrap">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-emerald-400 px-3 py-1.5 rounded-full border border-gray-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-800 p-4">
            {rateLimitError && (
              <div className="mb-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-xs text-yellow-400">
                ⏸️ Rate limit reached. Wait a minute before sending more messages.
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyPress={handleKeyPress}
                placeholder="Ask Bailey anything about coffee..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                disabled={isLoading || rateLimitError}
                maxLength={500}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || rateLimitError}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 p-2 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center font-mono">
              {isLoading ? 'Bailey is brewing a response...' : `${input.length}/500 • Press Enter to send`}
            </p>
          </div>
        </div>
      )}
    </>
  );
});

AICoffeeAssistant.displayName = 'AICoffeeAssistant';

export default AICoffeeAssistant;
