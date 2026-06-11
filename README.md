# Profecta Solutions — Website

Statische website voor **Profecta Solutions** (webdesign, webshops, apps en AI-oplossingen).

Gebaseerd op de Designpro-site structuur, volledig gerebrand naar Profecta Solutions.

## Lokaal starten

**Windows:** dubbelklik `START.bat`

**Of via terminal:**

```bash
node serve.mjs
```

Open daarna: [http://127.0.0.1:4173/](http://127.0.0.1:4173/)

## Structuur

| Pad | Beschrijving |
|-----|--------------|
| `index.html` | Homepage |
| `assets/css/generated/generated.css` | Hoofd-styling (kritisch — niet overschrijven met verkeerd bestand) |
| `assets/css/profecta-custom.css` | Profecta-specifieke overrides |
| `images/` | Afbeeldingen en logo's |
| `serve.mjs` | Lokale development server (poort 4173) |

## CSS onderhoud

Als de layout plotseling kapot is (witte tekst op wit, geen menu-styling), vernieuw `generated.css`:

```bash
node refresh-generated-css.mjs
```

## Contact (site)

- E-mail: profectasolutions@gmail.com
- WhatsApp: +31 6 20339009

## Deploy

De site is puur statisch HTML/CSS/JS. Upload de volledige map naar elke static host (Netlify, Vercel, GitHub Pages, eigen server).

Voor GitHub Pages: zet de root van deze repo als publish source, of gebruik een `docs/` map.
