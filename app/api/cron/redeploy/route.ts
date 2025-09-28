export async function GET(request: Request) {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) {
    return new Response('Missing hook', { status: 500 });
  }

  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  if (!ua.includes('vercel-cron')) {
    return new Response('Forbidden', { status: 403 });
  }

  const res = await fetch(hook, { method: 'POST' });
  return new Response(JSON.stringify({ ok: res.ok, status: res.status }), {
    headers: { 'content-type': 'application/json' },
    status: res.ok ? 200 : 502,
  });
}
