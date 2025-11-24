import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body as any;

    const msg = body?.message?.text || body?.text || "";
    const phone = body?.message?.from || body?.phone || "";

    console.log("Mensagem recebida:", msg, "Telefone:", phone);

    if (!msg || !phone) {
      return res.status(400).json({ error: "Payload incompleto" });
    }

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
              "Você é o atendente oficial da empresa. Responda de forma simples, direta e educada."
          },
          { role: "user", content: msg }
        ]
      })
    });

    const openaiData = await openaiRes.json();
    const resposta = openaiData.choices?.[0]?.message?.content?.trim() || "";

    const envio = await fetch(
      "https://backend.botconversa.com.br/api/v1/messages/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.BOTCONVERSA_API_KEY as string
        },
        body: JSON.stringify({
          phone,
          message: resposta
        })
      }
    );

    const envioData = await envio.json();
    console.log("Resposta BotConversa:", envioData);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Erro no webhook:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
