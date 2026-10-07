export type ViewMode = 'map' | 'portfolio' | 'zoning' | 'transactions' | 'briefing' | 'onemap';

export type HeatmapMetric = 'rent' | 'liquidity' | 'vacancy' | 'footfall' | 'greenMark';

export interface DistrictInfo {
  id: string; // e.g. SGP-D01-MRN
  name: string;
  zone: string; // e.g. Downtown Core
  subzone: string;
  liquidityScore: number; // 0 - 100
  avgRentPsf: number; // SGD PSF / month
  cbdDeltaPsf: number;
  capRate: number; // %
  occupancyRate: number; // %
  totalStockNla: number; // sqft
  avgPlotRatio: number;
  footfallIndex: number; // 0 - 100
  uraIncentiveEligible: boolean;
  status: 'outperforming' | 'advisory' | 'severe' | 'stable';
  coordinates: { x: number; y: number }; // Relative map coordinate
  description: string;
  keyTenants: string[];
  mrtLines: string[];
}

export interface AssetRecord {
  id: string;
  name: string;
  districtId: string;
  address: string;
  typology: 'Grade-A Office' | 'Mixed-Use Commercial' | 'Biotech / R&D Hub' | 'Tech Innovation Campus' | 'Regional Business Node';
  nlaSqft: number;
  grossRentPsf: number;
  cbdDeltaPsf: number;
  occupancyRate: number; // %
  waleYears: number; // Weighted Average Lease Expiry
  capRate: number; // %
  greenMarkRating: 'Platinum Super Low Energy' | 'Platinum' | 'GoldPLUS' | 'Certified';
  tenure: string; // e.g. 99-year from 2007, 999-year, Freehold
  majorTenants: { name: string; sharePercent: number }[];
  yearCompleted: number;
  storeys: number;
  coordinates: { x: number; y: number };
  liquidityScore: number;
  plotRatio: number;
  valuationSgdM: number;
  footfallIndex: number;
  mrtStation: string;
  isUraCbdIncentiveTarget: boolean;
}

export interface CapitalTransaction {
  id: string;
  assetName: string;
  districtId: string;
  transactedDate: string;
  transactedPriceSgdM: number;
  psfNla: number;
  buyer: string;
  seller: string;
  buyerCategory: 'Sovereign Wealth' | 'S-REIT' | 'Private Equity' | 'Institutional Fund' | 'Family Office';
  capitalOrigin: 'Singapore' | 'United States' | 'Hong Kong / China' | 'Europe' | 'Japan' | 'Middle East';
  npiYield: number; // %
  tenure: string;
}

export interface UraSimulatorConfig {
  siteName: string;
  districtId: string;
  siteAreaSqm: number;
  baselinePlotRatio: number;
  proposedScheme: 'none' | 'cbd_incentive' | 'strategic_dev' | 'green_bonus';
  conversionType: 'commercial_res' | 'hotel_office' | 'full_commercial';
  constructionCostPsfGfa: number;
  expectedExitPsf: number;
  discountRate: number;
}
