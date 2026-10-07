/**
 * Vercel Serverless Function & Express compatible Health Check API
 * Endpoint: /api/health
 */

export async function checkHealth(includeExternal = false) {
  const startTime = Date.now();
  const memory = process.memoryUsage ? process.memoryUsage() : { rss: 0, heapTotal: 0, heapUsed: 0 };

  const healthReport = {
    status: 'HEALTHY',
    service: 'Lion City Spatial Intelligence API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMb: {
        rss: Math.round(memory.rss / (1024 * 1024)),
        heapTotal: Math.round(memory.heapTotal / (1024 * 1024)),
        heapUsed: Math.round(memory.heapUsed / (1024 * 1024))
      }
    },
    endpoints: {
      health: '/api/health',
      onemapToken: '/api/onemap/token',
      onemapSearch: '/api/onemap/search',
      onemapRevGeocode: '/api/onemap/revgeocode'
    },
    onemapStatus: {
      gateway: 'READY',
      lastChecked: null,
      probes: {}
    }
  };

  if (includeExternal) {
    try {
      // Probe OneMap Elastic Search
      const searchStart = Date.now();
      const searchRes = await fetch(
        'https://www.onemap.gov.sg/api/common/elastic/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1',
        { method: 'GET', signal: AbortSignal.timeout(3500) }
      );
      const searchLatency = Date.now() - searchStart;

      healthReport.onemapStatus.probes.search = {
        target: 'https://www.onemap.gov.sg/api/common/elastic/search',
        httpStatus: searchRes.status,
        reachable: searchRes.status < 500,
        latencyMs: searchLatency
      };
    } catch (err) {
      healthReport.onemapStatus.probes.search = {
        target: 'https://www.onemap.gov.sg/api/common/elastic/search',
        reachable: false,
        error: err.message || 'Timeout/Network Error'
      };
    }

    try {
      // Probe OneMap Reverse Geocode
      const revStart = Date.now();
      const revRes = await fetch(
        'https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All',
        { method: 'GET', signal: AbortSignal.timeout(3500) }
      );
      const revLatency = Date.now() - revStart;

      healthReport.onemapStatus.probes.revgeocode = {
        target: 'https://www.onemap.gov.sg/api/public/revgeocode',
        httpStatus: revRes.status,
        reachable: revRes.status < 500,
        latencyMs: revLatency
      };
    } catch (err) {
      healthReport.onemapStatus.probes.revgeocode = {
        target: 'https://www.onemap.gov.sg/api/public/revgeocode',
        reachable: false,
        error: err.message || 'Timeout/Network Error'
      };
    }

    try {
      // Probe OneMap Token Endpoint
      const tokenStart = Date.now();
      const tokenRes = await fetch(
        'https://www.onemap.gov.sg/api/auth/post/getToken',
        { method: 'GET', signal: AbortSignal.timeout(3500) }
      );
      const tokenLatency = Date.now() - tokenStart;

      healthReport.onemapStatus.probes.token = {
        target: 'https://www.onemap.gov.sg/api/auth/post/getToken',
        httpStatus: tokenRes.status,
        reachable: tokenRes.status < 500,
        latencyMs: tokenLatency
      };
    } catch (err) {
      healthReport.onemapStatus.probes.token = {
        target: 'https://www.onemap.gov.sg/api/auth/post/getToken',
        reachable: false,
        error: err.message || 'Timeout/Network Error'
      };
    }

    healthReport.onemapStatus.lastChecked = new Date().toISOString();
  }

  healthReport.totalResponseTimeMs = Date.now() - startTime;
  return healthReport;
}

/**
 * Standard Vercel Serverless Function & Express handler
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    let checkExternal = false;
    if (req.query && req.query.external !== undefined) {
      checkExternal = req.query.external !== 'false';
    } else if (req.url && req.url.includes('external=true')) {
      checkExternal = true;
    }

    const report = await checkHealth(checkExternal);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(report);
    } else {
      res.statusCode = 200;
      return res.end(JSON.stringify(report));
    }
  } catch (error) {
    const errorPayload = {
      status: 'DEGRADED',
      error: error.message || String(error),
      timestamp: new Date().toISOString()
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(500).json(errorPayload);
    } else {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(errorPayload));
    }
  }
}
