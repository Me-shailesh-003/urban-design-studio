# Urban Design Studio

An architectural and interior design portfolio management platform built using a modern **3-Tier Full-Stack Architecture** with **Node.js, Express.js REST APIs**, **Google Firebase Realtime Database**, and **ImgBB Cloud Media Hosting**.

---

## 🌐 Live Production URL
* **Client Website:** [https://urban-design-studio.vercel.app](https://urban-design-studio.vercel.app)
* **Admin Control Panel:** [https://urban-design-studio.vercel.app/admin.html](https://urban-design-studio.vercel.app/admin.html)

---

## 📁 Project Directory Structure

```text
Urban Design Studio/
│
├── 📁 public/                     # Client-Side Frontend (HTML5, CSS3, Vanilla JS)
│   ├── index.html                 # Main Architectural Portfolio Webpage
│   ├── admin.html                 # Private Studio Admin Control Panel
│   ├── styles.css                 # Responsive Architectural Styling & Grid
│   ├── script.js                  # Dynamic Project/Team Loader & Lightbox
│   └── admin.js                   # Admin Operations & Canvas Image Optimizer
│
├── 📁 api/                        # Serverless Gateway (Vercel Functions)
│   └── index.js                   # Serverless Express API Entrypoint
│
├── 📁 data/                       # Local Data Store & Offline Fallback
│   └── data.json                  # Fallback JSON Storage & Initial Seed
│
├── 📁 docs/                       # Official Academic Minor Project Documentation
│   ├── Project_Report_Urban_Design_Studio.pdf      # Complete 22-Page Final PDF Report
│   └── Project_Report_Urban_Design_Studio.docx     # Editable MS Word Document
│
├── 📁 scripts/                    # Database & Automation Scripts
│   └── seed.js                    # Firebase Database Seeder Utility
│
├── .env                           # Environment Variables (ImgBB API & Firebase DB)
├── .env.example                   # Sample Configuration Template
├── .gitignore                     # Git Ignored Files (node_modules, .env)
├── package.json                   # Project Dependencies & NPM Scripts
├── package-lock.json              # Dependency Version Lock
├── README.md                      # Project Guide & Documentation
├── server.js                      # Core Node.js / Express REST API Server
└── vercel.json                    # Vercel Deployment & Route Rewrites
```

---

## 🛠️ Technology Stack
* **Presentation Layer:** Semantic HTML5, Modern CSS3 (Flexbox, CSS Grid, Custom Variables), Vanilla JavaScript (ES6+), HTML5 Canvas API (Client-side compression).
* **Application Layer:** Node.js (v24.x LTS), Express.js RESTful API Framework, Multer multipart streaming.
* **Database & Cloud Storage:** Google Firebase Realtime Database (NoSQL JSON REST API), ImgBB Cloud API v1.
* **Deployment & CI/CD:** Vercel Edge Serverless Cloud Platform, Git, GitHub (`Me-shailesh-003/urban-design-studio`).

---

## 🚀 Running Locally

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables (`.env`):**
   ```env
   PORT=5000
   IMGBB_API_KEY=your_imgbb_api_key_here
   FIREBASE_DB_URL=https://your-project-default-rtdb.firebaseio.com
   ```

3. **(Optional) Seed Firebase Database:**
   ```bash
   npm run seed
   ```

4. **Start the Application:**
   ```bash
   npm start
   ```
   * Open Main Website: `http://localhost:5000`
   * Open Admin Panel: `http://localhost:5000/admin.html`

---

## 👥 Academic Project Team
* **Institute:** Shri Vaishnav Institute of Computer Applications, SVVV Indore
* **Course:** Master of Computer Applications (MCA — AI-ML), Session 2026–2027
* **Guided By:** Prof. Shilpa Jaiswal (Professor, Department of Computer Application)
* **Team Members:**
  1. **Shailesh Parmar** (Enrollment No.: `2504MCAAIML0053`)
  2. **Sandeep Jamod** (Enrollment No.: `2504MCAAIML0050`)
