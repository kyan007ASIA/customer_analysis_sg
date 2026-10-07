import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Activity, 
  Search, 
  MapPin, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Terminal,
  Server,
  Zap,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

interface OneMapSearchResult {
  SEARCHVAL: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  ROAD_NAME: string;
  BLK_NO: string;
  LATITUDE: string;
  LONGITUDE: string;
  X: string;
  Y: string;
}

interface HealthData {
  status: string;
  uptimeSeconds: number;
  timestamp: string;
  system: {
    memoryUsageMb: {
      rss: number;
      heapUsed: number;
    };
  };
  onemapStatus: {
    probes: {
      search?: { httpStatus: number; reachable: boolean; latencyMs?: number };
      revgeocode?: { httpStatus: number; reachable: boolean; latencyMs?: number };
      token?: { httpStatus: number; reachable: boolean; latencyMs?: number };
    };
  };
  totalResponseTimeMs: number;
}

export const OneMapExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'health' | 'search' | 'revgeocode' | 'token'>('health');
  
  // Health State
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  // Search State
  const [searchVal, setSearchVal] = useState('raffles place');
  const [searchResults, setSearchResults] = useState<OneMapSearchResult[]>([]);
  const [totalFound, setTotalFound] = useState<number>(0);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchRaw, setSearchRaw] = useState<any>(null);

  // RevGeocode State
  const [revLocation, setRevLocation] = useState('1.3,103.8');
  const [revBuffer, setRevBuffer] = useState('40');
  const [revAddressType, setRevAddressType] = useState('All');
  const [revResults, setRevResults] = useState<any>(null);
  const [isRevLoading, setIsRevLoading] = useState(false);

  // Token State
  const [tokenResponse, setTokenResponse] = useState<any>(null);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fetchHealth = async () => {
    setIsHealthLoading(true);
    setHealthError(null);
    try {
      const res = await fetch('/api/health?external=true');
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
      setHealthError(err.message || 'Failed to connect to /api/health');
    } finally {
      setIsHealthLoading(false);
    }
  };

  const runSearch = async (queryVal = searchVal) => {
    setIsSearchLoading(true);
    try {
      const params = new URLSearchParams({
        searchVal: queryVal,
        returnGeom: 'Y',
        getAddrDetails: 'Y',
        pageNum: '1'
      });
      const res = await fetch(`/api/onemap/search?${params.toString()}`);
      const json = await res.json();
      setSearchRaw(json);
      if (json.data && json.data.results) {
        setSearchResults(json.data.results);
        setTotalFound(json.data.found || json.data.results.length);
      } else {
        setSearchResults([]);
        setTotalFound(0);
      }
    } catch (err: any) {
      console.error('OneMap Search Error:', err);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const runRevGeocode = async (loc = revLocation) => {
    setIsRevLoading(true);
    try {
      const params = new URLSearchParams({
        location: loc,
        buffer: revBuffer,
        addressType: revAddressType
      });
      const res = await fetch(`/api/onemap/revgeocode?${params.toString()}`);
      const json = await res.json();
      setRevResults(json);
    } catch (err: any) {
      console.error('OneMap RevGeocode Error:', err);
    } finally {
      setIsRevLoading(false);
    }
  };

  const checkTokenEndpoint = async (withCredentials = false) => {
    setIsTokenLoading(true);
    try {
      let options: RequestInit = { method: 'GET' };
      if (withCredentials && emailInput && passwordInput) {
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput, password: passwordInput })
        };
      }
      const res = await fetch('/api/onemap/token', options);
      const json = await res.json();
      setTokenResponse(json);
    } catch (err: any) {
      console.error('OneMap Token Error:', err);
    } finally {
      setIsTokenLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    runSearch('raffles place');
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto bg-[#F8FAFC] space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#CBD5E1]">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-[#0F172A] text-white rounded-[4px]">
              <Globe2 className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              OneMap API Integration & Health Telemetry
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Direct gateway to Singapore Land Authority (SLA) OneMap GIS endpoints: authentication token, elastic spatial search, and reverse geocoding.
          </p>
        </div>

        {/* Global health badge */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-[4px] text-xs font-mono shadow-xs">
            <span className={`w-2 h-2 rounded-full ${health?.status === 'HEALTHY' ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'}`} />
            <span className="font-semibold text-[#0F172A]">API: {health?.status || 'INITIALIZING'}</span>
            <span className="text-[#94A3B8]">|</span>
            <span className="text-[#0284C7]">{health?.totalResponseTimeMs || 0}ms</span>
          </div>

          <button
            onClick={fetchHealth}
            disabled={isHealthLoading}
            className="p-1.5 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-[4px] text-[#0F172A] transition-colors"
            title="Refresh API Health"
          >
            <RefreshCw className={`w-4 h-4 ${isHealthLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2">
        {[
          { id: 'health', label: '1. Health Monitor (/api/health)', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'search', label: '2. Elastic Search (raffles place)', icon: <Search className="w-3.5 h-3.5" /> },
          { id: 'revgeocode', label: '3. Reverse Geocode (1.3, 103.8)', icon: <MapPin className="w-3.5 h-3.5" /> },
          { id: 'token', label: '4. OneMap Auth Token (getToken)', icon: <Key className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-[4px] border flex items-center space-x-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Health Monitor */}
      {activeTab === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-semibold">Service Health</span>
              <div className="text-xl font-bold text-[#059669] mt-1 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                {health?.status || 'ONLINE'}
              </div>
              <span className="text-[10px] text-[#64748B] mt-1 block font-mono">Uptime: {health?.uptimeSeconds || 0}s</span>
            </div>

            <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-semibold">OneMap Search Probe</span>
              <div className="text-xl font-bold text-[#0F172A] mt-1 font-mono">
                {health?.onemapStatus?.probes?.search?.latencyMs || 0}ms
              </div>
              <span className="text-[10px] text-[#059669] mt-1 block font-mono">
                HTTP {health?.onemapStatus?.probes?.search?.httpStatus || 200} OK
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-semibold">OneMap RevGeocode Probe</span>
              <div className="text-xl font-bold text-[#0F172A] mt-1 font-mono">
                {health?.onemapStatus?.probes?.revgeocode?.latencyMs || 0}ms
              </div>
              <span className="text-[10px] text-[#0284C7] mt-1 block font-mono">
                Reachable ({health?.onemapStatus?.probes?.revgeocode?.httpStatus || 401})
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-[8px] border border-[#CBD5E1] shadow-xs">
              <span className="text-[10px] font-mono text-[#64748B] uppercase font-semibold">System Memory</span>
              <div className="text-xl font-bold text-[#0F172A] mt-1 font-mono">
                {health?.system?.memoryUsageMb?.heapUsed || 0}MB
              </div>
              <span className="text-[10px] text-[#64748B] mt-1 block font-mono">
                RSS: {health?.system?.memoryUsageMb?.rss || 0}MB
              </span>
            </div>
          </div>

          {/* Health JSON Inspector */}
          <div className="bg-white rounded-[8px] border border-[#CBD5E1] shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[#0F172A] uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#0284C7]" />
                Endpoint /api/health Telemetry Payload
              </span>
              <button
                onClick={() => handleCopy(JSON.stringify(health, null, 2), 'health')}
                className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center space-x-1"
              >
                {copiedKey === 'health' ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'health' ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-[#0F172A] text-[#E2E8F0] p-3 rounded-[4px] text-xs font-mono overflow-x-auto max-h-72">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Elastic Search */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[8px] border border-[#CBD5E1] shadow-xs space-y-3">
            <div className="text-xs font-bold text-[#0F172A] font-mono uppercase">
              OneMap Elastic Search Service (GET /api/onemap/search)
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                  placeholder="Enter Singapore building, street, or postal code (e.g. raffles place)..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] pl-9 pr-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <button
                onClick={() => runSearch()}
                disabled={isSearchLoading}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-[4px] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                {isSearchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Execute Search</span>
              </button>

              {/* Quick Presets */}
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[#64748B] text-[11px]">Presets:</span>
                {['raffles place', 'guoco tower', 'capitaspring', '049247', 'jurong gateway'].map(p => (
                  <button
                    key={p}
                    onClick={() => { setSearchVal(p); runSearch(p); }}
                    className="px-2 py-0.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-[3px] text-[11px] font-mono border border-[#CBD5E1]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#64748B] font-mono">
              Upstream: <code className="text-[#0284C7]">https://www.onemap.gov.sg/api/common/elastic/search?searchVal={encodeURIComponent(searchVal)}&returnGeom=Y&getAddrDetails=Y&pageNum=1</code>
            </div>
          </div>

          {/* Search Results Table */}
          <div className="bg-white rounded-[8px] border border-[#CBD5E1] shadow-xs overflow-hidden">
            <div className="p-3 bg-[#F8FAFC] border-b border-[#CBD5E1] flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#0F172A]">Results Found: {totalFound}</span>
              <span className="text-[#64748B]">Latency: {searchRaw?.latencyMs || 0}ms</span>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[10px] font-mono uppercase text-[#475569]">
                    <th className="p-2.5 font-semibold">Building & Location</th>
                    <th className="p-2.5 font-semibold">Postal Code</th>
                    <th className="p-2.5 font-semibold">SVY21 (X / Y)</th>
                    <th className="p-2.5 font-semibold">Coordinates (Lat / Lng)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {searchResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FAFC]">
                      <td className="p-2.5">
                        <div className="font-semibold text-[#0F172A]">{item.BUILDING || item.SEARCHVAL}</div>
                        <div className="text-[11px] text-[#64748B]">{item.ADDRESS}</div>
                      </td>
                      <td className="p-2.5 whitespace-nowrap font-mono font-semibold text-[#0284C7]">
                        {item.POSTAL !== 'NIL' ? item.POSTAL : '—'}
                      </td>
                      <td className="p-2.5 whitespace-nowrap font-mono text-[#64748B] text-[11px]">
                        X: {Math.round(Number(item.X))}, Y: {Math.round(Number(item.Y))}
                      </td>
                      <td className="p-2.5 whitespace-nowrap font-mono text-[#0F172A] text-[11px]">
                        {Number(item.LATITUDE).toFixed(6)}, {Number(item.LONGITUDE).toFixed(6)}
                      </td>
                    </tr>
                  ))}
                  {searchResults.length === 0 && !isSearchLoading && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-xs text-[#64748B]">
                        No results found for "{searchVal}". Try another query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reverse Geocode */}
      {activeTab === 'revgeocode' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[8px] border border-[#CBD5E1] shadow-xs space-y-3">
            <div className="text-xs font-bold text-[#0F172A] font-mono uppercase">
              OneMap Reverse Geocoding Service (GET /api/onemap/revgeocode)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-1">
                  Location (Lat, Lng)
                </label>
                <input
                  type="text"
                  value={revLocation}
                  onChange={(e) => setRevLocation(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-1">
                  Buffer (Meters)
                </label>
                <input
                  type="text"
                  value={revBuffer}
                  onChange={(e) => setRevBuffer(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-1">
                  Address Type
                </label>
                <input
                  type="text"
                  value={revAddressType}
                  onChange={(e) => setRevAddressType(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => runRevGeocode()}
                disabled={isRevLoading}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-[4px] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                {isRevLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                <span>Execute Reverse Geocode</span>
              </button>

              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[#64748B] text-[11px]">Presets:</span>
                {[
                  { label: 'Downtown (1.3, 103.8)', val: '1.3,103.8' },
                  { label: 'Raffles Place (1.284, 103.851)', val: '1.284,103.851' },
                  { label: 'Marina Bay (1.280, 103.854)', val: '1.280,103.854' }
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setRevLocation(p.val); runRevGeocode(p.val); }}
                    className="px-2 py-0.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-[3px] text-[11px] font-mono border border-[#CBD5E1]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#64748B] font-mono">
              Upstream: <code className="text-[#0284C7]">https://www.onemap.gov.sg/api/public/revgeocode?location={encodeURIComponent(revLocation)}&buffer={revBuffer}&addressType={revAddressType}</code>
            </div>
          </div>

          {/* RevGeocode Payload Viewer */}
          <div className="bg-white rounded-[8px] border border-[#CBD5E1] shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-[#0F172A] uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#0284C7]" />
                Reverse Geocode Response
              </span>
              <span className="text-xs font-mono text-[#64748B]">
                Latency: {revResults?.latencyMs || 0}ms
              </span>
            </div>

            <pre className="bg-[#0F172A] text-[#E2E8F0] p-3 rounded-[4px] text-xs font-mono overflow-x-auto max-h-72">
              {JSON.stringify(revResults, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Auth Token */}
      {activeTab === 'token' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[8px] border border-[#CBD5E1] shadow-xs space-y-3">
            <div className="text-xs font-bold text-[#0F172A] font-mono uppercase">
              OneMap Token Gateway (GET / POST /api/onemap/token)
            </div>
            <p className="text-xs text-[#64748B]">
              Proxies to <code className="text-[#0284C7] font-mono">https://www.onemap.gov.sg/api/auth/post/getToken</code>. Allows validating current token status or submitting account credentials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-1">
                  OneMap Registered Email (Optional)
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#64748B] uppercase mb-1">
                  OneMap Password (Optional)
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] px-3 py-1.5 text-xs text-[#0F172A]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => checkTokenEndpoint(false)}
                disabled={isTokenLoading}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-[4px] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                {isTokenLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
                <span>Check Token Status (GET)</span>
              </button>

              <button
                onClick={() => checkTokenEndpoint(true)}
                disabled={isTokenLoading || !emailInput || !passwordInput}
                className="px-4 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 text-white rounded-[4px] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <span>Request Token (POST)</span>
              </button>
            </div>
          </div>

          {/* Token Response Viewer */}
          <div className="bg-white rounded-[8px] border border-[#CBD5E1] shadow-xs p-4 space-y-3">
            <span className="text-xs font-bold font-mono text-[#0F172A] uppercase flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#0284C7]" />
              Auth Token Response
            </span>
            <pre className="bg-[#0F172A] text-[#E2E8F0] p-3 rounded-[4px] text-xs font-mono overflow-x-auto max-h-72">
              {JSON.stringify(tokenResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
