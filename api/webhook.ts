import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body as { text?: string };

    if (!text) {
      return res.status(400).json({ error: "Campo 'text' não enviado" });
    }

    // 1) Chamar a API da OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é o atendente oficial da empresa, responde curto, simples e educado, em português do Brasil."
          },
          { role: "user", content: text }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Desculpe, tive um problema para responder agora.";

    // 2) Devolver para o BotConversa em JSON
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
