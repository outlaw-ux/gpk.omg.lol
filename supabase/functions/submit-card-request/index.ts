import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

type RequestPayload = {
  budgetNotes?: string;
  cardName?: string;
  cardNumber?: string;
  collectorName?: string;
  company?: string;
  conditionPreference?: string;
  email?: string;
  requestDetails?: string;
  requestType?: string;
  setName?: string;
  sourcePage?: string;
  turnstileToken?: string;
  variation?: string;
  whatnotHandle?: string;
};

const requestTypes = new Set([
  'single-card',
  'sketch-card',
  'oddball-collectible',
  'want-list',
  'set-help'
]);

const conditionPreferences = new Set([
  '',
  'any-displayable',
  'clean-raw',
  'high-end',
  'sealed-preferred'
]);
const sourcePagePattern =
  /^https:\/\/curatorsguild\.com(\/.*)?$|^http:\/\/localhost(?::[0-9]+)?(\/.*)?$|^http:\/\/127\.0\.0\.1(?::[0-9]+)?(\/.*)?$/;

const allowedOrigins = (
  Deno.env.get('ALLOWED_ORIGINS') ?? 'https://curatorsguild.com'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const jsonResponse = (status: number, body: Record<string, string>, origin?: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: getCorsHeaders(origin)
  });

const trimOrNull = (value?: string) => {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : null;
};

const readRemoteIp = (req: Request) =>
  req.headers
    .get('x-forwarded-for')
    ?.split(',')
    .map((part) => part.trim())
    .find(Boolean) ?? '';

const isWithinLength = (value: string | undefined, maxLength: number) =>
  !value || value.trim().length <= maxLength;

const enforceRateLimit = async (clientKey: string) => {
  const { data, error } = await supabaseAdmin.rpc('enforce_card_request_rate_limit', {
    req_client_key: clientKey
  });

  if (error) {
    throw new Error('Rate limit check failed.');
  }

  const outcome = Array.isArray(data) ? data[0] : data;

  if (!outcome?.allowed) {
    const retryAfterSeconds = Number(outcome?.retry_after_seconds ?? 0);
    const retryAfterMinutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
    return {
      allowed: false,
      message: `Too many requests from this connection. Try again in about ${retryAfterMinutes} minute${retryAfterMinutes === 1 ? '' : 's'}.`
    };
  }

  return { allowed: true, message: '' };
};

const validateOrigin = (req: Request) => {
  const origin = req.headers.get('origin');

  if (!origin) {
    return false;
  }

  return allowedOrigins.includes(origin);
};

const verifyTurnstileToken = async (token: string, remoteIp: string) => {
  const secret = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET_KEY') ?? '';

  if (!secret) {
    throw new Error('CLOUDFLARE_TURNSTILE_SECRET_KEY is not configured.');
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Verification service is unavailable.');
  }

  const data = (await response.json()) as {
    'error-codes'?: string[];
    action?: string;
    hostname?: string;
    success?: boolean;
  };

  const hostname = data.hostname ?? '';
  const hostnameAllowed =
    hostname === 'curatorsguild.com' || hostname === 'localhost' || hostname === '127.0.0.1';

  if (!data.success || data.action !== 'submit_card_request' || !hostnameAllowed) {
    return false;
  }

  return true;
};

Deno.serve(async (req) => {
  const requestOrigin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    if (!validateOrigin(req)) {
      return new Response('forbidden', { status: 403, headers: getCorsHeaders(null) });
    }

    return new Response('ok', { headers: getCorsHeaders(requestOrigin) });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' }, requestOrigin);
  }

  if (!validateOrigin(req)) {
    return jsonResponse(403, { error: 'Origin not allowed.' }, requestOrigin);
  }

  let payload: RequestPayload;

  try {
    payload = (await req.json()) as RequestPayload;
  } catch {
    return jsonResponse(400, { error: 'Invalid request body.' }, requestOrigin);
  }

  if (trimOrNull(payload.company)) {
    return jsonResponse(200, { message: 'Ignored.' }, requestOrigin);
  }

  const collectorName = payload.collectorName?.trim() ?? '';
  const email = payload.email?.trim().toLowerCase() ?? '';
  const requestType = payload.requestType?.trim() ?? '';
  const requestDetails = payload.requestDetails?.trim() ?? '';
  const conditionPreference = payload.conditionPreference?.trim() ?? '';
  const turnstileToken = payload.turnstileToken?.trim() ?? '';
  const sourcePage = payload.sourcePage?.trim() || 'https://curatorsguild.com';
  const clientKey = readRemoteIp(req);

  if (collectorName.length < 2 || collectorName.length > 120) {
    return jsonResponse(
      400,
      { error: 'Collector name must be between 2 and 120 characters.' },
      requestOrigin
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(400, { error: 'Enter a valid email address.' }, requestOrigin);
  }

  if (!requestTypes.has(requestType)) {
    return jsonResponse(400, { error: 'Choose a valid request type.' }, requestOrigin);
  }

  if (!conditionPreferences.has(conditionPreference)) {
    return jsonResponse(400, { error: 'Choose a valid condition target.' }, requestOrigin);
  }

  if (!isWithinLength(payload.whatnotHandle, 120)) {
    return jsonResponse(400, { error: 'Whatnot handle is too long.' }, requestOrigin);
  }

  if (!isWithinLength(payload.setName, 160)) {
    return jsonResponse(400, { error: 'Set name is too long.' }, requestOrigin);
  }

  if (!isWithinLength(payload.cardNumber, 40)) {
    return jsonResponse(400, { error: 'Card number is too long.' }, requestOrigin);
  }

  if (!isWithinLength(payload.cardName, 160)) {
    return jsonResponse(400, { error: 'Card or collectible name is too long.' }, requestOrigin);
  }

  if (!isWithinLength(payload.variation, 240)) {
    return jsonResponse(400, { error: 'Variation details are too long.' }, requestOrigin);
  }

  if (!isWithinLength(payload.budgetNotes, 240)) {
    return jsonResponse(400, { error: 'Budget or trade notes are too long.' }, requestOrigin);
  }

  if (requestDetails.length < 12 || requestDetails.length > 3000) {
    return jsonResponse(400, {
      error: 'Request details must be between 12 and 3000 characters.'
    }, requestOrigin);
  }

  if (!sourcePagePattern.test(sourcePage)) {
    return jsonResponse(400, { error: 'Source page is not allowed.' }, requestOrigin);
  }

  if (!turnstileToken) {
    return jsonResponse(400, { error: 'Please complete the verification check.' }, requestOrigin);
  }

  try {
    const rateLimit = await enforceRateLimit(clientKey);

    if (!rateLimit.allowed) {
      return jsonResponse(429, { error: rateLimit.message }, requestOrigin);
    }

    const verified = await verifyTurnstileToken(turnstileToken, readRemoteIp(req));

    if (!verified) {
      return jsonResponse(400, { error: 'Verification failed. Please try again.' }, requestOrigin);
    }

    const { error } = await supabaseAdmin.from('card_requests').insert({
      budget_notes: trimOrNull(payload.budgetNotes),
      card_name: trimOrNull(payload.cardName),
      card_number: trimOrNull(payload.cardNumber),
      collector_name: collectorName,
      condition_preference: conditionPreference || null,
      email,
      request_details: requestDetails,
      request_type: requestType,
      set_name: trimOrNull(payload.setName),
      source_page: sourcePage,
      variation: trimOrNull(payload.variation),
      whatnot_handle: trimOrNull(payload.whatnotHandle)
    });

    if (error) {
      console.error('submit-card-request insert failed', error);
      return jsonResponse(500, { error: 'The request did not stick. Please try again.' }, requestOrigin);
    }

    return jsonResponse(200, { message: 'Request received.' }, requestOrigin);
  } catch (error) {
    console.error('submit-card-request failed', error);
    return jsonResponse(500, {
      error:
        error instanceof Error ? error.message : 'The request could not be processed right now.'
    }, requestOrigin);
  }
});
