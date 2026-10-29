import { describe, expect, it } from 'vitest'
import { bookingEmail, escapeHtml } from '~/utils/email'

const stay = { name: 'Mamie & Papi', start_date: '2026-11-07', end_date: '2026-11-10' }

describe('escapeHtml', () => {
  it('escapes the characters that would break or inject HTML', () => {
    expect(escapeHtml(`<b>"Lou" & 'Benj'</b>`)).toBe('&lt;b&gt;&quot;Lou&quot; &amp; &#39;Benj&#39;&lt;/b&gt;')
  })
})

describe('bookingEmail', () => {
  const email = bookingEmail(stay, 'https://labodiliere.netlify.app/')

  it('names who comes in the subject', () => {
    expect(email.subject).toBe('Nouveau séjour : Mamie & Papi')
  })

  it('lists the stay details in the text version', () => {
    expect(email.text).toContain("C'est réservé pour Mamie & Papi !")
    expect(email.text).toContain('Arrivée : Samedi 7 novembre 2026')
    expect(email.text).toContain('Départ : Mardi 10 novembre 2026')
    expect(email.text).toContain('Durée : 3 nuits')
    expect(email.text).toContain('Voir les séjours sur le site : https://labodiliere.netlify.app')
  })

  it('shows the same details in the HTML version, with the name escaped', () => {
    expect(email.html).toContain("C'est réservé pour Mamie &amp; Papi !")
    expect(email.html).toContain('Samedi 7 novembre 2026')
    expect(email.html).toContain('Mardi 10 novembre 2026')
    expect(email.html).toContain('3 nuits')
    expect(email.html).not.toContain('Mamie & Papi')
  })

  it('previews the dates in the inbox', () => {
    expect(email.html).toContain('La maison est réservée du samedi 7 au mardi 10 novembre.')
  })

  it('links to the site and its logo with absolute URLs', () => {
    expect(email.html).toContain('href="https://labodiliere.netlify.app"')
    expect(email.html).toContain('src="https://labodiliere.netlify.app/email-logo.png"')
    expect(email.html).toContain('>labodiliere.netlify.app<')
  })

  it('offers to add the stay to a personal calendar', () => {
    expect(email.html).toContain('Ajouter à mon agenda')
    expect(email.html).toContain('href="https://calendar.google.com/calendar/render?action=TEMPLATE&amp;')
    expect(email.html).toContain('href="https://labodiliere.netlify.app/api/calendar.ics?name=Mamie+%26+Papi&amp;start=2026-11-07&amp;end=2026-11-10"')
    expect(email.text).toContain('- Google Agenda : https://calendar.google.com/calendar/render?')
    expect(email.text).toContain('- iPhone, Outlook ou autre : https://labodiliere.netlify.app/api/calendar.ics?')
  })

  it('stacks every detail row on phones', () => {
    expect(email.html).toContain('@media (max-width: 480px)')
    expect(email.html.match(/class="detail-label"/g)).toHaveLength(4)
    expect(email.html.match(/class="detail-value"/g)).toHaveLength(4)
  })

  it('addresses the reader formally in the change-of-plans note', () => {
    expect(email.html).toContain("Supprimez le séjour depuis l'accueil du site")
    expect(email.text).toContain("Supprimez le séjour depuis l'accueil du site")
  })

  it('cannot be used to inject markup through the name', () => {
    const injected = bookingEmail({ ...stay, name: '<img src=x onerror=alert(1)>' }, 'https://labodiliere.netlify.app')
    expect(injected.html).not.toContain('<img src=x')
    expect(injected.html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })
})
