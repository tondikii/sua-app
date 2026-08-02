import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface InvitationEmailParams {
  to: string;
  tripId: string;
  tripName: string;
  inviterName: string;
}

/**
 * Outbound email via SMTP (Nodemailer).
 * If SMTP is not configured the service logs a warning and reports
 * `delivered = false` — the UI must not claim an email was sent.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('mail.host');
    if (!host) {
      this.logger.warn('SMTP_HOST not configured — invitation emails will not be sent');
      this.transporter = null;
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: parseInt(this.config.get<string>('mail.port') ?? '587', 10),
      secure: this.config.get<string>('mail.secure') === 'true',
      auth: this.config.get<string>('mail.user')
        ? {
            user: this.config.get<string>('mail.user')!,
            pass: this.config.get<string>('mail.pass') ?? '',
          }
        : undefined,
    });
  }

  /** Returns true only when the email was actually accepted by the SMTP server. */
  async sendInvitationEmail({
    to,
    tripId,
    tripName,
    inviterName,
  }: InvitationEmailParams): Promise<boolean> {
    if (!this.transporter) return false;

    const webUrl = this.config.get<string>('app.webUrl') ?? 'http://localhost:8081';
    const tripUrl = `${webUrl}/trip/${tripId}`;
    const from = this.config.get<string>('mail.from') ?? 'Atur Perjalanan <noreply@atur-perjalanan.app>';

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: `${inviterName} mengundangmu bergabung ke "${tripName}"`,
        text: [
          `Hai,`,
          ``,
          `${inviterName} mengundangmu untuk bergabung ke perjalanan "${tripName}" di Atur Perjalanan.`,
          ``,
          `Buka link berikut untuk melihat detailnya:`,
          tripUrl,
          ``,
          `— Atur Perjalanan`,
        ].join('\n'),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1A1A2E;">Kamu diundang ke "${tripName}"</h2>
            <p style="color: #1A1A2E; font-size: 14px; line-height: 1.6;">
              ${inviterName} mengundangmu untuk bergabung ke perjalanan
              <strong>${tripName}</strong> di Atur Perjalanan.
            </p>
            <a href="${tripUrl}"
               style="display: inline-block; background: #FF6B6B; color: #FFFFFF;
                      text-decoration: none; font-weight: 700; padding: 12px 24px;
                      border-radius: 14px; margin-top: 8px;">
              Lihat Perjalanan
            </a>
            <p style="color: #9091A0; font-size: 12px; margin-top: 24px;">
              Atur Perjalanan — ubah wacana perjalanan menjadi kenyataan.
            </p>
          </div>
        `,
      });
      return true;
    } catch (err) {
      this.logger.error(
        `Failed to send invitation email to ${to}: ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }
}
