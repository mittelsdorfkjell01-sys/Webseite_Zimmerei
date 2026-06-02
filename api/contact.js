module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, telefon, email, nachricht } = req.body;

  if (!name || !telefon || !email || !nachricht) {
    return res.status(400).json({ error: 'Bitte alle Pflichtfelder ausfüllen.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kontaktformular <onboarding@resend.dev>',
        to: 'zimmerei-mittelsdorf@t-online.de',
        reply_to: email,
        subject: `Neue Anfrage von ${name}`,
        html: `
          <div style="font-family: sans-serif; font-size: 15px; line-height: 1.7; color: #1A1A18; max-width: 600px;">
            <h2 style="margin-bottom: 24px;">Neue Anfrage über das Kontaktformular</h2>
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name</td>
                <td style="padding: 8px 0;">${escape(name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Telefon</td>
                <td style="padding: 8px 0;">${escape(telefon)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">E-Mail</td>
                <td style="padding: 8px 0;">${escape(email)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Vorhaben</td>
                <td style="padding: 8px 0;">${escape(nachricht).replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
            <p style="margin-top: 32px; color: #6B6B65; font-size: 13px;">
              Diese E-Mail wurde über das Kontaktformular auf zimmerei-mittelsdorf.de gesendet.
              Antworten Sie direkt auf diese E-Mail, um ${escape(name)} zu erreichen.
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API Fehler:', response.status, JSON.stringify(data));
      return res.status(500).json({
        error: 'Fehler beim Senden.',
        detail: data.message || data.name || JSON.stringify(data),
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Kontaktformular Fehler:', err.message);
    return res.status(500).json({ error: 'Verbindungsfehler zur Mail-API.', detail: err.message });
  }
};

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
