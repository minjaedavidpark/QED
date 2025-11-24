# 🧠 QED – Multi-Agent Study & Exam Coach

> **🏆 3rd Place Winner – Anthropic AI Hackathon @ UofT (Nov 2025)**
>
> **Track(s):**
> 🟦 Track 1 – Reasoning Systems (UofT AI)
> 🟩 General Track – Open Innovation

QED is a **multi-agent study coach** powered by Claude that trains students to _think_ through hard problems instead of just handing them the answer.

Students can:

- Break down tough questions into smaller steps
- Get guided, Socratic help instead of full solutions
- Receive structured feedback on their own work
- Generate realistic study plans for upcoming exams

This project was built for the **Anthropic AI Hackathon @ UofT** (Nov 1–23, 2025).

---

## ✨ Key Features

### 1. Guided Problem Solving (Socratic Coach)

Paste a problem (math / CS / econ / theory / etc.) and QED will:

- **Decompose** it into a sequence of reasoning steps
- Guide you through each step with questions and hints
- Adapt to your answers (gives more hints if you’re stuck)
- Only reveals the full solution outline after sufficient effort

> Goal: build _your_ reasoning muscles, not replace them.

---

### 2. Solution Critique (TA-Style Feedback)

Paste the **problem** and your **attempted solution**.

The system:

- Checks for **logical gaps** and unjustified steps
- Highlights **missing edge cases** or incorrect assumptions
- Rewrites your solution in plain language so you can see if it matches what you meant
- Provides structured feedback: “What you did well / What to improve”

---

### 3. Study Planner for Courses & Exams

Give QED:

- Course name (e.g. “CSC458 – Computer Networks”)
- Topics or a rough syllabus
- Exam date & weekly study hours

It will:

- Build a **realistic day-by-day study plan**
- Emphasize high-value topics and spaced review
- Generate **checkpoint questions** for each topic so you can self-test

---

## 🧩 Multi-Agent Design

Internally, QED uses **specialized Claude “agents”** implemented as separate prompt profiles:

- 🧩 **Decomposer Agent** – breaks problems into steps & required concepts
- 🗣️ **Socratic Coach Agent** – interacts with the student step-by-step
- 🔍 **Critic / Verifier Agent** – evaluates solutions and explains issues
- 📅 **Planner Agent** – turns topics + constraints into a study schedule
- (Optional) 🧠 **Misconception Tracker** – surfaces recurring patterns of mistakes

The frontend orchestrates these agents via a simple backend API, so each mode has a clear contract (inputs / outputs) but shares context when needed.

---

## 🛡️ Ethics & Academic Integrity

QED is explicitly designed to **support learning**, not cheating.

We implement several guardrails:

- **No direct full solution by default** – the coach uses hints and questions first
- **“Show solution” is gated** – only appears after multiple attempts or user confirmation
- Clear **disclaimer**: do not paste take-home exams; use for practice & understanding
- Prompts encourage **reflection**: after solving, students are asked what they learned and what to do differently next time

This aligns with the hackathon’s focus on **safe, human-centered AI** and responsible model use.

---

## 🏗️ Tech Stack

- **Frontend:** Next.js (React + TypeScript), Tailwind CSS
- **Backend:** Next.js API routes / Node.js + Flask (Manim visualization service)
- **LLM:** Anthropic Claude API (or OpenAI)
- **Visualization:** Manim Community Edition
- **Storage (optional):** SQLite / Supabase / PostgreSQL (for saving sessions & history)

> You can swap in your own stack; the core idea is agent-like prompt separation.

---

## 🚀 Deployment

Ready to deploy QED to the internet? We've got you covered!

### Quick Deployment (5-10 minutes)

Follow the **[Quick Start Guide](DEPLOY_QUICK_START.md)** to deploy to Railway in minutes.

### Comprehensive Deployment Options

See **[Internet Deployment Guide](DEPLOY_INTERNET.md)** for:

- Railway (recommended)
- Vercel + Railway
- Render
- Custom VPS deployment
- Cost comparisons and monitoring

### Local Docker Deployment

See **[Deployment Guide](DEPLOYMENT.md)** for Docker Compose and local deployment.

---
