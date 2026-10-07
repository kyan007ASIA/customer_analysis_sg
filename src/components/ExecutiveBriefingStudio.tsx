import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Printer, 
  Check, 
  Compass, 
  Building2, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { DISTRICTS_DATA, ASSETS_DATA, MACRO_STATISTICS, CBD_BENCHMARK_RENT_PSF } from '../data/singaporeData';
import { SpatialScorecardPill } from './SpatialScorecardPill';

export const ExecutiveBriefingStudio: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'cbd' | 'incentive' | 'decentralized'>('cbd');
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);

  const memoContent = {
    cbd: {
      title: 'SINGAPORE CBD GRADE-A FLIGHT-TO-QUALITY & CAPITAL YIELD OUTLOOK',
      classification: 'RESTRICTED // INSTITUTIONAL INVESTMENT COMMITTEE',
      author: 'Spatial Intelligence Analytics Division',
      date: '07 OCTOBER 2026',
      summary:
        'Singapore prime Downtown Core office assets demonstrate resilient capital values and compressed prime cap rates (3.30% - 3.45%), buoyed by acute Grade-A supply tightness and sovereign wealth allocations. Premium biophilic towers (CapitaSpring, MBFC Tower 2) continue commanding rental premiums of S$14.80 - S$15.40 PSF/mo (+15% above the Singapore CBD benchmark).',
      keyFindings: [
        'Occupancy across prime Marina Bay and Raffles Place stands at 97.4%, driven by expansionary demand from multi-family offices, hedge funds, and private wealth managers.',
        'CapitaSpring and CapitaGreen command S$1.85 to S$2.05 PSF monthly delta over CBD benchmark, setting modern benchmark for BCA Green Mark Platinum Super Low Energy certifications.',
        'SORA benchmark stabilization at 3.12% has expanded positive carry for institutional levered buyers, triggering an estimated S$4.8B in 12-month deal flow.'
      ],
      riskMatrix: [
        { risk: 'Lease Expiries 2027/28', level: 'MODERATE', mitigation: 'Staggered renewals underway with anchor tenants averaging 4.5 years WALE.' },
        { risk: 'Tech Sector Rationalization', level: 'LOW', mitigation: 'Replaced by expanding non-bank financial institutions and commodity trading desks.' },
        { risk: 'Cap Rate Compression Limits', level: 'MODERATE', mitigation: 'Underpinned by sovereign wealth defensive allocations seeking safe-haven Singapore sovereign debt proxy.' }
      ]
    },
    incentive: {
      title: 'URA CBD INCENTIVE SCHEME: TANJONG PAGAR & ANSON RE-DEVELOPMENT PIPELINE',
      classification: 'RESTRICTED // URBAN PLANNING & DEVELOPMENT SYNDICATE',
      author: 'Urban Land Economics Unit',
      date: '07 OCTOBER 2026',
      summary:
        'The URA CBD Incentive Scheme continues accelerating the structural transformation of older single-use commercial blocks along Anson Road and Cecil Street into vibrant 24/7 mixed-use vertical precincts, conferring +25% to +30% bonus Gross Floor Area (GFA) allowances.',
      keyFindings: [
        'Anson House and contiguous older assets represent prime conversion candidates, unlocking over 180,000 sq ft of bonus GFA when repositioned as integrated residential/commercial towers.',
        'Differential premiums (Land Betterment Charge) average S$1,150 PSF on bonus GFA, yielding attractive net development margins of +18.4% at target exit valuations above S$2,900 PSF.',
        'Enhanced subterranean infrastructure links with Maxwell (TEL) and Prince Edward (CCL) stations substantially heighten pedestrian density and transit accessibility.'
      ],
      riskMatrix: [
        { risk: 'Construction Capex Inflation', level: 'HIGH', mitigation: 'Locking pre-cast DfMA contracts and targeting BCA Green Mark Platinum incentives.' },
        { risk: 'Approval Horizon (URA & BCA)', level: 'LOW', mitigation: 'Government priority fast-tracking for carbon-neutral mixed development projects.' }
      ]
    },
    decentralized: {
      title: 'DECENTRALIZED REGIONAL HUBS: JURONG LAKE DISTRICT & ONE-NORTH RESILIENCE',
      classification: 'RESTRICTED // REGIONAL COMMERCIAL STRATEGY',
      author: 'Macro Geospatial Research Team',
      date: '07 OCTOBER 2026',
      summary:
        'Decentralized sub-markets offer institutional investors compelling yield arbitrage (4.15% - 4.85% NPI yields) relative to the CBD Core (3.35%). One-North commands 98.2% occupancy driven by high-retention life sciences and AI research anchors, while Jurong Lake District prepares for Singapore 2nd CBD phase-two development.',
      keyFindings: [
        'Mapletree Business City II and The Metropolis operate at virtual full occupancy (97.4% - 98.9%), with Google and Procter & Gamble anchoring extensive corporate headquarters campuses.',
        'Paya Lebar Quarter (PLQ) has emerged as the eastern regional commercial leader, achieving gross rents of S$9.20 PSF/mo with superior dual MRT transit connectivity.',
        'Yield spread of 100 to 150 bps over CBD core assets provides significant defensive cushion against elevated funding costs.'
      ],
      riskMatrix: [
        { risk: 'RTS Link Johor Economic Siphon', level: 'LOW', mitigation: 'High-value intellectual property and R&D activities remain firmly anchored within Singapore statutory frameworks.' }
      ]
    }
  }[selectedTopic];

  const handleCopy = () => {
    const textToCopy = `
======================================================
${memoContent.title}
${memoContent.classification}
DATE: ${memoContent.date} | AUTHOR: ${memoContent.author}
======================================================

EXECUTIVE SUMMARY:
${memoContent.summary}

KEY INSTITUTIONAL FINDINGS:
${memoContent.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

ANALYST ANNOTATIONS:
${customNote || 'No supplementary annotations added.'}

SPATIAL BENCHMARKS:
- CBD Grade-A Average: S$${CBD_BENCHMARK_RENT_PSF.toFixed(2)} PSF/mo
- MAS SORA 3M: ${MACRO_STATISTICS.soraRate}
- Total Pipeline: ${MACRO_STATISTICS.totalPipelineGfaSqft}
======================================================
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto bg-[#F8FAFC] space-y-4">
      {/* Studio Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#CBD5E1]">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#0F172A] text-white rounded-[4px]">
              <FileText className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Executive Briefing & Memo Studio
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Compile institutional-grade spatial investment memorandums and urban development briefings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] rounded-[4px] text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[#059669]">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Copy Full Memo</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-[4px] text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Print / PDF Document</span>
          </button>
        </div>
      </div>

      {/* Memo Preset Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'cbd', label: '1. CBD Core Grade-A Outlook' },
          { id: 'incentive', label: '2. URA CBD Incentive Scheme' },
          { id: 'decentralized', label: '3. Decentralized Hubs (JLD / One-North)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTopic(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[4px] border transition-all whitespace-nowrap ${
              selectedTopic === tab.id
                ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Formatted Institutional Document Container */}
      <div className="bg-white rounded-[8px] border border-[#CBD5E1] p-6 lg:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
        {/* Memo Masthead */}
        <div className="border-b-2 border-[#0F172A] pb-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#64748B]">
            <span className="bg-[#FEF2F2] text-[#991B1B] font-bold px-2 py-0.5 rounded-[2px] border border-[#FECACA]">
              {memoContent.classification}
            </span>
            <span>SINGAPORE COMMERCIAL CORRIDOR</span>
          </div>

          <h2 className="text-xl lg:text-2xl font-bold text-[#0F172A] tracking-tight font-sans">
            {memoContent.title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-[#64748B] pt-2 border-t border-[#E2E8F0]">
            <div>
              <span className="text-[#94A3B8] block text-[10px]">DATE:</span>
              <span className="font-semibold text-[#0F172A]">{memoContent.date}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px]">PREPARED BY:</span>
              <span className="font-semibold text-[#0F172A]">{memoContent.author}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px]">BENCHMARK BASELINE:</span>
              <span className="font-semibold text-[#0284C7]">S$13.35 PSF / mo</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
            1. Executive Synthesis & Spatial Findings
          </h3>
          <p className="text-xs lg:text-sm text-[#334155] leading-relaxed bg-[#F8FAFC] p-4 rounded-[6px] border border-[#E2E8F0]">
            {memoContent.summary}
          </p>
        </div>

        {/* Detailed Findings Bullet Points */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
            2. Core Spatial Observations & Empirical Telemetry
          </h3>
          <ul className="space-y-2 text-xs lg:text-sm text-[#334155]">
            {memoContent.keyFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                <span className="leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Assessment Radar Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
            3. Regulatory & Capital Market Risk Matrix
          </h3>
          <div className="border border-[#E2E8F0] rounded-[6px] overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[10px] font-mono uppercase text-[#475569]">
                  <th className="p-2.5 font-semibold">Identified Risk Factor</th>
                  <th className="p-2.5 font-semibold">Exposure</th>
                  <th className="p-2.5 font-semibold">Strategic Mitigation Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {memoContent.riskMatrix.map((r, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC]">
                    <td className="p-2.5 font-semibold text-[#0F172A]">{r.risk}</td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[2px] border ${
                          r.level === 'HIGH'
                            ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
                            : r.level === 'MODERATE'
                            ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                            : 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                        }`}
                      >
                        {r.level}
                      </span>
                    </td>
                    <td className="p-2.5 text-[#475569]">{r.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analyst Annotation Area */}
        <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-[#0284C7]" />
              4. Custom Committee Annotations & Sign-Off
            </h3>
            <span className="text-[10px] text-[#94A3B8]">Optional Analyst Notes</span>
          </div>
          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Add specific asset allocation constraints, underwriting hurdles, or debt syndicate requirements here..."
            rows={3}
            className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] p-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        {/* Document Footer Signatures */}
        <div className="pt-4 border-t border-[#CBD5E1] flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
          <div>LION CITY SPATIAL INTELLIGENCE // GOVTECH & URA VERIFIED</div>
          <div>SINGAPORE CODE SGP-MP2026-REF</div>
        </div>
      </div>
    </div>
  );
};
