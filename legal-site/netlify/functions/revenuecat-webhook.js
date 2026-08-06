/**
 * Compatibility proxy for RevenueCat webhooks → Bobble's HTTPS API.
 * New integrations should call api.bobble.au directly.
 */
const UPSTREAM =
  process.env.REVENUECAT_WEBHOOK_UPSTREAM ||
  'https://api.bobble.au/api/webhooks/revenuecat';

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
  const signature =
    event.headers['x-revenuecat-webhook-signature'] ||
    event.headers['X-RevenueCat-Webhook-Signature'] ||
    '';

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
        ...(signature
          ? { 'X-RevenueCat-Webhook-Signature': signature }
          : {}),
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
