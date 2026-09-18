# SkillSwap

**Hackathon ID: AZIS-MYZ39U**

A creator gig marketplace where young creators monetize their skills — design, editing, tutoring, music, and more — and clients can discover and book their services.

## Track

Track 2 — Web Development

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB connection string

### Setup

```bash
# Clone the repository
git clone https://github.com/CodeWithSalik/skillswap.git
cd skillswap

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials

No authentication required. The app uses a role switcher in the header:
- Switch to **Creator** mode to post gigs and manage bookings
- Switch to **Client** mode to browse gigs and make bookings

Enter any display name to get started.

## Features

1. **Post a Gig** — Creators list services with title, category, rate, and description
2. **Browse & Search** — Marketplace with search and category filtering
3. **Book a Gig** — Clients book services via a form and see confirmation
4. **Creator Dashboard** — Creators view incoming bookings and accept/decline
5. **My Bookings** — Clients track their bookings with live status updates

## Team

- **Ubaidullah** — Frontend / UI
- **Salik** — Backend / API

## Live URL

**Public Deployed Application:**
[https://skillswap-five-tan.vercel.app](https://skillswap-five-tan.vercel.app)
