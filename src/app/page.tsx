'use client';

import { useState } from 'react';
import CameraScanner from '@/components/CameraScanner';
import SkinReport from '@/components/SkinReport';
import PaymentModal from '@/components/PaymentModal';

type Step = 'payment' | 'scan' | 'report';

export default function Home() {
  const [step, setStep] = useState<Step>('payment');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 p-4 text-slate-100 md:p-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {step === 'payment' && <PaymentModal onSuccess={() => setStep('scan')} />}
        {step === 'scan' && <CameraScanner onComplete={(data) => { setAnalysisResult(data); setStep('report'); }} />}
        {step === 'report' && <SkinReport evaluation={{ ...analysisResult, createdAt: new Date().toISOString() }} />}
      </div>
    </main>
  );
}
