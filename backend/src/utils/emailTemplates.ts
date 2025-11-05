const passwordResetTemplate = (url: string) => ({
  subject: "Password Reset Request",
  text: `You requested a password reset. Open this link to reset your password: ${url}`,
  html: `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
            --bg: #ffffff;
            --fg: #0b0b0b;
            --muted: #6b6b6b;
            --accent-border: #0b0b0b;
            --button-bg: #0b0b0b;
            --button-fg: #ffffff;
            font-family: Inter, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          }
          body {
            background: var(--bg);
            color: var(--fg);
            margin: 0;
            padding: 24px;
          }
          .wrapper {
            max-width: 680px;
            margin: 0 auto;
            border: 1px solid #efefef;
            padding: 32px;
            border-radius: 12px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
          }
          .logo {
            width: 48px;
            height: 48px;
            background: var(--fg);
            border-radius: 10px;
            display: inline-block;
          }
          h1 {
            margin: 0 0 8px 0;
            font-size: 20px;
            letter-spacing: -0.2px;
          }
          p.lead {
            margin: 0 0 20px 0;
            color: var(--muted);
            line-height: 1.5;
          }
          .button {
            display: inline-block;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 8px;
            border: 1px solid var(--accent-border);
            background: var(--button-bg);
            color: var(--button-fg);
            font-weight: 600;
          }
          .muted {
            color: var(--muted);
            font-size: 13px;
            margin-top: 20px;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0b0b0b;
              --fg: #ffffff;
              --muted: #9a9a9a;
              --accent-border: #ffffff;
              --button-bg: #ffffff;
              --button-fg: #0b0b0b;
            }
            .wrapper {
              border-color: rgba(255,255,255,0.06);
            }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="brand">
            <span class="logo" aria-hidden="true"></span>
            <div>
              <h1>Password Reset</h1>
              <div class="muted">Requested link for your account</div>
            </div>
          </div>

          <p class="lead">We received a request to reset the password for your account. Click the button below to proceed. If you didn't request this, you can safely ignore this email.</p>

          <p style="text-align:center; margin:28px 0;">
            <a class="button" href="${url}" target="_blank" rel="noopener noreferrer">Reset Password</a>
          </p>

          <p class="muted">If the button doesn't work, copy and paste the following link into your browser:</p>
          <p style="word-break:break-all; color:var(--muted); font-size:13px;">${url}</p>

          <p class="muted" style="margin-top:32px;">Thanks — The Team</p>
        </div>
      </body>
    </html>
  `,
});

const getVerifyEmailTemplate = (url: string) => ({
  subject: "Verify Email Address",
  text: `Click the link to verify your email address: ${url}`,
  html: `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          :root{
            --bg:#ffffff;
            --fg:#0b0b0b;
            --muted:#6b6b6b;
            --accent:#0b0b0b;
            font-family: Inter, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          }
          body{
            background:var(--bg);
            color:var(--fg);
            margin:0;
            padding:28px;
          }
          .container{
            max-width:720px;
            margin:0 auto;
            padding:36px;
            border-radius:12px;
            border:1px solid #efefef;
          }
          .header{
            display:flex;
            gap:14px;
            align-items:center;
            margin-bottom:18px;
          }
          .badge{
            width:48px;
            height:48px;
            background:var(--fg);
            border-radius:10px;
          }
          h2{
            margin:0;
            font-size:20px;
          }
          p.lead{
            color:var(--muted);
            margin:12px 0 22px 0;
            line-height:1.45;
          }
          .cta{
            display:inline-block;
            padding:12px 20px;
            border-radius:8px;
            text-decoration:none;
            color:#fff;
            background:var(--accent);
            border:1px solid var(--accent);
            font-weight:600;
          }
          .fineprint{
            color:var(--muted);
            font-size:13px;
            margin-top:18px;
          }
          @media (prefers-color-scheme: dark){
            :root{
              --bg:#0b0b0b;
              --fg:#fff;
              --muted:#9a9a9a;
              --accent:#fff;
            }
            .container{ border-color: rgba(255,255,255,0.06); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge" aria-hidden="true"></div>
            <div>
              <h2>Verify your email</h2>
              <div class="fineprint">One click is all it takes — secure your account.</div>
            </div>
          </div>

          <p class="lead">Welcome — please confirm your email address by clicking the button below. This link will expire after a short time.</p>

          <p style="text-align:center; margin:26px 0;">
            <a class="cta" href="${url}" target="_blank" rel="noopener noreferrer">Verify Email</a>
          </p>

          <p class="fineprint">If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break:break-all; color:var(--muted); font-size:13px;">${url}</p>

          <p class="fineprint" style="margin-top:26px;">If you didn't create an account, you can ignore this message.</p>
        </div>
      </body>
    </html>
  `,
});

export { getVerifyEmailTemplate, passwordResetTemplate };
