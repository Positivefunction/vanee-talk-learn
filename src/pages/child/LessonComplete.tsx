import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Trophy, Target, CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';
import { useGameStore, type SessionResults } from '@/stores';
import { supabase } from '@/integrations/supabase/client';

export default function LessonComplete() {
  const navigate = useNavigate();
  const { completeSession, lastSessionResults, resetSession } = useGameStore();
  const [results, setResults] = useState<SessionResults | null>(null);
  const [exercises, setExercises] = useState<string>('');
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);

  useEffect(() => {
    // Complete the session and get results
    const sessionResults = completeSession();
    if (sessionResults) {
      setResults(sessionResults);
      // Fetch AI-generated exercises if there are weak areas
      if (sessionResults.weakPhonemes.length > 0) {
        fetchExercises(sessionResults);
      }
    } else if (lastSessionResults) {
      setResults(lastSessionResults);
      if (lastSessionResults.weakPhonemes.length > 0) {
        fetchExercises(lastSessionResults);
      }
    }
  }, []);

  const fetchExercises = async (sessionResults: SessionResults) => {
    setIsLoadingExercises(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: {
          assessmentData: {
            language: sessionResults.language,
            totalQuestions: sessionResults.totalQuestions,
            correctCount: sessionResults.correctCount,
            overallAccuracy: sessionResults.overallAccuracy,
            attempts: sessionResults.attempts.map(a => ({
              word: a.word,
              phoneme: a.phoneme,
              accuracy: a.accuracy,
              isCorrect: a.isCorrect,
              transcript: a.transcript,
            })),
            weakPhonemes: sessionResults.weakPhonemes,
            strongPhonemes: sessionResults.strongPhonemes,
          },
          type: 'exercises',
        },
      });

      if (error) throw error;
      if (data?.content) {
        setExercises(data.content);
      }
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
    } finally {
      setIsLoadingExercises(false);
    }
  };

  const handleContinue = () => {
    resetSession();
    navigate('/child/quest');
  };

  if (!results) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stars = results.overallAccuracy >= 90 ? 3 : results.overallAccuracy >= 70 ? 2 : 1;

  return (
    <div className="min-h-full flex flex-col px-4 py-6 overflow-auto">
      {/* Celebration Header */}
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        className="text-center mb-6"
      >
        <div className="text-7xl mb-4">🎊</div>
        <h1 className="font-display text-3xl text-foreground mb-2">Lesson Complete!</h1>
        <p className="text-muted-foreground">You're doing amazing!</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 mb-6 justify-center"
      >
        <div className="card-game p-4 text-center flex-1 max-w-[100px]">
          <div className="flex justify-center gap-1 mb-1">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${i < stars ? 'text-xp fill-xp' : 'text-muted'}`} 
              />
            ))}
          </div>
          <span className="text-xs font-medium">{stars} Stars</span>
        </div>
        <div className="card-game p-4 text-center flex-1 max-w-[100px]">
          <Zap className="w-6 h-6 text-primary mx-auto mb-1" />
          <span className="text-lg font-bold text-primary">+{results.xpEarned}</span>
          <span className="text-xs block">XP</span>
        </div>
        <div className="card-game p-4 text-center flex-1 max-w-[100px]">
          <Trophy className="w-6 h-6 text-success mx-auto mb-1" />
          <span className="text-lg font-bold text-success">{results.overallAccuracy}%</span>
          <span className="text-xs block">Score</span>
        </div>
      </motion.div>

      {/* Results Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Questions</span>
              <span className="font-bold">{results.totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Correct</span>
              <span className="font-bold text-success">{results.correctCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Need Practice</span>
              <span className="font-bold text-warning">{results.totalQuestions - results.correctCount}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sound Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sound Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.strongPhonemes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Sounds You Got Right</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.strongPhonemes.map((phoneme) => (
                    <Badge key={phoneme} variant="outline" className="bg-success/10 text-success border-success/20">
                      {phoneme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {results.weakPhonemes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">Sounds to Practice</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.weakPhonemes.map((phoneme) => (
                    <Badge key={phoneme} variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      {phoneme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Individual Attempts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Word by Word</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-auto">
              {results.attempts.map((attempt, idx) => (
                <div 
                  key={attempt.id} 
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    attempt.isCorrect ? 'bg-success/10' : 'bg-warning/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-medium">{attempt.word}</span>
                      <span className="text-xs text-muted-foreground ml-2">({attempt.phoneme})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${attempt.isCorrect ? 'text-success' : 'text-warning'}`}>
                      {attempt.accuracy}%
                    </span>
                    {attempt.isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Exercises */}
      {(results.weakPhonemes.length > 0 || exercises) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Practice Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingExercises ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating exercises for you...</span>
                </div>
              ) : exercises ? (
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {exercises}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Practice these sounds: {results.weakPhonemes.join(', ')}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-auto pt-4"
      >
        <Button onClick={handleContinue} className="btn-game btn-game-success w-full">
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
