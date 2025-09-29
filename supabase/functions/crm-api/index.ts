import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method

    let result: any

    // Route handling for CRM API endpoints
    if (method === 'GET' && path.endsWith('/companies')) {
      // Get all companies
      const { data, error } = await supabaseClient
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      result = { companies: data }

    } else if (method === 'GET' && path.endsWith('/contacts')) {
      // Get contacts with company relationships
      const { data, error } = await supabaseClient
        .from('contacts')
        .select(`
          *,
          company:companies (
            id,
            name,
            industry,
            website
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      result = { contacts: data }

    } else if (method === 'GET' && path.endsWith('/opportunities')) {
      // Get opportunities with contact/company joins
      const { data, error } = await supabaseClient
        .from('opportunities')
        .select(`
          *,
          contact:contacts (
            id,
            first_name,
            last_name,
            email,
            company:companies (
              id,
              name,
              industry
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      result = { opportunities: data }

    } else if (method === 'GET' && path.endsWith('/search')) {
      // Search contacts by name/email
      const searchTerm = url.searchParams.get('q')
      
      if (!searchTerm) {
        return new Response(
          JSON.stringify({ error: 'Search term (q) is required' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        )
      }

      const { data, error } = await supabaseClient
        .from('contacts')
        .select(`
          *,
          company:companies (
            id,
            name,
            industry,
            website
          )
        `)
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      result = { 
        searchTerm,
        contacts: data,
        count: data?.length || 0
      }

    } else if (method === 'GET' && path.endsWith('/dashboard')) {
      // Get dashboard summary counts
      const [companiesRes, contactsRes, opportunitiesRes] = await Promise.all([
        supabaseClient.from('companies').select('id', { count: 'exact' }),
        supabaseClient.from('contacts').select('id', { count: 'exact' }),
        supabaseClient.from('opportunities').select('id, status', { count: 'exact' })
      ])

      if (companiesRes.error) throw companiesRes.error
      if (contactsRes.error) throw contactsRes.error
      if (opportunitiesRes.error) throw opportunitiesRes.error

      // Count opportunities by status
      const opportunityStatusCounts = opportunitiesRes.data?.reduce((acc: any, opp: any) => {
        acc[opp.status] = (acc[opp.status] || 0) + 1
        return acc
      }, {}) || {}

      result = {
        summary: {
          totalCompanies: companiesRes.count || 0,
          totalContacts: contactsRes.count || 0,
          totalOpportunities: opportunitiesRes.count || 0,
          opportunitiesByStatus: opportunityStatusCounts
        }
      }

    } else {
      // Route not found
      return new Response(
        JSON.stringify({ error: 'Route not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    // Return successful response
    return new Response(
      JSON.stringify({ 
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('CRM API Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})