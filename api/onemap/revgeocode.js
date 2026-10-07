/**
 * Vercel Serverless Function & Express handler for OneMap Reverse Geocode
 * Endpoint: /api/onemap/revgeocode
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
    const location = req.query?.location || url.searchParams.get('location') || '1.3,103.8';
    const buffer = req.query?.buffer || url.searchParams.get('buffer') || '40';
    const addressType = req.query?.addressType || url.searchParams.get('addressType') || 'All';

    const targetUrl = new URL('https://www.onemap.gov.sg/api/public/revgeocode');
    targetUrl.searchParams.set('location', location);
    targetUrl.searchParams.set('buffer', buffer);
    targetUrl.searchParams.set('addressType', addressType);

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
    const data = await response.json().catch(() => ({ statusText: response.statusText }));

    let fallbackInfo = null;
    if (response.status === 401 && !token) {
      const [lat, lng] = location.split(',').map(s => parseFloat(s.trim()));
      fallbackInfo = {
        notice: 'OneMap reverse geocoding requires an API token. Configure ONE_MAP_API_KEY in environment variables.',
        coordinates: { latitude: lat || 1.3, longitude: lng || 103.8 },
        approximateZone: (lat > 1.27 && lat < 1.30 && lng > 103.83 && lng < 103.86)
          ? 'Singapore Downtown Core / Raffles Place & Marina Bay'
          : 'Singapore Urban Planning Corridor',
        cadastralDatum: 'SVY21 / WGS84'
      };
    }

    const resultPayload = {
      source: 'Singapore Land Authority (SLA) OneMap RevGeocode API',
      query: { location, buffer, addressType },
      latencyMs,
      targetUrl: targetUrl.toString(),
      data,
      fallbackInfo
    };

    res.setHeader('Content-Type', 'application/json');

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(response.status).json(resultPayload);
    } else {
      res.statusCode = response.status;
      return res.end(JSON.stringify(resultPayload));
    }
  } catch (error) {
    const errorPayload = {
      error: 'Failed to perform OneMap Reverse Geocoding',
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
