/**
 * Vercel Serverless Function / Express Route Handler: /api/send-pdf
 * Reads TELEGRAM_BOT_TOKEN securely from environment variables.
 * Dispatches processed PDF documents to user's Telegram chat via Telegram Bot API.
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
};

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Please use POST.'
    });
  }

  try {
    const { userId, fileName, pdfBase64 } = req.body || {};

    // 1. Verify that TELEGRAM_BOT_TOKEN is present in environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken || !botToken.trim()) {
      console.warn('Telegram bot token is not configured on server.');
      return res.status(500).json({
        success: false,
        message: 'Telegram bot token is not configured on server'
      });
    }

    // 2. Validate input parameters
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter.'
      });
    }

    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        message: 'Missing pdfBase64 document payload.'
      });
    }

    // 3. Process Base64 PDF data (support both raw base64 and data URI schemes)
    const cleanBase64 = typeof pdfBase64 === 'string'
      ? pdfBase64.replace(/^data:[^;]+;base64,/, '').trim()
      : '';
    const fileBuffer = Buffer.from(cleanBase64, 'base64');

    if (fileBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty PDF payload.'
      });
    }

    const safeFileName = (fileName && typeof fileName === 'string' && fileName.trim())
      ? fileName.trim()
      : 'SlowPDF_Document.pdf';

    // 4. Construct multipart/form-data payload using standard web FormData & Blob
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('chat_id', String(userId));
    formData.append('document', fileBlob, safeFileName);
    formData.append('caption', '✅ Here is your processed document from SlowPDF!');

    // 5. Send document via official Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${botToken.trim()}/sendDocument`;

    const tgResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      body: formData
    });

    const tgResult = await tgResponse.json().catch(() => ({
      ok: false,
      description: 'Received non-JSON response from Telegram API'
    }));

    if (!tgResponse.ok || !tgResult.ok) {
      console.error('Telegram API error response:', tgResult);
      return res.status(tgResponse.status >= 400 && tgResponse.status < 500 ? tgResponse.status : 502).json({
        success: false,
        message: tgResult.description || 'Failed to send document to Telegram chat.',
        errorCode: tgResult.error_code
      });
    }

    // 6. Return successful delivery response
    return res.status(200).json({
      success: true,
      message: 'Document delivered successfully to Telegram chat.',
      messageId: tgResult.result?.message_id
    });

  } catch (error) {
    console.error('Unexpected error in /api/send-pdf:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while dispatching PDF to Telegram.'
    });
  }
}
