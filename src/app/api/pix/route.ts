import { NextResponse } from 'next/server';
import { asaasRequest, type AsaasPayment, PAID_PAYMENT_STATUSES } from '@/lib/asaas';

export const runtime = 'nodejs';

type AsaasCustomer = { id: string };
type AsaasPixQrCode = { encodedImage: string; payload: string; expirationDate: string };

function todayInBrazil() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());
}

export async function POST(request: Request) {
  try {
    const { name, email, cpfCnpj } = await request.json();
    if (typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json({ error: 'Informe seu nome completo.' }, { status: 400 });
    }
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Informe um e-mail valido.' }, { status: 400 });
    }
    const customer = await asaasRequest<AsaasCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(), email: email.trim(),
        ...(typeof cpfCnpj === 'string' && cpfCnpj.replace(/\D/g, '') ? { cpfCnpj: cpfCnpj.replace(/\D/g, '') } : {}),
      }),
    });
    const payment = await asaasRequest<AsaasPayment>('/payments', {
      method: 'POST',
      body: JSON.stringify({
        customer: customer.id, billingType: 'PIX', value: 19.9, dueDate: todayInBrazil(),
        description: 'Analise facial SkinKilla',
      }),
    });
    const qrCode = await asaasRequest<AsaasPixQrCode>(`/payments/${payment.id}/pixQrCode`);
    return NextResponse.json({ id: payment.id, ...qrCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nao foi possivel gerar o Pix.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get('paymentId');
  if (!paymentId) return NextResponse.json({ error: 'paymentId e obrigatorio.' }, { status: 400 });
  try {
    const payment = await asaasRequest<AsaasPayment>(`/payments/${paymentId}`);
    const response = NextResponse.json({ status: payment.status });
    if (PAID_PAYMENT_STATUSES.has(payment.status)) {
      response.cookies.set('skinkilla_payment_id', payment.id, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 3600, path: '/',
      });
    }
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nao foi possivel consultar o pagamento.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
