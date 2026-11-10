import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sendPdfHandler from './api/send-pdf.js';
import sendTelegramHandler from './api/send-telegram.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser for JSON with large payload support for PDFs up to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Telegram Delivery API Routes
app.all(['/api/send-telegram', '/api/send-pdf'], async (req, res) => {
  try {
    await sendTelegramHandler(req, res);
  } catch (err: any) {
    console.error('Error handling Telegram delivery route:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
  }
});

// Direct Android APK Download Route (supports case-insensitive /slowpdf.apk & /SlowPDF.apk)
app.get(['/slowpdf.apk', '/SlowPDF.apk', '/SlowPDF-unsigned.apk'], (req, res) => {
  const candidates = [
    path.join(__dirname, 'public', 'slowpdf.apk'),
    path.join(__dirname, 'public', 'SlowPDF.apk'),
    path.join(__dirname, 'dist', 'slowpdf.apk'),
    path.join(__dirname, 'dist', 'SlowPDF.apk'),
  ];
  const apkPath = candidates.find((p) => fs.existsSync(p));
  if (apkPath) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="SlowPDF.apk"');
    return res.sendFile(apkPath);
  }
  res.status(404).send('APK file not found');
});

// Vite middleware in dev; static dist files in prod
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SlowPDF server running on http://0.0.0.0:${PORT}`);
});
