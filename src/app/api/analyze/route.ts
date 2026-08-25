import { NextResponse } from 'next/server';

// Mock function to simulate skin analysis
// In a real application, this would call a vision API (like MediaPipe or Google Vision)
const analyzeSkinImage = async (imageBase64: string) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random scores for demonstration
  // In reality, these would come from the vision model
  const getRandomScore = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Simulate scores based on some logic (just for demo)
  const wrinkles = getRandomScore(10, 80);
  const darkSpots = getRandomScore(5, 70);
  const redness = getRandomScore(0, 50);
  const texture = getRandomScore(15, 60);
  const oiliness = getRandomScore(10, 90);
  
  // Determine routine based on scores
  const routine = generateRoutine({ wrinkles, darkSpots, redness, texture, oiliness });
  
  return {
    metrics: {
      wrinkles_score: wrinkles,
      dark_spots_score: darkSpots,
      redness_score: redness,
      texture_score: texture,
      oiliness_score: oiliness,
    },
    routine,
    summary: generateSummary({ wrinkles, darkSpots, redness, texture, oiliness }),
  };
};

// Generate routine based on skin metrics
const generateRoutine = (metrics: any) => {
  const { wrinkles, darkSpots, redness, texture, oiliness } = metrics;
  
  // Cleanser: based on oiliness and texture
  let cleanserType = 'gel'; // default
  if (oiliness > 70) cleanserType = 'foaming';
  else if (oiliness < 30) cleanserType = 'cream';
  
  // Treatment: based on main concerns
  const treatmentType = wrinkles > 60 || darkSpots > 60 ? 'anti_aging' : 
                       redness > 50 ? 'soothing' : 
                       texture > 50 ? 'exfoliating' : 
                       'hydrating';
  
  // Sunscreen: always recommended, but type based on oiliness
  const sunscreenType = oiliness > 60 ? 'matte' : 'moisturizing';
  
  return [
    {
      step: 1,
      type: 'cleanser' as const,
      name: `${cleanserType.charAt(0).toUpperCase() + cleanserType.slice(1)} Cleanser`,
      description: `A limpeza adequada é essencial para remover impurezas e preparar a pele para os próximos passos.`,
      keyIngredients: cleanserType === 'foaming' 
        ? ['Ácido Salicílico', 'Ácido Glicólico'] 
        : cleanserType === 'cream'
        ? ['Manteiga de Karité', 'Óleo de Jojoba']
        : ['Ácido Hialurônico', 'Glicerina'],
    },
    {
      step: 2,
      type: 'treatment' as const,
      name: `${treatmentType.charAt(0).toUpperCase() + treatmentType.slice(1)} Serum`,
      description: `Tratamento focado nas suas principais preocupações de pele.`,
      keyIngredients: treatmentType === 'anti_aging'
        ? ['Retinol', 'Vitamina C', 'Peptídeos']
        : treatmentType === 'soothing'
        ? ['Niacinamida', 'Extrato de Camomila', 'Áloe Vera']
        : treatmentType === 'exfoliating'
        ? ['Ácido Lático', 'Ácido Mandélico', 'Enzimas de Abacaxi']
        : ['Ácido Hialurônico', 'Vitamina B5', 'Trehalose'],
    },
    {
      step: 3,
      type: 'sunscreen' as const,
      name: `${sunscreenType.charAt(0).toUpperCase() + sunscreenType.slice(1)} Sunscreen SPF 30+`,
      description: `Proteção solar diária é crucial para prevenir danos futuros e manchas.`,
      keyIngredients: sunscreenType === 'matte'
        ? ['Dióxido de Titânio', 'Óxido de Zinco', 'Sílica']
        : ['Ácido Hialurônico', 'Vitamina E', 'Extrato de Chá Verde'],
    }
  ];
};

// Generate summary based on metrics
const generateSummary = (metrics: any) => {
  const { wrinkles, darkSpots, redness, texture, oiliness } = metrics;
  let concerns: string[] = [];
  
  if (wrinkles > 60) concerns.push('rugas');
  if (darkSpots > 60) concerns.push('manchas escuras');
  if (redness > 50) concerns.push('vermelhidão');
  if (texture > 50) concerns.push('textura irregular');
  if (oiliness > 70) concerns.push('oleosidade excessiva');
  else if (oiliness < 30) concerns.push('ressecamento');
  
  if (concerns.length === 0) {
    return 'Sua pele está em excelente estado! Continue com os cuidados de prevenção.';
  }
  
  return `Identificamos sinais de ${concerns.join(' e ')}. Sua rotina personalizada foi formulada para abordar essas preocupações específicas.`;
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
    const result = await analyzeSkinImage(image);
    
    // Return the analysis result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
