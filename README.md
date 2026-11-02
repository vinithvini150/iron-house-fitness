# IRON HOUSE FITNESS

A premium, responsive five-page gym website built with HTML, CSS, vanilla JavaScript, Node.js, Express and MongoDB.

## Pages
- Home (`/`)
- About (`/about.html`)
- Membership (`/membership.html`)
- Trainers (`/trainers.html`)
- Contact (`/contact.html`)

## Local setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI`.
4. Run `npm run dev`.
5. Open http://localhost:5000.

The website pages render without MongoDB. The enquiry API requires a valid MongoDB URI.

## API
- `GET /api/health`
- `POST /api/enquiries`

POST JSON fields: `name`, `phone`, `email`, `goal`, `plan`, `message`.

## Vercel
Import the GitHub repository into Vercel. Add `MONGODB_URI` in Project Settings → Environment Variables. Vercel can detect the root `server.js` Express entry point; static files are in `public/`. The Express function exports the app and does not call `listen()` in production.
