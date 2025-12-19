-- Enable Row Level Security and create tables for Aurora Speech Therapy App

-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('child', 'therapist', 'parent');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roles" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create child_profiles table
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  avatar TEXT DEFAULT '🧒',
  age INTEGER,
  primary_language TEXT DEFAULT 'english',
  therapist_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  hearts INTEGER DEFAULT 5,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Children can view own profile" ON public.child_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Therapists can view assigned children" ON public.child_profiles
  FOR SELECT USING (auth.uid() = therapist_id);

CREATE POLICY "Parents can view own children" ON public.child_profiles
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Children can update own profile" ON public.child_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own child profile" ON public.child_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  target_phonemes TEXT[],
  difficulty TEXT DEFAULT 'easy',
  therapist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage own assignments" ON public.assignments
  FOR ALL USING (auth.uid() = therapist_id);

CREATE POLICY "Children can view assigned work" ON public.assignments
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Parents can view child assignments" ON public.assignments
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE parent_id = auth.uid())
  );

-- Create assignment_words table (words for each assignment)
CREATE TABLE public.assignment_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  phoneme TEXT NOT NULL,
  symbol TEXT,
  image_url TEXT,
  audio_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assignment_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assignment words inherit assignment policy" ON public.assignment_words
  FOR SELECT USING (
    assignment_id IN (SELECT id FROM public.assignments WHERE 
      therapist_id = auth.uid() OR 
      child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid() OR parent_id = auth.uid())
    )
  );

CREATE POLICY "Therapists can manage assignment words" ON public.assignment_words
  FOR ALL USING (
    assignment_id IN (SELECT id FROM public.assignments WHERE therapist_id = auth.uid())
  );

-- Create sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE SET NULL,
  language TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  total_questions INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  weak_phonemes TEXT[],
  strong_phonemes TEXT[],
  status TEXT DEFAULT 'in_progress'
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Children can view own sessions" ON public.sessions
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Children can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (
    child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Children can update own sessions" ON public.sessions
  FOR UPDATE USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Therapists can view assigned children sessions" ON public.sessions
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE therapist_id = auth.uid())
  );

CREATE POLICY "Parents can view child sessions" ON public.sessions
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE parent_id = auth.uid())
  );

-- Create attempts table
CREATE TABLE public.attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  phoneme TEXT NOT NULL,
  transcript TEXT,
  accuracy DECIMAL(5,2) DEFAULT 0,
  is_correct BOOLEAN DEFAULT false,
  audio_url TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attempts inherit session policy" ON public.attempts
  FOR ALL USING (
    session_id IN (
      SELECT id FROM public.sessions WHERE 
        child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid() OR therapist_id = auth.uid() OR parent_id = auth.uid())
    )
  );

-- Create streaks table
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Streaks follow child profile policy" ON public.streaks
  FOR ALL USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid() OR therapist_id = auth.uid() OR parent_id = auth.uid())
  );

-- Create teletherapy_sessions table
CREATE TABLE public.teletherapy_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  video_url TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.teletherapy_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage own teletherapy" ON public.teletherapy_sessions
  FOR ALL USING (auth.uid() = therapist_id);

CREATE POLICY "Children can view own teletherapy" ON public.teletherapy_sessions
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Parents can view child teletherapy" ON public.teletherapy_sessions
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE parent_id = auth.uid())
  );

-- Create materials table
CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'document',
  file_url TEXT,
  video_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage own materials" ON public.materials
  FOR ALL USING (auth.uid() = therapist_id);

CREATE POLICY "Children can view assigned materials" ON public.materials
  FOR SELECT USING (
    is_public = true OR child_id IN (SELECT id FROM public.child_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Parents can view child materials" ON public.materials
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE parent_id = auth.uid())
  );

-- Create soap_notes table
CREATE TABLE public.soap_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  teletherapy_id UUID REFERENCES public.teletherapy_sessions(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  generated_by_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage own SOAP notes" ON public.soap_notes
  FOR ALL USING (auth.uid() = therapist_id);

CREATE POLICY "Parents can view child SOAP notes" ON public.soap_notes
  FOR SELECT USING (
    child_id IN (SELECT id FROM public.child_profiles WHERE parent_id = auth.uid())
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_child_profiles_updated_at
  BEFORE UPDATE ON public.child_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teletherapy_sessions_updated_at
  BEFORE UPDATE ON public.teletherapy_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_soap_notes_updated_at
  BEFORE UPDATE ON public.soap_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();