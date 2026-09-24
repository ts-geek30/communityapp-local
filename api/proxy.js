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
    return res.status(200).end();
  }

  try {
    // Determine the target subpath
    // When rewritten via /api/proxy?path=:path*, req.query.path contains the matched path segment(s)
    let subpath = req.query.path;
    if (Array.isArray(subpath)) {
      subpath = subpath.join('/');
    } else if (!subpath) {
      // Fallback: extract from req.url
      const urlObj = new URL(req.url, 'http://localhost');
      subpath = urlObj.pathname.replace(/^\/api\/v1\/?/, '').replace(/^\/api\/proxy\/?/, '');
    }

    // Reconstruct query parameters excluding 'path'
    const queryParams = new URLSearchParams();
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (key !== 'path') {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else if (value !== undefined) {
            queryParams.append(key, value);
          }
        }
      }
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const cleanSubpath = (subpath || '').replace(/^\/+/, '');
    const targetUrl = `http://168.144.216.118:5000/api/v1/${cleanSubpath}${queryString}`;

    const headers = {};
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    }
    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization'];
    }
    if (req.headers['accept']) {
      headers['accept'] = req.headers['accept'];
    }

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body !== undefined && req.body !== null) {
        fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }
    }

    const backendResponse = await fetch(targetUrl, fetchOptions);
    const responseBuffer = await backendResponse.arrayBuffer();

    const contentType = backendResponse.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.status(backendResponse.status).send(Buffer.from(responseBuffer));
  } catch (error) {
    console.error('Vercel API Proxy Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Backend Proxy Error' });
  }
}
