'use client';

import { useState } from 'react';
import CameraScanner from '@/components/CameraScanner';
import SkinReport from '@/components/SkinReport';
import PaymentModal from '@/components/PaymentModal';

export default function Home() {
  const [step, setStep] = useState<'scan' | 'report'>('scan');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Função chamada após a captura/análise da imagem
  const handleScanComplete = (data?: any) => {
    if (data) setAnalysisResult(data);
    setStep('report');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        
        {/* Passo 1: Scanner / Captura da Pele */}
        {step === 'scan' && (
          <CameraScanner onComplete={handleScanComplete} />
        )}

        {/* Passo 2: Exibição do Relatório de Análise */}
        {step === 'report' && (
          <SkinReport 
            data={analysisResult}
            onUnlock={() => setIsPaymentOpen(true)}
            onRestart={() => setStep('scan')}
          />
        )}

        {/* Modal de Pagamento via Pix */}
        {isPaymentOpen && (
          <PaymentModal 
            onClose={() => setIsPaymentOpen(false)} 
          />
        )}

      </div>
    </main>
  );
}