export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extract path and query string from request URL
  const urlParts = req.url.split('?');
  const path = urlParts[0]; // e.g., /api/v1/auth/login
  const queryString = urlParts.length > 1 ? `?${urlParts[1]}` : '';

  const targetUrl = `http://168.144.216.118:5000${path}${queryString}`;

  try {
    const headers = {};
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    }
    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization'];
    }

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    }

    const backendResponse = await fetch(targetUrl, fetchOptions);
    const responseData = await backendResponse.text();

    const contentType = backendResponse.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.status(backendResponse.status).send(responseData);
  } catch (error) {
    console.error('Vercel API Proxy Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Backend Proxy Connection Error' });
  }
}
