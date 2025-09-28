// supabase/functions/gas-checker/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function runGasChecker() {
  // example logic — replace with your own
  const { data: sensors, error } = await supabase.from('gas_readings').select('*');
  if (error) throw error;

  const results = sensors.map((row: any) => {
    // simplistic: if reading > threshold, warn
    const threshold = row.threshold ?? 100;  
    return {
      id: row.id,
      status: row.value > threshold ? 'HIGH' : 'OK',
      value: row.value,
    };
  });

  // write results to table
  for (const r of results) {
    const { error: e } = await supabase.from('gas_status').upsert({
      reading_id: r.id,
      status: r.status,
      value: r.value,
      updated_at: new Date().toISOString()
    });
    if (e) console.error('GasChecker upsert error:', e);
  }

  return results;
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Run the gas checker logic
    const results = await runGasChecker();
    
    return new Response(JSON.stringify({ 
      success: true, 
      results,
      message: `Gas checker completed. Processed ${results.length} readings.`
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      status: 200,
    });
  } catch (error) {
    console.error('Gas checker error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      },
      status: 500,
    });
  }
});