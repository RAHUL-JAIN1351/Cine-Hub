# 🎬 CineHub — Your Personal Movie Explorer

CineHub is a fully responsive, feature-rich movie browsing web app that allows users to explore movies, view detailed information, manage their favourites list, and enjoy a smooth UI experience. It is powered by **MockAPI** for its backend data and deployed on **Vercel** for fast, reliable hosting.

This README explains everything about the project — features, technology stack, folder structure, API usage, deployment process, and how contributors can use or improve the project.

---

## 🚀 Live Demo

➡️ **CineHub on Vercel:** [https://cine-hub-sandy.vercel.app/](https://cine-hub-sandy.vercel.app/)

---

## ⭐ About CineHub

CineHub is designed to provide a clean, intuitive, and fast experience for movie lovers. Users can browse movies, read descriptions, view ratings, and save their favourite movies. The UI is optimized for all screen sizes, from desktops to mobiles.

The project uses:

* **HTML / CSS / JavaScript** — for the frontend
* **MockAPI.io** — as a cloud-based REST API backend
* **Vercel** — for seamless frontend deployment
* **GitHub** — version control & CI/CD integration

---

## ✨ Features Overview

Here is a detailed list of all the features CineHub offers:

### 🔍 1. Movie Browsing Grid

* Displays movies in a responsive card-based layout
* Automatically adjusts grid columns based on screen size
* Smooth hover animation for movie cards
* High-quality movie posters with dynamic height adjustments

### ⭐ 2. Movie Details

Each movie card shows:

* Movie poster
* Title
* Description (short)
* Genre
* IMDb-style rating (⭐)
* Favourite icon (❤️)

### ❤️ 3. Add to Favourites

* One-click favourite icon on each movie card
* Sends movie data to `/favourites` API resource
* Stores favourite movies persistently with MockAPI
* Displays filled heart icon when already added

### 📁 4. Dedicated Favourites Page

* Shows all saved favourite movies
* Same clean card layout as the main page
* Allows removing a movie from favourites
* Syncs instantly with MockAPI backend

### 🔄 5. Real-Time Sync With MockAPI

CineHub uses a central API base URL:

```
https://691616dd465a9144626ed82e.mockapi.io/api
```

* `/movies` for listing movies
* `/favourites` for storing user favourites
* Works 24/7 with zero downtime

### 📱 6. Fully Responsive UI

Special responsive rules:

* Removes scrollbars on small screens
* Adjusts card heights to prevent layout shifting
* Ensures icons (favourite, cart, etc.) remain visible on mobile

### ⚡ 7. Optimized Performance

* Minimized network requests
* Removed duplicate declarations like `apiBase`
* Preloaded images for faster rendering
* Clean, maintainable JS structure

---

## 🧠 How CineHub Works Internally

### 1️⃣ `/movies` API resource

Contains all movie data:

* Title
* Description
* Rating
* Genre
* Poster URL

### 2️⃣ `/favourites` API resource

Stores user-selected favourite movies.
Each entry is saved as a separate object:

```
{
  "id": "1",
  "title": "Inception",
  "poster": "https://...",
  "rating": 9.0
}
```

### 3️⃣ `common.js` — Centralized API Configuration

Contains the only declaration of:

```
const apiBase = "https://691616dd465a9144626ed82e.mockapi.io/api";
```

All other JS files import this indirectly through global scope.

---

## 🗂️ Project Structure

```
CineHub/
│
├── index.html        # Home page (movie grid)
├── favourites.html   # Favourites page
├── style.css         # Global styling
├── index.js          # Home page JS
├── favourites.js     # Favourites page JS
├── common.js         # Shared API base URL
├── img/              # Local images/assets
└── README.md         # Documentation
```

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6)
* **Backend (API):** MockAPI.io (REST API)
* **Hosting:** Vercel
* **Version Control:** GitHub
* **Tools:** JSON Schema, Fetch API, Responsive Layouts

---

## 🔧 Deployment Steps (Vercel)

1. Push project to a GitHub repository
2. Go to Vercel → Import GitHub repository
3. Configure project settings (Auto-detected)
4. Click **Deploy**
5. Vercel builds & publishes instantly
6. Automatic redeploy on every Git push

---

## 📌 How to Add Movie Data to MockAPI

1. Go to your MockAPI dashboard
2. Open **movies** resource
3. Add multiple movies using **Bulk Insert → JSON input**
4. Paste full movie array
5. Save and refresh

---

## 🐞 Common Issues & Fixes

### ❌ `SyntaxError: redeclaration of const apiBase`

**Fix:** Remove all duplicate declarations & keep only in `common.js`.

### ❌ Scrollbar visible in small screens

**Fix:** CSS update with:

```
.movie-grid {
  overflow-y: hidden;
}
```

### ❌ Icons not visible on mobile

**Fix:** Increased z-index & responsive sizes.

---

## 🎯 Future Enhancements

* Search functionality
* Filter by genre
* Sort by rating
* Movie carousel improvements
* User login system
* Dark/Light theme toggle

---

## 🤝 Contributions

Contributions are welcome!
If you want to improve UI, add features, or optimize code — feel free to open PRs.

---

## 🧑‍💻 Author

**Project by Rahul Jain**

If you like this project, ⭐ star the repository!
