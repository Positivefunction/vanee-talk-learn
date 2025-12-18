import { useState } from 'react';
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
  Lightbulb
} from 'lucide-react';
import { trainerSampleQuestions, getSuggestedQuestions } from '@/data/assessmentWords';
import type { SupportedLanguage } from '@/types';

export default function Reports() {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('kannada');
  
  // Simulated weak phonemes from assessment data
  const weakPhonemes = ['/r/', '/s/', '/k/'];
  const suggestedQuestions = getSuggestedQuestions(weakPhonemes, selectedLanguage, 5);

  // Simulated performance data
  const performanceData = {
    overallAccuracy: 72,
    totalSessions: 15,
    totalAttempts: 150,
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
    { id: 'kannada', name: 'Kannada' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'tamil', name: 'Tamil' },
    { id: 'telugu', name: 'Telugu' },
    { id: 'english', name: 'English' },
  ];

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
          <TabsTrigger value="questions">Sample Questions</TabsTrigger>
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
                {weakPhonemes.map((phoneme) => (
                  <Badge key={phoneme} variant="destructive" className="text-sm">
                    {phoneme}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Based on the assessment results, focus on retroflex sounds and sibilants in the next sessions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          {/* Language Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Sample Questions for Next Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Select Language
                </label>
                <div className="flex flex-wrap gap-2">
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
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Based on weak phonemes: {weakPhonemes.join(', ')}
              </p>

              <div className="space-y-4">
                {suggestedQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge 
                          variant={
                            question.difficulty === 'easy' 
                              ? 'default' 
                              : question.difficulty === 'medium' 
                              ? 'secondary' 
                              : 'destructive'
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                      <span className="font-mono text-sm text-muted-foreground">
                        {question.targetPhoneme}
                      </span>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-2xl font-medium text-foreground">
                        {question.prompt[selectedLanguage]}
                      </p>
                      {selectedLanguage !== 'english' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          ({question.prompt.english})
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{question.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
