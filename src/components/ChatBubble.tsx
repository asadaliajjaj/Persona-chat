'use client';

import { Message } from '@/types';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: Message;
  characterEmoji?: string;
  characterColor?: string;
}

export default function ChatBubble({ message, characterEmoji, characterColor }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ 
              background: `${characterColor}30`,
              boxShadow: `0 0 15px ${characterColor}30`
            }}
          >
            {characterEmoji}
          </div>
        )}
        
        <div 
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser 
              ? 'bg-[#8b5cf6] text-white rounded-br-md' 
              : 'bg-[#1a1a24] text-[#f8fafc] rounded-bl-md'
          }`}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}
