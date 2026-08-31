export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { name, email, phone, org, role, msg, website } = req.body || {};

  // Honeypot – bots fyller ut skjulte felt
  if (website) return res.status(200).json({ ok: true });

  if (!name || !email || !msg) return res.status(400).json({ ok: false, error: 'missing_fields' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, error: 'invalid_email' });
  if (msg.length > 3000) return res.status(400).json({ ok: false, error: 'too_long' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(503).json({ ok: false, error: 'not_configured' });

  const esc = (s) => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const html = `
    <h2>Ny henvendelse fra eiranova.no</h2>
    <p><strong>Navn:</strong> ${esc(name)}<br>
    <strong>E-post:</strong> ${esc(email)}<br>
    <strong>Telefon:</strong> ${esc(phone) || '–'}<br>
    <strong>Kommune/bedrift:</strong> ${esc(org) || '–'}<br>
    <strong>Kategori:</strong> ${esc(role) || '–'}</p>
    <p><strong>Melding:</strong><br>${esc(msg).replace(/\n/g, '<br>')}</p>
  `;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'EiraNova.no kontaktskjema <post@eiranova.no>',
      to: [process.env.CONTACT_TO || 'post@eiranova.no'],
      reply_to: email,
      subject: `[eiranova.no] Henvendelse fra ${name}${role ? ' – ' + role : ''}`,
      html
    })
  });

  if (!r.ok) return res.status(502).json({ ok: false, error: 'send_failed' });
  return res.status(200).json({ ok: true });
}
