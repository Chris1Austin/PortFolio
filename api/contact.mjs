export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const { name, email, subject, message, website } = request.body || {};
  if (website) return response.status(200).json({ ok: true });
  if (![name, email, subject, message].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ error: 'Please complete all required fields.' });
  }
  if (name.length > 100 || email.length > 200 || subject.length > 150 || message.length > 5000) {
    return response.status(400).json({ error: 'One or more fields are too long.' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL || !process.env.FROM_EMAIL) {
    return response.status(503).json({ error: 'The contact service has not been configured yet.' });
  }

  try {
    const mailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: [process.env.CONTACT_EMAIL],
        reply_to: email.trim(),
        subject: `[Portfolio] ${subject.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
      }),
    });
    if (!mailResponse.ok) throw new Error('Email provider rejected the request.');
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({ error: 'Unable to send your message right now.' });
  }
}
