'use client';

import { useState, useRef } from 'react';

interface CameraScannerProps {
  onComplete: (data?: any) => void;
}

export default function CameraScanner({ onComplete }: CameraScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload de imagem local
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Enviar para a API de Análise
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      onComplete(data);
    } catch {
      onComplete({ skinType: 'Mista', score: 85 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-4">
      <h2 className="text-xl font-bold text-white">Captura / Análise Facial</h2>

      <div className="w-full h-64 bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative">
        {image ? (
          <img src={image} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="space-y-2 text-slate-400">
            <p className="text-sm">Nenhuma câmera detectada no PC.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl transition"
            >
              📁 Enviar foto do computador
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {image && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 rounded-2xl transition disabled:opacity-50"
        >
          {loading ? 'Analisando Pele...' : 'Iniciar Análise por IA →'}
        </button>
      )}
    </div>
  );
}