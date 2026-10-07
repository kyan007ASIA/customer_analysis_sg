import React from 'react';
import { 
  Compass, 
  Building2, 
  Calculator, 
  ArrowLeftRight, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Radio,
  ExternalLink,
  ChevronRight,
  MapPin,
  Globe2
} from 'lucide-react';
import { ViewMode, DistrictInfo } from '../types/spatial';
import { DISTRICTS_DATA } from '../data/singaporeData';

interface NavigationRailProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  selectedDistrict: DistrictInfo | null;
  onSelectDistrict: (district: DistrictInfo) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentView,
  onSelectView,
  selectedDistrict,
  onSelectDistrict,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'map',
      label: 'Spatial Map Stage',
      icon: <Compass className="w-4 h-4" />,
      badge: 'GIS LIVE'
    },
    {
      id: 'portfolio',
      label: 'Asset Portfolio Matrix',
      icon: <Building2 className="w-4 h-4" />,
      badge: '12 TOWERS'
    },
    {
      id: 'zoning',
      label: 'URA Zoning & Plot Simulator',
      icon: <Calculator className="w-4 h-4" />
    },
    {
      id: 'transactions',
      label: 'Capital Deals & Liquidity',
      icon: <ArrowLeftRight className="w-4 h-4" />,
      badge: 'S$4.8B'
    },
    {
      id: 'briefing',
      label: 'Executive Briefing Studio',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'onemap',
      label: 'OneMap API & Geocode',
      icon: <Globe2 className="w-4 h-4" />,
      badge: 'LIVE API'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-[#0F172A] text-[#F8FAFC] flex flex-col border-r border-[#1E293B] transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:static`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2.5">
            {/* Lion City Crest Symbol */}
            <div className="w-8 h-8 rounded-[4px] bg-[#0284C7] flex items-center justify-center shadow-md font-bold text-white text-base font-mono">
              SG
            </div>
            <div>
              <div className="text-[14px] font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                <span>LION CITY</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#1E293B] text-[#38BDF8] rounded-[2px] border border-[#334155]">
                  SPATIAL
                </span>
              </div>
              <div className="text-[10px] text-[#94A3B8] tracking-wider uppercase font-mono">
                Institutional Intel Core
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main View Modes */}
          <div>
            <div className="text-[10px] font-mono font-semibold tracking-wider text-[#64748B] uppercase px-2 mb-2">
              Operational Views
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectView(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#0284C7] text-white shadow-xs font-semibold'
                        : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={isActive ? 'text-white' : 'text-[#94A3B8]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] ${
                          isActive
                            ? 'bg-[#0369A1] text-white'
                            : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Singapore Planning Districts Jump */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono font-semibold tracking-wider text-[#64748B] uppercase px-2 mb-2">
              <span>URA Districts ({DISTRICTS_DATA.length})</span>
              <Layers className="w-3 h-3 text-[#64748B]" />
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {DISTRICTS_DATA.map((dist) => {
                const isSelected = selectedDistrict?.id === dist.id;
                return (
                  <button
                    key={dist.id}
                    onClick={() => {
                      onSelectDistrict(dist);
                      if (currentView !== 'map') onSelectView('map');
                      onCloseMobile();
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-[3px] text-[11px] transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#1E293B] text-white border-l-2 border-[#0284C7] font-semibold'
                        : 'text-[#94A3B8] hover:bg-[#1E293B]/70 hover:text-[#E2E8F0]'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="truncate text-white font-medium group-hover:text-[#38BDF8]">
                        {dist.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#64748B]">
                        {dist.id}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[10px] text-[#0D9488] font-semibold tabular-nums">
                        {dist.liquidityScore}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Institutional Compliance Card */}
          <div className="p-3 bg-[#131B2E] border border-[#1E293B] rounded-[4px]">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-white mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>URA Master Plan 2025/26</span>
            </div>
            <p className="text-[10px] text-[#94A3B8] leading-relaxed mb-2">
              Active parameters synchronized with URA Space planning directives and BCA Super Low Energy guidelines.
            </p>
            <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B] pt-1.5 border-t border-[#1E293B]">
              <span>TENURE: FREEHOLD / 99Y</span>
              <span className="text-[#34D399]">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0B1324] text-[10px] font-mono text-[#64748B] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
            <span>TELEMETRY STABLE</span>
          </div>
          <span>SGP-SG8</span>
        </div>
      </aside>
    </>
  );
};
