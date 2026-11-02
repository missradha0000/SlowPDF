/**
 * Vercel Serverless Function / Express Handler: /api/send-pdf
 * Delivers processed PDFs directly to user's Telegram chat via Telegram Bot API
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { userId, fileName, pdfBase64 } = req.body || {};

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing userId parameter.' });
    }

    if (!pdfBase64) {
      return res.status(400).json({ success: false, error: 'Missing pdfBase64 document payload.' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.warn('TELEGRAM_BOT_TOKEN is not configured on the server.');
      return res.status(500).json({
        success: false,
        error: 'Telegram Bot Token is not configured on the server (TELEGRAM_BOT_TOKEN is missing).'
      });
    }

    // Strip data URI prefix if present (e.g. "data:application/pdf;base64,...")
    const cleanBase64 = typeof pdfBase64 === 'string' ? pdfBase64.replace(/^data:[^;]+;base64,/, '') : '';
    const fileBuffer = Buffer.from(cleanBase64, 'base64');

    if (fileBuffer.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid or empty PDF payload.' });
    }

    const safeFileName = (fileName && typeof fileName === 'string' && fileName.trim())
      ? fileName.trim()
      : 'SlowPDF_Document.pdf';

    // Construct FormData for Telegram sendDocument API
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('chat_id', String(userId));
    formData.append('document', fileBlob, safeFileName);
    formData.append('caption', '✅ Here is your processed document from SlowPDF!');

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendDocument`;

    const tgResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      body: formData
    });

    const tgResult = await tgResponse.json().catch(() => ({ ok: false, description: 'Non-JSON response from Telegram' }));

    if (!tgResponse.ok || !tgResult.ok) {
      console.error('Telegram API error:', tgResult);
      return res.status(tgResponse.status >= 400 && tgResponse.status < 500 ? tgResponse.status : 502).json({
        success: false,
        error: tgResult.description || 'Failed to send document to Telegram chat.',
        errorCode: tgResult.error_code
      });
    }

    return res.status(200).json({
      success: true,
      messageId: tgResult.result?.message_id
    });

  } catch (error) {
    console.error('Unexpected error in /api/send-pdf:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while dispatching PDF to Telegram.'
    });
  }
}
