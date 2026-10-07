import healthHandler from './health.js';
import onemapHandler from './onemap.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
  const pathname = url.pathname;

  if (pathname.includes('/health')) {
    return healthHandler(req, res);
  }

  if (pathname.includes('/onemap')) {
    return onemapHandler(req, res);
  }

  const payload = {
    status: 'ACTIVE',
    service: 'Lion City Spatial Intelligence API Gateway',
    version: '1.0.0',
    availableEndpoints: [
      {
        path: '/api/health',
        description: 'System health monitoring and OneMap connectivity telemetry'
      },
      {
        path: '/api/onemap',
        description: 'Singapore Land Authority (SLA) OneMap GIS integration endpoints'
      },
      {
        path: '/api/onemap/token',
        description: 'OneMap authentication token gateway'
      },
      {
        path: '/api/onemap/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1',
        description: 'OneMap Elastic Search geocoding service'
      },
      {
        path: '/api/onemap/revgeocode?location=1.3,103.8&buffer=40&addressType=All',
        description: 'OneMap Reverse Geocoding service'
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(payload);
  } else {
    res.statusCode = 200;
    return res.end(JSON.stringify(payload));
  }
}
