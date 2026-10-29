# AGENTS.md — La Bodilière

Site familial de réservation de la maison de La Bodilière (près de Dieppe). Il sert à voir quand la maison est libre, à réserver un séjour et à en supprimer un. Les utilisateurs vont des petits-enfants aux grands-parents, peu à l'aise avec l'informatique, sur mobile comme sur ordinateur. L'interface est en français, au tutoiement.

## Stack

- Nuxt 4 et Vue 3, TypeScript, auto-imports Nuxt (composants, composables, `utils/`).
- Tailwind CSS 3 et SCSS (`assets/css/tailwind.scss`), polices via `@nuxtjs/google-fonts`.
- Supabase via `@nuxtjs/supabase` (`useSupabaseClient()`), sans authentification (`redirect: false`).
- `@nuxt/image` pour les images, `nuxt-mail` (Mailgun) pour les e-mails.
- Météo : API OpenWeather (Dieppe, lat 49.92, lon 1.07), appelée uniquement côté serveur par `server/api/weather.get.ts` (cache 10 min).
- Déploiement sur Netlify. Gestionnaire de paquets : **yarn 1** (ne pas utiliser npm ni pnpm, ne pas créer d'autre lockfile).
- Node **22** (`.nvmrc`, lu aussi par Netlify) : `nvm use` avant toute commande. Vitest ne tourne pas sous Node 16.

## Commandes

```bash
yarn db:start     # base Supabase locale (Docker), à lancer avant yarn dev
yarn dev          # http://localhost:3000, sur la base locale
yarn dev:prod     # sur la base de prod (.env)
yarn db:reset     # remet la base locale à zéro (migrations + seed)
yarn db:stop
yarn build
yarn test         # Vitest, une passe
yarn test:watch
```

## Structure

Le code est à la racine et non dans `app/` : Nuxt 4 garde cette organisation quand le dossier `app/` n'existe pas.

- `pages/` : `index.vue` (accueil), `signup.vue` (formulaire de réservation).
- `components/` : `Header`, `HomeHero` (bandeau d'état), `Bookings` (liste des séjours et confirmation de suppression), `StayCard`, `ConfirmDialog`, `AvailabilityCalendar`, `Weather`, `Statistics`, `StatisticsItem`, `HeadingH2` (titre de section avec vague), `AppIcon` (icônes SVG par nom).
- `composables/` : `useBookings` (lecture, ajout, suppression via Supabase, état partagé) et `useToday` (jour courant à Paris, partagé serveur/client).
- `utils/` : `dates.ts` (calcul et formatage des dates en français) et `bookings.ts` (type `Booking`, chevauchements, état de la maison, statistiques, validation d'un séjour).
- `layouts/default.vue` (en-tête et largeur du contenu), `assets/css/tailwind.scss` (tokens de couleur, thème Nuit, classes `.card`, `.button-*`, `.field`, `.wave`).
- `public/vache.png` : le logo. Il ne se redessine pas, ne se recolore pas et ne se recadre pas.

Données Supabase :

- `bookings` : `id`, `name`, `start_date`, `end_date`. Une nuit est occupée du jour d'arrivée jusqu'à la veille du départ.
- `notes` : `id`, `note`, `author` (plus utilisée par le site).

Base locale : CLI Supabase (`brew install supabase/tap/supabase`) et Docker. Le schéma est dans `supabase/migrations/`, les séjours de test dans `supabase/seed.sql` (dates relatives au jour du reset). `yarn dev` remplace `SUPABASE_URL` et `SUPABASE_KEY` du `.env` par l'URL locale et la clé `anon` de démo du CLI, la même sur toutes les machines. Studio : http://127.0.0.1:54323. Un changement de schéma passe par `supabase migration new <nom>`, se teste en local puis s'applique à la prod avec `supabase db push` (projet `avpzcqjfdludlryulhfz`, sans historique de migrations avant celle-ci : voir `supabase migration repair`).

Variables d'environnement (`.env` en local, réglages Netlify en production, jamais commitées) : `SUPABASE_URL`, `SUPABASE_KEY`, `NUXT_OPENWEATHER_API_KEY`, `MAILGUN_SMTP_USER`, `MAILGUN_SMTP_PASSWORD`, `MAILGUN_FROM`, `MAILGUN_SMTP_HOST` (facultatif).

E-mails : `nuxt-mail` envoie via le SMTP Mailgun (`smtp.mailgun.org` par défaut, `MAILGUN_SMTP_HOST=smtp.eu.mailgun.org` pour un domaine de la région EU). Ses options sont figées au build : les variables `MAILGUN_*` doivent exister au moment de `yarn build` (Netlify les fournit), et un changement de `.env` demande de relancer `yarn dev`. Le destinataire et l'expéditeur sont fixés côté serveur dans `nuxt.config.ts` ; le client n'envoie que l'objet, le texte et le HTML (`bookingEmail` dans `utils/email.ts`). Le HTML des e-mails n'utilise que des tableaux, des styles en ligne, des couleurs en hexadécimal et des polices de secours (Georgia, Arial) : pas de flexbox, de variables CSS ni de SVG. Seule exception : une media query dans `<style>` pour adapter la mise en page au téléphone, en amélioration facultative (le mail doit rester lisible si elle est ignorée). Toute donnée saisie par un utilisateur passe par `escapeHtml`. Les images sont en URL absolue (`public/email-logo.png`). Maquette : artboard « E-mail · confirmation de réservation » du canvas.

## Démarche pour chaque développement

1. **Analyser l'existant avant d'écrire.** Chercher dans `components/`, `pages/`, `composables/`, `utils/` et `assets/css/` ce qui existe déjà (composants, classes `.card` et `.button`, helpers de dates, appels Supabase). Réutiliser ou étendre plutôt que dupliquer. Si une logique est copiée à deux endroits, la factoriser dans `utils/` ou `composables/`.
2. **Implémenter** au plus simple, dans le style du code autour.
3. **Écrire les tests unitaires** de la fonctionnalité (voir « Tests »). Un développement sans test n'est pas terminé.
4. **Faire une passe de code review** sur le diff avant de rendre la main (voir « Code review ») et appliquer les corrections utiles.
5. **Vérifier** : `yarn test` et `yarn build` passent, et la page concernée fonctionne dans le navigateur sur `localhost:3000`, en largeur ordinateur et téléphone.

## Tests

- Outils : **Vitest** 4 avec **@nuxt/test-utils** 4 (environnement `nuxt`), **@vue/test-utils** et **happy-dom**. Pas de Jest : il s'intègre mal à Nuxt. Config dans `vitest.config.ts`.
- Emplacement : `tests/unit/`, en reprenant l'arborescence du code (`tests/unit/utils/dates.spec.ts`, `tests/unit/components/Bookings.spec.ts`).
- Mettre la logique métier (calcul des nuits, chevauchement de séjours, statistiques, formatage des dates) dans des fonctions pures de `utils/`, testées sans monter de composant. `utils/dates.ts` contient déjà `parseDay`, `formatDateFR` et `countNights`.
- Pour un composant : `mountSuspended` de `@nuxt/test-utils/runtime` ; simuler Supabase avec `mockNuxtImport('useSupabaseClient', ...)` (exemple : `tests/unit/components/Bookings.spec.ts`). La config de test donne au module Supabase une URL et une clé factices : aucun test ne touche la vraie base, l'API météo ou Mailgun.
- Tester les comportements visibles par l'utilisateur et les cas limites (séjour d'une nuit, dates qui se chevauchent, départ avant l'arrivée, liste vide), pas les détails d'implémentation.

## Code review

Relire son propre diff avec ces questions, puis corriger :

- Est-ce que ça marche dans tous les cas (données vides, erreurs Supabase, fuseaux horaires des dates) ?
- Est-ce que ça réimplémente quelque chose qui existe déjà ?
- Peut-on faire plus simple ou plus court sans perdre en lisibilité ?
- Les types sont-ils précis (pas de `any` nouveau) ?
- Les tests couvrent-ils les cas limites ?

Dans Claude Code, `/code-review` peut servir pour cette passe.

## Style de code

- `<script setup lang="ts">` et Composition API pour tout nouveau code. Les composants encore en Options API (`HeadingH2`, `StatisticsItem`, `SvgIcon`) se migrent quand on les modifie.
- Pas de `any` dans le nouveau code ; typer les lignes Supabase (`Booking`, `Note`).
- Noms explicites, fonctions courtes, pas de code mort.
- **Commentaires rares et courts.** Ne pas commenter ce que le code dit déjà. Un commentaire n'explique que le pourquoi d'un choix non évident (contrainte métier, contournement d'un bug). Pas de commentaires de section ni de JSDoc systématique.
- Textes d'interface en français, au vouvoiement, avec des mots simples (« séjour », « arrivée », « départ »). Dates en toutes lettres : « du jeudi 29 octobre au dimanche 1er novembre · 3 nuits ».

## Design

Le redesign suit le design system « La Bodilière » : https://claude.ai/artifact/J7nD3ADztsfBdtP8AaH2xL (maquettes : https://claude.ai/artifact/EqpPLesdoz85asqUZ38PAJ). En résumé :

- Polices : Instrument Serif (400) pour le logo, les titres, les prénoms et les grands chiffres ; Atkinson Hyperlegible Next pour le texte (400, 500 pour les boutons et libellés, 600 au maximum).
- Couleurs : utiliser les tokens du design system (`craie`, `surface`, `ink`, `sea-strong`, `abysse`, `soleil`, `bouee`, `algue`…) déclarés dans la config Tailwind, jamais de couleur en dur.
- Accessibilité : texte de 18px minimum (15px pour l'accessoire), zones cliquables de 48px minimum, contraste 4.5:1, focus clavier visible, une icône toujours accompagnée d'un texte.
- Une seule action principale par écran ; aucune action visible seulement au survol ; toute suppression passe par une confirmation.
- Mobile d'abord, largeur maximale du contenu 1120px.

## Sécurité

- Aucune clé ou secret dans le code : passer par `.env` et `runtimeConfig`. Les appels qui demandent une clé privée (OpenWeather, Mailgun) passent par une route serveur dans `server/api/`.

## Dette connue

À corriger quand on touche le fichier concerné :

- `useToday` fixe le jour au chargement : un onglet resté ouvert après minuit garde la veille jusqu'au rechargement.
- La route `/mail/send` de nuxt-mail est publique : n'importe qui peut envoyer un message au destinataire configuré.

## Git

- Messages de commit courts, en anglais, à l'impératif (« Add booking overlap check »).
- Ne pas commiter, pousser ni ouvrir de PR sans demande explicite.
