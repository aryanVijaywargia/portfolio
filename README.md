# Aryan Portfolio

Personal portfolio website built with Next.js, React, TypeScript, Tailwind CSS, and pnpm.

## Setup

```bash
pnpm install
pnpm dev
```

The local dev server runs on `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and replace the placeholder values only if you want to enable optional server features:

- `GEMINI_API_KEY` enables the Byte chatbot API.
- `EMAIL_SERVER_*`, `EMAIL_FROM`, and `CONTACT_EMAIL_TO` enable the contact form email delivery.

## Validation

```bash
pnpm lint
pnpm build
```
