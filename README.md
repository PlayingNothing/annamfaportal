# MFA Intelligence Portal

Single-page React + Vite + Tailwind build for the MFA Intelligence Portal briefing experience.

## Getting started

1) Install dependencies: `npm install`
2) Start dev server: `npm run dev` (opens on http://localhost:5173)
3) Production build: `npm run build` then preview with `npm run preview`

## Notes

- Tailwind is enabled via `src/index.css`.
- Video/audio/image slots use public URLs in the data arrays. Replace the placeholders with your own YouTube or asset links.
- Local assets: drop images/videos in `public/media/` and reference them with `/media/your-file.ext` (served from site root).

## Publish on GitHub Pages

1) Create a new empty GitHub repository.
2) Initialize git in this folder (if not already initialized), add the remote, and push:
   - `git init`
   - `git add .`
   - `git commit -m "Initial commit"`
   - `git branch -M main`
   - `git remote add origin <your-repo-url>`
   - `git push -u origin main`
3) In GitHub: `Settings` -> `Pages` -> `Build and deployment` -> set `Source` to `GitHub Actions`.
4) After the push, the workflow in `.github/workflows/deploy-pages.yml` deploys the site automatically.
