import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, FileText, Play, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Material {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url: string | null;
  video_url: string | null;
  created_at: string;
}

interface TeletherapySession {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  video_url: string | null;
  meeting_link: string | null;
  status: string;
}

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sessions, setSessions] = useState<TeletherapySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch materials
      const { data: materialsData } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      setMaterials(materialsData || []);

      // Fetch teletherapy sessions with recordings
      const { data: sessionsData } = await supabase
        .from('teletherapy_sessions')
        .select('*')
        .not('video_url', 'is', null)
        .order('scheduled_at', { ascending: false });

      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-2xl font-display text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold">📚 My Classes</h1>
        <p className="text-muted-foreground">Videos and materials from your therapist</p>
      </div>

      {/* Recorded Sessions */}
      {sessions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Session Recordings
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative flex items-center justify-center">
                  {session.video_url ? (
                    <a 
                      href={session.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                    </a>
                  ) : (
                    <Video className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(session.scheduled_at), 'PPP')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{session.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Learning Materials */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-secondary" />
          Learning Materials
        </h2>
        
        {materials.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No materials yet</h3>
              <p className="text-muted-foreground">Your therapist will add materials here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      material.type === 'video' ? 'bg-primary/10' :
                      material.type === 'exercise' ? 'bg-success/10' :
                      'bg-secondary/10'
                    }`}>
                      {material.type === 'video' ? (
                        <Video className="w-5 h-5 text-primary" />
                      ) : material.type === 'exercise' ? (
                        <BookOpen className="w-5 h-5 text-success" />
                      ) : (
                        <FileText className="w-5 h-5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <CardDescription className="capitalize">{material.type}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{material.description}</p>
                  <div className="flex gap-2">
                    {material.video_url && (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={material.video_url} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4 mr-1" />
                          Watch
                        </a>
                      </Button>
                    )}
                    {material.file_url && (
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-4 h-4 mr-1" />
                          Open
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
