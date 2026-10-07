import React, { useState } from 'react';
import { 
  Calculator, 
  Building2, 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Sliders, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { AssetRecord } from '../types/spatial';
import { DISTRICTS_DATA, ASSETS_DATA } from '../data/singaporeData';

interface UraZoningSimulatorProps {
  initialAsset?: AssetRecord | null;
}

export const UraZoningSimulator: React.FC<UraZoningSimulatorProps> = ({ initialAsset }) => {
  // Preset or custom site configuration
  const [siteName, setSiteName] = useState(initialAsset?.name || 'Anson House (72 Anson Road)');
  const [districtId, setDistrictId] = useState(initialAsset?.districtId || 'SGP-D02-TJP');
  const [siteAreaSqm, setSiteAreaSqm] = useState(initialAsset ? Math.round(initialAsset.nlaSqft / 10.764 / 8.4) : 3150); // ~3,150 sqm (~33,900 sqft)
  const [baselineGpr, setBaselineGpr] = useState(initialAsset?.plotRatio || 8.4);
  const [scheme, setScheme] = useState<'cbd_incentive' | 'strategic_dev' | 'green_bonus' | 'baseline'>('cbd_incentive');
  const [conversionMix, setConversionMix] = useState<'hotel_res' | 'mixed_res_comm' | 'commercial'>('mixed_res_comm');
  const [constructionCapexPsf, setConstructionCapexPsf] = useState(520); // SGD PSF GFA
  const [targetExitPsf, setTargetExitPsf] = useState(2950); // SGD PSF
  const [lbcRatePsf, setLbcRatePsf] = useState(1150); // SGD PSF for differential premium / LBC

  // Conversion calculations
  const siteAreaSqft = siteAreaSqm * 10.7639;
  const baselineGfaSqft = siteAreaSqft * baselineGpr;

  // Bonus GFA percentage calculation based on URA policies
  let bonusGfaPercent = 0;
  if (scheme === 'cbd_incentive') {
    bonusGfaPercent = conversionMix === 'hotel_res' ? 30.0 : 25.0;
  } else if (scheme === 'strategic_dev') {
    bonusGfaPercent = 20.0;
  } else if (scheme === 'green_bonus') {
    bonusGfaPercent = 3.0;
  }

  const bonusGfaSqft = baselineGfaSqft * (bonusGfaPercent / 100);
  const totalGfaSqft = baselineGfaSqft + bonusGfaSqft;

  // Financial model metrics
  const estLbcSgdM = (bonusGfaSqft * lbcRatePsf) / 1_000_000;
  const estConstructionCapexSgdM = (totalGfaSqft * constructionCapexPsf) / 1_000_000;
  const projectedGdvSgdM = (totalGfaSqft * targetExitPsf * 0.88) / 1_000_000; // Assuming 88% efficiency ratio for NLA
  const totalProjectCostSgdM = estLbcSgdM + estConstructionCapexSgdM + (siteAreaSqft * 1200 / 1_000_000); // Including imputed land value
  const netDevelopmentMarginSgdM = projectedGdvSgdM - totalProjectCostSgdM;
  const marginPercent = (netDevelopmentMarginSgdM / projectedGdvSgdM) * 100;

  const handleLoadPreset = (asset: AssetRecord) => {
    setSiteName(asset.name);
    setDistrictId(asset.districtId);
    setSiteAreaSqm(Math.round(asset.nlaSqft / 10.764 / 8.4));
    setBaselineGpr(asset.plotRatio);
  };

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto bg-[#F8FAFC] space-y-5">
      {/* Simulator Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#CBD5E1]">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#0F172A] text-white rounded-[4px]">
              <Calculator className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              URA Master Plan & Plot Ratio Uplift Simulator
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Evaluate bonus Gross Floor Area (GFA) allowances under the URA CBD Incentive Scheme, Strategic Development Scheme, and LBC differential premiums.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-[#64748B] uppercase">Preset Sites:</span>
          {ASSETS_DATA.filter(a => a.isUraCbdIncentiveTarget).slice(0, 3).map(asset => (
            <button
              key={asset.id}
              onClick={() => handleLoadPreset(asset)}
              className="px-2 py-1 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-[3px] text-[11px] font-semibold text-[#0F172A] transition-colors"
            >
              {asset.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-time Output Model */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Parameter Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-[8px] border border-[#CBD5E1] shadow-xs space-y-4">
            <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <span>1. Site & Planning Baseline</span>
              <span className="text-[10px] text-[#0284C7] font-semibold">{districtId}</span>
            </div>

            {/* Site Name */}
            <div>
              <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                Target Development Site
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
              />
            </div>

            {/* Site Area in SQM */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                  Site Land Area (sq m)
                </label>
                <input
                  type="number"
                  value={siteAreaSqm}
                  onChange={(e) => setSiteAreaSqm(Number(e.target.value))}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs text-[#0F172A] font-mono tabular-nums focus:outline-none focus:border-[#0284C7]"
                />
                <span className="text-[10px] text-[#64748B] mt-0.5 block">
                  ≈ {(siteAreaSqft).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                  Baseline GPR
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={baselineGpr}
                  onChange={(e) => setBaselineGpr(Number(e.target.value))}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs text-[#0F172A] font-mono tabular-nums focus:outline-none focus:border-[#0284C7]"
                />
                <span className="text-[10px] text-[#64748B] mt-0.5 block">
                  Standard URA 8.4 - 11.2x
                </span>
              </div>
            </div>

            {/* Scheme Selection */}
            <div className="pt-2 border-t border-[#F1F5F9]">
              <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono mb-2">
                2. URA Incentive Mechanism
              </div>

              <div className="space-y-2">
                {[
                  {
                    id: 'cbd_incentive',
                    title: 'URA CBD Incentive Scheme',
                    bonus: '+25% to +30%',
                    desc: 'For transforming older office towers into mixed-use residential & hospitality hubs.'
                  },
                  {
                    id: 'strategic_dev',
                    title: 'Strategic Development Scheme (SDS)',
                    bonus: '+20%',
                    desc: 'Joint comprehensive redevelopment amalgamating contiguous commercial plots.'
                  },
                  {
                    id: 'green_bonus',
                    title: 'BCA Green Mark Super Low Energy',
                    bonus: '+3%',
                    desc: 'Green plot ratio bonus for carbon-neutral envelope construction.'
                  },
                  {
                    id: 'baseline',
                    title: 'No Incentive (Standard Baseline)',
                    bonus: '0%',
                    desc: 'Like-for-like commercial redevelopment under gazetted plot ratio.'
                  }
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`block p-2.5 rounded-[4px] border cursor-pointer transition-all ${
                      scheme === s.id
                        ? 'bg-[#F0F9FF] border-[#0284C7] ring-1 ring-[#0284C7]'
                        : 'bg-white border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="scheme"
                          value={s.id}
                          checked={scheme === s.id}
                          onChange={() => setScheme(s.id as any)}
                          className="accent-[#0F172A]"
                        />
                        <span className="text-xs font-semibold text-[#0F172A]">{s.title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded-[2px] border border-[#A7F3D0]">
                        {s.bonus}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] ml-5 mt-1 leading-tight">
                      {s.desc}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Conversion Mix */}
            {scheme === 'cbd_incentive' && (
              <div className="pt-2 border-t border-[#F1F5F9]">
                <label className="block text-[11px] font-semibold text-[#475569] uppercase mb-1">
                  Target Redevelopment Mix
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setConversionMix('mixed_res_comm')}
                    className={`p-2 rounded-[4px] border text-left transition-all ${
                      conversionMix === 'mixed_res_comm'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-white text-[#0F172A] border-[#CBD5E1]'
                    }`}
                  >
                    <div className="font-semibold text-xs">60% Resi / 40% Comm</div>
                    <div className="text-[10px] opacity-80">+25% Bonus GFA</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConversionMix('hotel_res')}
                    className={`p-2 rounded-[4px] border text-left transition-all ${
                      conversionMix === 'hotel_res'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-white text-[#0F172A] border-[#CBD5E1]'
                    }`}
                  >
                    <div className="font-semibold text-xs">Hotel & Residential</div>
                    <div className="text-[10px] opacity-80">+30% Bonus GFA</div>
                  </button>
                </div>
              </div>
            )}

            {/* Cost & Exit Assumptions */}
            <div className="pt-2 border-t border-[#F1F5F9] space-y-3">
              <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
                3. Cost & Valuation Parameters
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-0.5">
                    Capex (PSF GFA)
                  </label>
                  <input
                    type="number"
                    value={constructionCapexPsf}
                    onChange={(e) => setConstructionCapexPsf(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] px-2 py-1 text-xs text-[#0F172A] font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-0.5">
                    LBC Rate (PSF)
                  </label>
                  <input
                    type="number"
                    value={lbcRatePsf}
                    onChange={(e) => setLbcRatePsf(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] px-2 py-1 text-xs text-[#0F172A] font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-0.5">
                    Target Exit PSF
                  </label>
                  <input
                    type="number"
                    value={targetExitPsf}
                    onChange={(e) => setTargetExitPsf(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] px-2 py-1 text-xs text-[#0F172A] font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Computed Outputs & Institutional Metrics (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* GFA Uplift Waterfall Summary */}
          <div className="bg-white p-4 rounded-[8px] border border-[#CBD5E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0284C7]" />
                Permissible GFA Waterfall Analysis
              </span>
              <span className="text-[11px] font-mono font-semibold text-[#059669]">
                +{bonusGfaPercent}% UPLIFT
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#F8FAFC] rounded-[4px] border border-[#E2E8F0]">
                <div className="text-[10px] font-mono text-[#64748B] uppercase">Baseline GFA</div>
                <div className="text-lg font-bold text-[#0F172A] font-mono tabular-nums mt-1">
                  {Math.round(baselineGfaSqft).toLocaleString()}
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5">GPR {baselineGpr.toFixed(1)}x</div>
              </div>

              <div className="p-3 bg-[#F0FDF4] rounded-[4px] border border-[#BBF7D0]">
                <div className="text-[10px] font-mono text-[#166534] uppercase">Incentive Bonus GFA</div>
                <div className="text-lg font-bold text-[#15803D] font-mono tabular-nums mt-1">
                  +{Math.round(bonusGfaSqft).toLocaleString()}
                </div>
                <div className="text-[10px] text-[#166534] mt-0.5">+{bonusGfaPercent}% Bonus</div>
              </div>

              <div className="p-3 bg-[#0F172A] text-white rounded-[4px] border border-[#1E293B]">
                <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Total Permissible GFA</div>
                <div className="text-lg font-bold text-[#38BDF8] font-mono tabular-nums mt-1">
                  {Math.round(totalGfaSqft).toLocaleString()}
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-0.5">Effective GPR: {(baselineGpr * (1 + bonusGfaPercent/100)).toFixed(2)}x</div>
              </div>
            </div>

            {/* Visual GFA Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-[#64748B]">
                <span>Permissible Development Volume</span>
                <span className="font-mono">{(totalGfaSqft / 1000).toFixed(0)}k sq ft GFA</span>
              </div>
              <div className="h-4 bg-[#E2E8F0] rounded-[3px] overflow-hidden flex">
                <div
                  className="bg-[#0F172A] h-full flex items-center justify-center text-[9px] text-white font-mono"
                  style={{ width: `${(baselineGfaSqft / totalGfaSqft) * 100}%` }}
                >
                  Baseline {((baselineGfaSqft / totalGfaSqft) * 100).toFixed(0)}%
                </div>
                <div
                  className="bg-[#059669] h-full flex items-center justify-center text-[9px] text-white font-mono font-bold"
                  style={{ width: `${(bonusGfaSqft / totalGfaSqft) * 100}%` }}
                >
                  Bonus {((bonusGfaSqft / totalGfaSqft) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Feasibility & Profitability Model */}
          <div className="bg-white p-4 rounded-[8px] border border-[#CBD5E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#059669]" />
                Institutional Pro-Forma Economics
              </span>
              <span className="text-[10px] font-mono bg-[#F1F5F9] px-2 py-0.5 rounded-[2px] border border-[#CBD5E1]">
                CURRENCY: SGD
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                <span className="text-[10px] text-[#64748B] block font-mono">EST. LBC TAX</span>
                <span className="text-base font-bold text-[#0F172A] font-mono tabular-nums">
                  S${estLbcSgdM.toFixed(1)}M
                </span>
                <span className="text-[10px] text-[#94A3B8] block">Differential Premium</span>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                <span className="text-[10px] text-[#64748B] block font-mono">CONSTRUCTION CAPEX</span>
                <span className="text-base font-bold text-[#0F172A] font-mono tabular-nums">
                  S${estConstructionCapexSgdM.toFixed(1)}M
                </span>
                <span className="text-[10px] text-[#94A3B8] block">S${constructionCapexPsf}/psf GFA</span>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                <span className="text-[10px] text-[#64748B] block font-mono">PROJECTED GDV</span>
                <span className="text-base font-bold text-[#0284C7] font-mono tabular-nums">
                  S${projectedGdvSgdM.toFixed(1)}M
                </span>
                <span className="text-[10px] text-[#94A3B8] block">At S${targetExitPsf}/psf</span>
              </div>

              <div className="p-2.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-[4px]">
                <span className="text-[10px] text-[#065F46] block font-mono">NET DEV MARGIN</span>
                <span className="text-base font-bold text-[#059669] font-mono tabular-nums">
                  +{marginPercent.toFixed(1)}%
                </span>
                <span className="text-[10px] text-[#065F46] block font-mono">
                  +S${netDevelopmentMarginSgdM.toFixed(1)}M
                </span>
              </div>
            </div>

            {/* Regulatory Feasibility Checklist */}
            <div className="bg-[#F8FAFC] p-3 rounded-[4px] border border-[#E2E8F0] space-y-2 text-xs">
              <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                URA Policy Compliance Gateways
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Site Area &gt; 1,000 sqm ({siteAreaSqm.toLocaleString()} sqm verified)</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Downtown Core / Anson Incentive Corridor eligible</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Target BCA Green Mark Platinum baseline incorporated</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span>Subterranean MRT connection provision supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
