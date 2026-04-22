// Follow this setup guide to integrate the Deno runtime into your application:
// https://supabase.com/docs/guides/functions/connect-to-supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const { method, project, order_id, amount, api_key } = await req.json()

    console.log(`Creating Pakasir transaction: ${method} for ${project} (${order_id})`)

    const response = await fetch(`https://app.pakasir.com/api/transactioncreate/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project,
        order_id,
        amount,
        api_key,
      }),
    })

    const data = await response.json()
    console.log('Pakasir API Response:', data)

    return new Response(JSON.stringify(data), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      status: response.status,
    })
  } catch (error) {
    console.error('Edge Function Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
