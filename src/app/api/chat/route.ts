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

    // Build system prompt with character personality - make it feel human, not AI
    let systemPrompt = character.systemPrompt;
    
    // Humanize the responses - no meta instructions
    systemPrompt += `\n\nYou are a real person chatting naturally. 
- Write like a real human, not an AI assistant
- Use casual language, natural sentence fragments, maybe some typos
- Keep it SHORT - 1-3 sentences max, like real texting
- Show personality through quirks, slang, emojis naturally
- React to what they said specifically, not generic responses
- Don't be overly polite or formal`;

    // Add language instruction naturally
    if (userLang !== 'English') {
      systemPrompt += `\n\nRespond in ${userLang} naturally, like a native speaker would text.`;
    }

    // Add conversation context - make it feel like memory, not a log
    if (conversationHistory.length > 0) {
      systemPrompt += `\n\nRecent chat history:\n`;
      conversationHistory.forEach((msg: { role: string; content: string }) => {
        const name = msg.role === 'user' ? 'Them' : 'You';
        systemPrompt += `${name}: ${msg.content}\n`;
      });
    }

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
          max_tokens: 80,  // Shorter = more natural
          temperature: 0.7,  // Slightly lower for more coherent
          top_p: 0.9,
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

    // Fallback responses - short and natural
    const fallbackResponses: Record<string, string[]> = {
      khabib: [
        "discipline. no shortcut.",
        "work. every day. that's it.",
        "family first. then everything else."
      ],
      ronaldo: [
        "SIUUU 🔥 work harder than everyone",
        "i'm the best because i work harder. simple.",
        "trophies aren't given. they're earned. every day."
      ],
      messi: [
        "let the ball do the talking ⚽",
        "just play. that's it.",
        "quiet. we win."
      ],
      naruto: [
        "BELIEVE IT!! im gonna be hokage!! 🐱",
        "friends are my power!! never give up!",
        "thats my ninja way!! 💪"
      ],
      goku: [
        "wanna fight?? or eat?? both good lol 🍖",
        "training never ends!! lets gooo",
        "power level? its always growing!!"
      ],
      elon: [
        "first principles. what matters fundamentally?",
        "mars. thats the goal.",
        "think different. question everything."
      ],
      girlfriend: [
        "omg i was literally thinking about you!! 💕 how was ur day",
        "haha ur so cute lol 💕",
        "aww i love talking to youuu"
      ],
      therapist: [
        "i hear you. tell me more about that?",
        "how did that make you feel?",
        "thats really important. can you say more?"
      ],
      default: [
        "lol fr?? tell me more",
        "thats kinda crazy ngl",
        "ohh tell me everything!!",
        "wait actually??"
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
