# Eng. Inas Bin Yousuf — Portfolio

Personal portfolio website of **Eng. Inas Bin Yousuf (IBY)**, an IT Systems & Infrastructure Engineer based in Chattogram, Bangladesh. Built with React, TypeScript, Vite, and Tailwind CSS.

**Live site:** _add your Vercel/Netlify URL here once deployed_

## Features

- Responsive, animated single-page portfolio (About, Experience, Projects, Services, Education, Skills, Testimonials, Certifications, Contact)
- Light/dark theme toggle with saved preference
- Built-in CV / Resume / Cover Letter builder with multiple templates and PDF export
- Optional AI-assisted CV tailoring (via Gemini API) for a specific job description
- Working contact form (opens the visitor's email client with the message pre-filled)

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vitejs.dev/) for build tooling
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Motion](https://motion.dev/) for animation
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for client-side PDF export
- [@google/genai](https://ai.google.dev/) (optional) for AI-assisted CV content

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm run dev

# Type-check the project
npm run lint

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

### Optional: enabling the AI CV Optimizer

The CV Builder's "AI Help" tab uses the Gemini API to tailor your CV to a job description. This is entirely optional — the rest of the site, and the rest of the CV Builder, works without it.

1. Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Copy `.env.example` to `.env.local` and paste your key in
3. Restart `npm run dev`

## Deployment

This is a standard Vite + React project, so **Vercel and Netlify both auto-detect it with zero configuration** — no workflow files, no manual build settings needed.

### Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new), import the repo
3. Vercel auto-detects "Vite" as the framework, with build command `npm run build` and output directory `dist` — just click **Deploy**
4. *(Optional)* To enable the AI CV Optimizer, add an Environment Variable named `GEMINI_API_KEY` in **Project Settings → Environment Variables**, then redeploy
   - Note: since this is a static site, the key ends up visible in the built JavaScript to anyone who inspects the page. Only add a key you're comfortable being public.

### Netlify

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**, pick the repo
3. This repo includes `netlify.toml`, which already sets the build command (`npm run build`) and publish directory (`dist`) — Netlify picks this up automatically, just click **Deploy**
4. *(Optional)* For the AI CV Optimizer, add `GEMINI_API_KEY` under **Site configuration → Environment variables**, then redeploy

### GitHub Pages (alternative)

This also works on GitHub Pages, but needs one extra step since Pages serves from a repo subpath instead of a domain root: change `base: '/'` to `base: './'` in `vite.config.ts` before building, and use a GitHub Actions workflow to build + deploy (since Pages doesn't run `npm run build` for you the way Vercel/Netlify do).

## Project Structure

```
src/
  components/     # All UI sections (Hero, About, Experience, Projects, etc.)
  context/        # React context providers
  lib/            # Shared utilities
  assets/
    projects/     # Project card images — replace these 4 files with your own photos
                   # (keep the same filenames, or update the imports in Projects.tsx)
  data.ts         # All portfolio content (name, experience, skills, projects, etc.)
  App.tsx         # Page layout / section order
  main.tsx        # React entry point
public/
  favicon.svg     # Site favicon
  robots.txt      # Search-engine crawling rules
```

To update the content on the site (experience, projects, skills, certifications, contact info, etc.), edit **`src/data.ts`** — everything else reads from that single file.

To replace the project images with your own, drop your photos into `src/assets/projects/`, keeping the same 4 filenames (or update the `import` lines at the top of `src/components/Projects.tsx` to match new filenames).

## License

This project is personal portfolio source code. All rights to the content (name, work history, images) belong to Eng. Inas Bin Yousuf.
