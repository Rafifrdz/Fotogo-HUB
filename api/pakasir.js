
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { method, order_id, amount } = req.body;

    // AMBIL DARI ENVIRONMENT VARIABLES (DI VERCEL DASHBOARD)
    const project = process.env.VITE_PAKASIR_SLUG;
    const api_key = process.env.VITE_PAKASIR_API_KEY;

    if (!project || !api_key) {
      return res.status(500).json({ error: 'Pakasir credentials not configured on server' });
    }

    console.log(`[Secure Backend] Creating Pakasir ${method} for ${order_id}`);

    const response = await fetch(`https://app.pakasir.com/api/transactioncreate/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project,
        order_id,
        amount,
        api_key,
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Secure Proxy Error:', error);
    return res.status(500).json({ error: 'Backend failed to process payment' });
  }
}
