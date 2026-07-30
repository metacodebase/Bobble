/**
 * Netlify HTTPS proxy for RevenueCat webhooks → Bobble API (HTTP on EC2).
 * RevenueCat requires HTTPS; this terminates TLS and forwards the POST.
 */
const UPSTREAM =
  process.env.REVENUECAT_WEBHOOK_UPSTREAM ||
  'http://34.204.180.53/api/webhooks/revenuecat';

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const auth =
    event.headers.authorization || event.headers.Authorization || '';

  let body = event.body || '';
  if (event.isBase64Encoded && body) {
    body = Buffer.from(body, 'base64').toString('utf8');
  }

  try {
    const res = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(auth ? { Authorization: auth } : {}),
      },
      body,
    });

    const text = await res.text();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
      body: text,
    };
  } catch (err) {
    console.error('[revenuecat-webhook] upstream failed', err);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Upstream webhook unreachable',
        code: 'WEBHOOK_PROXY_ERROR',
      }),
    };
  }
};
