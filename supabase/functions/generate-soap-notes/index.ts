import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SessionData {
  childName: string;
  language: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  weakPhonemes: string[];
  strongPhonemes: string[];
  attempts: Array<{
    word: string;
    phoneme: string;
    accuracy: number;
    isCorrect: boolean;
    transcript: string;
  }>;
  sessionDuration?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionData } = await req.json() as { sessionData: SessionData };
    
    if (!sessionData) {
      throw new Error('Session data is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `Generate a professional SOAP note for a speech therapy session with the following data:

Child Name: ${sessionData.childName}
Language: ${sessionData.language}
Session Duration: ${sessionData.sessionDuration || 'Not recorded'} minutes
Total Questions: ${sessionData.totalQuestions}
Correct Answers: ${sessionData.correctCount}
Overall Accuracy: ${sessionData.accuracy}%
Weak Phonemes: ${sessionData.weakPhonemes.join(', ') || 'None identified'}
Strong Phonemes: ${sessionData.strongPhonemes.join(', ') || 'None identified'}

Detailed Attempts:
${sessionData.attempts.map((a, i) => 
  `${i + 1}. Word: "${a.word}" (${a.phoneme}) - ${a.isCorrect ? 'Correct' : 'Incorrect'} (${a.accuracy}%) - Child said: "${a.transcript}"`
).join('\n')}

Please generate a SOAP note with the following sections:
1. Subjective (S): Patient's reported symptoms, concerns, or goals
2. Objective (O): Observable, measurable findings from the session
3. Assessment (A): Clinical interpretation of the findings
4. Plan (P): Recommended next steps and treatment goals

Format the response as JSON with keys: subjective, objective, assessment, plan`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a professional speech-language pathologist assistant. Generate detailed, clinically appropriate SOAP notes based on session data. Always respond with valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'API credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Try to parse JSON from the response
    let soapNote;
    try {
      // Handle markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      soapNote = JSON.parse(jsonMatch[1] || content);
    } catch {
      // If JSON parsing fails, create structured response from text
      soapNote = {
        subjective: content.includes('Subjective') ? content.split('Subjective')[1]?.split(/Objective|Assessment|Plan/)[0]?.trim() : content,
        objective: '',
        assessment: '',
        plan: ''
      };
    }

    return new Response(JSON.stringify({ soapNote }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error generating SOAP note:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
