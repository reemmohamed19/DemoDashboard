
# Mini Dashboard

A small demo dashboard built with **HTML, CSS, JS, jQuery, DataTables, Toastr, Animate.css** and powered by the **JSONPlaceholder API**.

It demonstrates how to build a vibrant, user-friendly admin panel with CRUD operations (local), API integration, and interactive UI features.

## 🚀 Features

* **Dashboard**

  * Statistics for **Users / Posts / Comments**
  * Counts include **local additions** (stored in LocalStorage)
* **Users Page**

  * DataTables integration
  * View, Edit, Delete users
  * ⭐ Favorite users (persisted in LocalStorage)
  * Add/Edit/Delete locally with Toastr notifications
* **Posts Page**

  * Live search
  * Add / Edit / Delete posts locally
  * View comments (fetched from API per Post)
* **Core**

  * Loader animation
  * Toastr notifications for all actions
  * Light/Dark mode toggle

---

## 🛠️ Tech Stack / Libraries

* **HTML5 / CSS3 / JS (ES6)**
* [jQuery](https://jquery.com/) – DOM manipulation
* [DataTables](https://datatables.net/) – interactive tables
* [Toastr](https://codeseven.github.io/toastr/) – notifications
* [Animate.css](https://animate.style/) – CSS animations
* [Font Awesome](https://fontawesome.com/) – icons
* **LocalStorage** – persisting favorites and local CRUD
* **JSONPlaceholder API** – fake REST API for demo data

  * Users ➝ `https://jsonplaceholder.typicode.com/users`
  * Posts ➝ `https://jsonplaceholder.typicode.com/posts`
  * Comments ➝ `https://jsonplaceholder.typicode.com/comments?postId={id}`

---

## 📦 Installation & Running
1-Download folder 
2-unzip folder
3. Navigate to:
   * `index.html` → Dashboard
  
---

## ⚡ Notes

* API data is **read-only**. Add/Edit/Delete actions are **local only** (saved to `localStorage`).
* Dashboard stats automatically merge **API data + Local data**.
* Favorites also persist in `localStorage`.

---

✨ This project is meant as a practice/demo for frontend devs to learn how to integrate APIs, build CRUD UIs, and use common JS libraries.
