// export interface CarOption {
//   value: string;
//   label: string;
// }

// export interface SelectionState {
//   brand: string;
//   model: string;
//   variant: string;
// }

// export interface ComparisonRow {
//   feature: string;
//   [variantName: string]: string; // Dynamic keys for variant values
// }

// // The raw data structure expected from the API for the comparison table
// export interface ComparisonResponse {
//   columns: string[]; // e.g., ["Feature", "Creta SX", "Seltos GTX"]
//   data: ComparisonRow[];
// }

// // Internal structure for grouped data
// export interface GroupedFeature {
//   featureName: string;
//   values: { [variant: string]: string };
// }

// export interface FeatureGroup {
//   groupName: string;
//   items: GroupedFeature[];
// }

// // Structure for the Cascading Dropdown Data (Mock)
// export interface ModelDetails {
//   brands: string[];
//   models: Record<string, string[]>; // Brand -> Models
//   variants: Record<string, string[]>; // Model -> Variants
// }











// src/types.ts

export interface SelectionState {
  brand: string;
  model: string;
  variant: string;
}

export interface ModelDetails {
  brands: string[];
  models: Record<string, string[]>;
  variants: Record<string, string[]>;
}

export interface ComparisonRow {
  feature: string;
  [key: string]: string; // dynamic keys for variant columns
}

export interface ComparisonResponse {
  columns: string[];      // ["Feature", "<col1>", "<col2>", ...]
  data: ComparisonRow[];  // each has "feature" + variant columns
}

export interface GroupedFeature {
  featureName: string;
  values: { [variantName: string]: string };
}

export interface FeatureGroup {
  groupName: string;
  items: GroupedFeature[];
}
