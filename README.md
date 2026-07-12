<div align="center">

# 🌌 Aura AI — Premium OS for Athletic Performance

<p align="center">
  A premium, high-performance athletic operating system designed for elite athletes and fitness enthusiasts. Powered by React 19, Vite, Gemini Multimodal AI, and Supabase.
</p>

[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Multimodal_API-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Build-646CFF?style=for-the-badge&logo=vite)](https://vite.dev/)

<h4>
  <a href="#-live-demo">Live Demo</a>
  •
  <a href="#-features">Key Features</a>
  •
  <a href="#-installation">Quick Start</a>
  •
  <a href="#-project-architecture">Architecture</a>
</h4>

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Folder Structure](#-folder-structure)
- [Project Architecture](#-project-architecture)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Future Improvements](#-future-improvements)
- [Live Demo](#-live-demo)
- [Author](#-author)

---

## 🌟 Overview

**Aura AI** is a premium, AI-powered fitness operating system designed for athletes, fitness enthusiasts, and health-conscious users. It combines intelligent workout tracking, AI coaching, nutrition analysis, progress analytics, and computer vision into one modern, highly-polished web application.

---

## 🚀 Tech Stack

Aura AI is built using the industry's most modern and powerful developer tools:

### Frontend
* **React 19** - Standard Declarative UI component library.
* **TypeScript** - Strict compile-time type safety.
* **Vite** - High-speed, modern bundler and development server.
* **Tailwind CSS v4** - High-performance, modern utility-first CSS engine.
* **Motion** - Fluid physical and gesture-driven layout animations.
* **Lucide React** - Clean and consistent vector-based iconography.

### Backend
* **Node.js & Express.js** - Ultra-reliable API framework and request middleware layer.

### AI Engine
* **Gemini AI** - Personal text consultation engine.
* **Vision AI** - Multimodal image scanning for nutritional estimation.

### Database & Authentication
* **Supabase** - Postgres backend engine.
* **Supabase Authentication** - Secure OAuth and email-based authorization with built-in sandbox modes.

### Email
* **Resend API** - Automated transactional messaging.

### Deployment
* **Vercel** - Production client-side delivery.
* **Render** - Continuous backend service integration.

---

## ⚡ Key Features

### 💎 Premium Landing Page
Immersive user interface containing glassmorphic styling, neon aurora glows, responsive mockup frames, and buttery-smooth entry animations.

### 🔐 Double-State Authentication
Full-scale Supabase signup, login, and password recovery. Includes a dedicated **Quick Access Demo** sandbox mode to instantly explore full dashboard features without setting up an account.

### 📊 Performance Dashboard
Monitor daily active calories, hydration counts, training metrics, and macronutrient balances with customizable interactive layouts.

### 🧠 AI Athletic Coach
Consult your specialized AI trainer for customized daily workouts, diet breakdowns, performance analysis, and posture guidelines.

### 👁️ Vision Food Scanner
Upload or drag-and-drop meal images to instantly extract calorie limits, proteins, fats, and carb ratios powered by advanced multimodal models.

### 📈 Activity Analytics
Full visual reporting with clean tracking lines, progression bars, and interactive activity charts.

### 📬 Transactional Email Automation
Get a neat breakdown of your workout stats and nutritional highlights delivered directly to your inbox using Resend.

---

## 📦 Folder Structure

Our codebase is meticulously partitioned into two primary, self-contained directories:

```text
/
├── api/
│   └── server.ts          # Express Server handling Gemini, Vision & Resend endpoints
│
└── frontend/
    ├── assets/            # Static image assets and icons
    ├── components/        # High-performance reusable components (Navbar, Sidebar)
    ├── context/           # AuthContext managing user and sandbox session states
    ├── pages/             # Dynamic layout screens (Dashboard, Coach, Scanner, Workouts)
    ├── routes/            # Route wraps and access levels (ProtectedRoute)
    ├── services/          # API services (supabase.ts, authService.ts)
    ├── utils/             # Formatters, calculators, and helpers
    ├── App.tsx            # Routes orchestrator
    ├── main.tsx           # Client entry point
    └── index.css          # Core styles and custom variables
```

---

## 🏗️ Project Architecture

```text
       ┌────────────────────────┐
       │   React 19 Frontend    │
       └───────────┬────────────┘
                   │
                   ▼ (Express API)
       ┌────────────────────────┐
       │     Node.js Server     │
       └─────┬───────────┬──────┘
             │           │
             ▼           ▼
┌────────────────┐   ┌────────────────┐
│   Gemini AI    │   │  Resend Email  │
│  & Vision AI   │   │    Service     │
└────────────────┘   └────────────────┘
             │
             ▼
┌────────────────┐
│    Supabase    │
│  Postgres DB   │
└────────────────┘
```

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing-page.png)

### Login
![Login](./screenshots/login.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Workout Tracker
![Workout Tracker](./screenshots/workout.png)

### AI Coach
![AI Coach](./screenshots/coach.png)

### Vision AI
![Vision AI](./screenshots/vision.png)

### Analytics
![Analytics](./screenshots/analytics.png)

### Profile
![Profile](./screenshots/profile.png)

### Settings
![Settings](./screenshots/settings.png)

---

## ⚙️ Installation

Follow these steps to launch the system in your local workspace:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in your root folder and add the required credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GROQ_API_KEY=your_groq_api_key

# Email Service
VITE_RESEND_API_KEY=your_resend_api_key
```

### 3. Run Development Server
```bash
npm run dev
```
*Your application will run on http://localhost:3000*

---

## 🔮 Future Improvements

* ⌚ **Wearable Device Integration** - Synced biometric logs for Apple Watch, Fitbit, and Garmin.
* 🍽️ **AI Meal Planner** - Dynamically customized shopping lists and recipes matching daily macro goals.
* 🏋️ **Smart Workout Recommendations** - Adjust schedules based on fatigue and muscle recovery.
* 📄 **Weekly PDF Reports** - Professional, downloadable progress charts sent automatically.
* ☁️ **Cloud Backup** - Distributed secondary sync backups for user progress logs.

---

## 👤 Author

**Hardik Jadhav**

* **GitHub**: [@Hardikkkkkkk19](https://github.com/Hardikkkkkkk19)
* **Portfolio**: [https://premium-portfolio-zeta-nine.vercel.app/]
* **LinkedIn**: [https://www.linkedin.com/in/hardik-jadhav-463710385/]

---
<div align="center">
  <sub>Built with ❤️ by Hardik Jadhav</sub>
</div>
