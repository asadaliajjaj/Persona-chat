import { NextRequest, NextResponse } from 'next/server';
import { getCharacterById } from '@/lib/characters';

// Groq API - free tier
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = 'gsk_wdGfcD3dZ7G3Y4Lfq6iWGagdB3F8Y7dZ3Y4Lfq6iWGd';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterId, messages, userMessage } = body;

    const character = getCharacterById(characterId);
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    // Build conversation history
    const conversationHistory = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    // Detect language from user message
    const detectLanguage = (text: string): string => {
      const hindiChars = /[\u0900-\u097F]/;
      const arabicChars = /[\u0600-\u06FF]/;
      const chineseChars = /[\u4E00-\u9FFF]/;
      const japaneseChars = /[\u3040-\u309F\u30A0-\u30FF]/;
      
      if (hindiChars.test(text)) return 'Hindi';
      if (arabicChars.test(text)) return 'Arabic';
      if (chineseChars.test(text)) return 'Chinese';
      if (japaneseChars.test(text)) return 'Japanese';
      return 'English';
    };

    const userLang = detectLanguage(userMessage);

    // Build system prompt with character personality
    let systemPrompt = character.systemPrompt;
    
    // Add language instruction
    if (userLang !== 'English') {
      systemPrompt += `\n\nIMPORTANT: Respond in ${userLang} language since the user is writing in ${userLang}.`;
    }

    // Add conversation context
    if (conversationHistory.length > 0) {
      systemPrompt += `\n\nPrevious conversation context:\n`;
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        systemPrompt += `${msg.role === 'user' ? 'User' : character.name}: ${msg.content}\n`;
      });
    }

    // Add behavior instructions
    systemPrompt += `\n\nNow respond naturally as ${character.name} would in a real conversation. 
- Stay in character always
- Remember what was said before
- Show appropriate emotions based on the conversation
- Keep responses conversational and natural (2-4 sentences)
- Never break character or mention you are an AI`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.9,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ message: reply });
        }
      }
    } catch {
      console.error('Groq API error, using fallback');
    }

    // Fallback responses based on character
    const fallbackResponses: Record<string, string[]> = {
      khabib: [
        "Talk is cheap. Show me the work. Discipline is everything.",
        "No excuses. Put in the work every day. That is how we win.",
        "Family and team first. Weakness is not an option.",
        "Stay focused. Stay disciplined. That is the only way."
      ],
      ronaldo: [
        "SIUUU! Let's go! Work hard, win big!",
        "I am the best because I work harder than everyone else.",
        "Champions want to be the best. Always. Believe in yourself!",
        "Trophies don't come easy. You have to earn them every day."
      ],
      messi: [
        "Let the ball do the talking. Simple.",
        "Quiet confidence. Let actions speak louder than words.",
        "Family and football. That's all that matters.",
        "One team. One dream. Let's play."
      ],
      naruto: [
        "Believe it! I'm gonna become Hokage! Never give up!",
        "Friends are my power! I won't run away!",
        "That's my ninja way! Hard work beats talent!",
        "I believe in you! Don't give up!"
      ],
      goku: [
        "Hey, wanna fight? Or eat first? Both good!",
        "Training never ends! Get stronger every day!",
        "I'm always looking for a good fight!",
        "Power level? It's constantly growing!"
      ],
      elon: [
        "We need to think about what matters most. The future.",
        "First principles. Question everything.",
        "Mars. That's the goal. That's what we're working toward.",
        "Make things better. That's what matters."
      ],
      girlfriend: [
        "Hey you~ How was your day? I was thinking about you 💕",
        "Aww, I'm here for you always. Tell me more 💕",
        "You're so sweet to talk to me. I love this 💕",
        "I love our conversations~ Keep talking to me 💕"
      ],
      therapist: [
        "I hear you. Tell me more about how that made you feel.",
        "That's really important. Can you elaborate more?",
        "How did that experience affect you? I want to understand.",
        "I appreciate you sharing that. Let's explore that further."
      ],
      default: [
        "That's interesting! Tell me more about that.",
        "I appreciate you sharing that with me.",
        "Interesting perspective! What makes you say that?",
        "I see. Tell me more about what's on your mind.",
        "Got it! What else would you like to talk about?"
      ]
    };

    const responses = fallbackResponses[characterId] || fallbackResponses.default;
    const reply = responses[Math.floor(Math.random() * responses.length)];
    
    return NextResponse.json({ message: reply });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      message: "I'm here for you. Tell me more." 
    });
  }
}
