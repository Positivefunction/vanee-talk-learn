import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  FileText, 
  Download,
  BookOpen,
  Lightbulb,
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useTherapistStore, type SessionResults } from '@/stores';
import { supabase } from '@/integrations/supabase/client';
import type { SupportedLanguage } from '@/types';

interface AIRecommendation {
  word: string;
  phoneme: string;
  instructions: string;
  category: string;
}

export default function Reports() {
  const { patientResults } = useTherapistStore();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('kannada');
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [aiReport, setAiReport] = useState<string>('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Use latest session results or simulated data
  const latestResult = patientResults[patientResults.length - 1];
  
  const performanceData = latestResult ? {
    overallAccuracy: latestResult.overallAccuracy,
    totalSessions: patientResults.length,
    totalAttempts: patientResults.reduce((sum, r) => sum + r.totalQuestions, 0),
    weakPhonemes: latestResult.weakPhonemes,
    strongPhonemes: latestResult.strongPhonemes,
    phonemeBreakdown: calculatePhonemeBreakdown(patientResults),
  } : {
    overallAccuracy: 72,
    totalSessions: 15,
    totalAttempts: 150,
    weakPhonemes: ['/r/', '/s/', '/k/'],
    strongPhonemes: ['/m/', '/p/', '/b/'],
    phonemeBreakdown: [
      { phoneme: '/m/', accuracy: 95, attempts: 20 },
      { phoneme: '/p/', accuracy: 88, attempts: 18 },
      { phoneme: '/b/', accuracy: 85, attempts: 22 },
      { phoneme: '/k/', accuracy: 65, attempts: 25 },
      { phoneme: '/s/', accuracy: 58, attempts: 30 },
      { phoneme: '/r/', accuracy: 45, attempts: 35 },
    ],
  };

  const languages: { id: SupportedLanguage; name: string }[] = [
    { id: 'kannada', name: 'ಕನ್ನಡ' },
    { id: 'hindi', name: 'हिंदी' },
    { id: 'tamil', name: 'தமிழ்' },
    { id: 'telugu', name: 'తెలుగు' },
    { id: 'english', name: 'English' },
  ];

  const fetchAIRecommendations = async () => {
    setIsLoadingRecommendations(true);
    try {
      const assessmentData = latestResult ? {
        language: selectedLanguage,
        totalQuestions: latestResult.totalQuestions,
        correctCount: latestResult.correctCount,
        overallAccuracy: latestResult.overallAccuracy,
        attempts: latestResult.attempts.map(a => ({
          word: a.word,
          phoneme: a.phoneme,
          accuracy: a.accuracy,
          isCorrect: a.isCorrect,
          transcript: a.transcript,
        })),
        weakPhonemes: performanceData.weakPhonemes,
        strongPhonemes: performanceData.strongPhonemes,
      } : {
        language: selectedLanguage,
        totalQuestions: 20,
        correctCount: 14,
        overallAccuracy: performanceData.overallAccuracy,
        attempts: [],
        weakPhonemes: performanceData.weakPhonemes,
        strongPhonemes: performanceData.strongPhonemes,
      };

      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { assessmentData, type: 'recommendations' },
      });

      if (error) throw error;
      if (data?.recommendations) {
        setAiRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const fetchAIReport = async () => {
    setIsLoadingReport(true);
    try {
      const assessmentData = latestResult ? {
        language: latestResult.language,
        totalQuestions: latestResult.totalQuestions,
        correctCount: latestResult.correctCount,
        overallAccuracy: latestResult.overallAccuracy,
        attempts: latestResult.attempts.map(a => ({
          word: a.word,
          phoneme: a.phoneme,
          accuracy: a.accuracy,
          isCorrect: a.isCorrect,
          transcript: a.transcript,
        })),
        weakPhonemes: latestResult.weakPhonemes,
        strongPhonemes: latestResult.strongPhonemes,
      } : {
        language: selectedLanguage,
        totalQuestions: 20,
        correctCount: 14,
        overallAccuracy: performanceData.overallAccuracy,
        attempts: [],
        weakPhonemes: performanceData.weakPhonemes,
        strongPhonemes: performanceData.strongPhonemes,
      };

      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { assessmentData, type: 'report' },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Reports & Analytics</h1>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="report">AI Report</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overall Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{performanceData.overallAccuracy}%</span>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">{performanceData.totalSessions}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">{performanceData.totalAttempts}</span>
              </CardContent>
            </Card>
          </div>

          {/* Phoneme Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Phoneme Accuracy Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.phonemeBreakdown.map((item) => (
                  <div key={item.phoneme} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium">{item.phoneme}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.accuracy}% ({item.attempts} attempts)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.accuracy >= 80
                            ? 'bg-success'
                            : item.accuracy >= 60
                            ? 'bg-warning'
                            : 'bg-destructive'
                        }`}
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weak Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                Areas Needing Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {performanceData.weakPhonemes.map((phoneme) => (
                  <Badge key={phoneme} variant="destructive" className="text-sm">
                    {phoneme}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Based on the assessment results, focus on these sounds in the next sessions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI-Generated Questions for Next Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Select Language
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {languages.map((lang) => (
                    <Button
                      key={lang.id}
                      variant={selectedLanguage === lang.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLanguage(lang.id)}
                    >
                      {lang.name}
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={fetchAIRecommendations}
                  disabled={isLoadingRecommendations}
                  className="w-full sm:w-auto"
                >
                  {isLoadingRecommendations ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate 10 Questions for Weak Areas
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Targeting weak phonemes: {performanceData.weakPhonemes.join(', ')}
              </p>

              {aiRecommendations.length > 0 ? (
                <div className="space-y-4">
                  {aiRecommendations.map((question, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                            {index + 1}
                          </span>
                          <Badge variant="outline">{question.category}</Badge>
                        </div>
                        <span className="font-mono text-sm text-muted-foreground">
                          {question.phoneme}
                        </span>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-2xl font-medium text-foreground">
                          {question.word}
                        </p>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{question.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Click "Generate" to get AI-powered question recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  AI Assessment Report
                </div>
                <Button 
                  onClick={fetchAIReport}
                  disabled={isLoadingReport}
                  size="sm"
                >
                  {isLoadingReport ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReport ? (
                <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating comprehensive report...</span>
                </div>
              ) : aiReport ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground">{aiReport}</div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    Generate a comprehensive AI report based on assessment data
                  </p>
                  <Button onClick={fetchAIReport}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to calculate phoneme breakdown from multiple sessions
function calculatePhonemeBreakdown(results: SessionResults[]) {
  const phonemeStats: Record<string, { total: number; correct: number; attempts: number }> = {};
  
  results.forEach(result => {
    result.attempts.forEach(attempt => {
      if (!phonemeStats[attempt.phoneme]) {
        phonemeStats[attempt.phoneme] = { total: 0, correct: 0, attempts: 0 };
      }
      phonemeStats[attempt.phoneme].total += attempt.accuracy;
      phonemeStats[attempt.phoneme].attempts++;
      if (attempt.isCorrect) phonemeStats[attempt.phoneme].correct++;
    });
  });
  
  return Object.entries(phonemeStats)
    .map(([phoneme, stats]) => ({
      phoneme,
      accuracy: Math.round(stats.total / stats.attempts),
      attempts: stats.attempts,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
}
