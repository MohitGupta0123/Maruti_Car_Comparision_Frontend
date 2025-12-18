// src/services/api.ts
import { ComparisonResponse, ModelDetails, SelectionState } from '../types';

const BASE_API = import.meta.env.VITE_BASE_API || 'http://localhost:8000';

// ---------- Backend response types ----------

interface BackendCarMeta {
  brand: string;
  model: string;
  table: string;
  variants: string[];
}

interface GetModelDetailsApiResponse {
  status: string;
  cars: BackendCarMeta[];
}

interface BackendFeatureRow {
  feature: string;
  variants: Record<string, string | null>;
}

interface BackendCarComparison {
  brand: string;
  model: string;
  table_name: string;
  variants: string[];
  data: BackendFeatureRow[];
}

interface RawComparisonApiResponse {
  status: string;
  car1: BackendCarComparison;
  car2: BackendCarComparison;
}

// ---------- News API types ----------

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  source: {
    name: string;
    icon?: string;
  };
  published: string;
}

export interface NewsResponse {
  car: string;
  total: number;
  top5_news: NewsArticle[];
}

// Helper: clean markdown like **Exterior - Headlamps**
const normaliseFeatureName = (raw: string): string => {
  const cleaned = (raw || '').replace(/\*\*/g, '').trim();
  const lower = cleaned.toLowerCase();

  // Merge "Price Range" and "Price Range (Ex-showroom Delhi)" into one row
  if (lower.startsWith('price range')) {
    return 'Price Range';
  }

  return cleaned;
};

/**
 * GET /get_model_details
 */
export const fetchModelDetails = async (): Promise<ModelDetails> => {
  const res = await fetch(`${BASE_API}/get-model-details`);
  if (!res.ok) {
    throw new Error(`Failed to fetch model details: ${res.status}`);
  }

  const json: GetModelDetailsApiResponse = await res.json();
  const cars = json.cars || [];

  const brandsSet = new Set<string>();
  const models: Record<string, string[]> = {};
  const variants: Record<string, string[]> = {};

  cars.forEach((car) => {
    brandsSet.add(car.brand);

    if (!models[car.brand]) {
      models[car.brand] = [];
    }
    if (!models[car.brand].includes(car.model)) {
      models[car.brand].push(car.model);
    }

    variants[car.model] = car.variants || [];
  });

  return {
    brands: Array.from(brandsSet),
    models,
    variants,
  };
};

/**
 * POST /get_comparision_details
 */
export const fetchComparisonDetails = async (
  sel1: SelectionState,
  sel2: SelectionState
): Promise<ComparisonResponse> => {
  const payload = {
    brand1: sel1.brand,
    model1: sel1.model,
    variants1: [sel1.variant],
    brand2: sel2.brand,
    model2: sel2.model,
    variants2: [sel2.variant],
  };

  const res = await fetch(`${BASE_API}/get-comparison-details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log(payload);

  if (!res.ok) {
    throw new Error(`Failed to fetch comparison details: ${res.status}`);
  }

  const json: RawComparisonApiResponse = await res.json();
  const { car1, car2 } = json;

  const variantHeadersCar1 = (car1.variants || []).map(
    (v) => `${car1.brand} ${car1.model} - ${v}`
  );
  const variantHeadersCar2 = (car2.variants || []).map(
    (v) => `${car2.brand} ${car2.model} - ${v}`
  );

  const allVariantHeaders = [...variantHeadersCar1, ...variantHeadersCar2];
  const columns: string[] = ['Feature', ...allVariantHeaders];

  const rowMap = new Map<string, { feature: string; values: Record<string, string> }>();

  const ingestCar = (car: BackendCarComparison, variantHeaders: string[]) => {
    const variantNames = car.variants || [];

    const headerByVariantName: Record<string, string> = {};
    variantNames.forEach((variantName, idx) => {
      headerByVariantName[variantName] = variantHeaders[idx];
    });

    (car.data || []).forEach((row) => {
      const feature = normaliseFeatureName(row.feature || '');
      if (!feature) return;

      let entry = rowMap.get(feature);
      if (!entry) {
        entry = { feature, values: {} };
        rowMap.set(feature, entry);
      }

      Object.entries(row.variants || {}).forEach(([variantName, value]) => {
        const header = headerByVariantName[variantName];
        if (!header) return;

        entry!.values[header] = value ?? '';
      });
    });
  };

  ingestCar(car1, variantHeadersCar1);
  ingestCar(car2, variantHeadersCar2);

  const data = Array.from(rowMap.values()).map((entry) => {
    const row: any = { feature: entry.feature };
    allVariantHeaders.forEach((header) => {
      if (entry.values[header] !== undefined) {
        row[header] = entry.values[header];
      }
    });
    return row;
  });

  return { columns, data };
};

/**
 * GET /news?car={carModel}
 * Fetches top 5 news articles about a specific car model
 */
export const fetchCarNews = async (carModel: string): Promise<NewsResponse> => {
  const url = `${BASE_API}/news?car=${encodeURIComponent(carModel)}`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch news for ${carModel}: ${res.status}`);
  }

  const json: NewsResponse = await res.json();
  return json;
};