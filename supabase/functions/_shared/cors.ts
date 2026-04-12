export const getCorsHeaders = (origin?: string | null) => ({
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': origin ?? 'https://curatorsguild.com',
  'Content-Type': 'application/json',
  Vary: 'Origin'
});
