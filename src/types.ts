export interface Product {
  id: string;
  category: string;
  imageCount: number;
  images: string[];
}

export interface VisualMeasurement {
  score: number; // -5.0 to +5.0
  reasoning: string;
}

export interface AnalysisResult {
  measurements: {
    genderExpression: VisualMeasurement;
    visualWeight: VisualMeasurement;
    embellishment: VisualMeasurement;
    unconventionality: VisualMeasurement;
    formality: VisualMeasurement;
  };
  attributes: {
    wirecore: boolean;
    geometry: string;
    transparency: string;
    dominantColors: string[];
    texture: string;
    suitableForKids: boolean;
  };
  metadata: {
    visualDescription: string;
  };
}
