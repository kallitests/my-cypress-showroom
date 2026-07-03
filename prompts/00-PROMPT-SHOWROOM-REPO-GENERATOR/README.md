Le prompt est prêt, réutilisable pour n'importe quel `[APP]` (Cypress, Playwright, etc.) :

- **Phase 1** : Claude génère un template de pitch à remplir (outil, langage, app démo, scope de tests, features IA, etc.)
- **Phase 2** : à partir du pitch collé, Claude produit une spec markdown d'une seule page
- **Phase 3** : sur confirmation, Claude construit le repo complet avec tous les éléments qu'on vient de faire ensemble (commentaires anglais ligne par ligne, README au format "showroom", Dockerfile optimisé, docker-compose avec Redis expliqué, CI GitHub Actions optimisée, `.gitignore`/`.dockerignore`/`.env.example`)

Le prompt reste volontairement compact (workflow en 3 étapes strictes, pas de répétition entre phases) pour limiter la conso de tokens tout en gardant assez de détail pour que la Phase 3 produise un résultat complet à chaque fois.

Pour l'utiliser : colle ce prompt en tout début de nouvelle conversation Claude, remplace `[APP]` si tu veux le figer d'avance (ex: "Playwright"), ou laisse-le tel quel et précise l'outil dans ton pitch en Phase 1.


Voici un exemple concret d'utilisation, avec **Playwright** cette fois (pour varier de Cypress) :

---

**Étape 0 — Toi, dans une nouvelle conversation Claude :**
Tu colles le contenu du fichier `PROMPT-showroom-repo-generator.md`, sans rien ajouter.

**Étape 1 — Claude répond automatiquement avec le template (Phase 1) :**
```
PITCH — [APP] Showroom Repo
- Tool: [APP]
- Language: (TypeScript / JavaScript / Python / ...)
- Demo app under test (name + repo URL):
- Test scope: smoke / regression / API / unit / all
- AI features wanted: ...
- Target audience: international recruiters (repo fully in English)
- GitHub handle:
- Signature block (name, role, links, phone):
```

**Étape 2 — Toi, tu remplis et renvoies ce même bloc :**
```
PITCH — Playwright Showroom Repo
- Tool: Playwright
- Language: TypeScript
- Demo app under test: Sauce Demo (https://www.saucedemo.com)
- Test scope: smoke + API
- AI features wanted: self-healing agent on failure (LangGraph), no cy.prompt equivalent needed
- Target audience: international recruiters (repo fully in English)
- GitHub handle: kallitests
- Signature block: Khalid HAFID-MEDHEB, SDET Senior Cypress/Playwright, Github Kallitests: https://github.com/kallitests, Port: 06 15 53 40 66
```

**Étape 3 — Claude répond avec la spec 1 page (Phase 2)**, condensée : objectifs, stack, arborescence, liste de scénarios, résumé IA, résumé Docker/CI. Pas de long roman, juste la vue d'ensemble.

**Étape 4 — Toi :**
```
go
```

**Étape 5 — Claude construit tout (Phase 3)** : specs Playwright commentées en anglais, README au format badges/TOC/architecture ASCII, `Dockerfile` basé sur l'image Playwright officielle, `docker-compose.yml` (app Sauce Demo, Redis, smoke/regression/API/unit/linter), `.github/workflows/ci.yml`, `.gitignore`/`.dockerignore`/`.env.example` — puis livre le tout en zip téléchargeable.

---

Tu peux aussi accélérer en collant pitch + prompt **en un seul message** si tu connais déjà toutes les infos — Claude sautera directement à la Phase 2. Veux-tu que je lance réellement cet exemple Playwright maintenant pour te montrer le résultat sur un cas concret ?