# Tek Jun Hong — Portfolio

Static cloud-engineering portfolio, ready to deploy on Vercel. No framework or build step is needed.

## Run locally

Open `index.html` in a browser for the interface. The email form needs Vercel (or `vercel dev`) because it calls the serverless endpoint at `/api/contact`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In [Vercel](https://vercel.com/new), import the GitHub repository and choose **Deploy**. Leave the framework setting as **Other**.
3. In the Vercel project, open **Settings → Environment Variables** and add the three values from `.env.example`.
4. Create a [Resend](https://resend.com) account, generate an API key, and verify a sending domain. Use the verified sender as `FROM_EMAIL`. `CONTACT_EMAIL` can be your Outlook email address.
5. Redeploy, then submit the contact form to test it.

Without these environment variables, the form safely offers visitors the existing email-app fallback instead.

## Updating content

Search for `CHANGE:` in `index.html`; every editable content area is marked. The current resume link targets `Tek Jun Hong - Resume.pdf` in the project root.

## Previous design

The original portfolio design is preserved in `backup-old-design/`. Open its `index.html` to preview it, or copy its `index.html` and `style.css` back to the root to restore it.
