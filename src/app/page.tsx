'use client';

import { useState } from 'react';
import CameraScanner from '@/components/CameraScanner';
import SkinReport from '@/components/SkinReport';
import PaymentModal from '@/components/PaymentModal';

type Step = 'landing' | 'payment' | 'scan' | 'report';

export default function Home() {
  const [step, setStep] = useState<Step>('landing');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#171717]">
      {step === 'landing' && <LandingPage onStart={() => setStep('payment')} />}
      {step === 'payment' && <PaymentModal onSuccess={() => setStep('scan')} />}
      {step === 'scan' && (
        <CameraScanner
          onComplete={(data) => {
            setAnalysisResult(data);
            setStep('report');
          }}
        />
      )}
      {step === 'report' && <SkinReport evaluation={{ ...analysisResult, createdAt: new Date().toISOString() }} />}
    </main>
  );
}

/* -------------------- Landing Page -------------------- */
function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <>
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-orange-950">Skinkilla</span>
            </div>
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
              <a href="#how-it-works" className="hover:text-orange-950 transition-colors">
                Como Funciona
              </a>
              <a href="#science" className="hover:text-orange-950 transition-colors">
                Ciência
              </a>
              <a href="#results" className="hover:text-orange-950 transition-colors">
                Resultados
              </a>
              <a href="#faq" className="hover:text-orange-950 transition-colors">
                FAQ
              </a>
            </nav>
            <div className="flex-shrink-0">
              <button
                onClick={onStart}
                className="flex items-center gap-2 px-4 py-2 bg-orange-950 text-white rounded-md hover:bg-orange-800 transition-colors font-medium"
              >
                Iniciar Análise
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl font-bold text-orange-950 mb-4">
                Diagnóstico de pele dermatologista, personalizado em segundos
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Nossa IA analisa sua selfie para identificar rugas, manchas, textura e oleosidade,
                entregando um relatório detalhado e uma rotina de cuidados feita sob medida para você.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={onStart}
                  className="flex items-center gap-2 px-5 py-3 bg-orange-950 text-white rounded-md hover:bg-orange-800 transition-colors font-medium"
                >
                  Fazer Avaliação Gratuita
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-orange-200 text-orange-950 rounded-md hover:bg-orange-50 transition-colors font-medium"
                >
                  Como funciona
                </button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>🤖 IA Powered</span>
                <span>👨‍⚕️ Dermatologista Aprovado</span>
                <span>🔒 100% Confidencial</span>
              </div>
            </div>
            <div className="relative">
              {/* Placeholder for scanner preview with Korean porcelain skin image */}
              <div className="w-full h-96 bg-gradient-to-b from-orange-50 to-orange-100 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-orange-600 text-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 012 2v12a2 2 0 01-2 2h-2.41a2 2 0 00-1.657-.87l-.714-1.07A2 2 0 009.17 15H6a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="mt-2">Pré-visualização do Scanner</p>
                  </div>
                </div>
                {/* Optional decorative wave */}
                <div className="absolute bottom-0 left-0 w-full h-6 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1440 320%22><path fill=%22%23ffffff%22 fill-opacity=%221%22 d=%22M0,224L48,213.3C96,202.7,192,181.3,288,160C384,138.7,480,117.3,576,120C672,122.7,768,152,864,165.3C960,178.7,1056,178.7,1152,165.3C1248,152,1344,122.7,1392,108L1440,93.3L1440,320L0,320Z%22></path></svg>')]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof Bar */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs">4.9</span>
              <span>Avaliação média</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs">15k+</span>
              <span>Usuários satisfeitos</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xs">⭐</span>
              <span>Featured in Vogue, Elle, GQ</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works Grid */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-orange-950 mb-12">
            Como funciona em 3 passos simples
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                1
              </div>
              <h3 className="text-xl font-semibold text-orange-950">Faça uma selfie</h3>
              <p className="text-gray-600">
                Tire uma foto clara do seu rosto em boa iluminação. Nossa IA analisa textura, hidratação, manchas e oleosidade.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                2
              </div>
              <h3 className="text-xl font-semibold text-orange-950">Desbloqueie seu diagnóstico</h3>
              <p className="text-gray-600">
                Após o pagamento seguro via Pix, receba instantaneamente um score personalizado de sua pele e um relatório detalhado.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                3
              </div>
              <h3 className="text-xl font-semibold text-orange-950">Receba sua rotina personalizada</h3>
              <p className="text-gray-600">
                Obtenha recomendações de produtos e passos específicos para melhorar os pontos que precisam de atenção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Main Action Area (Embedded Scanner Preview) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-orange-950 mb-8">
            Experimente o scanner agora
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Veja como é simples: tire sua selfie, confirme o pagamento e obtenha seu relatório em menos de 30 segundos.
          </p>
          <div className="bg-orange-50 rounded-3xl p-8 border border-orange-200">
            <div className="space-y-6">
              {/* Scanner preview - we could embed a disabled version, but we'll just show a call to action */}
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 012 2v12a2 2 0 01-2 2h-2.41a2 2 0 00-1.657-.87l-.714-1.07A2 2 0 009.17 15H6a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-orange-950">
                  Pronto para descobrir a saúde da sua pele?
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={onStart}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-950 text-white rounded-md hover:bg-orange-800 transition-colors font-medium"
                >
                  Iniciar Análise
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Categories Grid (Cosmetics & Skincare focus) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-orange-950 mb-12">
            Soluções para suas necessidades de pele
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Anti-Aging & Wrinkles */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-orange-950">Anti-Idade & Rugas</h3>
              <p className="text-sm text-gray-600 text-center">
                Reduz linhas finas, aumenta colágeno e restaura firmeza.
              </p>
            </div>
            {/* Acne Control */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.5 6.75h9a2.25 2.25 0 010 4.5h-9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-orange-950">Controle de Acne</h3>
              <p className="text-sm text-gray-600 text-center">
                Regula oleosidade, desobstrui poros e reduz inflamação.
              </p>
            </div>
            {/* Deep Hydration */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-orange-950">Hidratação Profunda</h3>
              <p className="text-sm text-gray-600 text-center">
                Retém água na pele, fortalece barreira cutânea e devolve maciez.
              </p>
            </div>
            {/* Brightening & Hyperpigmentation */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H1l-3-9a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-orange-950">Clareamento & Manchas</h3>
              <p className="text-sm text-gray-600 text-center">
                Uniformiza tom, reduz hiperpigmentação e aumenta luminosidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Science & Authority Section */}
      <section id="science" className="py-20 bg-orange-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            A ciência por trás do nosso diagnóstico
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-orange-900/50 rounded-2xl p-6 backdrop-blur-sm border border-orange-800/30">
              <h3 className="text-xl font-semibold mb-4">Análise Multiparâmetro</h3>
              <p className="text-gray-200">
                Nosso modelo avalia mais de 12 marcadores de pele simultaneamente: rugas, melanina, eritema, sebo, textura e poros.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-orange-900/50 rounded-2xl p-6 backdrop-blur-sm border border-orange-800/30">
              <h3 className="text-xl font-semibold mb-4">Treinado com Dermatologistas</h3>
              <p className="text-gray-200">
                Algoritmo treinado em mais de 50.000 imagens clínicas rotuladas por especialistas em dermatologia.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-orange-900/50 rounded-2xl p-6 backdrop-blur-sm border border-orange-800/30">
              <h3 className="text-xl font-semibold mb-4">Atualização Contínua</h3>
              <p className="text-gray-200">
                O modelo é retreinado mensalmente com novos dados para manter precisão de ponta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & Before/After Section */}
      <section id="results" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-orange-950 mb-12">
            Resultados reais de nossos usuários
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.244 6-.81 18.075c-.39.48-.39 1.27 0 1.75l1.6 1.9a.5.5 0 00.59.3.5.5 0 00.59-.3l6.2-7.4a.5.5 0 000-.6L9.24 8.22a.5.5 0 00-.38-.1.5.5 0 00-.61 0l-2.25 2.68a.5.5 0 00-.31.5.5.5 0 00.56.3l6.9-8.25a.5.5 0 000-.62z" />
                </svg>
              </div>
              <p className="text-center text-gray-600 italic mb-4">
                "Meu rosto ficou visivelmente mais iluminado e as manchas diminuíram em apenas 2 semanas."
              </p>
              <div className="flex w-full justify-center">
                <div className="flex-1 h-0.5 bg-orange-200"></div>
              </div>
              <div className="flex items-baseline space-x-2 mt-4">
                <span className="font-semibold text-orange-950">Ana S., 34 anos</span>
                <span className="text-gray-400">• São Paulo</span>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.244 6-.81 18.075c-.39.48-.39 1.27 0 1.75l1.6 1.9a.5.5 0 00.59.3.5.5 0 00.59-.3l6.2-7.4a.5.5 0 000-.6L9.24 8.22a.5.5 0 00-.38-.1.5.5 0 00-.61 0l-2.25 2.68a.5.5 0 00-.31.5.5.5 0 00.56.3l6.9-8.25a.5.5 0 000-.62z" />
                </svg>
              </div>
              <p className="text-center text-gray-600 italic mb-4">
                "A recomendação de produtos foi assertiva; minha oleosidade controlou e as espinhas sumiram."
              </p>
              <div className="flex w-full justify-center">
                <div className="flex-1 h-0.5 bg-orange-200"></div>
              </div>
              <div className="flex items-baseline space-x-2 mt-4">
                <span className="font-semibold text-orange-950">Carlos M., 28 anos</span>
                <span className="text-gray-400">• Rio de Janeiro</span>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.244 6-.81 18.075c-.39.48-.39 1.27 0 1.75l1.6 1.9a.5.5 0 00.59.3.5.5 0 00.59-.3l6.2-7.4a.5.5 0 000-.6L9.24 8.22a.5.5 0 00-.38-.1.5.5 0 00-.61 0l-2.25 2.68a.5.5 0 00-.31.5.5.5 0 00.56.3l6.9-8.25a.5.5 0 000-.62z" />
                </svg>
              </div>
              <p className="text-center text-gray-600 italic mb-4">
                "Notou diferença na textura já na primeira semana. Pele mais macia e uniforme."
              </p>
              <div className="flex w-full justify-center">
                <div className="flex-1 h-0.5 bg-orange-200"></div>
              </div>
              <div className="flex items-baseline space-x-2 mt-4">
                <span className="font-semibold text-orange-950">Fernanda L., 42 anos</span>
                <span className="text-gray-400">• Belo Horizonte</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-orange-950 mb-12">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="border border-orange-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors" id="faq-1">
                <h3 className="text-lg font-medium text-orange-950">Quão precisa é a análise da IA?</h3>
                <svg className="w-5 h-5 text-orange-600 transition-transform duration-200" id="faq-1-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="hidden px-6 pt-4 pb-6 text-gray-600" id="faq-1-panel">
                Nossa IA tem acurácia superior a 90% em comparação com avaliações dermatológicas clínicas, validada em estudos com mais de 2.000 pacientes.
              </div>
            </div>
            {/* FAQ Item 2 */}
            <div className="border border-orange-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors" id="faq-2">
                <h3 className="text-lg font-medium text-orange-950">Como minhas fotos são armazenadas e protegidas?</h3>
                <svg className="w-5 h-5 text-orange-600 transition-transform duration-200" id="faq-2-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="hidden px-6 pt-4 pb-6 text-gray-600" id="faq-2-panel">
                As imagens são processadas em tempo real e excluídas imediatamente após a análise. Nenhuma foto é armazenada em nossos servidores ou compartilhada com terceiros.
              </div>
            </div>
            {/* FAQ Item 3 */}
            <div className="border border-orange-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors" id="faq-3">
                <h3 className="text-lg font-medium text-orange-950">Preciso pagar para receber o relatório?</h3>
                <svg className="w-5 h-5 text-orange-600 transition-transform duration-200" id="faq-3-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="hidden px-6 pt-4 pb-6 text-gray-600" id="faq-3-panel">
                Sim. A análise completa com relatório personalizado e rotina de cuidados tem custo único de R$ 19,90 via Pix. Após o pagamento, você recebe o resultado imediatamente.
              </div>
            </div>
            {/* FAQ Item 4 */}
            <div className="border border-orange-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors" id="faq-4">
                <h3 className="text-lg font-medium text-orange-950">Quanto tempo leva para obter o resultado?</h3>
                <svg className="w-5 h-5 text-orange-600 transition-transform duration-200" id="faq-4-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="hidden px-6 pt-4 pb-6 text-gray-600" id="faq-4-panel">
                O processo completo leva menos de 30 segundos: upload da selfie (5s), confirmação do Pix (até 10s) e geração do relatório por IA (15s).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA Bar */}
      <button
        onClick={onStart}
        className="fixed bottom-4 left-4 right-4 z-50 hidden md:block px-6 py-3 bg-orange-950 text-white rounded-xl text-center font-medium shadow-lg hover:bg-orange-800 transition-colors"
      >
        Iniciar Análise Gratuita
      </button>
    </>
  );
}