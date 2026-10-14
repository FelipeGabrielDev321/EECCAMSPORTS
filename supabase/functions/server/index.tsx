import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-ec12f2c5/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-ec12f2c5/send-email", async (c) => {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    return c.json({ error: "RESEND_API_KEY not configured" }, 500);
  }

  const body = await c.req.json();
  const { to, studentName, sport, status, reason, deniedByName, deniedByRole, deniedBySport } = body;

  if (!to || !studentName || !sport || !status) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const isApproved = status === "aprovado";

  const subject = isApproved
    ? `✅ Inscrição Aprovada — ${sport} | EEPCA`
    : `❌ Inscrição Não Aprovada — ${sport} | EEPCA`;

  const approvedHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:12px;">
      <div style="background:#16a34a;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">✅ Inscrição Aprovada!</h1>
      </div>
      <p style="color:#1e293b;font-size:16px;">Olá, <strong>${studentName}</strong>!</p>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Temos o prazer de informar que sua inscrição para a modalidade
        <strong style="color:#1e293b;">${sport}</strong> foi
        <strong style="color:#16a34a;">aprovada</strong> no processo seletivo da
        <strong>Escola Estadual Professora Calpurnia Caldas de Amorim (EEPCA)</strong>.
      </p>
      <div style="background:#dcfce7;border:1px solid #86efac;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">Próximos passos:</p>
        <ol style="color:#166534;font-size:14px;margin:8px 0 0 0;padding-left:20px;line-height:1.8;">
          <li>Aguarde o contato da escola com a data e horário do teste prático</li>
          <li>Compareça com documento de identificação</li>
          <li>Use roupas e calçados adequados para a atividade</li>
        </ol>
      </div>
      <p style="color:#475569;font-size:14px;">Em caso de dúvidas, entre em contato: <a href="mailto:contato@eepca.edu.br" style="color:#2563eb;">contato@eepca.edu.br</a></p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="color:#94a3b8;font-size:12px;text-align:center;">EEPCA — Processo Seletivo Esportivo 2026</p>
    </div>
  `;

  const roleLabel = deniedByRole === "secretario" ? "Secretaria" : `Professor(a)${deniedBySport ? ` — ${deniedBySport}` : ""}`;

  const deniedHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:12px;">
      <div style="background:#dc2626;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">❌ Inscrição Não Aprovada</h1>
      </div>
      <p style="color:#1e293b;font-size:16px;">Olá, <strong>${studentName}</strong>!</p>
      <p style="color:#475569;font-size:15px;line-height:1.6;">
        Informamos que sua inscrição para a modalidade
        <strong style="color:#1e293b;">${sport}</strong> no processo seletivo da
        <strong>Escola Estadual Professora Calpurnia Caldas de Amorim (EEPCA)</strong>
        não foi aprovada nesta edição.
      </p>
      <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px 0;color:#991b1b;font-size:14px;font-weight:600;">Motivo informado:</p>
        <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.6;">${reason}</p>
        <p style="margin:12px 0 0 0;color:#991b1b;font-size:12px;">
          Decisão de: <strong>${deniedByName}</strong> (${roleLabel})
        </p>
      </div>
      <p style="color:#475569;font-size:14px;line-height:1.6;">
        Caso tenha dúvidas ou queira mais informações, entre em contato com a secretaria da escola:
        <a href="mailto:contato@eepca.edu.br" style="color:#2563eb;">contato@eepca.edu.br</a>
      </p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
      <p style="color:#94a3b8;font-size:12px;text-align:center;">EEPCA — Processo Seletivo Esportivo 2026</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EEPCA Processo Seletivo <onboarding@resend.dev>",
      to: [to],
      subject,
      html: isApproved ? approvedHtml : deniedHtml,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return c.json({ error: "Failed to send email", detail: err }, 500);
  }

  return c.json({ success: true });
});

Deno.serve(app.fetch);
