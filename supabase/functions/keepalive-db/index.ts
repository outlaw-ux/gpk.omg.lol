import { createClient } from 'npm:@supabase/supabase-js@2';

const requireEnv = (name: string) => {
  const value = Deno.env.get(name)?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
};

const supabaseAdmin = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'));
const keepaliveToken = requireEnv('KEEPALIVE_TOKEN');

const jsonResponse = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });

const getBearerToken = (authorizationHeader: string | null) => {
  if (!authorizationHeader) {
    return '';
  }

  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? '';
};

Deno.serve(async (req) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const providedToken =
    req.headers.get('x-keepalive-token')?.trim() || getBearerToken(req.headers.get('authorization'));

  if (!providedToken || providedToken !== keepaliveToken) {
    return jsonResponse(401, { error: 'Unauthorized.' });
  }

  const { error } = await supabaseAdmin.from('card_requests').select('id').limit(1);

  if (error) {
    console.error('keepalive-db query failed', error);
    return jsonResponse(500, { error: 'Database ping failed.' });
  }

  return jsonResponse(200, {
    message: 'Database ping succeeded.',
    touchedAt: new Date().toISOString()
  });
});
