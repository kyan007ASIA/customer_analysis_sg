/**
 * Vercel Serverless Function & Express handler for OneMap Token
 * Endpoint: /api/onemap/token
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
    const email = req.body?.email || req.query?.email || url.searchParams.get('email') || process.env.ONEMAP_EMAIL;
    const password = req.body?.password || req.query?.password || url.searchParams.get('password') || process.env.ONEMAP_PASSWORD;
    const existingKey = process.env.ONE_MAP_API_KEY || process.env.ONEMAP_API_TOKEN;

    const fetchOptions = {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(6000)
    };

    if (email && password) {
      fetchOptions.method = 'POST';
      fetchOptions.body = JSON.stringify({ email, password });
    }

    const response = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', fetchOptions);
    const data = await response.json().catch(() => ({ statusText: response.statusText }));

    const resultPayload = {
      endpoint: 'https://www.onemap.gov.sg/api/auth/post/getToken',
      httpStatus: response.status,
      configuredEnvKey: existingKey ? 'PRESENT' : 'NOT_CONFIGURED',
      response: data,
      note: !email || !password
        ? 'Tip: To obtain a full authenticated token, register at https://www.onemap.gov.sg/apidocs and supply email and password via POST body or ONEMAP_EMAIL/ONEMAP_PASSWORD or set ONE_MAP_API_KEY in environment variables.'
        : undefined
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
      error: 'Failed to contact OneMap auth service',
      message: error.message || String(error),
      target: 'https://www.onemap.gov.sg/api/auth/post/getToken'
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
