import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Video, Calendar, Upload, Link, Users, Clock, Plus, FileText, Play } from 'lucide-react';
import { format } from 'date-fns';

interface TeletherapySession {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration_minutes: number;
  video_url: string | null;
  meeting_link: string | null;
  status: string;
  child_id: string;
}

interface Material {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url: string | null;
  video_url: string | null;
  created_at: string;
}

export default function Teletherapy() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<TeletherapySession[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showNewMaterial, setShowNewMaterial] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: 30,
    meeting_link: '',
    video_url: '',
  });
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    type: 'video',
    video_url: '',
    file_url: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch teletherapy sessions
      const { data: sessionsData } = await supabase
        .from('teletherapy_sessions')
        .select('*')
        .eq('therapist_id', user.id)
        .order('scheduled_at', { ascending: false });

      setSessions(sessionsData || []);

      // Fetch materials
      const { data: materialsData } = await supabase
        .from('materials')
        .select('*')
        .eq('therapist_id', user.id)
        .order('created_at', { ascending: false });

      setMaterials(materialsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, create without child_id - would need a child selector
      const { error } = await supabase.from('teletherapy_sessions').insert({
        therapist_id: user.id,
        child_id: null as any, // Would need child selection UI
        title: newSession.title,
        description: newSession.description,
        scheduled_at: newSession.scheduled_at,
        duration_minutes: newSession.duration_minutes,
        meeting_link: newSession.meeting_link || null,
        video_url: newSession.video_url || null,
        status: 'scheduled',
      });

      if (error) throw error;

      toast({ title: 'Session created!', description: 'Teletherapy session has been scheduled.' });
      setShowNewSession(false);
      setNewSession({ title: '', description: '', scheduled_at: '', duration_minutes: 30, meeting_link: '', video_url: '' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateMaterial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('materials').insert({
        therapist_id: user.id,
        title: newMaterial.title,
        description: newMaterial.description,
        type: newMaterial.type,
        video_url: newMaterial.video_url || null,
        file_url: newMaterial.file_url || null,
        is_public: false,
      });

      if (error) throw error;

      toast({ title: 'Material added!', description: 'Learning material has been uploaded.' });
      setShowNewMaterial(false);
      setNewMaterial({ title: '', description: '', type: 'video', video_url: '', file_url: '' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Teletherapy</h1>
          <p className="text-muted-foreground">Schedule sessions and manage learning materials</p>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Materials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showNewSession} onOpenChange={setShowNewSession}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Teletherapy Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newSession.title}
                      onChange={(e) => setNewSession(p => ({ ...p, title: e.target.value }))}
                      placeholder="Session title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newSession.description}
                      onChange={(e) => setNewSession(p => ({ ...p, description: e.target.value }))}
                      placeholder="What will be covered..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={newSession.scheduled_at}
                        onChange={(e) => setNewSession(p => ({ ...p, scheduled_at: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newSession.duration_minutes}
                        onChange={(e) => setNewSession(p => ({ ...p, duration_minutes: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Meeting Link (Zoom/Meet)</Label>
                    <Input
                      value={newSession.meeting_link}
                      onChange={(e) => setNewSession(p => ({ ...p, meeting_link: e.target.value }))}
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                  <div>
                    <Label>Recording URL (optional)</Label>
                    <Input
                      value={newSession.video_url}
                      onChange={(e) => setNewSession(p => ({ ...p, video_url: e.target.value }))}
                      placeholder="Video URL after session"
                    />
                  </div>
                  <Button onClick={handleCreateSession} className="w-full">
                    Schedule Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No sessions scheduled</h3>
                <p className="text-muted-foreground">Schedule your first teletherapy session</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription>{session.description}</CardDescription>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                        session.status === 'completed' ? 'bg-success/10 text-success' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(session.scheduled_at), 'PPP p')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {session.duration_minutes} minutes
                    </div>
                    <div className="flex gap-2">
                      {session.meeting_link && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                            <Link className="w-4 h-4 mr-1" />
                            Join
                          </a>
                        </Button>
                      )}
                      {session.video_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={session.video_url} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-1" />
                            Recording
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={showNewMaterial} onOpenChange={setShowNewMaterial}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Learning Material</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial(p => ({ ...p, title: e.target.value }))}
                      placeholder="Material title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial(p => ({ ...p, description: e.target.value }))}
                      placeholder="What this material covers..."
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial(p => ({ ...p, type: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                      <option value="exercise">Exercise</option>
                    </select>
                  </div>
                  <div>
                    <Label>Video URL (YouTube, Vimeo, etc.)</Label>
                    <Input
                      value={newMaterial.video_url}
                      onChange={(e) => setNewMaterial(p => ({ ...p, video_url: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <Label>Document URL</Label>
                    <Input
                      value={newMaterial.file_url}
                      onChange={(e) => setNewMaterial(p => ({ ...p, file_url: e.target.value }))}
                      placeholder="Link to PDF or document"
                    />
                  </div>
                  <Button onClick={handleCreateMaterial} className="w-full">
                    Add Material
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading materials...</div>
          ) : materials.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No materials yet</h3>
                <p className="text-muted-foreground">Upload videos and documents for your students</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription>{material.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      {material.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      {material.type}
                    </div>
                    <div className="flex gap-2">
                      {material.video_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={material.video_url} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-1" />
                            Watch
                          </a>
                        </Button>
                      )}
                      {material.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
