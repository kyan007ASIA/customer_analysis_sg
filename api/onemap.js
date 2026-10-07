import searchHandler from './onemap/search.js';
import tokenHandler from './onemap/token.js';
import revgeocodeHandler from './onemap/revgeocode.js';

/**
 * Dispatcher handler for /api/onemap on Vercel and Express
 */
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

  if (pathname.includes('/search') || url.searchParams.has('searchVal')) {
    return searchHandler(req, res);
  }

  if (pathname.includes('/token')) {
    return tokenHandler(req, res);
  }

  if (pathname.includes('/revgeocode') || url.searchParams.has('location')) {
    return revgeocodeHandler(req, res);
  }

  const indexPayload = {
    service: 'OneMap Information API Integration',
    authority: 'Singapore Land Authority (SLA) / GovTech Singapore',
    configuredApiKey: process.env.ONE_MAP_API_KEY ? 'CONFIGURED' : 'NOT_CONFIGURED',
    endpoints: [
      {
        path: '/api/onemap/token',
        method: 'GET / POST',
        description: 'Authenticates and acquires OneMap API Access Token',
        upstream: 'https://www.onemap.gov.sg/api/auth/post/getToken'
      },
      {
        path: '/api/onemap/search?searchVal=raffles%20place&returnGeom=Y&getAddrDetails=Y&pageNum=1',
        method: 'GET',
        description: 'Searches Singapore buildings, postal codes, and SVY21 / WGS84 coordinates',
        upstream: 'https://www.onemap.gov.sg/api/common/elastic/search'
      },
      {
        path: '/api/onemap/revgeocode?location=1.3,103.8&buffer=40&addressType=All',
        method: 'GET',
        description: 'Performs reverse geocoding on coordinates to retrieve nearest building and road info',
        upstream: 'https://www.onemap.gov.sg/api/public/revgeocode'
      }
    ]
  };

  res.setHeader('Content-Type', 'application/json');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(indexPayload);
  } else {
    res.statusCode = 200;
    return res.end(JSON.stringify(indexPayload));
  }
}
