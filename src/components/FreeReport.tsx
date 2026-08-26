import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SkinMetrics {
  wrinkles_score: number;
  dark_spots_score: number;
  redness_score: number;
  texture_score: number;
  oiliness_score: number;
}

interface RoutineStep {
  step: 1 | 2 | 3;
  type: 'cleanser' | 'treatment' | 'sunscreen';
  name: string;
  description: string;
  keyIngredients: string[];
}

interface FreeReportProps {
  evaluation: {
    metrics: SkinMetrics;
    routine: RoutineStep[];
    summary?: string;
    createdAt: string;
  };
}

const FreeReport: React.FC<FreeReportProps> = ({ evaluation }) => {
  const { metrics, routine, summary, createdAt } = evaluation;
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const router = useRouter();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Determine score color based on value
  const getScoreColor = (score: number) => {
    if (score <= 33) return 'text-green-600';
    if (score <= 66) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleUpgradeToFull = () => {
    // Navigate to payment step for full analysis
    router.push('/'); // This will trigger the payment flow
    // In a real app, we might want to pass some context or use a different approach
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Seu Relatório Gratuito de Análise de Pele</h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Análise realizada em {formatDate(createdAt)}
        </p>

        {/* Summary */}
        {summary && (
          <p className="italic text-gray-600 mb-4">{summary}</p>
        )}

        {/* Metrics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="font-medium">Rugas</span>
            <div className="flex w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${getScoreColor(metrics.wrinkles_score)} h-2.5 rounded-left`}
                style={{ width: `${metrics.wrinkles_score}%` }}
              ></div>
            </div>
            <p className="text-right text-sm">{metrics.wrinkles_score}%</p>
          </div>

          <div className="space-y-2">
            <span className="font-medium">Manchas escuras</span>
            <div className="flex w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${getScoreColor(metrics.dark_spots_score)} h-2.5 rounded-left`}
                style={{ width: `${metrics.dark_spots_score}%` }}
              ></div>
            </div>
            <p className="text-right text-sm">{metrics.dark_spots_score}%</p>
          </div>

          <div className="space-y-2">
            <span className="font-medium">Vermelhidão</span>
            <div className="flex w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${getScoreColor(metrics.redness_score)} h-2.5 rounded-left`}
                style={{ width: `${metrics.redness_score}%` }}
              ></div>
            </div>
            <p className="text-right text-sm">{metrics.redness_score}%</p>
          </div>

          <div className="space-y-2">
            <span className="font-medium">Textura</span>
            <div className="flex w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${getScoreColor(metrics.texture_score)} h-2.5 rounded-left`}
                style={{ width: `${metrics.texture_score}%` }}
              ></div>
            </div>
            <p className="text-right text-sm">{metrics.texture_score}%</p>
          </div>

          <div className="space-y-2">
            <span className="font-medium">Oleosidade</span>
            <div className="flex w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${getScoreColor(metrics.oiliness_score)} h-2.5 rounded-left`}
                style={{ width: `${metrics.oiliness_score}%` }}
              ></div>
            </div>
            <p className="text-right text-sm">{metrics.oiliness_score}%</p>
          </div>
        </div>
      </div>

      {/* Routine */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Sugestão de Rotina Básica</h2>
        <p className="text-sm text-gray-500 mb-4">
          Baseada na sua análise gratuita, aqui estão algumas recomendações básicas:
        </p>

        <div className="space-y-6">
          {routine.map((step) => (
            <div
              key={step.step}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                activeStep === step.step ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.type === 'cleanser'
                      ? 'bg-blue-500/20 text-blue-500'
                      : step.type === 'treatment'
                      ? 'bg-purple-500/20 text-purple-500'
                      : 'bg-green-500/20 text-green-500'
                  }`}>
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{step.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  {activeStep === step.step && (
                    <div className="mt-2">
                      <h4 className="font-medium mb-1">Principais ativos:</h4>
                      <p className="text-sm">{step.keyIngredients.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade option */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500 mb-4">
          Deseja uma análise mais detalhada com rotina personalizada completa?
        </p>
        <button
          onClick={handleUpgradeToFull}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
        >
          Fazer Análise Completa (R$ 19,90)
        </button>
      </div>
    </div>
  );
};

export default FreeReport;