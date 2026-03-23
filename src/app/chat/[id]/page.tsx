'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getCharacterById } from '@/lib/characters';
import { getCharacterImage } from '@/lib/images';
import { Message } from '@/types';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';

export default function ChatPage() {
  const params = useParams();
  const characterId = params.id as string;
  const character = getCharacterById(characterId);
  
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if this is a custom persona
  useEffect(() => {
    if (characterId.startsWith('custom-')) {
      const saved = localStorage.getItem('customPersonas');
      if (saved) {
        try {
          const customPersonas = JSON.parse(saved);
          const customPersona = customPersonas.find((p: { id: string; photo?: string }) => p.id === characterId);
          if (customPersona) {
            setCustomPhoto(customPersona.photo);
          }
        } catch (e) {
          console.error('Error loading custom persona:', e);
        }
      }
    }
  }, [characterId]);

  // Load initial message
  useEffect(() => {
    if (character && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: character.exampleMessage,
        timestamp: Date.now()
      }]);
    }
  }, [character]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          messages: messages.slice(-20),
          userMessage
        })
      });

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Something went wrong. Please try again.',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Character not found</h1>
          <Link href="/" className="text-[#8b5cf6] hover:underline">
            ← Back to characters
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = customPhoto || getCharacterImage(characterId);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#12121a] border-b border-[#1a1a24] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-[#94a3b8] hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {imageUrl ? (
                <Image 
                  src={imageUrl} 
                  alt={character.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-xl"
                  style={{ background: `${character.color}30` }}
                >
                  {character.emoji}
                </div>
              )}
            </div>
            <div>
              <h1 className="font-semibold text-white">{character.name}</h1>
              <p className="text-xs text-[#64748b]">Online</p>
            </div>
          </div>
          
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatBubble 
                key={message.id} 
                message={message}
                characterEmoji={character.emoji}
                characterColor={character.color}
              />
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt={character.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-sm"
                    style={{ background: `${character.color}30` }}
                  >
                    {character.emoji}
                  </div>
                )}
              </div>
              <div className="bg-[#1a1a24] px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                <span className="typing-dot w-2 h-2 bg-[#64748b] rounded-full" />
                <span className="typing-dot w-2 h-2 bg-[#64748b] rounded-full" />
                <span className="typing-dot w-2 h-2 bg-[#64748b] rounded-full" />
              </div>
            </motion.div>
          )}
          
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-[#12121a] border-t border-[#1a1a24] p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </footer>
    </div>
  );
}
