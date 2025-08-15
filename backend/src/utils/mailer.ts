import nodemailer, { Transporter } from "nodemailer";
import { htmlToText } from "html-to-text";
import { SendEmailOptions } from "@shared/types";

let transporter: Transporter | null = null;

const isSmtpConfigured = () => {
    return !!(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS);
}

export async function getMailer(): Promise<Transporter> {
    if (transporter)
        return transporter;

    if (isSmtpConfigured()) {
        transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 587,
            secure: Number(process.env.MAIL_PORT) === 465, // true for 465, false for 587
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    } else {
        // Dev-only: creates a sandbox account you can preview in browser
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        console.warn("[mailer] Using Ethereal test account. Set MAIL_* envs for real SMTP.");
    }

    try {
        await transporter.verify();
        console.log("[mailer] SMTP connection verified.");
    } catch (err) {
        console.error("[mailer] SMTP verification failed:", err);
    }

    return transporter;
}

export async function sendEmail(opts: SendEmailOptions) {
    const mailer = await getMailer();
    const info = await mailer.sendMail({
        from: opts.from || process.env.MAIL_FROM || "no-reply@example.com",
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: htmlToText(opts.html),
    });

    // If Ethereal, print preview URL
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log(`[mailer] Preview: ${preview}`);

    return info;
}

export const verifyEmailTemplate = (link: string) => {
    return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial">
    <h2>Confirm your email</h2>
    <p>Thanks for signing up. Please confirm your email address by clicking the button below:</p>
    <p>
      <a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:8px;
      background:#111;color:#fff;text-decoration:none">Verify Email</a>
    </p>
    <p>If the button doesn't work, copy and paste this URL into your browser:</p>
    <p><a href="${link}">${link}</a></p>
    <p>— From-M</p>
  </div>`;
}
