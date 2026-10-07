/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewMode, HeatmapMetric, AssetRecord, DistrictInfo } from './types/spatial';
import { DISTRICTS_DATA, ASSETS_DATA } from './data/singaporeData';
import { HeaderBar } from './components/HeaderBar';
import { NavigationRail } from './components/NavigationRail';
import { SpatialMapStage } from './components/SpatialMapStage';
import { SpatialInspectorDrawer } from './components/SpatialInspectorDrawer';
import { AssetPortfolioMatrix } from './components/AssetPortfolioMatrix';
import { UraZoningSimulator } from './components/UraZoningSimulator';
import { CapitalTransactionsLedger } from './components/CapitalTransactionsLedger';
import { ExecutiveBriefingStudio } from './components/ExecutiveBriefingStudio';
import { OneMapExplorer } from './components/OneMapExplorer';
import { Menu, Layers, Compass, Building2, Sliders } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(DISTRICTS_DATA[0]); // SGP-D01-MRN default
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(ASSETS_DATA[0]); // CapitaSpring default
  const [activeHeatmap, setActiveHeatmap] = useState<HeatmapMetric>('rent');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [simulatorTargetAsset, setSimulatorTargetAsset] = useState<AssetRecord | null>(null);

  const handleSelectAsset = (asset: AssetRecord) => {
    setSelectedAsset(asset);
    const dist = DISTRICTS_DATA.find(d => d.id === asset.districtId);
    if (dist) setSelectedDistrict(dist);
    setIsInspectorOpen(true);
  };

  const handleSelectDistrict = (district: DistrictInfo) => {
    setSelectedDistrict(district);
    // Find first asset in that district if possible
    const assetInDistrict = ASSETS_DATA.find(a => a.districtId === district.id);
    if (assetInDistrict) {
      setSelectedAsset(assetInDistrict);
    }
    setIsInspectorOpen(true);
  };

  const handleSimulateAsset = (asset: AssetRecord) => {
    setSimulatorTargetAsset(asset);
    setCurrentView('zoning');
  };

  // Human-readable active filter summary
  const activeFilterSummary = selectedDistrict
    ? `${selectedDistrict.id} (${selectedDistrict.name})`
    : 'All Singapore Corridors';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* 280px Persistent Navigation Rail */}
      <NavigationRail
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={handleSelectDistrict}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <HeaderBar
          onSelectAsset={handleSelectAsset}
          onSelectDistrict={handleSelectDistrict}
          activeFilterSummary={activeFilterSummary}
        />

        {/* Mobile Navigation bar trigger & Quick Tabs */}
        <div className="lg:hidden bg-white px-3 py-2 border-b border-[#CBD5E1] flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 rounded-[4px] border border-[#CBD5E1] text-[#0F172A] flex items-center space-x-1.5 text-xs font-semibold"
          >
            <Menu className="w-4 h-4" />
            <span>Menu & Districts</span>
          </button>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('map')}
              className={`px-2 py-1 rounded-[3px] text-xs font-medium ${
                currentView === 'map' ? 'bg-[#0F172A] text-white' : 'text-[#64748B]'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setCurrentView('portfolio')}
              className={`px-2 py-1 rounded-[3px] text-xs font-medium ${
                currentView === 'portfolio' ? 'bg-[#0F172A] text-white' : 'text-[#64748B]'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setCurrentView('zoning')}
              className={`px-2 py-1 rounded-[3px] text-xs font-medium ${
                currentView === 'zoning' ? 'bg-[#0F172A] text-white' : 'text-[#64748B]'
              }`}
            >
              Zoning
            </button>
          </div>
        </div>

        {/* View Switcher Container */}
        <main className="flex-1 flex overflow-hidden relative min-h-0">
          {currentView === 'map' && (
            <div className="flex-1 flex h-full overflow-hidden p-3 lg:p-4 gap-3">
              <SpatialMapStage
                selectedDistrict={selectedDistrict}
                selectedAsset={selectedAsset}
                onSelectDistrict={handleSelectDistrict}
                onSelectAsset={handleSelectAsset}
                activeHeatmap={activeHeatmap}
                onChangeHeatmap={setActiveHeatmap}
              />

              {/* 420px Contextual Spatial Inspector Drawer */}
              <SpatialInspectorDrawer
                selectedAsset={selectedAsset}
                selectedDistrict={selectedDistrict}
                onClose={() => setIsInspectorOpen(false)}
                onSelectView={(v) => setCurrentView(v)}
                onSimulateAsset={handleSimulateAsset}
                isOpen={isInspectorOpen}
              />

              {/* Drawer reopen toggle button if closed */}
              {!isInspectorOpen && (
                <button
                  onClick={() => setIsInspectorOpen(true)}
                  className="absolute right-6 top-8 bg-[#0F172A] text-white p-2.5 rounded-[4px] shadow-lg hover:bg-[#1E293B] text-xs font-semibold flex items-center space-x-1.5 z-30"
                  title="Open Spatial Inspector"
                >
                  <Sliders className="w-4 h-4 text-[#38BDF8]" />
                  <span>Inspect Selected</span>
                </button>
              )}
            </div>
          )}

          {currentView === 'portfolio' && (
            <AssetPortfolioMatrix
              onSelectAsset={handleSelectAsset}
              onSimulateAsset={handleSimulateAsset}
            />
          )}

          {currentView === 'zoning' && (
            <UraZoningSimulator initialAsset={simulatorTargetAsset} />
          )}

          {currentView === 'transactions' && (
            <CapitalTransactionsLedger />
          )}

          {currentView === 'briefing' && (
            <ExecutiveBriefingStudio />
          )}

          {currentView === 'onemap' && (
            <OneMapExplorer />
          )}
        </main>
      </div>
    </div>
  );
}
