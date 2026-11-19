# Urban Design Studio

An Architecture & Interior Design Portfolio with a Node.js backend, dynamic Firebase Realtime Database integration, and ImgBB media hosting.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** Firebase Realtime Database (with local JSON fallback)
- **Image Hosting:** ImgBB API

## Key Features
- **Dynamic Portfolio:** Project cards and details (location, year, category) load dynamically from the database.
- **Architect Profiles:** Team members and architects loaded dynamically.
- **Admin Control Panel:** Accessible at `/admin.html` to upload new architecture projects and team members.
- **Image Upload:** Upload images directly to ImgBB via the backend REST API.
- **Contact Form:** Interactive contact form that saves inquiries to the database.
- **Responsive & Accessible:** Works across desktop, tablet, and mobile with lightbox previews.

## Setup & Running Locally

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure `.env` file:
Create or edit `.env`:
```env
PORT=5000
IMGBB_API_KEY=your_imgbb_api_key_here
FIREBASE_DB_URL=https://your-firebase-database.firebaseio.com
```
*Note: If `.env` is left blank, the project automatically uses local JSON storage (`data/data.json`) so it runs out-of-the-box.*

3. Start the server:
```bash
npm start
```

4. Open in browser:
- Main Website: `http://localhost:5000`
- Admin Portal: `http://localhost:5000/admin.html`

## Free Deployment (Vercel / Render)

### Deploying on Render (Free)
1. Push this project to your GitHub repository.
2. Sign up on [render.com](https://render.com) (Free, no credit card required).
3. Create a **New Web Service** and select your GitHub repo.
4. Set Build Command: `npm install` and Start Command: `node server.js`.
5. Add your Environment Variables (`IMGBB_API_KEY` and `FIREBASE_DB_URL`) under Settings.
6. Click **Deploy**.
