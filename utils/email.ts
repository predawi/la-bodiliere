import type { NewBooking } from './bookings'
import { googleCalendarUrl, icsFileUrl } from './calendar'
import { capitalize, countNights, formatLongDate, formatNights, formatStayRange } from './dates'

const SANS = "'Atkinson Hyperlegible Next', 'Segoe UI', Arial, sans-serif"
const SERIF = "'Instrument Serif', Georgia, 'Times New Roman', serif"

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function detailRow(label: string, value: string, last = false) {
  const border = last ? '' : 'border-bottom:1px solid #dde5e8;'
  return `<tr>
<td class="detail-label" style="padding:16px 0;${border}font-family:${SANS};font-size:16px;color:#50656e;">${label}</td>
<td class="detail-value" align="right" style="padding:16px 0;${border}font-family:${SANS};font-size:18px;font-weight:500;color:#0f2a35;">${value}</td>
</tr>`
}

function calendarButton(label: string, url: string) {
  return `<tr><td style="padding-bottom:12px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="border:1.5px solid #6f848b;border-radius:999px;">
<a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 22px;font-family:${SANS};font-size:16px;font-weight:500;line-height:1.2;color:#1d5a73;text-decoration:none;">${label}</a>
</td>
</tr></table></td></tr>`
}

// Email clients ignore flexbox, CSS variables and web fonts: tables, inline styles and fallback fonts only.
// The media query only stacks the details on phones; clients that drop it keep the two columns.
export function bookingEmail(booking: NewBooking, siteUrl: string) {
  const name = escapeHtml(booking.name)
  const range = formatStayRange(booking.start_date, booking.end_date, false)
  const nights = formatNights(countNights(booking.start_date, booking.end_date))
  const arrival = capitalize(formatLongDate(booking.start_date, true))
  const departure = capitalize(formatLongDate(booking.end_date, true))
  const site = siteUrl.replace(/\/$/, '')
  const googleUrl = googleCalendarUrl(booking, site)
  const icsUrl = icsFileUrl(booking, site)

  const text = [
    `C'est réservé pour ${booking.name} !`,
    '',
    `Qui vient : ${booking.name}`,
    `Arrivée : ${arrival}`,
    `Départ : ${departure}`,
    `Durée : ${nights}`,
    '',
    `Voir les séjours sur le site : ${site}`,
    '',
    'Ajouter à mon agenda :',
    `- Google Agenda : ${googleUrl}`,
    `- iPhone, Outlook ou autre : ${icsUrl}`,
    '',
    "Un changement de programme ? Supprimez le séjour depuis l'accueil du site : les dates redeviendront libres pour toute la famille.",
  ].join('\n')

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Nouveau séjour : ${name}</title>
<style>
@media (max-width: 480px) {
  .detail-label, .detail-value { display: block !important; width: auto !important; text-align: left !important; }
  .detail-label { padding-bottom: 2px !important; border-bottom: 0 !important; }
  .detail-value { padding-top: 0 !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background:#e4eaec;">
<div style="display:none;max-height:0;overflow:hidden;">La maison est réservée ${range}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e4eaec;">
<tr><td align="center" style="padding:16px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#f3f6f7;border-radius:20px;">
<tr><td style="padding:20px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding-right:12px;"><img src="${site}/email-logo.png" width="56" alt="" style="display:block;border:0;"></td>
<td style="font-family:${SERIF};font-size:30px;line-height:1;color:#1d5a73;">La Bodilière</td>
</tr></table>
</td></tr>
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#133a49;border-radius:20px;">
<tr><td style="padding:24px 20px;">
<span style="display:inline-block;background:#f4c95d;color:#0f2a35;border-radius:999px;padding:4px 12px;font-family:${SANS};font-size:14px;font-weight:500;">Réservation confirmée</span>
<h1 style="margin:14px 0 0;font-family:${SERIF};font-weight:400;font-size:30px;line-height:1.15;color:#eef5f7;">C'est réservé pour ${name} !</h1>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #dde5e8;border-radius:20px;">
<tr><td style="padding:4px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td class="detail-label" style="padding:16px 0;border-bottom:1px solid #dde5e8;font-family:${SANS};font-size:16px;color:#50656e;">Qui vient</td>
<td class="detail-value" align="right" style="padding:16px 0;border-bottom:1px solid #dde5e8;font-family:${SERIF};font-size:26px;line-height:1.1;color:#0f2a35;">${name}</td>
</tr>
${detailRow('Arrivée', arrival)}
${detailRow('Départ', departure)}
${detailRow('Durée', nights, true)}
</table>
</td></tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
<td style="background:#1d5a73;border-radius:999px;">
<a href="${site}" style="display:inline-block;padding:16px 30px;font-family:${SANS};font-size:18px;font-weight:500;line-height:1.2;color:#ffffff;text-decoration:none;">Voir les séjours sur le site</a>
</td>
</tr></table>
<p style="margin:28px 0 12px;font-family:${SANS};font-size:16px;font-weight:500;color:#0f2a35;">Ajouter à mon agenda</p>
<table role="presentation" cellpadding="0" cellspacing="0">
${calendarButton('Google Agenda', googleUrl)}
${calendarButton('iPhone, Outlook ou autre', icsUrl)}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;background:#e3eff3;border-radius:10px;">
<tr><td style="padding:16px;font-family:${SANS};font-size:16px;line-height:1.5;color:#0f2a35;">
<strong style="font-weight:600;">Un changement de programme ?</strong>
Supprimez le séjour depuis l'accueil du site : les dates redeviendront libres pour toute la famille.
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 20px 24px;font-family:${SANS};font-size:14px;line-height:1.5;color:#50656e;">
Ce message est envoyé automatiquement à chaque nouvelle réservation sur le site de La Bodilière, la maison de famille près de Dieppe.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

  return { subject: `Nouveau séjour : ${booking.name}`, text, html }
}
