const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? '';
export const hasRequestApiConfig = Boolean(supabaseUrl && supabaseAnonKey);
export const hasTurnstileConfig = Boolean(turnstileSiteKey);
export const hasRequestFormConfig = hasRequestApiConfig && hasTurnstileConfig;

const requestApiUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/submit-card-request` : '';

export type CardRequestPayload = {
  budgetNotes: string;
  cardName: string;
  cardNumber: string;
  collectorName: string;
  company: string;
  conditionPreference: string;
  email: string;
  requestDetails: string;
  requestType: string;
  setName: string;
  sourcePage: string;
  turnstileToken: string;
  variation: string;
  whatnotHandle: string;
};

export const getRequestFormConfigMessage = () => {
  if (!hasRequestApiConfig && !hasTurnstileConfig) {
    return 'Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_TURNSTILE_SITE_KEY to enable protected submissions.';
  }

  if (!hasRequestApiConfig) {
    return 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable the request API.';
  }

  if (!hasTurnstileConfig) {
    return 'Add VITE_TURNSTILE_SITE_KEY to enable human verification.';
  }

  return '';
};

export const submitCardRequest = async (payload: CardRequestPayload) => {
  if (!requestApiUrl || !supabaseAnonKey) {
    throw new Error(getRequestFormConfigMessage() || 'The request API is not configured.');
  }

  const response = await fetch(requestApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    return;
  }

  let message = 'The request did not stick. Please try again.';

  try {
    const data = (await response.json()) as { error?: string };
    if (data.error) {
      message = data.error;
    }
  } catch {
    // Fall back to the default message for non-JSON responses.
  }

  throw new Error(message);
};
