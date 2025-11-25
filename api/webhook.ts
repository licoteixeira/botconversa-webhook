import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
   const body = req.body || {};

console.log('Corpo recebido do BotConversa:', JSON.stringify(body, null, 2));

const userText =
  (body.text as string | undefined) ||
  (body.mensagem as string | undefined) ||
  (body.message as string | undefined) ||
  (body.root && (body.root.text as string | undefined)) ||
  '';

if (!userText.trim()) {
  return res.json({
    reply:
      'Desculpe, não consegui entender a sua mensagem agora. Pode escrever de novo, por favor?',
  });
}

    // ===== CHAMADA OPENAI COM LOG COMPLETO =====
    const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'system',
      content:
        'Você é um atendente da empresa Viggi Rastreamento. Responda de forma clara, direta e educada, sempre relacionado a rastreamento veicular, TAG, planos e dúvidas de clientes.',
    },
    { role: 'user', content: userText },
  ],
});

const reply =
  completion.choices[0]?.message?.content ??
  'Desculpe, tive um problema ao responder agora. Pode tentar novamente?';

return res.json({ reply });

    }

    const data = JSON.parse(openaiText);
    const reply =
      data.choices?.[0]?.message?.content?.trim() ??
      "Desculpe, tive um problema para responder agora.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("ERRO GERAL NO WEBHOOK:", err);
    return res.status(200).json({
      reply: "Desculpe, tive um problema para responder agora.",
    });
  }
}


