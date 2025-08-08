# Trip Hood — Tour Management Application

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://tour-hood-project.web.app/)  ![License](https://img.shields.io/badge/License-MIT-blue)

---

# Overview

Trip Hood is a **MERN-based** tour management web application built for travel enthusiasts who want safe, simple, and reliable trip planning. Focused on popular tourist spots in Bangladesh, Trip Hood lets users browse curated packages, choose guides, book trips with secure card payments, and manage everything from a personalized dashboard.

---

# 🔗 Live Demo

**Website:** [https://tour-hood-project.web.app/](https://tour-hood-project.web.app/)

> **Demo admin (for testing only)**

```text
email: mahbubasw@gmail.com
password: Aaaaa@
```

---

# 🖼 Trip Hood - home

![Trip Hood - Home](./home-page-ui.png)

---

# 🛠 Main Technologies

* **Frontend:** React, HTML, CSS, JavaScript
* **Backend:** Node.js, Express
* **Database:** MongoDB (Atlas)
* **Hosting / Auth / Static assets:** Firebase (site hosted on Firebase Hosting)
* **Payments:** SSLCommerz (Visa card payment integration)

> See `package.json` in `client/` and `server/` for the full dependency list.

---

# ✨ Core Features

* ✅ **Comprehensive Tour Packages** — curated travel packages for popular spots in Bangladesh.
* ✅ **Safe Tour Management** — features designed with user safety in mind.
* ✅ **Easy Booking** — browse packages and book directly via the site.
* ✅ **Guide Selection** — users can view guide profiles and choose a preferred guide.
* ✅ **Guide Application Workflow** — logged-in users can apply to become tour guides; admin can review and approve/reject.
* ✅ **Role-Based Dashboards** — Tourist (default), Tour Guide, and Admin dashboards with tailored views.
* ✅ **Secure Card Payments** — Visa card payments via SSLCommerz.
* ✅ **Responsive Design** — mobile-to-desktop friendly layout.

---

# 📦 Dependencies (high level)

> *Install the exact versions from each `package.json` in the repo.*

**Client (common):**

* react
* react-dom
* react-router-dom
* axios
* react-hook-form (optional)
* react-datepicker (optional)
* sweetalert2 (optional)

**Server (common):**

* express
* mongoose
* dotenv
* cors
* bcryptjs
* jsonwebtoken
* sslcommerz (or custom integration)

---

# 🚀 Run Locally — Quick Start

> Replace `<YOUR-REPO-URL>` with the repo link and fill environment variables according to your services.

```bash
# 1. Clone the repo
git clone <YOUR-REPO-URL>
cd trip-hood

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Environment variables

Create a `.env` file in the `server/` folder and add the required variables. Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
# SSLCommerz credentials (example names — adapt to your code)
SSL_COMMERZ_STORE_ID=your_store_id
SSL_COMMERZ_STORE_PASSWORD=your_store_password
```

If the project uses Firebase (for hosting/auth), add the Firebase config to the client environment (`.env.local` or `REACT_APP_...` variables) as needed.

### Start the app

Open two terminals:

```bash
# Terminal 1 — start backend
cd server
npm run dev   # or `node index.js` / `nodemon index.js`

# Terminal 2 — start frontend
cd client
npm start     # or `npm run dev` depending on setup
```

> If the project has a root `package.json` with `concurrently`, you may be able to run both with `npm run dev` from the root.

---

# ⚙️ Build & Deploy (Firebase example)

1. Build the client:

```bash
cd client
npm run build
```

2. Serve or deploy the build with your preferred host (Firebase example):

```bash
# install firebase-tools if you haven't
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

---

# 📁 Suggested Project Structure

```
trip-hood/
├─ client/          # React app
├─ server/          # Node/Express API
├─ README.md
└─ .env.example
```

---

# 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add ..."`
4. Push: `git push origin feat/your-feature`
5. Open a PR and describe the change

Please add tests and keep code style consistent.

---


# 📞 Contact

* **Email:** [mahbubalamdave2.00@gmail.com](mailto:mahbubalamdave2.00@gmail.com)
* **Phone:** 01307594998

---

# 🧾 License

This project is released under the **MIT License**. See the `LICENSE` file for details.

---

