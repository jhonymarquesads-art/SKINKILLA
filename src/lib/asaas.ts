const ASAAS_PRODUCTION_URL = 'https://api.asaas.com/v3';
const ASAAS_SANDBOX_URL = 'https://api-sandbox.asaas.com/v3';

export const PAID_PAYMENT_STATUSES = new Set(['RECEIVED', 'CONFIRMED']);

function getAsaasConfig() {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error('ASAAS_API_KEY nao configurada.');

  const baseUrl = process.env.ASAAS_API_URL
    ?? (apiKey.startsWith('$aact_hmlg_') ? ASAAS_SANDBOX_URL : ASAAS_PRODUCTION_URL);
  return { apiKey, baseUrl };
}

export async function asaasRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { apiKey, baseUrl } = getAsaasConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'SkinKilla/1.0',
      access_token: apiKey,
      ...init?.headers,
    },
    cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.description ?? 'Nao foi possivel comunicar com o Asaas.');
  }
  return data as T;
}

export type AsaasPayment = { id: string; status: string };
