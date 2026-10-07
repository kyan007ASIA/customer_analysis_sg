import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ArrowUpDown, 
  Download, 
  Filter, 
  Search, 
  ChevronRight, 
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AssetRecord } from '../types/spatial';
import { ASSETS_DATA, DISTRICTS_DATA, CBD_BENCHMARK_RENT_PSF } from '../data/singaporeData';
import { SpatialScorecardPill } from './SpatialScorecardPill';
import { YieldDeltaMeter } from './YieldDeltaMeter';

interface AssetPortfolioMatrixProps {
  onSelectAsset: (asset: AssetRecord) => void;
  onSimulateAsset: (asset: AssetRecord) => void;
}

type SortField = 'name' | 'grossRentPsf' | 'occupancyRate' | 'capRate' | 'nlaSqft' | 'valuationSgdM' | 'waleYears';

export const AssetPortfolioMatrix: React.FC<AssetPortfolioMatrixProps> = ({
  onSelectAsset,
  onSimulateAsset
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [typologyFilter, setTypologyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('grossRentPsf');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAssets = useMemo(() => {
    return ASSETS_DATA.filter((asset) => {
      const matchDistrict = districtFilter === 'all' || asset.districtId === districtFilter;
      const matchTypology = typologyFilter === 'all' || asset.typology === typologyFilter;
      const matchSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.majorTenants.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchDistrict && matchTypology && matchSearch;
    }).sort((a, b) => {
      const multiplier = sortAsc ? 1 : -1;
      if (sortField === 'name') return multiplier * a.name.localeCompare(b.name);
      return multiplier * ((a[sortField] as number) - (b[sortField] as number));
    });
  }, [districtFilter, typologyFilter, searchQuery, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Aggregates for executive header strip
  const totalNla = filteredAssets.reduce((sum, a) => sum + a.nlaSqft, 0);
  const avgRent = filteredAssets.length ? filteredAssets.reduce((sum, a) => sum + a.grossRentPsf, 0) / filteredAssets.length : 0;
  const avgOccupancy = filteredAssets.length ? filteredAssets.reduce((sum, a) => sum + a.occupancyRate, 0) / filteredAssets.length : 0;
  const totalValuation = filteredAssets.reduce((sum, a) => sum + a.valuationSgdM, 0);

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 lg:p-6 overflow-y-auto bg-[#F8FAFC]">
      {/* Executive KPI Summary Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-[8px] border border-[#E2E8F0] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Tracked Institutional NLA
          </div>
          <div className="text-xl font-bold text-[#0F172A] mt-1 tabular-nums font-mono">
            {(totalNla / 1_000_000).toFixed(2)}M <span className="text-xs text-[#64748B] font-sans">sq ft</span>
          </div>
          <div className="text-[10px] text-[#059669] mt-1 flex items-center gap-1">
            <span className="font-semibold">12 Core Grade-A Assets</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#E2E8F0] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Weighted Mean Gross Rent
          </div>
          <div className="text-xl font-bold text-[#0F172A] mt-1 tabular-nums font-mono">
            S${avgRent.toFixed(2)} <span className="text-xs text-[#64748B] font-sans">PSF / mo</span>
          </div>
          <div className="text-[10px] text-[#0284C7] mt-1">
            CBD Benchmark: S${CBD_BENCHMARK_RENT_PSF.toFixed(2)}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#E2E8F0] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Committed Occupancy Rate
          </div>
          <div className="text-xl font-bold text-[#0F172A] mt-1 tabular-nums font-mono">
            {avgOccupancy.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#059669] mt-1">
            Institutional Flight to Quality
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#E2E8F0] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Asset Book Valuation
          </div>
          <div className="text-xl font-bold text-[#0F172A] mt-1 tabular-nums font-mono">
            S${(totalValuation / 1000).toFixed(2)}B
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">
            Weighted Cap Rate: 3.52%
          </div>
        </div>
      </div>

      {/* Filter and Query Control Bar */}
      <div className="bg-white p-3 rounded-[8px] border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tower name or tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* District Selector */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          >
            <option value="all">All Planning Districts</option>
            {DISTRICTS_DATA.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id} - {d.name}
              </option>
            ))}
          </select>

          {/* Typology Selector */}
          <select
            value={typologyFilter}
            onChange={(e) => setTypologyFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          >
            <option value="all">All Typologies</option>
            <option value="Grade-A Office">Grade-A Office</option>
            <option value="Mixed-Use Commercial">Mixed-Use Commercial</option>
            <option value="Tech Innovation Campus">Tech Innovation Campus</option>
            <option value="Regional Business Node">Regional Business Node</option>
          </select>
        </div>

        {/* Results count & Export */}
        <div className="flex items-center space-x-2 text-xs text-[#64748B]">
          <span className="font-mono">{filteredAssets.length} Assets Filtered</span>
        </div>
      </div>

      {/* Main High-Density Table */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] shadow-xs overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-9 bg-[#F8FAFC] border-b border-[#CBD5E1] text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                <th
                  onClick={() => handleSort('name')}
                  className="px-3.5 py-2 font-semibold cursor-pointer hover:text-[#0F172A]"
                >
                  <div className="flex items-center space-x-1">
                    <span>Asset & District</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 py-2 font-semibold">Scorecard</th>
                <th className="px-3 py-2 font-semibold">Typology</th>
                <th
                  onClick={() => handleSort('grossRentPsf')}
                  className="px-3 py-2 font-semibold text-right cursor-pointer hover:text-[#0F172A]"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Rent PSF / Mo</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 py-2 font-semibold w-36">CBD Benchmark Delta</th>
                <th
                  onClick={() => handleSort('occupancyRate')}
                  className="px-3 py-2 font-semibold text-right cursor-pointer hover:text-[#0F172A]"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Occupancy</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('capRate')}
                  className="px-3 py-2 font-semibold text-right cursor-pointer hover:text-[#0F172A]"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Cap Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('nlaSqft')}
                  className="px-3 py-2 font-semibold text-right cursor-pointer hover:text-[#0F172A]"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>NLA (Sq Ft)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 py-2 font-semibold">Green Mark</th>
                <th className="px-3 py-2 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="h-11 hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                >
                  {/* Asset Name & District */}
                  <td className="px-3.5 py-2">
                    <div className="font-semibold text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                      {asset.name}
                    </div>
                    <div className="text-[11px] text-[#64748B] truncate max-w-xs">
                      {asset.address}
                    </div>
                  </td>

                  {/* Scorecard Pill */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <SpatialScorecardPill
                      districtCode={asset.districtId}
                      liquidityScore={asset.liquidityScore}
                      size="sm"
                    />
                  </td>

                  {/* Typology */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-[11px] text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded-[3px] border border-[#E2E8F0]">
                      {asset.typology}
                    </span>
                  </td>

                  {/* Gross Rent PSF */}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <div className="font-bold text-[#0F172A] tabular-nums font-mono text-[13px]">
                      S${asset.grossRentPsf.toFixed(2)}
                    </div>
                  </td>

                  {/* CBD Benchmark Delta & Yield Meter */}
                  <td className="px-3 py-2 w-36 whitespace-nowrap">
                    <YieldDeltaMeter
                      currentRentPsf={asset.grossRentPsf}
                      benchmarkPsf={CBD_BENCHMARK_RENT_PSF}
                    />
                  </td>

                  {/* Occupancy */}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <span
                      className={`font-semibold tabular-nums ${
                        asset.occupancyRate >= 97 ? 'text-[#059669]' : 'text-[#0F172A]'
                      }`}
                    >
                      {asset.occupancyRate.toFixed(1)}%
                    </span>
                  </td>

                  {/* Cap Rate */}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <span className="font-mono text-[#475569] tabular-nums">
                      {asset.capRate.toFixed(2)}%
                    </span>
                  </td>

                  {/* NLA */}
                  <td className="px-3 py-2 text-right whitespace-nowrap font-mono tabular-nums text-[#475569]">
                    {asset.nlaSqft.toLocaleString()}
                  </td>

                  {/* Green Mark */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-[2px] border ${
                        asset.greenMarkRating.includes('Super Low')
                          ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                          : 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                      }`}
                    >
                      {asset.greenMarkRating.replace('Platinum', 'Plat')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSimulateAsset(asset);
                      }}
                      className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#0F172A] hover:text-white rounded-[3px] text-[10px] font-semibold text-[#0F172A] border border-[#CBD5E1] transition-all"
                      title="Load into URA Plot Ratio Simulator"
                    >
                      Simulate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
