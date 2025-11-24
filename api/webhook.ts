import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body as { text?: string };
    console.log("Recebi do BotConversa:", req.body);

    if (!text) {
      return res.status(400).json({ error: "Campo 'text' não enviado" });
    }

    // ===== CHAMADA OPENAI COM LOG COMPLETO =====
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é o atendente oficial da empresa. Responda em português, simples e educado.",
          },
          { role: "user", content: text },
        ],
      }),
    });

    const openaiText = await openaiRes.text();
    console.log("Resposta bruta da OpenAI:", openaiRes.status, openaiText);

    if (!openaiRes.ok) {
      // erro de chave / modelo / etc
      return res.status(200).json({
        reply:
          "Desculpe, tive um problema técnico ao falar com o assistente agora.",
      });
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


