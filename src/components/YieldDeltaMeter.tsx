import React from 'react';
import { CBD_BENCHMARK_RENT_PSF } from '../data/singaporeData';

interface YieldDeltaMeterProps {
  currentRentPsf: number;
  benchmarkPsf?: number;
  showText?: boolean;
  className?: string;
}

export const YieldDeltaMeter: React.FC<YieldDeltaMeterProps> = ({
  currentRentPsf,
  benchmarkPsf = CBD_BENCHMARK_RENT_PSF,
  showText = true,
  className = ''
}) => {
  const delta = currentRentPsf - benchmarkPsf;
  const isPositive = delta >= 0;

  // Let's normalize rent range: min S$4.00 to max S$18.00
  const minVal = 4.0;
  const maxVal = 18.0;
  const pct = Math.min(Math.max(((currentRentPsf - minVal) / (maxVal - minVal)) * 100, 4), 100);
  const benchmarkPct = ((benchmarkPsf - minVal) / (maxVal - minVal)) * 100;

  return (
    <div className={`flex flex-col gap-1 min-w-[120px] ${className}`}>
      {/* 4px high inline micro-bar */}
      <div className="relative w-full h-[4px] bg-[#CBD5E1] rounded-[2px] overflow-visible">
        {/* Fill bar */}
        <div
          className="h-full rounded-[2px] transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundColor: isPositive ? '#0D9488' : '#0284C7'
          }}
        />
        {/* Baseline marker at CBD benchmark */}
        <div
          className="absolute top-[-3px] bottom-[-3px] w-[2px] bg-[#0F172A] z-10"
          style={{ left: `${benchmarkPct}%` }}
          title={`CBD Benchmark: S$${benchmarkPsf.toFixed(2)} PSF`}
        />
      </div>

      {showText && (
        <div className="flex items-center justify-between text-[11px] leading-3 text-[#45464D]">
          <span className="font-medium tabular-nums">
            S${currentRentPsf.toFixed(2)}
          </span>
          <span
            className={`font-semibold tabular-nums ${
              isPositive ? 'text-[#059669]' : 'text-[#45464D]'
            }`}
          >
            {isPositive ? `+S$${delta.toFixed(2)}` : `-S$${Math.abs(delta).toFixed(2)}`}
          </span>
        </div>
      )}
    </div>
  );
};
