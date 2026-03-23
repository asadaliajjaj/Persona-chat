import Link from 'next/link';
import CharacterGrid from '@/components/CharacterGrid';

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 md:py-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] via-[#f472b6] to-[#8b5cf6] bg-clip-text text-transparent">
            PersonaChat
          </h1>
          <p className="text-[#94a3b8]">
            Chat with 22+ unique AI characters
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/custom"
            className="px-4 py-2 bg-[#1a1a24] hover:bg-[#252532] text-white rounded-xl transition-colors"
          >
            + Create Custom
          </Link>
        </div>
      </header>

      <CharacterGrid />

      <footer className="text-center mt-16 py-8 border-t border-[#1a1a24]">
        <p className="text-[#64748b] text-sm">
          Built with Next.js + Groq API • Demo Version
        </p>
      </footer>
    </main>
  );
}
