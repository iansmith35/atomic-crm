import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: `You are the Recording Studio AI assistant. Help with:
          - Booking studio sessions
          - Managing client information  
          - Tracking session notes and recordings
          - Scheduling and availability
          Current action: ${action}`
        }, {
          role: 'user',
          content: JSON.stringify(data)
        }],
        max_tokens: 1000
      })
    })

    const aiResult = await openaiResponse.json()
    const aiResponse = aiResult.choices[0].message.content

    if (action === 'create_booking') {
      const { error } = await supabaseClient
        .from('studio_bookings')
        .insert(data.booking)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        action: action 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})