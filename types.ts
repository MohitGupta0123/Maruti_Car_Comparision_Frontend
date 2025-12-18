// src/types.ts

export interface SelectionState {
  brand: string;
  model: string;
  variant: string;
  version?: string;
}

export interface ModelDetails {
  brands: string[];
  models: Record<string, string[]>;
  variants: Record<string, string[]>;
  versions: Record<string, string[]>;
}

export interface ComparisonResponse {
  columns: string[];
  data: Record<string, any>[];
}

export interface GroupedFeature {
  featureName: string;
  values: Record<string, string>;
}

export interface FeatureGroup {
  groupName: string;
  items: GroupedFeature[];
}

// News related types
export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  source: {
    name: string;
    icon?: string;
    authors?: string[];
  };
  published: string;
}

export interface NewsResponse {
  car: string;
  total: number;
  top5_news: NewsArticle[];
}