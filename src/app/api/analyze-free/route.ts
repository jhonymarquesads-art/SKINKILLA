import { NextResponse } from 'next/server';

// Mock function to simulate free skin analysis (limited version)
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

  // Generate basic routine (less personalized)
  const routine = generateBasicRoutine({ wrinkles, darkSpots, redness, texture, oiliness });

  return {
    metrics: {
      wrinkles_score: wrinkles,
      dark_spots_score: darkSpots,
      redness_score: redness,
      texture_score: texture,
      oiliness_score: oiliness,
    },
    routine,
    summary: generateFreeSummary({ wrinkles, darkSpots, redness, texture, oiliness }),
  };
};

// Generate basic routine for free analysis
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