'use client';

import { FormEvent, useEffect, useState } from 'react';

interface PaymentModalProps {
  onSuccess: () => void;
}

type PixData = { id: string; payload: string; encodedImage: string };

export default function PaymentModal({ onSuccess }: PaymentModalProps) {
  const [payer, setPayer] = useState({ name: '', email: '', cpfCnpj: '' });
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pixData) return;
    const poll = async () => {
      try {
        const response = await fetch(`/api/pix?paymentId=${encodeURIComponent(pixData.id)}`, { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && ['RECEIVED', 'CONFIRMED'].includes(data.status)) onSuccess();
      } catch {
        // A proxima consulta tenta novamente sem interromper a tela de pagamento.
      }
    };
    void poll();
    const interval = window.setInterval(() => void poll(), 4000);
    return () => window.clearInterval(interval);
  }, [onSuccess, pixData]);

  const createPix = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payer),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Nao foi possivel gerar o Pix.');
      setPixData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao criar o pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const copyPayload = async () => {
    if (!pixData) return;
    await navigator.clipboard.writeText(pixData.payload);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md space-y-5 rounded-3xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl">
        <div className="space-y-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Pagamento seguro via Pix</p>
          <h2 className="pt-2 text-xl font-bold text-white">Desbloquear analise completa</h2>
        </div>
        {!pixData ? (
          <form onSubmit={createPix} className="space-y-3">
            <input required minLength={3} value={payer.name} onChange={(event) => setPayer({ ...payer, name: event.target.value })} placeholder="Nome completo" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
            <input required type="email" value={payer.email} onChange={(event) => setPayer({ ...payer, email: event.target.value })} placeholder="E-mail" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
            <input value={payer.cpfCnpj} onChange={(event) => setPayer({ ...payer, cpfCnpj: event.target.value })} placeholder="CPF ou CNPJ (opcional)" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm" />
            <button disabled={loading} className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 disabled:opacity-60">{loading ? 'Gerando Pix...' : 'Gerar Pix de R$ 19,90'}</button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-400">Pague o QR Code. A analise sera liberada automaticamente apos a confirmacao.</p>
            <div className="inline-block rounded-2xl bg-white p-3"><img src={`data:image/png;base64,${pixData.encodedImage}`} alt="QR Code Pix" className="h-48 w-48 object-contain" /></div>
            <button onClick={copyPayload} className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950">{copied ? 'Codigo Pix copiado' : 'Copiar codigo Pix'}</button>
            <button
              type="button"
              onClick={onSuccess}
              className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition mt-2"
            >
              🧪 Simular Pagamento Aprovado (Modo Teste)
            </button>
          </div>
        )}
        {error && <p className="text-center text-sm text-rose-400">{error}</p>}
      </div>
    </div>
  );
}