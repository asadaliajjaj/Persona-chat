'use client';

import { Character } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getCharacterImage } from '@/lib/images';

interface CharacterCardProps {
  character: Character;
  index: number;
}

export default function CharacterCard({ character, index }: CharacterCardProps) {
  // Check for custom photo first (for custom personas)
  const customPhoto = ("photo" in character ? character.photo : undefined) as string | undefined;
  const imageUrl = customPhoto || getCharacterImage(character.id);

  return (
    <Link href={`/chat/${character.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="glass-card rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
        style={{ '--color': character.color } as React.CSSProperties}
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, ${character.color}40, transparent)` }}
        />
        
        <div className="relative z-10">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden animate-float"
            style={{ 
              boxShadow: `0 0 30px ${character.color}40`
            }}
          >
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
                className="w-full h-full flex items-center justify-center text-4xl"
                style={{ background: `${character.color}30` }}
              >
                {character.emoji}
              </div>
            )}
          </div>
          
          <h3 className="character-name text-lg font-semibold text-center mb-1 text-white">
            {character.name}
          </h3>
          
          <p className="text-sm text-center text-[var(--text-secondary)] mb-3 line-clamp-2">
            {character.description}
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <span 
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ 
                background: `${character.color}20`,
                color: character.color,
                border: `1px solid ${character.color}40`
              }}
            >
              Chat →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
