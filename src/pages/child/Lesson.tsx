import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, type AssessmentAttempt } from '@/stores';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, ChevronRight, X, MicOff } from 'lucide-react';
import { getAssessmentWordsForLanguage } from '@/data/assessmentWords';
import { toast } from 'sonner';

// Language code mapping for Web Speech API
const LANG_MAP: Record<string, string> = {
  kannada: 'kn-IN',
  hindi: 'hi-IN',
  tamil: 'ta-IN',
  telugu: 'te-IN',
  malayalam: 'ml-IN',
  marathi: 'mr-IN',
  bengali: 'bn-IN',
  english: 'en-IN',
};

// Calculate similarity between two strings (Levenshtein distance based)
const calculateAccuracy = (spoken: string, expected: string): number => {
  const s1 = spoken.toLowerCase().trim();
  const s2 = expected.toLowerCase().trim();
  
  if (s1 === s2) return 100;
  if (s1.length === 0) return 0;
  
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return Math.round((1 - distance / maxLen) * 100);
};

// Check if Web Speech API is supported
const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export default function Lesson() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { 
    isRecording, 
    setRecording, 
    addXP, 
    updateHearts, 
    hearts, 
    currentLanguage,
    addAttempt,
    startSession,
    sessionId,
  } = useGameStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const recognitionRef = useRef<any>(null);

  // Get words in the selected language
  const cards = getAssessmentWordsForLanguage(currentLanguage);
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId && packId) {
      startSession(packId);
    }
  }, [sessionId, packId, startSession]);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      setErrorMessage('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = LANG_MAP[currentLanguage] || 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setRecording(true);
      setErrorMessage('');
    };

    recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcriptText = lastResult[0].transcript;
      setTranscript(transcriptText);
    };

    recognition.onend = () => {
      setIsListening(false);
      setRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setRecording(false);
      
      if (event.error === 'no-speech') {
        toast.error('No speech detected. Please try again.');
      } else if (event.error === 'audio-capture') {
        toast.error('No microphone found. Please check your microphone.');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please allow microphone access.');
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentLanguage, setRecording]);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = LANG_MAP[currentLanguage] || 'en-IN';
    }
  }, [currentLanguage]);

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentCard.word);
      utterance.lang = LANG_MAP[currentLanguage] || 'en-IN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleRecord = async () => {
    if (!isSpeechRecognitionSupported()) {
      toast.error('Speech recognition not supported. Please use Chrome browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    setTranscript('');
    setErrorMessage('');

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current?.start();
      
      setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      }, 5000);
    } catch (err) {
      console.error('Microphone access error:', err);
      toast.error('Could not access microphone. Please allow microphone access.');
    }
  };

  // Process result when recording ends
  useEffect(() => {
    if (!isListening && transcript && !showFeedback) {
      const calculatedAccuracy = calculateAccuracy(transcript, currentCard.word);
      const correct = calculatedAccuracy >= 70;
      
      setAccuracy(calculatedAccuracy);
      setIsCorrect(correct);
      setShowFeedback(true);
      
      // Track this attempt
      const attempt: AssessmentAttempt = {
        id: crypto.randomUUID(),
        word: currentCard.word,
        phoneme: currentCard.phoneme,
        accuracy: calculatedAccuracy,
        isCorrect: correct,
        transcript: transcript,
        timestamp: Date.now(),
      };
      addAttempt(attempt);
      
      if (correct) {
        addXP(Math.floor(calculatedAccuracy / 10));
      } else {
        updateHearts(Math.max(0, hearts - 1));
      }
    }
  }, [isListening, transcript, showFeedback, currentCard, addXP, updateHearts, hearts, addAttempt]);

  const handleNext = () => {
    setShowFeedback(false);
    setTranscript('');
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate(`/child/lesson/${packId}/complete`);
    }
  };

  return (
    <div className="min-h-full flex flex-col px-4 py-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/child/quest')}>
          <X className="w-5 h-5" />
        </Button>
        <div className="flex-1 progress-game">
          <motion.div className="progress-game-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {currentIndex + 1}/{cards.length}
        </span>
      </div>

      {/* Language indicator */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🗣️ Speaking in: {currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)}
        </span>
      </div>

      {/* Card */}
      <motion.div className="flex-1 flex flex-col items-center justify-center" layout>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="card-game w-full max-w-xs p-8 text-center"
          >
            <div className="text-7xl mb-4">{currentCard.symbol}</div>
            <h2 className="font-display text-3xl text-foreground mb-2">{currentCard.word}</h2>
            <p className="text-muted-foreground text-sm">
              Say: "<span className="font-semibold text-foreground">{currentCard.word}</span>"
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Target sound: {currentCard.phoneme}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Feedback overlay */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm ${
                isCorrect ? 'bg-success/20' : 'bg-destructive/20'
              }`}
            >
              <div className="text-center bg-background/95 rounded-3xl p-8 shadow-xl max-w-sm mx-4">
                <div className="text-6xl mb-4">{isCorrect ? '🎉' : '💪'}</div>
                <h3 className="font-display text-2xl mb-2">
                  {isCorrect ? 'Great job!' : 'Keep trying!'}
                </h3>
                
                <div className="mb-4">
                  <div className="text-4xl font-bold text-primary">{accuracy}%</div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">You said:</p>
                  <p className="font-medium text-foreground">{transcript}</p>
                </div>

                <Button onClick={handleNext} className="btn-game btn-game-primary">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      {!showFeedback && (
        <div className="flex flex-col items-center gap-4 py-6">
          {errorMessage ? (
            <p className="text-sm text-destructive text-center px-4">{errorMessage}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tap 🔊 to hear, then tap 🎤 to speak
            </p>
          )}
          <div className="flex justify-center gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-16 h-16 rounded-full"
              onClick={handlePlayAudio}
              disabled={isListening}
            >
              <Volume2 className="w-6 h-6" />
            </Button>
            <button
              onClick={handleRecord}
              disabled={!isSpeechRecognitionSupported()}
              className={`mic-button ${isListening ? 'mic-button-recording' : ''}`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 text-primary-foreground" />
              ) : (
                <Mic className="w-10 h-10 text-primary-foreground" />
              )}
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary-foreground/50"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </button>
          </div>
          {isListening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-primary font-medium">🎙️ Listening...</p>
              {transcript && (
                <p className="text-sm text-muted-foreground mt-1">
                  Heard: "{transcript}"
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
