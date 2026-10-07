import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  TrendingUp, 
  Globe2, 
  ShieldCheck, 
  DollarSign, 
  Search, 
  Filter,
  PieChart,
  Building
} from 'lucide-react';
import { CapitalTransaction } from '../types/spatial';
import { TRANSACTIONS_DATA, DISTRICTS_DATA } from '../data/singaporeData';
import { SpatialScorecardPill } from './SpatialScorecardPill';

export const CapitalTransactionsLedger: React.FC = () => {
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [buyerCategoryFilter, setBuyerCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeals = useMemo(() => {
    return TRANSACTIONS_DATA.filter((deal) => {
      const matchOrigin = originFilter === 'all' || deal.capitalOrigin === originFilter;
      const matchCategory = buyerCategoryFilter === 'all' || deal.buyerCategory === buyerCategoryFilter;
      const matchSearch =
        deal.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.seller.toLowerCase().includes(searchQuery.toLowerCase());

      return matchOrigin && matchCategory && matchSearch;
    });
  }, [originFilter, buyerCategoryFilter, searchQuery]);

  // Aggregate metrics
  const totalVolumeSgdM = filteredDeals.reduce((sum, d) => sum + d.transactedPriceSgdM, 0);
  const avgPsf = filteredDeals.length ? Math.round(filteredDeals.reduce((sum, d) => sum + d.psfNla, 0) / filteredDeals.length) : 0;
  const avgNpiYield = filteredDeals.length ? (filteredDeals.reduce((sum, d) => sum + d.npiYield, 0) / filteredDeals.length).toFixed(2) : '0';

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto bg-[#F8FAFC] space-y-4">
      {/* Executive Market Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Institutional Deal Flow
          </div>
          <div className="text-xl font-bold text-[#0F172A] mt-1 tabular-nums font-mono">
            S${(totalVolumeSgdM / 1000).toFixed(2)}B
          </div>
          <div className="text-[10px] text-[#059669] mt-1 font-medium">
            {filteredDeals.length} Landmark Transactions
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Average Price PSF NLA
          </div>
          <div className="text-xl font-bold text-[#0F172A] mt-1 tabular-nums font-mono">
            S${avgPsf.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#0284C7] mt-1 font-medium">
            Prime CBD Core Range S$2.8k - S$3.2k
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Mean Entry NPI Yield
          </div>
          <div className="text-xl font-bold text-[#0F172A] mt-1 tabular-nums font-mono">
            {avgNpiYield}%
          </div>
          <div className="text-[10px] text-[#64748B] mt-1">
            Spread over SORA 3M: +35 bps
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#64748B] font-semibold">
            Cross-Border Capital Inflow
          </div>
          <div className="text-xl font-bold text-[#0284C7] mt-1 tabular-nums font-mono">
            62.4%
          </div>
          <div className="text-[10px] text-[#059669] mt-1 font-medium">
            Led by US & Pan-Asian PE Funds
          </div>
        </div>
      </div>

      {/* Capital Origin Allocation Visual Strip */}
      <div className="bg-white p-3 rounded-[8px] border border-[#CBD5E1] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0F172A] font-mono uppercase flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-[#0284C7]" />
            Global Institutional Capital Distribution (Singapore Commercial Corridors)
          </span>
          <span className="text-[10px] font-mono text-[#64748B]">CY 2024 - 2026</span>
        </div>

        <div className="h-4 bg-[#F1F5F9] rounded-[3px] overflow-hidden flex text-[9px] font-mono text-white font-semibold">
          <div style={{ width: '37.6%' }} className="bg-[#0F172A] flex items-center justify-center" title="Singapore Domestic: 37.6%">
            Singapore 37.6%
          </div>
          <div style={{ width: '28.4%' }} className="bg-[#0284C7] flex items-center justify-center" title="United States: 28.4%">
            US 28.4%
          </div>
          <div style={{ width: '18.5%' }} className="bg-[#0D9488] flex items-center justify-center" title="Hong Kong / China: 18.5%">
            HK / China 18.5%
          </div>
          <div style={{ width: '10.2%' }} className="bg-[#D97706] flex items-center justify-center" title="Europe: 10.2%">
            EU 10.2%
          </div>
          <div style={{ width: '5.3%' }} className="bg-[#64748B] flex items-center justify-center" title="Japan & Others: 5.3%">
            JP 5.3%
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white p-3 rounded-[8px] border border-[#CBD5E1] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deal name, buyer, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          >
            <option value="all">All Capital Origins</option>
            <option value="Singapore">Singapore</option>
            <option value="United States">United States</option>
            <option value="Hong Kong / China">Hong Kong / China</option>
            <option value="Europe">Europe</option>
          </select>

          <select
            value={buyerCategoryFilter}
            onChange={(e) => setBuyerCategoryFilter(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
          >
            <option value="all">All Buyer Typologies</option>
            <option value="S-REIT">S-REIT</option>
            <option value="Private Equity">Private Equity</option>
            <option value="Sovereign Wealth">Sovereign Wealth</option>
            <option value="Institutional Fund">Institutional Fund</option>
            <option value="Family Office">Family Office</option>
          </select>
        </div>

        <div className="text-xs font-mono text-[#64748B]">
          {filteredDeals.length} Verified Transactions
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-[8px] border border-[#CBD5E1] shadow-xs overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-9 bg-[#F8FAFC] border-b border-[#CBD5E1] text-[11px] font-mono uppercase tracking-wider text-[#475569]">
                <th className="px-3.5 py-2 font-semibold">Asset Transaction</th>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold text-right">Price (SGD)</th>
                <th className="px-3 py-2 font-semibold text-right">Price PSF NLA</th>
                <th className="px-3 py-2 font-semibold">Acquiring Entity</th>
                <th className="px-3 py-2 font-semibold">Capital Origin</th>
                <th className="px-3 py-2 font-semibold text-right">NPI Yield</th>
                <th className="px-3 py-2 font-semibold">Tenure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="h-11 hover:bg-[#F8FAFC] transition-colors">
                  {/* Asset & District */}
                  <td className="px-3.5 py-2">
                    <div className="font-semibold text-[#0F172A]">{deal.assetName}</div>
                    <div className="text-[10px] font-mono text-[#64748B]">{deal.districtId}</div>
                  </td>

                  {/* Transacted Date */}
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-[#64748B]">
                    {deal.transactedDate}
                  </td>

                  {/* Transacted Price SGD M */}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <span className="font-bold text-[#0F172A] font-mono tabular-nums text-[13px]">
                      S${deal.transactedPriceSgdM.toFixed(1)}M
                    </span>
                  </td>

                  {/* Price PSF NLA */}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <span className="font-semibold text-[#0284C7] font-mono tabular-nums">
                      S${deal.psfNla.toLocaleString()}
                    </span>
                  </td>

                  {/* Acquiring Entity */}
                  <td className="px-3 py-2">
                    <div className="font-medium text-[#0F172A] truncate max-w-xs">{deal.buyer}</div>
                    <div className="text-[10px] text-[#64748B]">
                      Ex-Seller: {deal.seller}
                    </div>
                  </td>

                  {/* Capital Origin */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] text-[11px] font-medium bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
                      {deal.capitalOrigin}
                    </span>
                  </td>

                  {/* NPI Yield */}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <span className="font-bold text-[#059669] font-mono tabular-nums">
                      {deal.npiYield.toFixed(2)}%
                    </span>
                  </td>

                  {/* Tenure */}
                  <td className="px-3 py-2 whitespace-nowrap text-[#64748B] text-[11px]">
                    {deal.tenure}
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
