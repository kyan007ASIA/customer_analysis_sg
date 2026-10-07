import express from 'express';

const router = express.Router();

/**
 * Health check handler to monitor server status and external OneMap API connectivity
 */
export async function checkHealth(includeExternal = false) {
  const startTime = Date.now();
  const memory = process.memoryUsage();

  const healthReport = {
    status: 'HEALTHY',
    service: 'Lion City Spatial Intelligence API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
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
        { method: 'GET', signal: AbortSignal.timeout(5000) }
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
        error: err.message
      };
    }

    try {
      // Probe OneMap Reverse Geocode
      const revStart = Date.now();
      const revRes = await fetch(
        'https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All',
        { method: 'GET', signal: AbortSignal.timeout(5000) }
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
        error: err.message
      };
    }

    try {
      // Probe OneMap Token Endpoint
      const tokenStart = Date.now();
      const tokenRes = await fetch(
        'https://www.onemap.gov.sg/api/auth/post/getToken',
        { method: 'GET', signal: AbortSignal.timeout(5000) }
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
        error: err.message
      };
    }

    healthReport.onemapStatus.lastChecked = new Date().toISOString();
  }

  healthReport.totalResponseTimeMs = Date.now() - startTime;
  return healthReport;
}

// Route handlers
router.get('/', async (req, res) => {
  const checkExternal = req.query.external !== 'false';
  try {
    const report = await checkHealth(checkExternal);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({
      status: 'DEGRADED',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Standalone handler export
export default router;
