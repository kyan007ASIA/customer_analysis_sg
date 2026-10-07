import express from 'express';

const router = express.Router();

// In-memory token cache if user sets or acquires a token
let cachedToken = process.env.ONEMAP_API_TOKEN || null;
let tokenExpiry = null;

/**
 * 1) OneMap Token Endpoint
 * GET /api/onemap/token or POST /api/onemap/token
 * Proxies to: https://www.onemap.gov.sg/api/auth/post/getToken
 */
router.all('/token', async (req, res) => {
  try {
    const email = req.body?.email || req.query.email || process.env.ONEMAP_EMAIL;
    const password = req.body?.password || req.query.password || process.env.ONEMAP_PASSWORD;

    // If request contains credentials, call OneMap auth endpoint with POST JSON
    const fetchOptions = {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (email && password) {
      fetchOptions.method = 'POST';
      fetchOptions.body = JSON.stringify({ email, password });
    }

    const response = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', fetchOptions);
    const data = await response.json().catch(() => ({ statusText: response.statusText }));

    if (response.ok && data.access_token) {
      cachedToken = data.access_token;
      tokenExpiry = data.expiry_timestamp;
    }

    res.status(response.status).json({
      endpoint: 'https://www.onemap.gov.sg/api/auth/post/getToken',
      httpStatus: response.status,
      hasCachedToken: !!cachedToken,
      tokenExpiry: tokenExpiry,
      response: data,
      note: !email || !password
        ? 'Tip: To obtain a full authenticated token, register at https://www.onemap.gov.sg/apidocs and supply email and password via POST body or ONEMAP_EMAIL/ONEMAP_PASSWORD in .env.'
        : undefined
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to contact OneMap auth service',
      message: error.message,
      target: 'https://www.onemap.gov.sg/api/auth/post/getToken'
    });
  }
});

/**
 * 2) OneMap Elastic Search Endpoint
 * GET /api/onemap/search
 * Proxies to: https://www.onemap.gov.sg/api/common/elastic/search?searchVal=...&returnGeom=Y&getAddrDetails=Y&pageNum=1
 */
router.get('/search', async (req, res) => {
  try {
    const searchVal = req.query.searchVal || 'raffles place';
    const returnGeom = req.query.returnGeom || 'Y';
    const getAddrDetails = req.query.getAddrDetails || 'Y';
    const pageNum = req.query.pageNum || '1';

    const targetUrl = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
    targetUrl.searchParams.set('searchVal', searchVal);
    targetUrl.searchParams.set('returnGeom', returnGeom);
    targetUrl.searchParams.set('getAddrDetails', getAddrDetails);
    targetUrl.searchParams.set('pageNum', pageNum);

    const headers = {};
    const token = req.headers.authorization || (cachedToken ? `Bearer ${cachedToken}` : null);
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const startTime = Date.now();
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers
    });
    const latencyMs = Date.now() - startTime;

    const data = await response.json();

    res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute cache
    res.status(response.status).json({
      source: 'Singapore Land Authority (SLA) OneMap API',
      query: {
        searchVal,
        returnGeom,
        getAddrDetails,
        pageNum
      },
      latencyMs,
      targetUrl: targetUrl.toString(),
      data
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to perform OneMap Elastic Search',
      message: error.message
    });
  }
});

/**
 * 3) OneMap Reverse Geocoding Endpoint
 * GET /api/onemap/revgeocode
 * Proxies to: https://www.onemap.gov.sg/api/public/revgeocode?location=1.3,103.8&buffer=40&addressType=All
 */
router.get('/revgeocode', async (req, res) => {
  try {
    const location = req.query.location || '1.3,103.8';
    const buffer = req.query.buffer || '40';
    const addressType = req.query.addressType || 'All';

    const targetUrl = new URL('https://www.onemap.gov.sg/api/public/revgeocode');
    targetUrl.searchParams.set('location', location);
    targetUrl.searchParams.set('buffer', buffer);
    targetUrl.searchParams.set('addressType', addressType);

    const headers = {};
    const token = req.headers.authorization || (cachedToken ? `Bearer ${cachedToken}` : null);
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const startTime = Date.now();
    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers
    });
    const latencyMs = Date.now() - startTime;

    const data = await response.json().catch(() => ({ statusText: response.statusText }));

    // If unauthorized and no token provided, provide helpful Singapore context & reverse lookup fallback
    let fallbackInfo = null;
    if (response.status === 401 && !token) {
      // Parse coordinates: e.g. location="1.3,103.8"
      const [lat, lng] = location.split(',').map(s => parseFloat(s.trim()));
      fallbackInfo = {
        notice: 'OneMap reverse geocoding requires a bearer token for full street details.',
        coordinates: { latitude: lat || 1.3, longitude: lng || 103.8 },
        approximateZone: (lat > 1.27 && lat < 1.30 && lng > 103.83 && lng < 103.86)
          ? 'Singapore Downtown Core / Raffles Place & Marina Bay'
          : 'Singapore Urban Planning Corridor',
        cadastralDatum: 'SVY21 / WGS84'
      };
    }

    res.status(response.status).json({
      source: 'Singapore Land Authority (SLA) OneMap RevGeocode API',
      query: {
        location,
        buffer,
        addressType
      },
      latencyMs,
      targetUrl: targetUrl.toString(),
      data,
      fallbackInfo
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to perform OneMap Reverse Geocoding',
      message: error.message
    });
  }
});

/**
 * Index / overview of OneMap integration endpoints
 */
router.get('/', (req, res) => {
  res.json({
    service: 'OneMap Information API Integration',
    authority: 'Singapore Land Authority (SLA) / GovTech Singapore',
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
  });
});

export default router;
