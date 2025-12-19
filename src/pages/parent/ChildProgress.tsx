import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Sparkles,
  Calendar,
  Trophy,
  BookOpen
} from 'lucide-react';
import { useGameStore, type SessionResults } from '@/stores';
import { supabase } from '@/integrations/supabase/client';

export default function ChildProgress() {
  const { lastSessionResults } = useGameStore();
  const [aiReport, setAiReport] = useState<string>('');
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  const fetchAIReport = async (results: SessionResults) => {
    setIsLoadingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: {
          assessmentData: {
            language: results.language,
            totalQuestions: results.totalQuestions,
            correctCount: results.correctCount,
            overallAccuracy: results.overallAccuracy,
            attempts: results.attempts.map(a => ({
              word: a.word,
              phoneme: a.phoneme,
              accuracy: a.accuracy,
              isCorrect: a.isCorrect,
              transcript: a.transcript,
            })),
            weakPhonemes: results.weakPhonemes,
            strongPhonemes: results.strongPhonemes,
          },
          type: 'report',
        },
      });

      if (error) throw error;
      if (data?.content) {
        setAiReport(data.content);
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
    } finally {
      setIsLoadingReport(false);
    }
  };

  useEffect(() => {
    if (lastSessionResults && !aiReport) {
      fetchAIReport(lastSessionResults);
    }
  }, [lastSessionResults]);

  // Show simulated data if no session results
  const displayResults = lastSessionResults || {
    overallAccuracy: 75,
    totalQuestions: 10,
    correctCount: 7,
    weakPhonemes: ['/r/', '/s/'],
    strongPhonemes: ['/m/', '/p/', '/k/'],
    xpEarned: 45,
    language: 'kannada',
    attempts: [],
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Child's Progress</h1>
        {lastSessionResults && (
          <Badge variant="outline" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            Latest Session
          </Badge>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{displayResults.overallAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Overall Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-success">
              {displayResults.correctCount}/{displayResults.totalQuestions}
            </div>
            <p className="text-xs text-muted-foreground">Correct Answers</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Accuracy</span>
                <span className="font-bold">{displayResults.overallAccuracy}%</span>
              </div>
              <Progress value={displayResults.overallAccuracy} className="h-3" />
            </div>
            <p className="text-xs text-muted-foreground">
              {displayResults.overallAccuracy >= 80 
                ? "Excellent progress! Keep up the great work! 🌟"
                : displayResults.overallAccuracy >= 60
                ? "Good progress! A little more practice will help! 💪"
                : "Keep practicing! Every attempt makes you stronger! 🎯"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sound Performance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sound Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayResults.strongPhonemes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Sounds Mastered</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayResults.strongPhonemes.map((phoneme) => (
                  <Badge key={phoneme} className="bg-success/10 text-success border-success/20">
                    {phoneme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {displayResults.weakPhonemes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Sounds to Practice</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {displayResults.weakPhonemes.map((phoneme) => (
                  <Badge key={phoneme} className="bg-warning/10 text-warning border-warning/20">
                    {phoneme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Attempts (if available) */}
      {lastSessionResults && lastSessionResults.attempts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-auto">
              {lastSessionResults.attempts.slice(0, 5).map((attempt, idx) => (
                <div 
                  key={attempt.id} 
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    attempt.isCorrect ? 'bg-success/10' : 'bg-warning/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm">{attempt.word}</span>
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
      )}

      {/* AI Report */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingReport ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Generating report...</span>
            </div>
          ) : aiReport ? (
            <div className="text-sm text-foreground whitespace-pre-wrap">
              {aiReport}
            </div>
          ) : (
            <div className="text-center py-4">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-3">
                Complete an assessment to see the detailed report
              </p>
              {!lastSessionResults && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchAIReport(displayResults as any)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  View Sample Report
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
