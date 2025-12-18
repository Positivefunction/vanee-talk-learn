import type { SupportedLanguage } from '@/types';

// Multilingual assessment words for each language
export interface AssessmentWord {
  id: string;
  symbol: string;
  phoneme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  translations: Record<SupportedLanguage, string>;
}

export const assessmentWords: AssessmentWord[] = [
  {
    id: '1',
    symbol: '🍎',
    phoneme: '/a/',
    difficulty: 'easy',
    translations: {
      kannada: 'ಸೇಬು',
      hindi: 'सेब',
      tamil: 'ஆப்பிள்',
      telugu: 'యాపిల్',
      malayalam: 'ആപ്പിൾ',
      marathi: 'सफरचंद',
      bengali: 'আপেল',
      english: 'Apple',
    },
  },
  {
    id: '2',
    symbol: '⚽',
    phoneme: '/b/',
    difficulty: 'easy',
    translations: {
      kannada: 'ಚೆಂಡು',
      hindi: 'गेंद',
      tamil: 'பந்து',
      telugu: 'బంతి',
      malayalam: 'പന്ത്',
      marathi: 'चेंडू',
      bengali: 'বল',
      english: 'Ball',
    },
  },
  {
    id: '3',
    symbol: '🐱',
    phoneme: '/k/',
    difficulty: 'easy',
    translations: {
      kannada: 'ಬೆಕ್ಕು',
      hindi: 'बिल्ली',
      tamil: 'பூனை',
      telugu: 'పిల్లి',
      malayalam: 'പൂച്ച',
      marathi: 'मांजर',
      bengali: 'বিড়াল',
      english: 'Cat',
    },
  },
  {
    id: '4',
    symbol: '🐕',
    phoneme: '/d/',
    difficulty: 'easy',
    translations: {
      kannada: 'ನಾಯಿ',
      hindi: 'कुत्ता',
      tamil: 'நாய்',
      telugu: 'కుక్క',
      malayalam: 'നായ',
      marathi: 'कुत्रा',
      bengali: 'কুকুর',
      english: 'Dog',
    },
  },
  {
    id: '5',
    symbol: '🐘',
    phoneme: '/e/',
    difficulty: 'medium',
    translations: {
      kannada: 'ಆನೆ',
      hindi: 'हाथी',
      tamil: 'யானை',
      telugu: 'ఏనుగు',
      malayalam: 'ആന',
      marathi: 'हत्ती',
      bengali: 'হাতি',
      english: 'Elephant',
    },
  },
  {
    id: '6',
    symbol: '🌸',
    phoneme: '/f/',
    difficulty: 'easy',
    translations: {
      kannada: 'ಹೂವು',
      hindi: 'फूल',
      tamil: 'மலர்',
      telugu: 'పువ్వు',
      malayalam: 'പൂവ്',
      marathi: 'फूल',
      bengali: 'ফুল',
      english: 'Flower',
    },
  },
  {
    id: '7',
    symbol: '🏠',
    phoneme: '/h/',
    difficulty: 'easy',
    translations: {
      kannada: 'ಮನೆ',
      hindi: 'घर',
      tamil: 'வீடு',
      telugu: 'ఇల్లు',
      malayalam: 'വീട്',
      marathi: 'घर',
      bengali: 'বাড়ি',
      english: 'House',
    },
  },
  {
    id: '8',
    symbol: '🌙',
    phoneme: '/m/',
    difficulty: 'easy',
    translations: {
      kannada: 'ಚಂದ್ರ',
      hindi: 'चाँद',
      tamil: 'நிலா',
      telugu: 'చంద్రుడు',
      malayalam: 'ചന്ദ്രൻ',
      marathi: 'चंद्र',
      bengali: 'চাঁদ',
      english: 'Moon',
    },
  },
  {
    id: '9',
    symbol: '💧',
    phoneme: '/w/',
    difficulty: 'easy',
    translations: {
      kannada: 'ನೀರು',
      hindi: 'पानी',
      tamil: 'தண்ணீர்',
      telugu: 'నీరు',
      malayalam: 'വെള്ളം',
      marathi: 'पाणी',
      bengali: 'জল',
      english: 'Water',
    },
  },
  {
    id: '10',
    symbol: '🌳',
    phoneme: '/t/',
    difficulty: 'easy',
    translations: {
      kannada: 'ಮರ',
      hindi: 'पेड़',
      tamil: 'மரம்',
      telugu: 'చెట్టు',
      malayalam: 'മരം',
      marathi: 'झाड',
      bengali: 'গাছ',
      english: 'Tree',
    },
  },
];

// Sample questions for trainers based on performance
export interface TrainerSampleQuestion {
  id: string;
  category: 'articulation' | 'phoneme_focus' | 'repetition' | 'sentence';
  difficulty: 'easy' | 'medium' | 'hard';
  targetPhoneme: string;
  prompt: Record<SupportedLanguage, string>;
  instructions: string;
}

export const trainerSampleQuestions: TrainerSampleQuestion[] = [
  {
    id: 'q1',
    category: 'articulation',
    difficulty: 'easy',
    targetPhoneme: '/k/',
    prompt: {
      kannada: 'ಕಮಲ',
      hindi: 'कमल',
      tamil: 'தாமரை',
      telugu: 'కమలం',
      malayalam: 'താമര',
      marathi: 'कमळ',
      bengali: 'পদ্ম',
      english: 'Lotus',
    },
    instructions: 'Focus on initial /k/ sound articulation. Watch for substitution with /g/.',
  },
  {
    id: 'q2',
    category: 'phoneme_focus',
    difficulty: 'easy',
    targetPhoneme: '/m/',
    prompt: {
      kannada: 'ಅಮ್ಮ',
      hindi: 'माँ',
      tamil: 'அம்மா',
      telugu: 'అమ్మ',
      malayalam: 'അമ്മ',
      marathi: 'आई',
      bengali: 'মা',
      english: 'Mother',
    },
    instructions: 'Practice nasal /m/ sound. Common in all Indian languages.',
  },
  {
    id: 'q3',
    category: 'repetition',
    difficulty: 'medium',
    targetPhoneme: '/r/',
    prompt: {
      kannada: 'ರಾಮ',
      hindi: 'राम',
      tamil: 'ராமன்',
      telugu: 'రాముడు',
      malayalam: 'രാമൻ',
      marathi: 'राम',
      bengali: 'রাম',
      english: 'Rama',
    },
    instructions: 'Focus on retroflex /r/ sound. Have child repeat 3 times.',
  },
  {
    id: 'q4',
    category: 'sentence',
    difficulty: 'hard',
    targetPhoneme: '/s/',
    prompt: {
      kannada: 'ಸೂರ್ಯ ಬೆಳಕು ಕೊಡುತ್ತಾನೆ',
      hindi: 'सूरज रोशनी देता है',
      tamil: 'சூரியன் ஒளி தருகிறது',
      telugu: 'సూర్యుడు వెలుగు ఇస్తాడు',
      malayalam: 'സൂര്യൻ വെളിച്ചം നൽകുന്നു',
      marathi: 'सूर्य प्रकाश देतो',
      bengali: 'সূর্য আলো দেয়',
      english: 'The sun gives light',
    },
    instructions: 'Complete sentence with /s/ in initial position. Check fluency and clarity.',
  },
  {
    id: 'q5',
    category: 'articulation',
    difficulty: 'medium',
    targetPhoneme: '/p/',
    prompt: {
      kannada: 'ಪಕ್ಷಿ',
      hindi: 'पक्षी',
      tamil: 'பறவை',
      telugu: 'పక్షి',
      malayalam: 'പക്ഷി',
      marathi: 'पक्षी',
      bengali: 'পাখি',
      english: 'Bird',
    },
    instructions: 'Check bilabial plosive /p/ production. Watch for weak aspiration.',
  },
];

// Get suggested questions based on weak phonemes
export function getSuggestedQuestions(
  weakPhonemes: string[],
  language: SupportedLanguage,
  limit: number = 5
): TrainerSampleQuestion[] {
  const matching = trainerSampleQuestions.filter(q => 
    weakPhonemes.some(p => q.targetPhoneme.includes(p))
  );
  
  if (matching.length >= limit) {
    return matching.slice(0, limit);
  }
  
  // Fill with other questions
  const remaining = trainerSampleQuestions.filter(q => 
    !weakPhonemes.some(p => q.targetPhoneme.includes(p))
  );
  
  return [...matching, ...remaining].slice(0, limit);
}

// Get words for assessment by language
export function getAssessmentWordsForLanguage(
  language: SupportedLanguage,
  limit?: number
): { word: string; symbol: string; phoneme: string; id: string }[] {
  const words = assessmentWords.map(w => ({
    id: w.id,
    word: w.translations[language],
    symbol: w.symbol,
    phoneme: w.phoneme,
  }));
  
  return limit ? words.slice(0, limit) : words;
}
