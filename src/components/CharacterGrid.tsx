'use client';

import { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import { characters, categoryLabels } from '@/lib/characters';
import { Character } from '@/types';

const categories = ['all', 'sports', 'anime', 'business', 'relationship', 'cultural', 'custom'] as const;

interface CustomPersona {
  id: string;
  name: string;
  relationship: string;
  photo: string;
}

export default function CharacterGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPersonas, setCustomPersonas] = useState<CustomPersona[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('customPersonas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomPersonas(parsed);
      } catch (e) {
        console.error('Error loading custom personas:', e);
      }
    }
  }, []);

  const customCharacters: Character[] = customPersonas.map((persona) => ({
    id: persona.id,
    name: persona.name,
    category: 'custom' as const,
    color: '#8b5cf6',
    emoji: '👤',
    description: `${persona.relationship} - Custom Companion`,
    systemPrompt: `You are ${persona.name}. You are a ${persona.relationship} who loves and cares about the user. Be warm, supportive, and conversational. Respond in the same language as the user.`,
    exampleMessage: `Hi! I'm ${persona.name}. Nice to meet you!`,
    photo: persona.photo,
  }));

  const allCharacters = [...characters, ...customCharacters];

  const filteredCharacters = allCharacters.filter((char) => {
    const matchesCategory = activeCategory === 'all' || char.category === activeCategory;
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         char.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === 'all') return 'All';
    if (cat === 'custom') return 'Custom';
    return categoryLabels[cat] || cat;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#8b5cf6] text-white'
                  : 'bg-[#1a1a24] text-[#94a3b8] hover:bg-[#252532]'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:border-[#8b5cf6] transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCharacters.map((character, index) => (
          <CharacterCard key={character.id} character={character} index={index} />
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#64748b]">No characters found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
