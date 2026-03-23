// Image URLs for all characters - using high-quality sources
export const characterImages: Record<string, string> = {
  // Sports Legends
  khabib: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Khabib_Nurmagomedov_2018.jpg/440px-Khabib_Nurmagomedov_2018.jpg',
  ronaldo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg',
  messi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/440px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',
  ali: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Muhammad_Ali_NYWTS.jpg/440px-Muhammad_Ali_NYWTS.jpg',
  jordan: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Michael_Jordan_in_2013.jpg/440px-Michael_Jordan_in_2013.jpg',
  mcgregor: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Conor_McGregor_2018.jpg/440px-Conor_McGregor_2018.jpg',
  bolt: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Usain_Bolt_2016.jpg/440px-Usain_Bolt_2016.jpg',
  lebron: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/LeBron_James_-_51354198361_%28cropped%29.jpg/440px-LeBron_James_-_51354198361_%28cropped%29.jpg',
  
  // Anime Characters
  naruto: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Naruto_ Uzumaki.png/300px-Naruto_ Uzumaki.png',
  goku: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Goku_SSJ_Xeno.png/300px-Goku_SSJ_Xeno.png',
  pikachu: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/Pikachu_2.png/300px-Pikachu_2.png',
  luffy: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Monkey_D._Luffy.png/300px-Monkey_D._Luffy.png',
  levi: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Levi_Ackerman.png/300px-Levi_Ackerman.png',
  
  // Business / Mindset
  goggins: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/David_Goggins_in_2019.jpg/440px-David_Goggins_in_2019.jpg',
  elon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28cropped%29.jpg/440px-Elon_Musk_Royal_Society_%28cropped%29.jpg',
  steve_jobs: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Steve_Jobs_Outline.jpg/440px-Steve_Jobs_Outline.jpg',
  
  // Relationship
  girlfriend: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  'best-friend-m': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  'best-friend-f': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  mother: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
  therapist: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
  
  // Cultural
  'desi-yaar': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  'punjabi-sardar': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  'street-philosopher': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  'roast-bot': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
};

export const getCharacterImage = (id: string): string => {
  return characterImages[id] || '';
};
