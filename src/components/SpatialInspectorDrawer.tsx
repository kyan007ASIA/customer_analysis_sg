import React from 'react';
import { 
  X, 
  ExternalLink, 
  Building2, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  Train, 
  Users, 
  Calculator, 
  Calendar,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AssetRecord, DistrictInfo, ViewMode } from '../types/spatial';
import { SpatialScorecardPill } from './SpatialScorecardPill';
import { YieldDeltaMeter } from './YieldDeltaMeter';
import { CBD_BENCHMARK_RENT_PSF } from '../data/singaporeData';

interface SpatialInspectorDrawerProps {
  selectedAsset: AssetRecord | null;
  selectedDistrict: DistrictInfo | null;
  onClose: () => void;
  onSelectView: (view: ViewMode) => void;
  onSimulateAsset: (asset: AssetRecord) => void;
  isOpen: boolean;
}

export const SpatialInspectorDrawer: React.FC<SpatialInspectorDrawerProps> = ({
  selectedAsset,
  selectedDistrict,
  onClose,
  onSelectView,
  onSimulateAsset,
  isOpen
}) => {
  if (!isOpen) return null;

  // If no asset is selected, inspect the district; if neither, show placeholder
  const isInspectingAsset = !!selectedAsset;
  const currentTitle = isInspectingAsset ? selectedAsset.name : selectedDistrict?.name || 'Spatial Inspector';
  const districtCode = isInspectingAsset ? selectedAsset.districtId : selectedDistrict?.id || 'SGP-D01-MRN';
  const liquidityScore = isInspectingAsset ? selectedAsset.liquidityScore : selectedDistrict?.liquidityScore || 90.0;

  return (
    <aside
      className="w-full lg:w-[420px] bg-white border-l border-[#CBD5E1] shadow-lg flex flex-col h-full overflow-hidden shrink-0 z-30"
    >
      {/* Drawer Header */}
      <div className="p-4 bg-[#F8FAFC] border-b border-[#CBD5E1] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#0284C7]" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            {isInspectingAsset ? 'Commercial Asset Telemetry' : 'Planning Subzone Profile'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-[3px] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Entity Title & Scorecard Pill */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <SpatialScorecardPill districtCode={districtCode} liquidityScore={liquidityScore} />
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${
                isInspectingAsset
                  ? selectedAsset.occupancyRate >= 96
                    ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                    : 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                  : selectedDistrict?.status === 'outperforming'
                  ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                  : 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]'
              }`}
            >
              {isInspectingAsset
                ? `${selectedAsset.occupancyRate}% COMMITTED`
                : selectedDistrict?.status.toUpperCase()}
            </span>
          </div>

          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight leading-snug">
            {currentTitle}
          </h2>

          <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1 font-mono">
            <Compass className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
            <span>{isInspectingAsset ? selectedAsset.address : selectedDistrict?.subzone}</span>
          </p>
        </div>

        {/* Primary Analytical KPIs */}
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-[6px] p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#64748B] font-semibold">
              Gross Effective Rent
            </span>
            <span className="text-[10px] text-[#64748B]">Benchmark S$13.35</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-[#0F172A] tabular-nums font-mono">
                S${isInspectingAsset ? selectedAsset.grossRentPsf.toFixed(2) : selectedDistrict?.avgRentPsf.toFixed(2)}
              </span>
              <span className="text-xs text-[#64748B]">PSF / mo</span>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-semibold tabular-nums ${
                  (isInspectingAsset ? selectedAsset.cbdDeltaPsf : selectedDistrict?.cbdDeltaPsf || 0) >= 0
                    ? 'text-[#059669]'
                    : 'text-[#0284C7]'
                }`}
              >
                {(isInspectingAsset ? selectedAsset.cbdDeltaPsf : selectedDistrict?.cbdDeltaPsf || 0) >= 0 ? '+' : ''}
                S${(isInspectingAsset ? selectedAsset.cbdDeltaPsf : selectedDistrict?.cbdDeltaPsf || 0).toFixed(2)} vs CBD
              </span>
            </div>
          </div>

          {/* Yield Delta Meter component */}
          <YieldDeltaMeter
            currentRentPsf={isInspectingAsset ? selectedAsset.grossRentPsf : selectedDistrict?.avgRentPsf || 13.0}
            benchmarkPsf={CBD_BENCHMARK_RENT_PSF}
          />

          {/* Secondary stats grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-center">
            <div className="p-1.5 bg-white rounded-[3px] border border-[#E2E8F0]">
              <div className="text-[10px] text-[#94A3B8] font-mono">CAP RATE</div>
              <div className="text-xs font-bold text-[#0F172A] tabular-nums">
                {isInspectingAsset ? selectedAsset.capRate.toFixed(2) : selectedDistrict?.capRate.toFixed(2)}%
              </div>
            </div>

            <div className="p-1.5 bg-white rounded-[3px] border border-[#E2E8F0]">
              <div className="text-[10px] text-[#94A3B8] font-mono">OCCUPANCY</div>
              <div className="text-xs font-bold text-[#0F172A] tabular-nums">
                {isInspectingAsset ? selectedAsset.occupancyRate.toFixed(1) : selectedDistrict?.occupancyRate.toFixed(1)}%
              </div>
            </div>

            <div className="p-1.5 bg-white rounded-[3px] border border-[#E2E8F0]">
              <div className="text-[10px] text-[#94A3B8] font-mono">
                {isInspectingAsset ? 'WALE' : 'PLOT RATIO'}
              </div>
              <div className="text-xs font-bold text-[#0F172A] tabular-nums">
                {isInspectingAsset ? `${selectedAsset.waleYears} Yrs` : `${selectedDistrict?.avgPlotRatio}x`}
              </div>
            </div>
          </div>
        </div>

        {/* URA Planning Parameters & Zoning Framework */}
        <div className="border border-[#CBD5E1] rounded-[6px] p-3 space-y-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#F1F5F9]">
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
              URA Master Plan Telemetry
            </span>
            <span className="text-[10px] font-mono text-[#059669] font-semibold bg-[#ECFDF5] px-1.5 py-0.5 rounded-[2px] border border-[#A7F3D0]">
              GAZETTED
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Zoning Classification</span>
              <span className="font-semibold text-[#0F172A]">
                {isInspectingAsset ? selectedAsset.typology : `${selectedDistrict?.zone} (Commercial)`}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Gross Plot Ratio (GPR)</span>
              <span className="font-semibold text-[#0F172A] font-mono">
                {isInspectingAsset ? `${selectedAsset.plotRatio}.0 GPR` : `${selectedDistrict?.avgPlotRatio}.0 Base`}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">Land Tenure</span>
              <span className="font-semibold text-[#0F172A]">
                {isInspectingAsset ? selectedAsset.tenure : 'State Leasehold (99y) / 999y'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#F8FAFC]">
              <span className="text-[#64748B]">URA CBD Incentive Scheme</span>
              <span className={`font-semibold ${
                (isInspectingAsset ? selectedAsset.isUraCbdIncentiveTarget : selectedDistrict?.uraIncentiveEligible)
                  ? 'text-[#059669]'
                  : 'text-[#64748B]'
              }`}>
                {(isInspectingAsset ? selectedAsset.isUraCbdIncentiveTarget : selectedDistrict?.uraIncentiveEligible)
                  ? 'Eligible (+25% to +30% GFA)'
                  : 'Standard Baseline'}
              </span>
            </div>

            {isInspectingAsset && (
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">BCA Green Mark Standard</span>
                <span className="font-semibold text-[#0D9488] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
                  {selectedAsset.greenMarkRating}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tenant Portfolio / Key Anchors */}
        <div className="border border-[#CBD5E1] rounded-[6px] p-3 space-y-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#F1F5F9]">
            <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#0284C7]" />
              {isInspectingAsset ? 'Top Anchor Tenants' : 'Key District Occupiers'}
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">INSTITUTIONAL GRADE</span>
          </div>

          {isInspectingAsset ? (
            <div className="space-y-2">
              {selectedAsset.majorTenants.map((tenant) => (
                <div key={tenant.name} className="flex flex-col space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#0F172A]">{tenant.name}</span>
                    <span className="font-mono text-[#64748B] tabular-nums font-semibold">{tenant.sharePercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0284C7] rounded-full"
                      style={{ width: `${tenant.sharePercent * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedDistrict?.keyTenants.map((name) => (
                <span
                  key={name}
                  className="px-2 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] text-xs font-medium text-[#0F172A]"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Transit & Commuter Connectivity */}
        <div className="p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-[6px]">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0369A1] mb-1.5">
            <Train className="w-4 h-4" />
            <span>Transit Arterials & Isochrone</span>
          </div>
          <div className="text-xs text-[#0C4A6E] font-medium mb-1">
            {isInspectingAsset ? selectedAsset.mrtStation : selectedDistrict?.mrtLines.join(' • ')}
          </div>
          <div className="text-[11px] text-[#0369A1]/80 leading-relaxed">
            Sheltered underground pedestrian connectivity within Singapore Downtown subterranean network.
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="space-y-2 pt-2">
          {isInspectingAsset && (
            <button
              onClick={() => onSimulateAsset(selectedAsset)}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-2 px-3 rounded-[4px] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-xs"
            >
              <Calculator className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Simulate Site in URA Plot Calculator</span>
            </button>
          )}

          <button
            onClick={() => onSelectView('portfolio')}
            className="w-full bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] py-2 px-3 rounded-[4px] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>Compare in Asset Portfolio Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B]" />
          </button>
        </div>
      </div>
    </aside>
  );
};
