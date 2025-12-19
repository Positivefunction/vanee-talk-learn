import type { SupportedLanguage } from '@/types';

export interface AssignmentTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetPhonemes: string[];
  words: Array<{
    id: string;
    word: Record<SupportedLanguage, string>;
    symbol: string;
    phoneme: string;
    imageUrl?: string;
  }>;
}

export const assignmentTopics: AssignmentTopic[] = [
  {
    id: 'first-words',
    title: 'First Words',
    description: 'Basic vocabulary for beginners',
    icon: '🎯',
    targetPhonemes: ['/a/', '/m/', '/b/', '/p/'],
    words: [
      {
        id: 'fw-1',
        word: { kannada: 'ಅಮ್ಮ', hindi: 'माँ', tamil: 'அம்மா', telugu: 'అమ్మ', malayalam: 'അമ്മ', marathi: 'आई', bengali: 'মা', english: 'Mother' },
        symbol: '👩',
        phoneme: '/m/',
      },
      {
        id: 'fw-2',
        word: { kannada: 'ಅಪ್ಪ', hindi: 'पापा', tamil: 'அப்பா', telugu: 'నాన్న', malayalam: 'അച്ഛൻ', marathi: 'बाबा', bengali: 'বাবা', english: 'Father' },
        symbol: '👨',
        phoneme: '/p/',
      },
      {
        id: 'fw-3',
        word: { kannada: 'ಬಾಯಿ', hindi: 'मुँह', tamil: 'வாய்', telugu: 'నోరు', malayalam: 'വായ', marathi: 'तोंड', bengali: 'মুখ', english: 'Mouth' },
        symbol: '👄',
        phoneme: '/b/',
      },
      {
        id: 'fw-4',
        word: { kannada: 'ಕೈ', hindi: 'हाथ', tamil: 'கை', telugu: 'చేయి', malayalam: 'കൈ', marathi: 'हात', bengali: 'হাত', english: 'Hand' },
        symbol: '✋',
        phoneme: '/k/',
      },
      {
        id: 'fw-5',
        word: { kannada: 'ಕಣ್ಣು', hindi: 'आँख', tamil: 'கண்', telugu: 'కన్ను', malayalam: 'കണ്ണ്', marathi: 'डोळा', bengali: 'চোখ', english: 'Eye' },
        symbol: '👁️',
        phoneme: '/k/',
      },
    ],
  },
  {
    id: 'animal-words',
    title: 'Animal Words',
    description: 'Learn names of animals',
    icon: '🐾',
    targetPhonemes: ['/k/', '/g/', '/d/', '/t/'],
    words: [
      {
        id: 'aw-1',
        word: { kannada: 'ನಾಯಿ', hindi: 'कुत्ता', tamil: 'நாய்', telugu: 'కుక్క', malayalam: 'നായ', marathi: 'कुत्रा', bengali: 'কুকুর', english: 'Dog' },
        symbol: '🐕',
        phoneme: '/d/',
      },
      {
        id: 'aw-2',
        word: { kannada: 'ಬೆಕ್ಕು', hindi: 'बिल्ली', tamil: 'பூனை', telugu: 'పిల్లి', malayalam: 'പൂച്ച', marathi: 'मांजर', bengali: 'বিড়াল', english: 'Cat' },
        symbol: '🐱',
        phoneme: '/k/',
      },
      {
        id: 'aw-3',
        word: { kannada: 'ಹಸು', hindi: 'गाय', tamil: 'மாடு', telugu: 'ఆవు', malayalam: 'പശു', marathi: 'गाय', bengali: 'গরু', english: 'Cow' },
        symbol: '🐄',
        phoneme: '/g/',
      },
      {
        id: 'aw-4',
        word: { kannada: 'ಆನೆ', hindi: 'हाथी', tamil: 'யானை', telugu: 'ఏనుగు', malayalam: 'ആന', marathi: 'हत्ती', bengali: 'হাতি', english: 'Elephant' },
        symbol: '🐘',
        phoneme: '/a/',
      },
      {
        id: 'aw-5',
        word: { kannada: 'ಹಕ್ಕಿ', hindi: 'पक्षी', tamil: 'பறவை', telugu: 'పక్షి', malayalam: 'പക്ഷി', marathi: 'पक्षी', bengali: 'পাখি', english: 'Bird' },
        symbol: '🐦',
        phoneme: '/p/',
      },
      {
        id: 'aw-6',
        word: { kannada: 'ಮೀನು', hindi: 'मछली', tamil: 'மீன்', telugu: 'చేప', malayalam: 'മീൻ', marathi: 'मासा', bengali: 'মাছ', english: 'Fish' },
        symbol: '🐟',
        phoneme: '/m/',
      },
      {
        id: 'aw-7',
        word: { kannada: 'ಸಿಂಹ', hindi: 'शेर', tamil: 'சிங்கம்', telugu: 'సింహం', malayalam: 'സിംഹം', marathi: 'सिंह', bengali: 'সিংহ', english: 'Lion' },
        symbol: '🦁',
        phoneme: '/s/',
      },
      {
        id: 'aw-8',
        word: { kannada: 'ಹುಲಿ', hindi: 'बाघ', tamil: 'புலி', telugu: 'పులి', malayalam: 'പുലി', marathi: 'वाघ', bengali: 'বাঘ', english: 'Tiger' },
        symbol: '🐅',
        phoneme: '/t/',
      },
    ],
  },
  {
    id: 'food-words',
    title: 'Food Words',
    description: 'Names of common foods',
    icon: '🍎',
    targetPhonemes: ['/r/', '/l/', '/s/', '/ch/'],
    words: [
      {
        id: 'food-1',
        word: { kannada: 'ಅನ್ನ', hindi: 'चावल', tamil: 'சோறு', telugu: 'అన్నం', malayalam: 'ചോറ്', marathi: 'भात', bengali: 'ভাত', english: 'Rice' },
        symbol: '🍚',
        phoneme: '/r/',
      },
      {
        id: 'food-2',
        word: { kannada: 'ರೊಟ್ಟಿ', hindi: 'रोटी', tamil: 'ரொட்டி', telugu: 'రొట్టె', malayalam: 'റൊട്ടി', marathi: 'रोटी', bengali: 'রুটি', english: 'Bread' },
        symbol: '🍞',
        phoneme: '/r/',
      },
      {
        id: 'food-3',
        word: { kannada: 'ಸೇಬು', hindi: 'सेब', tamil: 'ஆப்பிள்', telugu: 'యాపిల్', malayalam: 'ആപ്പിൾ', marathi: 'सफरचंद', bengali: 'আপেল', english: 'Apple' },
        symbol: '🍎',
        phoneme: '/s/',
      },
      {
        id: 'food-4',
        word: { kannada: 'ಬಾಳೆಹಣ್ಣು', hindi: 'केला', tamil: 'வாழைப்பழம்', telugu: 'అరటిపండు', malayalam: 'പഴം', marathi: 'केळे', bengali: 'কলা', english: 'Banana' },
        symbol: '🍌',
        phoneme: '/b/',
      },
      {
        id: 'food-5',
        word: { kannada: 'ಹಾಲು', hindi: 'दूध', tamil: 'பால்', telugu: 'పాలు', malayalam: 'പാൽ', marathi: 'दूध', bengali: 'দুধ', english: 'Milk' },
        symbol: '🥛',
        phoneme: '/l/',
      },
      {
        id: 'food-6',
        word: { kannada: 'ನೀರು', hindi: 'पानी', tamil: 'தண்ணீர்', telugu: 'నీళ్ళు', malayalam: 'വെള്ളം', marathi: 'पाणी', bengali: 'জল', english: 'Water' },
        symbol: '💧',
        phoneme: '/n/',
      },
    ],
  },
  {
    id: 'color-words',
    title: 'Color Words',
    description: 'Learn color names',
    icon: '🎨',
    targetPhonemes: ['/n/', '/l/', '/h/', '/k/'],
    words: [
      {
        id: 'color-1',
        word: { kannada: 'ಕೆಂಪು', hindi: 'लाल', tamil: 'சிவப்பு', telugu: 'ఎరుపు', malayalam: 'ചുവപ്പ്', marathi: 'लाल', bengali: 'লাল', english: 'Red' },
        symbol: '🔴',
        phoneme: '/r/',
      },
      {
        id: 'color-2',
        word: { kannada: 'ನೀಲಿ', hindi: 'नीला', tamil: 'நீலம்', telugu: 'నీలం', malayalam: 'നീല', marathi: 'निळा', bengali: 'নীল', english: 'Blue' },
        symbol: '🔵',
        phoneme: '/n/',
      },
      {
        id: 'color-3',
        word: { kannada: 'ಹಸಿರು', hindi: 'हरा', tamil: 'பச்சை', telugu: 'ఆకుపచ్చ', malayalam: 'പച്ച', marathi: 'हिरवा', bengali: 'সবুজ', english: 'Green' },
        symbol: '🟢',
        phoneme: '/h/',
      },
      {
        id: 'color-4',
        word: { kannada: 'ಹಳದಿ', hindi: 'पीला', tamil: 'மஞ்சள்', telugu: 'పసుపు', malayalam: 'മഞ്ഞ', marathi: 'पिवळा', bengali: 'হলুদ', english: 'Yellow' },
        symbol: '🟡',
        phoneme: '/h/',
      },
      {
        id: 'color-5',
        word: { kannada: 'ಕಪ್ಪು', hindi: 'काला', tamil: 'கருப்பு', telugu: 'నలుపు', malayalam: 'കറുപ്പ്', marathi: 'काळा', bengali: 'কালো', english: 'Black' },
        symbol: '⚫',
        phoneme: '/k/',
      },
      {
        id: 'color-6',
        word: { kannada: 'ಬಿಳಿ', hindi: 'सफेद', tamil: 'வெள்ளை', telugu: 'తెలుపు', malayalam: 'വെള്ള', marathi: 'पांढरा', bengali: 'সাদা', english: 'White' },
        symbol: '⚪',
        phoneme: '/b/',
      },
    ],
  },
  {
    id: 'number-words',
    title: 'Number Words',
    description: 'Learn to count',
    icon: '🔢',
    targetPhonemes: ['/o/', '/t/', '/th/', '/ch/'],
    words: [
      {
        id: 'num-1',
        word: { kannada: 'ಒಂದು', hindi: 'एक', tamil: 'ஒன்று', telugu: 'ఒకటి', malayalam: 'ഒന്ന്', marathi: 'एक', bengali: 'এক', english: 'One' },
        symbol: '1️⃣',
        phoneme: '/o/',
      },
      {
        id: 'num-2',
        word: { kannada: 'ಎರಡು', hindi: 'दो', tamil: 'இரண்டு', telugu: 'రెండు', malayalam: 'രണ്ട്', marathi: 'दोन', bengali: 'দুই', english: 'Two' },
        symbol: '2️⃣',
        phoneme: '/t/',
      },
      {
        id: 'num-3',
        word: { kannada: 'ಮೂರು', hindi: 'तीन', tamil: 'மூன்று', telugu: 'మూడు', malayalam: 'മൂന്ന്', marathi: 'तीन', bengali: 'তিন', english: 'Three' },
        symbol: '3️⃣',
        phoneme: '/th/',
      },
      {
        id: 'num-4',
        word: { kannada: 'ನಾಲ್ಕು', hindi: 'चार', tamil: 'நான்கு', telugu: 'నాలుగు', malayalam: 'നാല്', marathi: 'चार', bengali: 'চার', english: 'Four' },
        symbol: '4️⃣',
        phoneme: '/f/',
      },
      {
        id: 'num-5',
        word: { kannada: 'ಐದು', hindi: 'पाँच', tamil: 'ஐந்து', telugu: 'ఐదు', malayalam: 'അഞ്ച്', marathi: 'पाच', bengali: 'পাঁচ', english: 'Five' },
        symbol: '5️⃣',
        phoneme: '/f/',
      },
    ],
  },
  {
    id: 'body-parts',
    title: 'Body Parts',
    description: 'Learn parts of the body',
    icon: '🫀',
    targetPhonemes: ['/n/', '/m/', '/k/', '/h/'],
    words: [
      {
        id: 'body-1',
        word: { kannada: 'ತಲೆ', hindi: 'सिर', tamil: 'தலை', telugu: 'తల', malayalam: 'തല', marathi: 'डोके', bengali: 'মাথা', english: 'Head' },
        symbol: '🗣️',
        phoneme: '/h/',
      },
      {
        id: 'body-2',
        word: { kannada: 'ಮೂಗು', hindi: 'नाक', tamil: 'மூக்கு', telugu: 'ముక్కు', malayalam: 'മൂക്ക്', marathi: 'नाक', bengali: 'নাক', english: 'Nose' },
        symbol: '👃',
        phoneme: '/n/',
      },
      {
        id: 'body-3',
        word: { kannada: 'ಕಿವಿ', hindi: 'कान', tamil: 'காது', telugu: 'చెవి', malayalam: 'ചെവി', marathi: 'कान', bengali: 'কান', english: 'Ear' },
        symbol: '👂',
        phoneme: '/k/',
      },
      {
        id: 'body-4',
        word: { kannada: 'ಕಾಲು', hindi: 'पैर', tamil: 'கால்', telugu: 'కాలు', malayalam: 'കാൽ', marathi: 'पाय', bengali: 'পা', english: 'Leg' },
        symbol: '🦵',
        phoneme: '/l/',
      },
      {
        id: 'body-5',
        word: { kannada: 'ಹೊಟ್ಟೆ', hindi: 'पेट', tamil: 'வயிறு', telugu: 'కడుపు', malayalam: 'വയറ്', marathi: 'पोट', bengali: 'পেট', english: 'Stomach' },
        symbol: '🫃',
        phoneme: '/s/',
      },
    ],
  },
];

export function getAssignmentById(id: string): AssignmentTopic | undefined {
  return assignmentTopics.find(t => t.id === id);
}

export function getWordsForAssignment(assignmentId: string, language: SupportedLanguage) {
  const topic = getAssignmentById(assignmentId);
  if (!topic) return [];
  
  return topic.words.map(w => ({
    id: w.id,
    word: w.word[language],
    symbol: w.symbol,
    phoneme: w.phoneme,
    imageUrl: w.imageUrl,
  }));
}
