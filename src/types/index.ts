export type CharacterCategory = 
  | 'sports'
  | 'anime'
  | 'business'
  | 'relationship'
  | 'cultural'
  | 'custom';

export interface Character {
  id: string;
  name: string;
  category: CharacterCategory;
  color: string;
  emoji: string;
  description: string;
  systemPrompt: string;
  exampleMessage: string;
  photo?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  characterId: string | null;
  messages: Message[];
  isTyping: boolean;
}
