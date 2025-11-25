// api/webhook.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Webhook recebeu:', req.body);

  if (req.method !== 'POST') {
    res.status(405).json({ reply: 'Método não permitido' });
    return;
  }

  const body: any = req.body || {};

  const userText =
    body.text ||
    body.mensagem ||
    body.message ||
    (body.root && body.root.text) ||
    '';

  const safeText = (userText || '').toString().trim() || '(vazio)';

  // Resposta só de teste, sem GPT
  return res.status(200).json({
    reply: `Recebi do WhatsApp: ${safeText}`,
  });
}
