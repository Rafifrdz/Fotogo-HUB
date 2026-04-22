import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: 'Photobooth Hub',
          short_name: 'Photobooth',
          description: 'A modern photobooth application',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        }
      }),
      // UNIFIED API PROXY (Matches Vercel's /api/pakasir)
      {
        name: 'pakasir-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/pakasir') {
              if (req.method === 'POST') {
                try {
                  const body = await new Promise<unknown>((resolve) => {
                    let data = '';
                    req.on('data', chunk => data += chunk);
                    req.on('end', () => resolve(JSON.parse(data)));
                  });

                  const { method, order_id, amount } = body as {
                    method: string;
                    order_id: string;
                    amount: number;
                  };
                  console.log(`[Local Proxy] Creating Pakasir ${method} transaction...`);

                  const response = await fetch(`https://app.pakasir.com/api/transactioncreate/${method}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      project: env.VITE_PAKASIR_SLUG,
                      order_id,
                      amount,
                      api_key: env.VITE_PAKASIR_API_KEY
                    })
                  });

                  const result = await response.json();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err) {
                  const message = err instanceof Error ? err.message : 'Unknown error';
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: message }));
                }
                return;
              }
            }
            next();
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
