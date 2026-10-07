import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  MapPin, 
  Activity, 
  Info, 
  Eye, 
  TrendingUp, 
  Building,
  Check,
  Maximize2
} from 'lucide-react';
import { DistrictInfo, AssetRecord, HeatmapMetric } from '../types/spatial';
import { DISTRICTS_DATA, ASSETS_DATA, CBD_BENCHMARK_RENT_PSF } from '../data/singaporeData';
import { SpatialScorecardPill } from './SpatialScorecardPill';

interface SpatialMapStageProps {
  selectedDistrict: DistrictInfo | null;
  selectedAsset: AssetRecord | null;
  onSelectDistrict: (district: DistrictInfo) => void;
  onSelectAsset: (asset: AssetRecord) => void;
  activeHeatmap: HeatmapMetric;
  onChangeHeatmap: (metric: HeatmapMetric) => void;
}

export const SpatialMapStage: React.FC<SpatialMapStageProps> = ({
  selectedDistrict,
  selectedAsset,
  onSelectDistrict,
  onSelectAsset,
  activeHeatmap,
  onChangeHeatmap
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showMrtLines, setShowMrtLines] = useState(true);
  const [showExpressways, setShowExpressways] = useState(true);
  const [hoveredAsset, setHoveredAsset] = useState<AssetRecord | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.8), 2.4));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Color mapper based on active metric
  const getDistrictHeatColor = (district: DistrictInfo) => {
    switch (activeHeatmap) {
      case 'rent':
        // Rent ranges S$4.80 to S$14.65
        if (district.avgRentPsf >= 13.0) return 'rgba(2, 132, 199, 0.40)'; // #0284C7 Sky Blue
        if (district.avgRentPsf >= 10.0) return 'rgba(13, 148, 136, 0.35)'; // #0D9488 Teal
        if (district.avgRentPsf >= 7.5) return 'rgba(16, 185, 129, 0.30)'; // Emerald
        return 'rgba(203, 213, 225, 0.35)'; // Slate neutral

      case 'liquidity':
        if (district.liquidityScore >= 90) return 'rgba(13, 148, 136, 0.45)';
        if (district.liquidityScore >= 80) return 'rgba(2, 132, 199, 0.35)';
        return 'rgba(245, 158, 11, 0.30)';

      case 'vacancy':
        const vacancy = 100 - district.occupancyRate;
        if (vacancy > 10) return 'rgba(220, 38, 38, 0.35)'; // High vacancy
        if (vacancy > 5) return 'rgba(217, 119, 6, 0.30)';
        return 'rgba(16, 185, 129, 0.35)'; // Tight vacancy

      case 'footfall':
        if (district.footfallIndex >= 90) return 'rgba(2, 132, 199, 0.45)';
        if (district.footfallIndex >= 75) return 'rgba(13, 148, 136, 0.35)';
        return 'rgba(203, 213, 225, 0.30)';

      case 'greenMark':
        return district.uraIncentiveEligible ? 'rgba(5, 150, 105, 0.40)' : 'rgba(148, 163, 184, 0.25)';

      default:
        return 'rgba(2, 132, 199, 0.25)';
    }
  };

  return (
    <div className="relative flex-1 h-full min-h-[600px] bg-[#F1F5F9] border border-[#CBD5E1] rounded-[6px] overflow-hidden flex flex-col shadow-xs">
      {/* Top Map Control Bar */}
      <div className="bg-white/95 backdrop-blur-xs px-4 py-2 border-b border-[#CBD5E1] flex flex-wrap items-center justify-between gap-3 z-20">
        {/* Heatmap Layer Selectors */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-[#64748B] uppercase font-semibold mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
            Layer:
          </span>
          {[
            { id: 'rent', label: 'Gross Rent PSF' },
            { id: 'liquidity', label: 'Liquidity Score' },
            { id: 'vacancy', label: 'Occupancy Health' },
            { id: 'footfall', label: 'Footfall Flow' },
            { id: 'greenMark', label: 'CBD Incentive Zones' }
          ].map(layer => (
            <button
              key={layer.id}
              onClick={() => onChangeHeatmap(layer.id as HeatmapMetric)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-[3px] border transition-all ${
                activeHeatmap === layer.id
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                  : 'bg-white text-[#475569] border-[#CBD5E1] hover:border-[#0284C7] hover:text-[#0284C7]'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* Visibility Toggles & Zoom controls */}
        <div className="flex items-center space-x-2">
          {/* MRT Toggle */}
          <button
            onClick={() => setShowMrtLines(!showMrtLines)}
            className={`px-2 py-1 text-[11px] font-mono rounded-[3px] border transition-colors flex items-center space-x-1 ${
              showMrtLines
                ? 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD] font-semibold'
                : 'bg-white text-[#94A3B8] border-[#E2E8F0]'
            }`}
            title="Toggle MRT Transit Lines"
          >
            <span>MRT LINES</span>
            {showMrtLines && <Check className="w-3 h-3 text-[#0369A1]" />}
          </button>

          {/* Expressway Toggle */}
          <button
            onClick={() => setShowExpressways(!showExpressways)}
            className={`px-2 py-1 text-[11px] font-mono rounded-[3px] border transition-colors flex items-center space-x-1 ${
              showExpressways
                ? 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] font-semibold'
                : 'bg-white text-[#94A3B8] border-[#E2E8F0]'
            }`}
            title="Toggle Expressways (AYE, CTE, PIE, ECP)"
          >
            <span>ROADS</span>
            {showExpressways && <Check className="w-3 h-3 text-[#15803D]" />}
          </button>

          {/* Zoom In/Out */}
          <div className="flex items-center bg-white border border-[#CBD5E1] rounded-[3px] overflow-hidden">
            <button
              onClick={() => handleZoom(0.2)}
              className="p-1.5 hover:bg-[#F1F5F9] text-[#0F172A] border-r border-[#CBD5E1]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-1.5 hover:bg-[#F1F5F9] text-[#0F172A] border-r border-[#CBD5E1]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-[#F1F5F9] text-[#0F172A]"
              title="Reset Viewport"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Graphic Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center select-none bg-[#E2E8F0]/40">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '55% 55%'
          }}
        >
          <defs>
            {/* Sea Pattern / Grid */}
            <pattern id="seaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
            </pattern>

            {/* Gradient for CBD Core Focus */}
            <radialGradient id="cbdGlow" cx="57%" cy="67%" r="20%" fx="57%" fy="67%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>

            {/* Drop shadow filter for interactive markers */}
            <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" floodColor="#0F172A" />
            </filter>
          </defs>

          {/* Background Ocean Plane */}
          <rect width="1000" height="600" fill="#F8FAFC" />
          <rect width="1000" height="600" fill="url(#seaGrid)" opacity="0.6" />

          {/* Singapore Strait Waters & Surrounding Land References (Johor coast hint at top, Batam at bottom) */}
          <path
            d="M 120 40 Q 400 30 750 45 L 850 60 L 850 10 L 120 10 Z"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1"
            opacity="0.5"
          />
          <text x="320" y="32" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="2">
            MALAYSIA / JOHOR STRAITS
          </text>

          {/* Singapore Main Island Accurate Vector Polygon */}
          <g id="singaporeMainland">
            <path
              d="M 190 280 
                 C 210 230, 280 180, 360 140
                 C 400 120, 460 120, 520 135
                 C 600 155, 680 190, 770 230
                 C 820 250, 870 280, 890 320
                 C 900 345, 870 370, 830 380
                 C 790 390, 750 385, 710 390
                 C 670 395, 630 430, 580 445
                 C 530 460, 470 445, 420 440
                 C 370 435, 320 420, 260 410
                 C 220 400, 160 380, 140 350
                 C 130 330, 150 300, 190 280 Z"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1.5"
              className="drop-shadow-sm"
            />

            {/* Jurong Island & Southwest Industrial Offshore Islands */}
            <path
              d="M 210 440 C 240 430, 280 435, 290 460 C 290 480, 260 495, 220 490 C 190 485, 185 455, 210 440 Z"
              fill="#E2E8F0"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <text x="215" y="470" fill="#64748B" fontSize="8" fontFamily="JetBrains Mono">
              JURONG ISLAND
            </text>

            {/* Sentosa Island */}
            <path
              d="M 510 465 C 540 460, 570 465, 575 480 C 565 495, 525 495, 505 485 Z"
              fill="#E2E8F0"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <text x="525" y="482" fill="#64748B" fontSize="8" fontFamily="JetBrains Mono">
              SENTOSA
            </text>

            {/* Pulau Ubin & Tekong (East) */}
            <path
              d="M 760 170 C 785 160, 820 165, 815 185 C 790 195, 765 190, 760 170 Z"
              fill="#E2E8F0"
              stroke="#CBD5E1"
              strokeWidth="0.75"
            />

            {/* Singapore River & Marina Reservoir Inset Waterways */}
            <path
              d="M 540 400 Q 560 395 575 405 Q 585 415 600 410 Q 615 410 630 425 Q 610 440 580 435 Z"
              fill="#EFF6FF"
              stroke="#BAE6FD"
              strokeWidth="1"
            />
          </g>

          {/* Expressways Network (AYE, PIE, CTE, ECP, SLE, KPE) */}
          {showExpressways && (
            <g id="expresswayNetwork" opacity="0.6">
              {/* PIE (Pan Island Expressway) East-West spine */}
              <path
                d="M 230 330 Q 380 260 520 280 T 780 280 T 860 320"
                fill="none"
                stroke="#64748B"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />
              {/* AYE (Ayer Rajah Expressway) Southern West to CBD */}
              <path
                d="M 220 370 Q 330 380 450 410 T 550 435"
                fill="none"
                stroke="#64748B"
                strokeWidth="1.8"
              />
              {/* CTE (Central Expressway) North-South */}
              <path
                d="M 520 150 Q 540 250 560 360 T 565 420"
                fill="none"
                stroke="#64748B"
                strokeWidth="1.8"
              />
              {/* ECP (East Coast Parkway) */}
              <path
                d="M 580 430 Q 680 410 760 370 T 860 330"
                fill="none"
                stroke="#64748B"
                strokeWidth="1.8"
              />
            </g>
          )}

          {/* MRT Lines Trunk Lines */}
          {showMrtLines && (
            <g id="mrtNetwork" opacity="0.85">
              {/* East-West Line (Green) */}
              <path
                d="M 240 340 L 300 350 L 420 375 L 530 420 L 565 405 L 610 370 L 670 335 L 770 320 L 840 330"
                fill="none"
                stroke="#059669"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* North-South Line (Red) */}
              <path
                d="M 390 160 L 460 210 L 530 250 L 550 330 L 570 395 L 565 425"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Downtown Line (Blue) */}
              <path
                d="M 430 240 L 520 310 L 585 345 L 575 400 L 590 415 L 680 340 L 790 330"
                fill="none"
                stroke="#0284C7"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Circle Line (Orange) */}
              <path
                d="M 585 360 Q 650 340 670 370 T 580 430 T 450 420 T 415 375 T 480 300 T 585 360"
                fill="none"
                stroke="#D97706"
                strokeWidth="1.6"
                strokeDasharray="2 2"
              />
              {/* Thomson-East Coast Line (Brown) */}
              <path
                d="M 390 150 L 430 210 L 520 330 L 555 420 L 580 435 L 690 405"
                fill="none"
                stroke="#78350F"
                strokeWidth="1.8"
              />
            </g>
          )}

          {/* CBD Core Glow effect */}
          <circle cx="570" cy="405" r="90" fill="url(#cbdGlow)" pointerEvents="none" />

          {/* Planning Zone Choropleth Boundaries */}
          <g id="planningDistricts">
            {DISTRICTS_DATA.map((dist) => {
              const isSelected = selectedDistrict?.id === dist.id;
              const isHovered = hoveredDistrict?.id === dist.id;
              const heatColor = getDistrictHeatColor(dist);

              // Distinct geographic bounding boxes / polygons for each Singapore district
              let polygonPath = '';
              if (dist.id === 'SGP-D01-MRN') {
                // Raffles Place / Marina Bay
                polygonPath = 'M 555 380 L 595 380 L 610 415 L 580 425 L 555 405 Z';
              } else if (dist.id === 'SGP-D02-TJP') {
                // Tanjong Pagar / Shenton
                polygonPath = 'M 540 415 L 565 410 L 575 445 L 535 448 Z';
              } else if (dist.id === 'SGP-D07-BGS') {
                // Bugis / Beach Road
                polygonPath = 'M 575 330 L 615 335 L 610 370 L 570 365 Z';
              } else if (dist.id === 'SGP-D05-ONH') {
                // One-North / Buona Vista
                polygonPath = 'M 400 355 L 450 360 L 455 420 L 405 405 Z';
              } else if (dist.id === 'SGP-D14-PYL') {
                // Paya Lebar Central
                polygonPath = 'M 650 315 L 700 320 L 695 355 L 645 350 Z';
              } else if (dist.id === 'SGP-D22-JLD') {
                // Jurong Lake District
                polygonPath = 'M 270 330 L 330 335 L 325 385 L 265 375 Z';
              } else if (dist.id === 'SGP-D17-CBP') {
                // Changi Business Park
                polygonPath = 'M 770 310 L 825 315 L 820 355 L 765 350 Z';
              } else if (dist.id === 'SGP-D25-WDL') {
                // Woodlands Regional Centre
                polygonPath = 'M 360 135 L 425 140 L 420 185 L 355 180 Z';
              } else {
                polygonPath = `M ${dist.coordinates.x - 25} ${dist.coordinates.y - 20} L ${dist.coordinates.x + 25} ${dist.coordinates.y - 20} L ${dist.coordinates.x + 20} ${dist.coordinates.y + 20} L ${dist.coordinates.x - 20} ${dist.coordinates.y + 20} Z`;
              }

              return (
                <g key={dist.id} className="cursor-pointer transition-all">
                  <path
                    d={polygonPath}
                    fill={heatColor}
                    stroke={isSelected ? '#0284C7' : isHovered ? '#0F172A' : '#64748B'}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                    strokeDasharray={dist.uraIncentiveEligible ? '4 2' : 'none'}
                    onClick={() => onSelectDistrict(dist)}
                    onMouseEnter={() => setHoveredDistrict(dist)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className="transition-colors duration-150"
                  />

                  {/* District Centroid Label */}
                  <g
                    transform={`translate(${dist.coordinates.x}, ${dist.coordinates.y})`}
                    onClick={() => onSelectDistrict(dist)}
                    pointerEvents="none"
                  >
                    <rect
                      x="-38"
                      y="-18"
                      width="76"
                      height="16"
                      rx="3"
                      fill={isSelected ? '#0F172A' : '#FFFFFF'}
                      stroke={isSelected ? '#0284C7' : '#CBD5E1'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-7"
                      textAnchor="middle"
                      fill={isSelected ? '#FFFFFF' : '#0F172A'}
                      fontSize="8"
                      fontWeight="700"
                      fontFamily="Inter"
                      letterSpacing="0.04em"
                    >
                      {dist.id.replace('SGP-', '')}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Interactive Grade-A Commercial Asset Nodes */}
          <g id="assetNodes">
            {ASSETS_DATA.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              const isHovered = hoveredAsset?.id === asset.id;
              const isAboveBenchmark = asset.grossRentPsf >= CBD_BENCHMARK_RENT_PSF;

              return (
                <g
                  key={asset.id}
                  transform={`translate(${asset.coordinates.x}, ${asset.coordinates.y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAsset(asset);
                    const matchingDist = DISTRICTS_DATA.find(d => d.id === asset.districtId);
                    if (matchingDist) onSelectDistrict(matchingDist);
                  }}
                  onMouseEnter={() => setHoveredAsset(asset)}
                  onMouseLeave={() => setHoveredAsset(null)}
                >
                  {/* Pulse ring for selected asset */}
                  {isSelected && (
                    <circle
                      r="14"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-ping"
                    />
                  )}

                  {/* Pin Background Marker */}
                  <circle
                    r={isSelected ? '8' : isHovered ? '7' : '5.5'}
                    fill={isSelected ? '#0284C7' : isAboveBenchmark ? '#0D9488' : '#0F172A'}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    filter="url(#markerShadow)"
                    className="transition-all duration-150"
                  />

                  {/* Interior Icon dot */}
                  <circle
                    r={isSelected ? '3' : '2'}
                    fill="#FFFFFF"
                  />

                  {/* Persistent or hover label */}
                  {(isSelected || isHovered || zoomLevel >= 1.4) && (
                    <g transform="translate(0, -12)" pointerEvents="none">
                      <rect
                        x={-asset.name.length * 3.2 - 6}
                        y="-14"
                        width={asset.name.length * 6.4 + 12}
                        height="16"
                        rx="3"
                        fill="#0F172A"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontWeight="600"
                        fontFamily="Inter"
                      >
                        {asset.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Compass Rose / Spatial Scale */}
          <g transform="translate(80, 520)" opacity="0.8">
            <rect x="0" y="0" width="130" height="42" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <text x="12" y="16" fill="#0F172A" fontSize="9" fontWeight="700" fontFamily="Inter">
              SCALE: 1:125,000
            </text>
            <line x1="12" y1="26" x2="82" y2="26" stroke="#0F172A" strokeWidth="2" />
            <line x1="12" y1="23" x2="12" y2="29" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="82" y1="23" x2="82" y2="29" stroke="#0F172A" strokeWidth="1.5" />
            <text x="92" y="29" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">
              5.0 KM
            </text>
            <text x="12" y="38" fill="#94A3B8" fontSize="7" fontFamily="JetBrains Mono">
              EPSG:3414 (SVY21)
            </text>
          </g>
        </svg>

        {/* Hover Asset Card Tooltip */}
        {hoveredAsset && (
          <div
            className="absolute bottom-4 left-4 bg-white border border-[#CBD5E1] p-3 rounded-[6px] shadow-lg z-30 pointer-events-none max-w-xs animate-in fade-in duration-100"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#0284C7] font-semibold">
                {hoveredAsset.districtId}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded-[2px] font-semibold border border-[#A7F3D0]">
                {hoveredAsset.occupancyRate}% OCC
              </span>
            </div>
            <div className="text-xs font-bold text-[#0F172A]">{hoveredAsset.name}</div>
            <div className="text-[11px] text-[#64748B] mb-2">{hoveredAsset.address}</div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1F5F9] text-[11px]">
              <div>
                <span className="text-[#94A3B8] block text-[10px]">Gross Rent:</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  S${hoveredAsset.grossRentPsf.toFixed(2)} PSF
                </span>
              </div>
              <div>
                <span className="text-[#94A3B8] block text-[10px]">Cap Rate:</span>
                <span className="font-bold text-[#0F172A] tabular-nums">
                  {hoveredAsset.capRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Legend Overlay at bottom right */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs border border-[#CBD5E1] p-2.5 rounded-[4px] shadow-md z-20 text-[10px] font-mono">
          <div className="font-bold text-[#0F172A] mb-1.5 uppercase flex items-center justify-between gap-4">
            <span>Map Layer Intensity</span>
            <span className="text-[#0284C7]">{activeHeatmap}</span>
          </div>
          <div className="flex items-center space-x-1 mb-2">
            <span className="w-4 h-2.5 bg-[#CBD5E1] rounded-[1px]" />
            <span className="w-4 h-2.5 bg-[#93C5FD] rounded-[1px]" />
            <span className="w-4 h-2.5 bg-[#0D9488] rounded-[1px]" />
            <span className="w-4 h-2.5 bg-[#0284C7] rounded-[1px]" />
            <span className="w-4 h-2.5 bg-[#0F172A] rounded-[1px]" />
            <span className="ml-1 text-[#64748B]">Low → High Yield</span>
          </div>
          <div className="flex items-center justify-between text-[#64748B] pt-1 border-t border-[#F1F5F9]">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
              <span>Above CBD Avg</span>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
              <span>Below CBD Avg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
