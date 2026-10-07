/**
 * Vercel Serverless Function & Express handler for OneMap Search
 * Endpoint: /api/onemap/search
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
    const searchVal = req.query?.searchVal || url.searchParams.get('searchVal') || 'raffles place';
    const returnGeom = req.query?.returnGeom || url.searchParams.get('returnGeom') || 'Y';
    const getAddrDetails = req.query?.getAddrDetails || url.searchParams.get('getAddrDetails') || 'Y';
    const pageNum = req.query?.pageNum || url.searchParams.get('pageNum') || '1';

    const targetUrl = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
    targetUrl.searchParams.set('searchVal', searchVal);
    targetUrl.searchParams.set('returnGeom', returnGeom);
    targetUrl.searchParams.set('getAddrDetails', getAddrDetails);
    targetUrl.searchParams.set('pageNum', pageNum);

    const headers = {};
    const token = req.headers?.authorization || process.env.ONE_MAP_API_KEY || process.env.ONEMAP_API_TOKEN || null;
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const startTime = Date.now();
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(6000)
    });
    const latencyMs = Date.now() - startTime;
    const data = await response.json();

    const resultPayload = {
      source: 'Singapore Land Authority (SLA) OneMap API',
      query: { searchVal, returnGeom, getAddrDetails, pageNum },
      latencyMs,
      targetUrl: targetUrl.toString(),
      data
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=60');

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(response.status).json(resultPayload);
    } else {
      res.statusCode = response.status;
      return res.end(JSON.stringify(resultPayload));
    }
  } catch (error) {
    const errorPayload = {
      error: 'Failed to perform OneMap Elastic Search',
      message: error.message || String(error)
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
