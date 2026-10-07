import React from 'react';

interface SpatialScorecardPillProps {
  districtCode: string; // e.g. SGP-D01-MRN
  liquidityScore: number; // e.g. 96.4
  size?: 'sm' | 'md';
  className?: string;
}

export const SpatialScorecardPill: React.FC<SpatialScorecardPillProps> = ({
  districtCode,
  liquidityScore,
  size = 'md',
  className = ''
}) => {
  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-stretch rounded-[4px] overflow-hidden border border-[#CBD5E1] shadow-xs select-none ${className}`}
      title={`District: ${districtCode} | Spatial Liquidity Score: ${liquidityScore.toFixed(1)}`}
    >
      {/* Left Cell: URA district code */}
      <span
        className={`bg-[#0F172A] text-white font-mono font-semibold tracking-[0.05em] uppercase flex items-center justify-center ${
          isSmall ? 'px-1.5 py-0.5 text-[10px] leading-3' : 'px-2 py-0.5 text-[11px] leading-4'
        }`}
      >
        {districtCode}
      </span>

      {/* Right Cell: Spatial liquidity score */}
      <span
        className={`bg-[#F1F5F9] text-[#0F172A] font-semibold tabular-nums flex items-center justify-center border-l border-[#CBD5E1] ${
          isSmall ? 'px-1.5 py-0.5 text-[10px] leading-3' : 'px-2 py-0.5 text-[11px] leading-4'
        }`}
      >
        <span className="text-[#0D9488] mr-0.5 text-[9px] font-bold">▲</span>
        {liquidityScore.toFixed(1)}
      </span>
    </div>
  );
};
