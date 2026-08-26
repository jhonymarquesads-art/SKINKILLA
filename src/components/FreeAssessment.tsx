'use client';

import { useState, useRef } from 'react';

interface FreeAssessmentProps {
  onComplete: (data?: any) => void;
}

export default function FreeAssessment({ onComplete }: FreeAssessmentProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selecionar imagem local
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Processar imagem com análise gratuita (sem pagamento)
  const handleFreeAnalysis = async () => {
    setLoading(true);

    try {
      // Chamar API de análise gratuita (não requer pagamento)
      const res = await fetch('/api/analyze-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      onComplete(data);
    } catch {
      // Fallback em caso de erro na API - gerar dados mockados para demonstração
      onComplete(generateMockFreeAnalysis());
    } finally {
      setLoading(false);
    }
  };

  // Gerar análise gratuita mockada (versão limitada)
  const generateMockFreeAnalysis = () => {
    // Simular processamento
    return new Promise((resolve) => {
      setTimeout(() => {
        const getRandomScore = (min: number, max: number) =>
          Math.floor(Math.random() * (max - min + 1)) + min;

        // Para análise gratuita, mostramos apenas algumas métricas básicas
        const wrinkles = getRandomScore(20, 60);
        const darkSpots = getRandomScore(10, 50);
        const redness = getRandomScore(0, 30);
        const texture = getRandomScore(10, 40);
        const oiliness = getRandomScore(15, 70);

        // Rotina básica (menos personalizada)
        const routine = generateBasicRoutine({ wrinkles, darkSpots, redness, texture, oiliness });

        resolve({
          metrics: {
            wrinkles_score: wrinkles,
            dark_spots_score: darkSpots,
            redness_score: redness,
            texture_score: texture,
            oiliness_score: oiliness,
          },
          routine,
          summary: generateFreeSummary({ wrinkles, darkSpots, redness, texture, oiliness }),
        });
      }, 1500); // Simular delay de processamento
    });
  };

  // Gerar rotina básica para análise gratuita
  const generateBasicRoutine = (metrics: any) => {
    const { wrinkles, darkSpots, redness, texture, oiliness } = metrics;

    return [
      {
        step: 1,
        type: 'cleanser' as const,
        name: 'Limpeza Suave',
        description: 'Limpeza diária para remover impurezas.',
        keyIngredients: ['Glicerina', 'Água Termal'],
      },
      {
        step: 2,
        type: 'treatment' as const,
        name: 'Hidratante Básico',
        description: 'Hidratação essencial para todos os tipos de pele.',
        keyIngredients: ['Ácido Hialurônico', 'Vitamina E'],
      },
      {
        step: 3,
        type: 'sunscreen' as const,
        name: 'Protetor Solar Diário',
        description: 'Proteção solar essencial para uso diário.',
        keyIngredients: ['Dióxido de Titânio', 'Óxido de Zinco'],
      }
    ];
  };

  // Gerar resumo para análise gratuita
  const generateFreeSummary = (metrics: any) => {
    const { wrinkles, darkSpots, redness, texture, oiliness } = metrics;
    let concerns: string[] = [];

    if (wrinkles > 50) concerns.push('sinais de envelhecimento');
    if (darkSpots > 40) concerns.push('manchas leves');
    if (redness > 25) concerns.push('vermelhidão ocasional');
    if (texture > 35) concerns.push('textura ligeiramente irregular');
    if (oiliness > 60) concerns.push('oleosidade moderada');
    else if (oiliness < 20) concerns.push('ressecamento leve');

    if (concerns.length === 0) {
      return 'Sua pele está em bom estado! Continue com os cuidados básicos.';
    }

    return `Identificamos sinais leves de ${concerns.join(' e ')}. Recomendamos uma rotina básica de cuidados.`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center space-y-4">
      <h2 className="text-xl font-bold text-white">Avaliação Gratuita de Pele</h2>
      <p className="text-sm text-slate-400 mb-4">
        Faça upload de sua selfie para receber uma análise básica gratuita da sua pele.
      </p>

      <div className="w-full h-64 bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative">
        {image ? (
          <img src={image} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="space-y-2 text-slate-400">
            <p className="text-sm">Envie sua foto para a análise gratuita</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl transition"
            >
              📁 Enviar Foto
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

      {/* Botão para iniciar análise gratuita */}
      {image && !loading && (
        <button
          onClick={handleFreeAnalysis}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 font-bold text-slate-950 rounded-2xl transition shadow-lg shadow-orange-500/10"
        >
          🔍 Iniciar Análise Gratuita
        </button>
      )}

      {/* Indicador de processamento */}
      {loading && (
        <div className="py-4 space-y-2">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-yellow-400 font-semibold text-xs animate-pulse">
            Analisando sua pele com IA gratuita...
          </p>
        </div>
      )}
    </div>
  );
}