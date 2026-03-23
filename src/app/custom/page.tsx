'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CustomPersona() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('best-friend');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('customPersonas');
    if (saved) {
      console.log('Found existing personas');
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const saved = localStorage.getItem('customPersonas');
      const customPersonas = saved ? JSON.parse(saved) : [];

      const newPersona = {
        id: `custom-${Date.now()}`,
        name,
        relationship,
        photo,
        createdAt: Date.now(),
      };

      customPersonas.push(newPersona);
      localStorage.setItem('customPersonas', JSON.stringify(customPersonas));

      console.log('Created custom persona:', newPersona);

      setLoading(false);
      router.push('/');
    } catch (error) {
      console.error('Error creating persona:', error);
      setLoading(false);
    }
  };

  const relationshipTypes = [
    { value: 'girlfriend', label: 'Girlfriend', emoji: '💕' },
    { value: 'boyfriend', label: 'Boyfriend', emoji: '💙' },
    { value: 'best-friend', label: 'Best Friend', emoji: '🙌' },
    { value: 'mother', label: 'Mother', emoji: '❤️' },
    { value: 'father', label: 'Father', emoji: '👨' },
    { value: 'mentor', label: 'Mentor', emoji: '🎯' },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Own Companion</h1>
          <p className="text-[#94a3b8]">Upload a photo and create a personalized AI companion</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#94a3b8] mb-3">Upload Photo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-[#2a2a3a] rounded-xl flex items-center justify-center cursor-pointer hover:border-[#8b5cf6] transition-colors overflow-hidden relative"
            >
              {photo ? (
                <Image src={photo} alt="Uploaded" fill className="object-cover" unoptimized />
              ) : (
                <div className="text-center text-[#64748b]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Click to upload a photo</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter their name..."
              className="w-full bg-[#1a1a24] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6]"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-[#94a3b8] mb-3">Relationship Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relationshipTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setRelationship(type.value)}
                  className={`p-4 rounded-xl border transition-all ${
                    relationship === type.value
                      ? 'border-[#8b5cf6] bg-[#8b5cf6]/20'
                      : 'border-[#2a2a3a] hover:border-[#8b5cf6]/50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{type.emoji}</span>
                  <span className="text-sm text-white">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#f472b6] hover:opacity-90 text-white font-medium py-4 rounded-xl transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Companion'}
          </button>
        </div>
      </div>
    </div>
  );
}
