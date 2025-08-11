# myFlashcard

A simple flashcard web app. You can create decks, add flashcards (with optional images), and study them. It has user login and a small admin area.

- Backend: Node.js + Express + Prisma (MySQL)
- Frontend: React + Vite + Tailwind/daisyUI

---

## What you can do

- Register and log in
- Create and edit decks
- Create and edit flashcards (text and optional images)
- Tag flashcards and search by tags
- Report decks (admin can review)

---

## Prerequisites

- Node.js 18+
- MySQL 8+ running locally
- Cloudinary account (only if you want image upload to work)

---

## Setup (quick)

1) Install dependencies

```bash
# API
cd myFlashcard-API && npm install
# WEB
cd ../myFlashcard-WEB && npm install
```

2) API environment file

Create `myFlashcard-API/.env` (you can copy from `.env.example`) and fill in:

```bash
PORT=8899
DATABASE_URL=mysql://USER:PASS@localhost:3306/myFlashcard
JWT_SECRET=your-secret

# Cloudinary (optional for image uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

3) Initialize database (run inside myFlashcard-API)

```bash
npx prisma migrate dev   # create tables
npx prisma db seed       # optional: add demo data
```

4) Run the servers

```bash
# API
npm run dev              # http://localhost:8899

# in another terminal, for the WEB app
cd ../myFlashcard-WEB
npm run dev              # Vite dev server
```

The frontend talks to `http://localhost:8899` by default (see `myFlashcard-WEB/src/api/axios.js`).

---

## Demo accounts (from seed)

- bob1@gmail.com / 123456
- alice@gmail.com / 1234567
- charlie@gmail.com / 123456

Admin: open Prisma Studio (`npx prisma studio`) and set a user's `role` to `ADMIN` to try the admin pages.

---

## Notes

- If you don’t set Cloudinary, image upload features won’t work, but everything else will run.
- Use Prisma Studio to view/edit data while developing.

