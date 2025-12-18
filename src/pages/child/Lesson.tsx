import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, ChevronRight, X } from 'lucide-react';
import { getAssessmentWordsForLanguage } from '@/data/assessmentWords';

export default function Lesson() {
  const { packId } = useParams();
  const navigate = useNavigate();
  const { isRecording, setRecording, addXP, updateHearts, hearts, currentLanguage } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [transcript, setTranscript] = useState('');

  // Get words in the selected language
  const cards = getAssessmentWordsForLanguage(currentLanguage);
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handlePlayAudio = () => {
    // Use Web Speech API for TTS in selected language
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentCard.word);
      
      // Map language codes
      const langMap: Record<string, string> = {
        kannada: 'kn-IN',
        hindi: 'hi-IN',
        tamil: 'ta-IN',
        telugu: 'te-IN',
        malayalam: 'ml-IN',
        marathi: 'mr-IN',
        bengali: 'bn-IN',
        english: 'en-IN',
      };
      
      utterance.lang = langMap[currentLanguage] || 'en-IN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleRecord = () => {
    setRecording(true);
    
    // Simulate speech recognition (in production, use real ASR)
    setTimeout(() => {
      setRecording(false);
      
      // Simulate accuracy score (in production, use real ASR + comparison)
      const simulatedAccuracy = Math.floor(Math.random() * 40) + 60; // 60-100%
      const correct = simulatedAccuracy >= 70;
      
      setAccuracy(simulatedAccuracy);
      setIsCorrect(correct);
      setTranscript(currentCard.word); // In production, this would be ASR result
      setShowFeedback(true);
      
      if (correct) {
        addXP(Math.floor(simulatedAccuracy / 10));
      } else {
        updateHearts(hearts - 1);
      }
    }, 2500);
  };

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
                
                {/* Accuracy score */}
                <div className="mb-4">
                  <div className="text-4xl font-bold text-primary">{accuracy}%</div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>

                {/* What was detected */}
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
          <p className="text-sm text-muted-foreground">
            Tap 🔊 to hear, then tap 🎤 to speak
          </p>
          <div className="flex justify-center gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-16 h-16 rounded-full"
              onClick={handlePlayAudio}
            >
              <Volume2 className="w-6 h-6" />
            </Button>
            <button
              onClick={handleRecord}
              disabled={isRecording}
              className={`mic-button ${isRecording ? 'mic-button-recording' : ''}`}
            >
              <Mic className="w-10 h-10 text-primary-foreground" />
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary-foreground/50"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </button>
          </div>
          {isRecording && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-medium"
            >
              🎙️ Listening...
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
}
