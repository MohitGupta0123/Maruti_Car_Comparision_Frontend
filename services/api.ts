// import { ComparisonResponse, ModelDetails } from '../types';

// // Mock Data for Dropdowns
// const MOCK_DB: ModelDetails = {
//   brands: ['Hyundai', 'Tata', 'Mahindra', 'Toyota'],
//   models: {
//     'Hyundai': ['Creta', 'Verna', 'Tucson'],
//     'Tata': ['Nexon', 'Harrier', 'Safari'],
//     'Mahindra': ['XUV700', 'Thar', 'Scorpio-N'],
//     'Toyota': ['Fortuner', 'Innova Crysta'],
//   },
//   variants: {
//     'Creta': ['SX (O)', 'SX Tech', 'S (O)'],
//     'Verna': ['SX Turbo', 'SX Opt'],
//     'Tucson': ['Signature', 'Platinum'],
//     'Nexon': ['Fearless +', 'Creative +'],
//     'Harrier': ['Fearless', 'Adventure'],
//     'Safari': ['Accomplished', 'Pure'],
//     'XUV700': ['AX7 L', 'AX5'],
//     'Thar': ['LX Hard Top', 'AX Opt'],
//     'Scorpio-N': ['Z8 L', 'Z6'],
//     'Fortuner': ['Legender', '4x4 AT'],
//     'Innova Crysta': ['ZX', 'VX'],
//   }
// };

// // Mock Data for Comparison
// const MOCK_COMPARISON_DATA = (variant1: string, variant2: string): ComparisonResponse => {
//   // Generate randomish data for demo purposes based on selected variants
//   const features = [
//     { name: "Price Range", v1: "₹ 15 - 19 Lakhs", v2: "₹ 16 - 20 Lakhs" },
//     { name: "Exterior - Headlamps", v1: "LED Projector", v2: "Halogen" },
//     { name: "Exterior - LED Daytime Running Lamps (DRL)", v1: "Yes", v2: "Yes" },
//     { name: "Exterior - LED Tail Stop Lamp", v1: "Connected LED", v2: "Standard LED" },
//     { name: "Exterior - Follow-Me Home Headlamp", v1: "Yes", v2: "" }, // Empty for "No info" check
//     { name: "Exterior - Wheels Type", v1: "Alloy", v2: "Steel" },
//     { name: "Exterior - Front Grille", v1: "Chrome", v2: "Piano Black" },
//     { name: "Exterior - Full Wheel Covers", v1: "No", v2: "Yes" },
//     { name: "Interior - Adjustable Headrest", v1: "Front & Rear", v2: "Front Only" },
//     { name: "Safety - 360 View Camera", v1: "Yes", v2: "No" },
//     { name: "Comfort & Convenience - Air Conditioner", v1: "Automatic Climate Control", v2: "Manual" },
//     { name: "Comfort & Convenience - Engine Push Start/Stop with Smart Key", v1: "Yes", v2: "Yes" },
//     { name: "Comfort & Convenience - Remote Keyless Entry", v1: "Smart Key", v2: "Foldable Key" },
//     { name: "Rear USB Charger", v1: "Type-C", v2: "Type-A" },
//     { name: "Wireless Phone Charger", v1: "Yes", v2: "" },
//     { name: "Hyundai Bluelink Connected Car Technology", v1: "Yes", v2: "No" },
//     { name: "Tyre Pressure Monitoring System (TPMS)", v1: "Highline", v2: "Lowline" }
//   ];

//   return {
//     columns: ["Feature", variant1, variant2],
//     data: features.map(f => ({
//       feature: f.name,
//       [variant1]: f.v1,
//       [variant2]: f.v2
//     }))
//   };
// };

// export const fetchModelDetails = async (): Promise<ModelDetails> => {
//   // Simulate API delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(MOCK_DB);
//     }, 500);
//   });
// };

// export const fetchComparisonDetails = async (variant1: string, variant2: string): Promise<ComparisonResponse> => {
//   // Simulate API delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(MOCK_COMPARISON_DATA(variant1, variant2));
//     }, 800);
//   });
// };














// // src/services/api.ts
// import { ComparisonResponse, ModelDetails, SelectionState } from '../types';

// const BASE_API = import.meta.env.VITE_BASE_API || 'http://localhost:8000';

// // ---------- Backend response types ----------

// interface BackendCarMeta {
//   brand: string;
//   model: string;
//   table: string;
//   variants: string[];
// }

// interface GetModelDetailsApiResponse {
//   status: string;
//   cars: BackendCarMeta[];
// }

// interface BackendFeatureRow {
//   feature: string;
//   variants: Record<string, string | null>; // { "Sportz": "value", "Asta": null }
// }

// interface BackendCarComparison {
//   brand: string;
//   model: string;
//   table_name: string;
//   variants: string[];
//   data: BackendFeatureRow[];
// }

// interface RawComparisonApiResponse {
//   status: string;
//   car1: BackendCarComparison;
//   car2: BackendCarComparison;
// }

// // Helper: clean markdown like **Exterior - Headlamps**
// // const normaliseFeatureName = (raw: string): string =>
// //   (raw || '').replace(/\*\*/g, '').trim();

// const normaliseFeatureName = (raw: string): string => {
//   const cleaned = (raw || '').replace(/\*\*/g, '').trim();
//   const lower = cleaned.toLowerCase();

//   // Merge "Price Range" and "Price Range (Ex-showroom Delhi)" into one row
//   if (lower.startsWith('price range')) {
//     return 'Price Range';
//   }

//   return cleaned;
// };

// /**
//  * GET /get_model_details
//  * Backend returns:
//  * {
//  *   "status": "success",
//  *   "cars": [ { brand, model, table, feature_column, variants: [...] }, ... ]
//  * }
//  *
//  * We convert it into:
//  * {
//  *   brands: [...],
//  *   models: { [brand]: [models...] },
//  *   variants: { [model]: [variants...] }
//  * }
//  */
// export const fetchModelDetails = async (): Promise<ModelDetails> => {
//   const res = await fetch(`${BASE_API}/get-model-details`); // if your endpoint is /get_models_details just change this line
//   if (!res.ok) {
//     throw new Error(`Failed to fetch model details: ${res.status}`);
//   }

//   const json: GetModelDetailsApiResponse = await res.json();
//   const cars = json.cars || [];

//   const brandsSet = new Set<string>();
//   const models: Record<string, string[]> = {};
//   const variants: Record<string, string[]> = {};

//   cars.forEach((car) => {
//     brandsSet.add(car.brand);

//     if (!models[car.brand]) {
//       models[car.brand] = [];
//     }
//     if (!models[car.brand].includes(car.model)) {
//       models[car.brand].push(car.model);
//     }

//     variants[car.model] = car.variants || [];
//   });

//   return {
//     brands: Array.from(brandsSet),
//     models,
//     variants,
//   };
// };

// /**
//  * POST /get_comparision_details
//  *
//  * Request body (example):
//  * {
//  *   "brand1": "Hyundai",
//  *   "model1": "i20",
//  *   "variants1": ["magna", "sportz"],
//  *   "brand2": "Nexa",
//  *   "model2": "Baleno",
//  *   "variants2": ["delta_mt", "sigma_mt"]
//  * }
//  *
//  * Response:
//  * {
//  *   "status": "success",
//  *   "car1": { ... },
//  *   "car2": { ... }
//  * }
//  *
//  * We merge car1 + car2 into a single ComparisonResponse:
//  * columns: ["Feature", "<Car1 col1>", "<Car1 col2>", "<Car2 col1>", "<Car2 col2>"]
//  * data:    [{ feature, "<col1>": value, "<col2>": value, ... }, ...]
//  */
// export const fetchComparisonDetails = async (
//   sel1: SelectionState,
//   sel2: SelectionState
// ): Promise<ComparisonResponse> => {
//   const payload = {
//     brand1: sel1.brand,
//     model1: sel1.model,
//     variants1: [sel1.variant], // still sending single variant per car
//     brand2: sel2.brand,
//     model2: sel2.model,
//     variants2: [sel2.variant],
//   };

//   const res = await fetch(`${BASE_API}/get-comparison-details`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });

//   console.log(payload)

//   if (!res.ok) {
//     throw new Error(`Failed to fetch comparison details: ${res.status}`);
//   }

//   const json: RawComparisonApiResponse = await res.json();
//   const { car1, car2 } = json;

//   // Build headers like "HYUNDAI i20 - Sportz", "HYUNDAI i20 - Asta"
//   const variantHeadersCar1 = (car1.variants || []).map(
//     (v) => `${car1.brand} ${car1.model} - ${v}`
//   );
//   const variantHeadersCar2 = (car2.variants || []).map(
//     (v) => `${car2.brand} ${car2.model} - ${v}`
//   );

//   const allVariantHeaders = [...variantHeadersCar1, ...variantHeadersCar2];
//   const columns: string[] = ['Feature', ...allVariantHeaders];

//   // feature -> { feature, values: { [header]: value } }
//   const rowMap = new Map<string, { feature: string; values: Record<string, string> }>();

//   const ingestCar = (
//     car: BackendCarComparison,
//     variantHeaders: string[]
//   ) => {
//     const variantNames = car.variants || [];

//     // Map variant name -> header string
//     const headerByVariantName: Record<string, string> = {};
//     variantNames.forEach((variantName, idx) => {
//       headerByVariantName[variantName] = variantHeaders[idx];
//     });

//     (car.data || []).forEach((row) => {
//       const feature = normaliseFeatureName(row.feature || '');
//       if (!feature) return;

//       let entry = rowMap.get(feature);
//       if (!entry) {
//         entry = { feature, values: {} };
//         rowMap.set(feature, entry);
//       }

//       // row.variants is an object: { "Sportz": "value", "Asta": null }
//       Object.entries(row.variants || {}).forEach(([variantName, value]) => {
//         const header = headerByVariantName[variantName];
//         if (!header) return; // variant not in selected list

//         entry!.values[header] = value ?? ''; // null => empty string
//       });
//     });
//   };

//   ingestCar(car1, variantHeadersCar1);
//   ingestCar(car2, variantHeadersCar2);

//   const data = Array.from(rowMap.values()).map((entry) => {
//     const row: any = { feature: entry.feature };
//     allVariantHeaders.forEach((header) => {
//       if (entry.values[header] !== undefined) {
//         row[header] = entry.values[header];
//       }
//       // undefined => your table shows "No information Available"
//     });
//     return row;
//   });

//   return { columns, data };
// };


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