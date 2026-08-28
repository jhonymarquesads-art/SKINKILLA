import { NextResponse } from 'next/server';

type SkinMetrics = {
  wrinkles: number;
  darkSpots: number;
  redness: number;
  texture: number;
  oiliness: number;
};

type PlanProduct = {
  category: string;
  recommendation: string;
  priceMin: number;
  priceMax: number;
};

const calculateGamification = (metrics: SkinMetrics) => {
  const concernAverage = (metrics.wrinkles + metrics.darkSpots + metrics.redness + metrics.texture + metrics.oiliness) / 5;
  const score = Math.max(35, Math.min(98, Math.round(100 - concernAverage)));
  const potential = Math.min(99, score + Math.max(8, Math.round((100 - score) * 0.55)));
  const level = score >= 80 ? 'Pele em equilíbrio' : score >= 60 ? 'Em evolução' : 'Começando sua jornada';

  return {
    score,
    potential,
    level,
    pointsEarned: 100,
    nextGoal: Math.min(100, score + 5),
    message: `Você completou sua primeira avaliação e desbloqueou o nível "${level}".`,
  };
};

// Free assessment provides directional guidance, not a medical diagnosis.
const analyzeSkinImageFree = async (imageBase64: string) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate random scores for demonstration (more limited range for free version)
  const getRandomScore = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // For free analysis, we provide basic scores with some limitations
  const wrinkles = getRandomScore(15, 55); // Limited range
  const darkSpots = getRandomScore(5, 45); // Limited range
  const redness = getRandomScore(0, 25); // Limited range
  const texture = getRandomScore(10, 35); // Limited range
  const oiliness = getRandomScore(10, 60); // Limited range

  const metrics = { wrinkles, darkSpots, redness, texture, oiliness };
  const routine = generateRoutine(metrics);
  const plan = generatePlan(metrics);
  const gamification = calculateGamification(metrics);

  return {
    metrics: {
      wrinkles_score: wrinkles,
      dark_spots_score: darkSpots,
      redness_score: redness,
      texture_score: texture,
      oiliness_score: oiliness,
    },
    routine,
    summary: generateFreeSummary(metrics),
    plan,
    gamification,
  };
};

const generateRoutine = (metrics: SkinMetrics) => {
  const { wrinkles, darkSpots, redness, texture, oiliness } = metrics;
  const cleanser = oiliness > 45
    ? { name: 'Gel de limpeza para controle de oleosidade', ingredients: ['Niacinamida', 'Glicerina'] }
    : { name: 'Limpeza suave para preservar a barreira', ingredients: ['Glicerina', 'Ceramidas'] };
  const treatment = darkSpots >= wrinkles && darkSpots >= redness
    ? { name: 'Sérum uniformizador', ingredients: ['Niacinamida', 'Ácido Tranexâmico'] }
    : wrinkles >= redness
      ? { name: 'Sérum antioxidante e de renovação', ingredients: ['Vitamina C', 'Peptídeos'] }
      : { name: 'Sérum calmante e hidratante', ingredients: ['Pantenol', 'Ácido Hialurônico'] };

  return [
    {
      step: 1,
      type: 'cleanser' as const,
      name: cleanser.name,
      description: 'Use pela manhã e à noite, sem esfregar a pele.',
      keyIngredients: cleanser.ingredients,
    },
    {
      step: 2,
      type: 'treatment' as const,
      name: treatment.name,
      description: 'Comece em noites alternadas e observe a tolerância da pele.',
      keyIngredients: treatment.ingredients,
    },
    {
      step: 3,
      type: 'sunscreen' as const,
      name: 'Protetor solar facial FPS 30 ou maior',
      description: 'Aplique todas as manhãs e reaplique quando houver exposição.',
      keyIngredients: ['Filtros UV', 'Vitamina E'],
    }
  ];
};

const generatePlan = (metrics: SkinMetrics) => {
  const { wrinkles, darkSpots, redness, texture, oiliness } = metrics;
  const products: PlanProduct[] = [
    {
      category: 'Limpeza',
      recommendation: oiliness > 45 ? 'Gel de limpeza suave' : 'Leite ou espuma de limpeza suave',
      priceMin: 25,
      priceMax: 55,
    },
    {
      category: 'Tratamento principal',
      recommendation: darkSpots >= wrinkles ? 'Sérum de niacinamida ou ácido tranexâmico' : 'Sérum antioxidante com vitamina C',
      priceMin: 45,
      priceMax: 110,
    },
    {
      category: 'Hidratação',
      recommendation: redness > 20 || texture > 25 ? 'Hidratante reparador com pantenol ou ceramidas' : 'Hidratante leve com ácido hialurônico',
      priceMin: 35,
      priceMax: 90,
    },
    {
      category: 'Proteção',
      recommendation: 'Protetor solar facial FPS 30 ou maior',
      priceMin: 45,
      priceMax: 100,
    },
  ];
  const totalMin = products.reduce((total, product) => total + product.priceMin, 0);
  const totalMax = products.reduce((total, product) => total + product.priceMax, 0);
  const priorities = [
    { score: oiliness, label: 'controle de oleosidade' },
    { score: darkSpots, label: 'uniformização de manchas' },
    { score: wrinkles, label: 'prevenção de sinais' },
    { score: redness, label: 'conforto e vermelhidão' },
    { score: texture, label: 'melhora da textura' },
  ].sort((first, second) => second.score - first.score);

  return {
    title: priorities[0].score > 35 ? `Foco em ${priorities[0].label}` : 'Foco em prevenção e equilíbrio',
    priorities: priorities.slice(0, 3).map((priority) => priority.label),
    products,
    totalMin,
    totalMax,
    note: 'Estimativa para montar a rotina inicial. Os valores variam por marca, tamanho e região.',
  };
};

// Generate summary for free analysis
const generateFreeSummary = (metrics: any) => {
  const { wrinkles, darkSpots, redness, texture, oiliness } = metrics;
  let concerns: string[] = [];

  if (wrinkles > 40) concerns.push('sinais de envelhecimento');
  if (darkSpots > 30) concerns.push('manchas leves');
  if (redness > 20) concerns.push('vermelhidão ocasional');
  if (texture > 25) concerns.push('textura ligeiramente irregular');
  if (oiliness > 50) concerns.push('oleosidade moderada');
  else if (oiliness < 15) concerns.push('ressecamento leve');

  if (concerns.length === 0) {
    return 'Sua pele está em bom estado! Continue com os cuidados básicos.';
  }

  return `Identificamos sinais leves de ${concerns.join(' e ')}. Recomendamos uma rotina básica de cuidados.`;
};

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // In a real app, we would validate the image is a valid base64 string
    // and optionally check size/type here

    // Process the image (in-memory only)
    const result = await analyzeSkinImageFree(image);

    // Return the analysis result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in analyze-free route:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}