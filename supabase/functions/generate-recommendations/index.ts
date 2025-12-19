import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AttemptData {
  word: string;
  phoneme: string;
  accuracy: number;
  isCorrect: boolean;
  transcript: string;
}

interface AssessmentData {
  language: string;
  totalQuestions: number;
  correctCount: number;
  overallAccuracy: number;
  attempts: AttemptData[];
  weakPhonemes: string[];
  strongPhonemes: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { assessmentData, type } = await req.json() as { 
      assessmentData: AssessmentData; 
      type: 'exercises' | 'recommendations' | 'report';
    };

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'exercises') {
      systemPrompt = `You are a speech-language pathologist AI assistant. Generate corrective exercises for speech therapy based on assessment results. 
      Be specific, practical, and child-friendly. Format exercises as numbered steps.
      Focus on the weak phonemes identified and provide 3-5 exercises.`;
      
      userPrompt = `Based on this assessment in ${assessmentData.language}:
- Overall accuracy: ${assessmentData.overallAccuracy}%
- Weak sounds: ${assessmentData.weakPhonemes.join(', ')}
- Strong sounds: ${assessmentData.strongPhonemes.join(', ')}

Generate 3-5 corrective exercises to help improve the weak sounds. Make them fun and engaging for children.`;
    } else if (type === 'recommendations') {
      systemPrompt = `You are a speech-language pathologist AI assistant. Generate assessment questions targeting specific phonemes.
      Each question should include a word, the target phoneme, and brief instructions.
      Return ONLY a valid JSON array with this structure:
      [{"word": "word in target language", "phoneme": "/phoneme/", "instructions": "brief instruction", "category": "word|sentence|minimal-pair"}]`;
      
      userPrompt = `Generate 10 assessment questions in ${assessmentData.language} targeting these weak phonemes: ${assessmentData.weakPhonemes.join(', ')}.
      
Current assessment results:
- Overall accuracy: ${assessmentData.overallAccuracy}%
- Most difficult words: ${assessmentData.attempts.filter(a => !a.isCorrect).slice(0, 3).map(a => a.word).join(', ')}

Return only the JSON array, no other text.`;
    } else if (type === 'report') {
      systemPrompt = `You are a speech-language pathologist AI assistant. Generate a comprehensive assessment report summary.
      Be professional but accessible for parents. Include strengths, areas for improvement, and recommendations.`;
      
      userPrompt = `Generate a brief assessment report for a child who completed a ${assessmentData.language} speech assessment:

Assessment Results:
- Total questions: ${assessmentData.totalQuestions}
- Correct answers: ${assessmentData.correctCount}
- Overall accuracy: ${assessmentData.overallAccuracy}%
- Strong sounds: ${assessmentData.strongPhonemes.join(', ')}
- Sounds needing practice: ${assessmentData.weakPhonemes.join(', ')}

Detailed attempts:
${assessmentData.attempts.map(a => `- "${a.word}" (${a.phoneme}): ${a.accuracy}% - Said: "${a.transcript}"`).join('\n')}

Provide a 2-3 paragraph summary including:
1. Overall performance assessment
2. Specific strengths observed
3. Areas for focused practice
4. Recommendations for parents/therapists`;
    }

    console.log('Generating', type, 'for language:', assessmentData.language);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('AI response received successfully');

    // For recommendations, parse JSON
    if (type === 'recommendations') {
      try {
        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = content;
        if (content.includes('```')) {
          const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (match) jsonStr = match[1];
        }
        const recommendations = JSON.parse(jsonStr.trim());
        return new Response(JSON.stringify({ recommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Failed to parse recommendations JSON:', parseError);
        return new Response(JSON.stringify({ recommendations: [], raw: content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-recommendations:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
