module.exports =function generateManagerEmail({ name, email, message, subject = "New user message", timestamp = new Date() }) {
  const formattedTime = new Date(timestamp).toLocaleString();

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${subject}</title>
    <style>
      /* Inline-friendly basic styles */
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0; padding:0; background:#f4f6f8; }
      .container { max-width:620px; margin:28px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08); }
      .header { background:#0b74de; color:#ffffff; padding:18px 24px; text-align:left; }
      .header h1 { margin:0; font-size:18px; font-weight:600; }
      .body { padding:20px 24px; color:#111827; line-height:1.5; }
      .meta { background:#f6f8fa; padding:12px; border-radius:6px; margin:12px 0; font-size:13px; color:#374151; }
      .message { white-space:pre-wrap; padding:14px; border-left:4px solid #0b74de; background:#fbfdff; border-radius:6px; margin-top:8px; }
      .cta { margin-top:18px; text-align:left; }
      .button { display:inline-block; text-decoration:none; padding:10px 16px; border-radius:6px; background:#0b74de; color:#fff; font-weight:600; }
      .footer { padding:14px 20px; font-size:12px; color:#6b7280; text-align:center; background:#ffffff; }
      @media (max-width:520px) {
        .container { margin:10px; }
        .header h1 { font-size:16px; }
      }
    </style>
  </head>
  <body>
    <div class="container" role="article" aria-roledescription="email">
      <div class="header">
        <h1>New message — ${escapeHtml(subject)}</h1>
      </div>

      <div class="body">
        <p>Hi Manager,</p>

        <p>You have received a new message from a user. Details are below.</p>

        <div class="meta">
          <strong>Name:</strong> ${escapeHtml(name)}<br>
          <strong>Email:</strong> <a href="mailto:${escapeAttr(email)}">${escapeHtml(email)}</a><br>
          <strong>Received:</strong> ${escapeHtml(formattedTime)}
        </div>

        <div>
          <div style="font-weight:600; margin-bottom:6px;">Message</div>
          <div class="message">${escapeHtml(message)}</div>
        </div>

        <div class="cta">
          <!-- Example button: view in dashboard (replace URL) -->
          <a class="button" href="https://yourapp.example.com/admin/messages" target="_blank" rel="noopener">View in Dashboard</a>
        </div>

        <p style="margin-top:18px; color:#374151;">— This is an automated notification from <strong>Your App Name</strong></p>
      </div>

      <div class="footer">
        Your App Name • 123 Example St • City • Unsubscribe or change settings in your admin panel.
      </div>
    </div>
  </body>
  </html>
  `;

  const text = `
${subject}

Name: ${name}
Email: ${email}
Received: ${formattedTime}

Message:
${message}

View in Dashboard: https://yourapp.example.com/admin/messages

— This is an automated notification from Your App Name
  `.trim();

  return { html, text };
}

/* Small helper to escape HTML (prevents injection when inserting user content) */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Escape for attributes like mailto link */
function escapeAttr(str = "") {
  return encodeURIComponent(String(str));
}
