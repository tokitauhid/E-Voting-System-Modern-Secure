# 🗳️ E-Voting System

A modern, secure electronic voting system built with vanilla HTML, CSS, and JavaScript. Features a polished glassmorphic UI with animated backgrounds, responsive design, and a complete admin dashboard for election management.

---

## ✨ Features

### Voter Portal
- **Secure Registration & Login** — SHA-256 hashed passwords, voter ID-based auth
- **Candidate Browsing** — View all candidates with party affiliations and emblems
- **One-Click Voting** — Confirmation modal with one-vote-only enforcement
- **Profile Dashboard** — Real-time vote status and account information
- **Password Recovery** — Reset via Voter ID + Full Name verification

### Admin Dashboard
- **Live Election Stats** — Registered voters, votes cast, turnout percentage
- **Visual Results** — Animated progress bars with real-time vote counts
- **Candidate Management** — Full CRUD: add, edit emblems, delete candidates
- **CSV Export** — One-click export of election results
- **Credential Management** — Update admin username & password
- **Responsive Sidebar** — Mobile-friendly navigation with overlay

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure & accessibility (ARIA attributes) |
| **CSS3** | Glassmorphism, animated gradients, CSS custom properties |
| **JavaScript (ES6+)** | Application logic, localStorage data layer |
| **Font Awesome 6** | Icons throughout the UI |
| **Google Fonts (Inter)** | Modern typography |

---

## 📁 Project Structure

```
Web_project/
├── css/
│   └── main.css              # Design system — tokens, auth styles, toasts
├── js/
│   ├── utils.js              # Toast notifications, Storage wrapper, UI helpers
│   ├── auth.js               # Login & registration logic
│   ├── vote.js               # Voter dashboard & voting logic
│   └── admin.js              # Admin dashboard logic & CRUD
├── login.html                # Voter login page
├── register.html             # Voter registration page
├── forgot_password.html      # Password reset page
├── admin_login.html          # Admin login page
├── voter_dashboard.html      # Voter dashboard — browse & vote
├── admin_dashboard.html      # Admin dashboard — manage election
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)
- No build tools, Node.js, or server required

### Running Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Web_project
   ```

2. **Open in browser**
   ```bash
   # Option 1: Direct file open
   open login.html          # macOS
   xdg-open login.html      # Linux

   # Option 2: Serve with any HTTP server
   npx serve .
   # or
   python3 -m http.server 8000
   ```

3. **Start using the app**
   - Register a new voter account → Login → Cast your vote
   - Access the admin panel via the "Admin Login" link

---

## 🔑 Default Credentials

| Role | Username / Voter ID | Password |
|---|---|---|
| **Admin** | `admin` | `admin` |
| **Voter** | *(Register your own)* | *(min 6 characters)* |

> ⚠️ Change the default admin credentials immediately after first login via **Settings > Change Admin Credentials**.

---

## 🎨 Design Highlights

- **Animated gradient backgrounds** on all auth pages
- **Glassmorphic cards** with backdrop blur and refined shadows
- **CSS custom properties** for consistent theming
- **Micro-animations** on hover, focus, and page transitions
- **Fully responsive** — mobile-first sidebar and adaptive grid layouts
- **Accessible** — ARIA labels, keyboard navigation, focus-visible styles

---

## 📄 License

This project is open-source. Feel free to use and modify for educational purposes.
