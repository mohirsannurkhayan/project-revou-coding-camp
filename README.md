# 📋 To-Do List Life Dashboard

A simple productivity dashboard built with **HTML**, **CSS**, and **Vanilla JavaScript** — no frameworks, no backend, just open and use.

<img width="1919" height="1020" alt="image" src="https://github.com/user-attachments/assets/de771d1a-d1e6-40d3-81a7-84fddfc3c742" />


---

## 🚀 Features

### 1. 🕐 Greeting & Time
- Displays current date and time (updates every second)
- Shows greeting based on time of day — Pagi / Siang / Sore / Malam
- Custom user name saved in Local Storage

### 2. ⏱ Focus Timer (Pomodoro)
- 25-minute countdown timer
- Start, Stop, and Reset controls

### 3. ✅ To-Do List
- Add new tasks
- Edit existing tasks
- Mark tasks as completed
- Delete tasks
- Prevent duplicate tasks (case-insensitive)
- All data saved using Local Storage

### 4. 🔗 Quick Links
- Add custom links with a label and URL
- Open favorite websites in a new tab
- Remove links individually
- Saved in Local Storage

### 5. 🎨 Additional Features
- Light / Dark Mode toggle (preference saved)
- Custom user name in greeting

---

## 🛠️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Structure  | HTML5                   |
| Styling    | CSS3 (Custom Properties)|
| Logic      | Vanilla JavaScript (ES6)|
| Storage    | Browser Local Storage   |

---

## 📂 Project Structure

```
to-do-list-life-dashboard/
├── index.html        # Main HTML structure
├── css/
│   └── style.css     # All styles (light/dark theme, layout, components)
├── js/
│   └── app.js        # All JavaScript logic (modular IIFE pattern)
└── README.md
```

---

## ⚡ Getting Started

No installation or build step required.

### Option 1 — Open directly in browser

1. Clone or download this repository
   ```bash
   git clone https://github.com/mohirsannurkhayan/project-revou-coding-camp.git
   ```
2. Open `index.html` in any modern browser
   ```
   Double-click index.html  →  Done ✅
   ```

### Option 2 — Use Live Server (VS Code)

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

---

## 💾 Local Storage Keys

| Key        | Description                        |
|------------|------------------------------------|
| `theme`    | Current theme (`light` / `dark`)   |
| `userName` | User's display name                |
| `tasks`    | Array of to-do task objects        |
| `links`    | Array of quick link objects        |

---

## 🌐 Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome  | ✅        |
| Firefox | ✅        |
| Edge    | ✅        |
| Safari  | ✅        |

---

## 📌 Challenges Implemented

- [x] Light / Dark Mode
- [x] Custom name in greeting
- [x] Prevent duplicate tasks

---
