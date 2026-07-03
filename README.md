# 🧪 my-cypress-showroom

> **A fully-commented Cypress smoke suite, augmented with AI.**
> Gherkin scenarios → Cypress smoke tests → `cy.prompt` natural-language actions → a self-healing LangGraph agent for spec generation and failure diagnosis.

[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)](https://github.com/kallitests/my-cypress-showroom)
[![Cypress](https://img.shields.io/badge/Cypress-14+-17202C?style=flat-square&logo=cypress)](https://cypress.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=flat-square&logo=python)](https://python.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-agent-blueviolet?style=flat-square)](https://langchain-ai.github.io/langgraph/)
[![Claude](https://img.shields.io/badge/Claude-Anthropic-black?style=flat-square)](https://anthropic.com)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![Redis](https://img.shields.io/badge/Redis-cache-DC382D?style=flat-square&logo=redis)](https://redis.io)
[![License](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](./LICENSE)

---

## 🗺️ Table of Contents

- [Why this repo?](#-why-this-repo)
- [What it does](#%EF%B8%8F-what-it-does)
- [Architecture](#-architecture)
- [Stack](#-stack)
- [Project Structure](#-project-structure)
- [Test Scenarios](#-test-scenarios)
- [Code Comment Convention](#-code-comment-convention)
- [AI-Assisted Testing](#-ai-assisted-testing)
  - [cy.prompt — runtime AI](#1-cyprompt--runtime-ai)
  - [LangGraph agent — tooling AI](#2-langgraph-agent--tooling-ai)
- [Docker & Local Development](#-docker--local-development)
- [Getting Started](#-getting-started)
- [CI/CD](#-cicd)
- [Design Decisions](#-design-decisions)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 💡 Why This Repo?

This is a **showroom repository** — a compact, deliberately curated codebase built to demonstrate Cypress test-automation skills to technical recruiters and hiring teams, in a few minutes of reading.

It runs against the official [**Cypress Real World App**](https://github.com/cypress-io/cypress-realworld-app) (a full-stack React/Express payment app) and focuses on **critical-path smoke coverage** rather than exhaustive regression — the goal is to show *how* good Cypress code is written, not to test everything.

```
Gherkin Scenarios ──▶ Cypress Smoke Specs ──▶ cy.prompt (AI actions) ──▶ LangGraph Agent (AI tooling)
```

---

## ⚙️ What It Does

| Step | Description |
|------|-------------|
| 📋 **Specification** | Gherkin `.feature` files as living documentation for every scenario |
| 🧪 **Smoke testing** | 7 Cypress specs covering auth, onboarding, transactions, search, social, notifications |
| 💬 **AI-driven actions** | 2 specs using `cy.prompt` — natural-language steps, deterministic assertions |
| 🤖 **AI tooling** | A LangGraph agent that generates, runs, and self-heals Cypress specs from Gherkin |
| 📝 **Line-by-line comments** | Every test line is commented in English — built for an international audience |
| 🐳 **CI/CD ready** | GitHub Actions workflow runs the smoke suite on every push |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                         my-cypress-showroom                           │
│                                                                       │
│  ┌───────────────┐     ┌──────────────────┐     ┌──────────────────┐ │
│  │ Gherkin        │────▶│ Cypress Smoke     │────▶│ App Under Test   │ │
│  │ .feature files │     │ Specs (.cy.ts)    │     │ (RWA, React/API) │ │
│  └───────────────┘     └────────┬──────────┘     └──────────────────┘ │
│                                  │                                     │
│                                  ▼                                     │
│                         ┌──────────────────┐                          │
│                         │ cy.prompt demos   │  Natural-language ACTIONS│
│                         │ (ai-driven/)      │  deterministic ASSERTS  │
│                         └──────────────────┘                          │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                     ai-agent/ (LangGraph)                      │  │
│  │                                                                 │  │
│  │  parse_gherkin ──▶ generate_cypress_spec ──▶ run_cypress        │  │
│  │        ▲                                          │             │  │
│  │        └──────── summarize_failures ◀──────────────┘  (on fail) │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  🐳 GitHub Actions — smoke suite gated on every push                  │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🧰 Stack

| Layer | Technology |
|-------|-----------|
| **Test execution** | [Cypress 14+](https://cypress.io) (TypeScript) |
| **App under test** | [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app) (React · Express · lowdb) |
| **Specification** | [Gherkin](https://cucumber.io/docs/gherkin/) `.feature` files (documentation, not execution) |
| **AI runtime** | [`cy.prompt`](https://docs.cypress.io) — Cypress native AI actions |
| **AI tooling** | Python 3.11+ · [LangGraph](https://langchain-ai.github.io/langgraph/) · [LangChain](https://langchain.com) |
| **LLM backend** | [Claude (Anthropic)](https://anthropic.com) |
| **CI/CD** | GitHub Actions |

---

## 📁 Project Structure

```
my-cypress-showroom/
├── cypress/
│   ├── e2e/
│   │   ├── smoke/                        # 7 core smoke specs
│   │   │   ├── 01-auth.cy.ts
│   │   │   ├── 02-onboarding-bank-account.cy.ts
│   │   │   ├── 03-transaction-creation.cy.ts
│   │   │   ├── 04-transaction-search.cy.ts
│   │   │   ├── 05-social-interactions.cy.ts
│   │   │   ├── 06-notifications.cy.ts
│   │   │   └── 07-negative-auth.cy.ts
│   │   ├── ai-driven/                    # cy.prompt demos
│   │   │   ├── 08-signup-cy-prompt.cy.ts
│   │   │   └── 09-transaction-cy-prompt.cy.ts
│   │   ├── regression/                   # Broader, slower coverage (nightly CI)
│   │   │   └── 10-transaction-history-pagination.cy.ts
│   │   └── api/                          # cy.request-only, no UI
│   │       └── 11-transactions-api.cy.ts
│   ├── features/                          # Gherkin — living documentation
│   │   ├── auth.feature
│   │   ├── bank-account.feature
│   │   ├── transaction.feature
│   │   ├── search.feature
│   │   ├── social.feature
│   │   └── notifications.feature
│   ├── fixtures/
│   │   ├── users.json
│   │   └── transactions.json
│   └── support/
│       ├── commands.ts                    # loginByUI, loginByApi...
│       ├── e2e.ts
│       └── selectors.ts                   # Centralized data-test selectors
├── ai-agent/                              # LangGraph agent (Python tooling)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── cache.py                           # Redis-backed LLM response cache
│   ├── graph.py                           # Graph definition
│   ├── nodes/
│   │   ├── parse_gherkin.py
│   │   ├── generate_cypress_spec.py
│   │   ├── run_cypress.py
│   │   └── summarize_failures.py
│   ├── prompts/
│   │   └── cypress_codegen.md
│   ├── tests/                             # pytest unit tests
│   │   ├── test_parse_gherkin.py
│   │   └── test_cache.py
│   └── cli.py                             # Entry point
├── docker/
│   └── app-under-test.Dockerfile          # Builds the Cypress Real World App
├── .github/workflows/ci.yml               # Full CI pipeline
├── Dockerfile                             # Cypress test runner image
├── docker-compose.yml                     # Full local/CI stack (app, redis, all suites)
├── eslint.config.mjs
├── cypress.config.ts
├── package.json
├── tsconfig.json
├── .dockerignore
├── .gitignore
├── .env.example
└── LICENSE
```

---

## 🧭 Test Scenarios

| Feature | Scenario | Spec file |
|---------|----------|-----------|
| Authentication | Valid sign-in redirects to the transaction feed | `01-auth.cy.ts` |
| Authentication | Sign-out returns to the sign-in page | `01-auth.cy.ts` |
| Authentication | Invalid password is rejected with an error | `07-negative-auth.cy.ts` |
| Bank account | Adding a valid bank account | `02-onboarding-bank-account.cy.ts` |
| Transactions | Creating a payment request | `03-transaction-creation.cy.ts` |
| Transactions | Sending a payment debits the balance | `03-transaction-creation.cy.ts` |
| Search | Filtering transactions by contact name | `04-transaction-search.cy.ts` |
| Social | Liking a public transaction | `05-social-interactions.cy.ts` |
| Social | Adding a comment | `05-social-interactions.cy.ts` |
| Notifications | Unread badge on a new payment request | `06-notifications.cy.ts` |
| AI-driven | Signup via `cy.prompt` | `08-signup-cy-prompt.cy.ts` |
| AI-driven | Transaction creation via `cy.prompt` | `09-transaction-cy-prompt.cy.ts` |
| Regression | Infinite-scroll pagination loads more transactions | `10-transaction-history-pagination.cy.ts` |
| Regression | Feed order is stable across a page reload | `10-transaction-history-pagination.cy.ts` |
| API | `POST /login` — valid and invalid credentials | `11-transactions-api.cy.ts` |
| API | `GET /transactions/public` — authenticated vs. anonymous | `11-transactions-api.cy.ts` |

Full Gherkin source lives in [`cypress/features/`](./cypress/features).

---

## 📝 Code Comment Convention

**Every line of test code carries an inline English comment explaining its intent** — not just its mechanics. This is a deliberate showroom convention for an international audience.

```ts
describe('Smoke: Authentication', () => {
  beforeEach(() => {
    cy.task('db:seed'); // Reset the local lowdb database to a known state before each test
  });

  it('signs in with a valid seeded user and lands on the transaction feed', () => {
    cy.loginByUI(users.validUser.username, users.validUser.password); // Sign in through the real UI form
    cy.location('pathname').should('equal', '/'); // Assert redirect to the home/transaction feed
    cy.get(selectors.auth.sideNavUsername).should('contain', users.validUser.username); // Assert the session is authenticated
  });
});
```

---

## 🤖 AI-Assisted Testing

### 1. `cy.prompt` — runtime AI

Two specs in [`cypress/e2e/ai-driven/`](./cypress/e2e/ai-driven) show Cypress's native AI actions in practice:

```ts
cy.visit('/signup'); // Standard Cypress navigation, no AI involved here

cy.prompt([
  'Fill the sign-up form with a realistic first name, last name, username and a secure password',
  'Submit the sign-up form',
]);

cy.location('pathname').should('equal', '/'); // Deterministic assertion: confirm redirect to the home feed
```

**`cy.prompt` is used for actions only — never for assertions.** Verification always stays plain, explicit Cypress. This keeps the suite reliable and debuggable while still showcasing AI-assisted authoring for UIs whose selectors change often.

### 2. LangGraph agent — tooling AI

[`ai-agent/`](./ai-agent) is a small Python agent that closes the loop between specification and code:

| Node | Role |
|------|------|
| `parse_gherkin` | Reads a `.feature` file, extracts structured scenarios |
| `generate_cypress_spec` | LLM generates a fully-commented `.cy.ts` spec from those scenarios |
| `run_cypress` | Executes the generated spec, captures the JSON report |
| `summarize_failures` | On failure, explains the root cause in plain language and retries (max 2 attempts) |

```bash
# Generate, run, and self-heal a smoke spec straight from its Gherkin source
python ai-agent/cli.py --feature cypress/features/transaction.feature
```

---

---

## 🐳 Docker & Local Development

The entire stack — app under test, cache, and every test category — runs through **Docker Compose**, no local Node/Python setup required.

| Service | Image / Build | Purpose |
|---------|---------------|---------|
| `app` | `docker/app-under-test.Dockerfile` | Clones and serves the Cypress Real World App (frontend `:3000` + API `:3001`) |
| `redis` | `redis:7-alpine` | Caching layer for the app **and** LLM response cache for the AI agent (see below) |
| `cypress-smoke` | `Dockerfile` | Runs the smoke suite |
| `cypress-regression` | `Dockerfile` | Runs the regression suite (profile: `regression`) |
| `cypress-api` | `Dockerfile` | Runs the API-only suite (profile: `api`) |
| `cypress-ai` | `Dockerfile` | Runs the `cy.prompt` suite (profile: `ai-tests`) |
| `unit-tests` | `ai-agent/Dockerfile` | Runs the agent's pytest suite (profile: `unit`) |
| `linter` | `Dockerfile` | Runs ESLint (profile: `lint`) |
| `ai-agent` | `ai-agent/Dockerfile` | On-demand Gherkin-to-Cypress generator (profile: `ai`) |

### Why Redis is here

Redis serves two purposes in this showroom, both documented inline in [`docker-compose.yml`](./docker-compose.yml):

1. A **caching/rate-limit layer** in front of the app under test — closer to a real production topology than the app's default single-process setup.
2. An **LLM response cache** for the LangGraph agent ([`ai-agent/cache.py`](./ai-agent/cache.py)): identical Gherkin scenarios aren't re-sent to Claude on every self-healing retry, cutting cost and latency.

### Common commands

```bash
# Start the app + Redis (baseline, always available)
docker compose up -d app redis

# Run each test category on demand
docker compose run --rm cypress-smoke
docker compose --profile regression run --rm cypress-regression
docker compose --profile api run --rm cypress-api
docker compose --profile unit run --rm unit-tests
docker compose --profile lint run --rm linter

# Generate a spec from a Gherkin file via the AI agent
docker compose --profile ai run --rm ai-agent --feature cypress/features/auth.feature

# Tear everything down (including volumes)
docker compose down -v
```

---

## 🚀 Getting Started

```bash
# 1. Clone this repo
git clone https://github.com/kallitests/my-cypress-showroom.git
cd my-cypress-showroom

# 2. Environment
cp .env.example .env
# Fill in ANTHROPIC_API_KEY if you want to run the AI agent

# 3. Run the smoke suite — builds and starts the app, Redis and Cypress automatically
docker compose up -d app redis
docker compose run --rm cypress-smoke
```

<details>
<summary>Prefer running without Docker? (local Node/Python setup)</summary>

```bash
# Install Cypress dependencies
npm install

# Clone and start the app under test in a separate terminal
git clone https://github.com/cypress-io/cypress-realworld-app.git app-under-test
cd app-under-test && yarn && yarn dev

# Back in this repo: run the smoke suite
npm run cypress:run:smoke

# (Optional) Set up the AI agent
cd ai-agent
pip install -r requirements.txt
python cli.py --feature ../cypress/features/auth.feature
```

</details>

---

## 🧵 CI/CD

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) is a single pipeline covering the whole stack, with jobs ordered for the fastest possible failure signal:

```
lint ──┬──▶ unit-tests ──┐
       └──▶ api-tests ───┴──▶ smoke-tests ──┬──▶ regression-tests   (nightly / manual only)
                                             ├──▶ ai-driven-tests    (only if CYPRESS_AI_KEY is set)
       └──▶ docker-build (parallel, validates every Dockerfile)
```

| Trigger | Jobs that run |
|---------|----------------|
| Push / Pull Request to `main` | `lint`, `unit-tests`, `api-tests`, `smoke-tests`, `docker-build` |
| Nightly schedule (`cron`) | Adds `regression-tests` |
| Manual (`workflow_dispatch`) | Adds `regression-tests` on demand |
| `CYPRESS_AI_KEY` secret present | Adds `ai-driven-tests` on every run |

Notable design choices:

- **`concurrency`** cancels a stale run when new commits land on the same branch/PR — no wasted CI minutes.
- **npm/pip caching** via `actions/setup-node` and `actions/setup-python` speeds up repeat installs.
- **Docker layer caching** (`cache-from`/`cache-to: type=gha`) keeps image builds fast across runs.
- **Regression is opt-in, not on every push** — it's slower by design, so it runs nightly instead of gating every PR.
- Failed smoke/regression runs **upload videos and screenshots** as build artifacts for debugging.

---

## 🎯 Design Decisions

- **Gherkin as documentation, not execution** — `.feature` files describe intent for non-technical readers; Cypress specs are the actual, native, debuggable implementation.
- **AI on actions, never on assertions** — `cy.prompt` drives UI interactions; correctness is always verified with plain, deterministic Cypress assertions.
- **Smoke, not full regression** — this repo optimizes for critical-path coverage and code clarity, not exhaustive testing.
- **Centralized selectors** — a single `selectors.ts` file means a UI change requires one edit, not a hunt across every spec.
- **Docker-first workflow** — every service (app, cache, each test category) is containerized so the whole suite is reproducible on any machine, and identical between local runs and CI.
- **Redis is illustrative, not load-bearing** — the vanilla Real World App works fine without it; it's wired in deliberately to demonstrate testing against a more production-like, stateful architecture, and to cache the AI agent's LLM calls.
- **Smoke gates every push, regression runs nightly** — keeps the fast feedback loop fast, while still getting deeper coverage on a schedule.

---

## 📌 Roadmap

- [x] Smoke suite on core RWA flows (auth, onboarding, transactions, search, social, notifications)
- [x] `cy.prompt` demo specs
- [x] LangGraph agent — Gherkin-to-spec generation with self-healing retries
- [x] Regression and API-only test suites
- [x] Full Docker/Compose stack (app, Redis, all test categories)
- [x] Redis-backed LLM response cache for the agent
- [x] Optimized GitHub Actions CI pipeline (lint → unit/api → smoke → regression/AI, Docker layer caching)
- [ ] Visual regression on the same smoke scenarios (Percy)
- [ ] Accessibility smoke checks (`cypress-axe`)
- [ ] Auto-created GitHub issue on repeated agent failure
- [ ] Live demo GIF in this README

⭐ Star this repo to follow the progress.

---

## 👤 Author

**Khalid Hafid-Medheb**
Senior SDET — Cypress / Playwright — automation & AI-assisted testing

[![LinkedIn](https://img.shields.io/badge/LinkedIn-khalid--hafid--medheb-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/khalid-hafid-medheb-40451aa8/)
[![GitHub](https://img.shields.io/badge/GitHub-kallitests-181717?style=flat-square&logo=github)](https://github.com/kallitests)

---

*Built with 🎭 Cypress · 🦜 LangGraph · 🧠 Claude (Anthropic)*
