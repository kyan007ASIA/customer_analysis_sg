import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  FileText, 
  TrendingUp, 
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import { MACRO_STATISTICS, ASSETS_DATA, DISTRICTS_DATA } from '../data/singaporeData';
import { AssetRecord, DistrictInfo } from '../types/spatial';

interface HeaderBarProps {
  onSelectAsset: (asset: AssetRecord) => void;
  onSelectDistrict: (district: DistrictInfo) => void;
  activeFilterSummary: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onSelectAsset,
  onSelectDistrict,
  activeFilterSummary
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCirculars, setShowCirculars] = useState(false);

  const filteredAssets = searchQuery.trim()
    ? ASSETS_DATA.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.majorTenants.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredDistricts = searchQuery.trim()
    ? DISTRICTS_DATA.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.zone.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const circulars = [
    {
      id: 'URA-2026-C04',
      date: 'Today 09:30 SGT',
      title: 'URA Master Plan Review: CBD Incentive Scheme Extension',
      dept: 'Urban Redevelopment Authority',
      summary: 'Eligibility window for Anson and Cecil Street redevelopment bonus GFA extended through Q4 2027.'
    },
    {
      id: 'BCA-2026-GM02',
      date: 'Yesterday 16:15 SGT',
      title: 'BCA Green Mark 2026 Carbon Metric Threshold Update',
      dept: 'Building and Construction Authority',
      summary: 'Super Low Energy requirement now incorporates embodied carbon benchmarks for commercial retrofits.'
    },
    {
      id: 'MAS-2026-R01',
      date: '05 Oct 2026',
      title: 'MAS SORA Overnight Index: 3.12% Fixed Fixing',
      dept: 'Monetary Authority of Singapore',
      summary: '3-Month Compounded SORA benchmark declines 8 bps following Fed policy stabilization.'
    }
  ];

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-xs">
      {/* Top Telemetry Strip */}
      <div className="bg-[#0F172A] text-white text-[11px] font-mono py-1.5 px-4 flex items-center justify-between overflow-x-auto whitespace-nowrap border-b border-[#1E293B]">
        <div className="flex items-center space-x-6 divide-x divide-[#334155]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[#94A3B8] uppercase tracking-wider text-[10px]">URA LIVE GIS LINK</span>
            <span className="text-[#38BDF8] font-semibold">SYNCHRONIZED (SGT)</span>
          </div>
          
          <div className="pl-4 flex items-center space-x-1.5">
            <span className="text-[#94A3B8]">MAS SORA 3M:</span>
            <span className="text-white font-semibold tabular-nums">{MACRO_STATISTICS.soraRate}</span>
            <span className="text-[#34D399] text-[10px]">{MACRO_STATISTICS.soraDelta}</span>
          </div>

          <div className="pl-4 flex items-center space-x-1.5">
            <span className="text-[#94A3B8]">CBD GRADE-A:</span>
            <span className="text-white font-semibold tabular-nums">{MACRO_STATISTICS.cbdGrossRentPsf} PSF</span>
            <span className="text-[#34D399] text-[10px]">{MACRO_STATISTICS.cbdGrossRentDelta}</span>
          </div>

          <div className="pl-4 flex items-center space-x-1.5 hidden md:flex">
            <span className="text-[#94A3B8]">CORE CAP RATE:</span>
            <span className="text-[#FBBF24] font-semibold tabular-nums">{MACRO_STATISTICS.coreCapRate}</span>
          </div>

          <div className="pl-4 flex items-center space-x-1.5 hidden lg:flex">
            <span className="text-[#94A3B8]">URA OFFICE INDEX:</span>
            <span className="text-[#34D399] font-semibold tabular-nums">{MACRO_STATISTICS.uraPriceIndexDelta}</span>
          </div>

          <div className="pl-4 flex items-center space-x-1.5 hidden xl:flex">
            <span className="text-[#94A3B8]">FOREIGN SOVEREIGN INFLOW:</span>
            <span className="text-[#38BDF8] font-semibold tabular-nums">{MACRO_STATISTICS.institutionalForeignShare}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[10px] text-[#94A3B8]">
          <span className="hidden sm:inline">DATA CYCLE: Q3/Q4-2026</span>
          <span className="bg-[#1E293B] text-[#E2E8F0] px-2 py-0.5 rounded-[2px] font-semibold border border-[#334155]">
            GOVTECH SGP v4.2
          </span>
        </div>
      </div>

      {/* Main Navigation Sub-Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left Search input */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Singapore towers, districts, tenants (e.g. CapitaSpring, Guoco, D01)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] pl-9 pr-8 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {isSearchOpen && (filteredAssets.length > 0 || filteredDistricts.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#CBD5E1] rounded-[4px] shadow-lg z-50 max-h-80 overflow-y-auto">
              {filteredAssets.length > 0 && (
                <div className="p-2 border-b border-[#F1F5F9]">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 py-1">
                    Commercial Assets ({filteredAssets.length})
                  </div>
                  {filteredAssets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        onSelectAsset(asset);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-[3px] hover:bg-[#F1F5F9] flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0284C7]">
                          {asset.name}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {asset.address}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#0F172A] tabular-nums">
                          S${asset.grossRentPsf.toFixed(2)}/psf
                        </span>
                        <div className="text-[10px] text-[#0D9488] font-medium">
                          {asset.occupancyRate}% occ
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredDistricts.length > 0 && (
                <div className="p-2">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 py-1">
                    Planning Districts ({filteredDistricts.length})
                  </div>
                  {filteredDistricts.map(district => (
                    <button
                      key={district.id}
                      onClick={() => {
                        onSelectDistrict(district);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-[3px] hover:bg-[#F1F5F9] flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#0F172A] group-hover:text-[#0284C7]">
                          {district.name}
                        </div>
                        <div className="text-[10px] text-[#64748B] font-mono">
                          {district.id} • {district.zone}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold bg-[#F1F5F9] text-[#0F172A] px-2 py-0.5 rounded-[3px] border border-[#CBD5E1]">
                        Score {district.liquidityScore}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-3">
          {/* Active Context badge */}
          <div className="hidden md:flex items-center space-x-1.5 bg-[#F1F5F9] border border-[#CBD5E1] px-2.5 py-1 rounded-[4px] text-[11px]">
            <Sliders className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="text-[#64748B]">Active Scope:</span>
            <span className="font-semibold text-[#0F172A]">{activeFilterSummary}</span>
          </div>

          {/* URA Policy Circulars Bell */}
          <div className="relative">
            <button
              onClick={() => setShowCirculars(!showCirculars)}
              className="relative p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-[4px] border border-[#E2E8F0] transition-colors"
              title="Official URA & Regulatory Notices"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full ring-2 ring-white"></span>
            </button>

            {showCirculars && (
              <div className="absolute right-0 mt-2 w-96 bg-white border border-[#CBD5E1] rounded-[6px] shadow-xl z-50 p-3">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#0284C7]" />
                    <span className="text-xs font-bold text-[#0F172A]">URA & Regulatory Circulars</span>
                  </div>
                  <button onClick={() => setShowCirculars(false)} className="text-[#94A3B8] hover:text-[#0F172A]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {circulars.map(c => (
                    <div key={c.id} className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px]">
                      <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1">
                        <span className="font-mono font-semibold text-[#0284C7]">{c.id}</span>
                        <span>{c.date}</span>
                      </div>
                      <div className="text-xs font-semibold text-[#0F172A] leading-tight mb-1">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-[#475569] leading-relaxed">
                        {c.summary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
