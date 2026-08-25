'use client';

import { useState, useEffect } from 'react';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentModal({ onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    id: string;
    payload: string;
    encodedImage: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Gerar o Pix assim que o modal for aberto
  useEffect(() => {
    async function generatePix() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/pix', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Falha ao gerar o Pix. Verifique a chave de API.');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setPixData(data);
      } catch (err: any) {
        setError(err.message || 'Erro inesperado ao criar o pagamento.');
      } finally {
        setLoading(false);
      }
    }

    generatePix();
  }, []);

  // Função para copiar o código Pix Copia e Cola
  const handleCopy = () => {
    if (pixData?.payload) {
      navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl text-slate-100 relative space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Título */}
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
            Pagamento Seguro via Pix
          </span>
          <h2 className="text-xl font-bold text-white pt-2">
            Desbloquear Análise Completa
          </h2>
          <p className="text-xs text-slate-400">
            Escaneie o QR Code ou copie a chave Pix abaixo.
          </p>
        </div>

        {/* Estado de Carregamento */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400">Gerando QR Code Pix...</p>
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs text-center space-y-2">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="underline text-rose-300 hover:text-rose-100"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Exibição do QR Code e Copia e Cola */}
        {!loading && !error && pixData && (
          <div className="space-y-4 text-center">
            
            {/* Valor */}
            <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-2xl flex items-center justify-between px-4">
              <span className="text-xs text-slate-400">Valor total:</span>
              <span className="text-lg font-bold text-emerald-400">R$ 19,90</span>
            </div>

            {/* Imagem do QR Code */}
            {pixData.encodedImage && (
              <div className="bg-white p-3 rounded-2xl inline-block shadow-inner mx-auto">
                <img
                  src={`data:image/png;base64,${pixData.encodedImage}`}
                  alt="QR Code Pix"
                  className="w-48 h-48 object-contain rounded-lg"
                />
              </div>
            )}

            {/* Botão Copiar Código Pix */}
            <div className="space-y-2">
              <button
                onClick={handleCopy}
                className={`w-full py-3 px-4 rounded-2xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold'
                }`}
              >
                {copied ? (
                  <>
                    <span>✓</span> Código Pix Copiado!
                  </>
                ) : (
                  <>
                    <span>📋</span> Copiar Código Pix (Copia e Cola)
                  </>
                )}
              </button>
              
              <p className="text-[11px] text-slate-500">
                Após efetuar o pagamento, seu relatório será liberado automaticamente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
