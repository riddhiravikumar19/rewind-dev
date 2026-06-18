# Rewind.dev — Full-Stack Bug Replay and Session Debugging Platform

![Rewind.dev Landing Page](public/screenshots/landing.png)

## Live Demo

**Deployed Project:** https://rewind-dev.vercel.app/
**GitHub Repository:** https://github.com/riddhiravikumar19/rewind-dev

---

## Overview

Rewind.dev is a full-stack debugging and session replay platform that helps developers understand exactly what happened before a bug occurred.

It connects to a website using a lightweight tracker SDK, captures real browser sessions, reconstructs the session timeline through Ghost Replay, and generates structured developer-ready bug reports.

Instead of depending on vague user complaints like “something broke,” Rewind.dev captures the actual user journey, including clicks, page loads, route changes, failed API calls, console errors, browser information, device type, screen size, severity, and session metadata.

---

## Problem Statement

Debugging user-reported issues is slow because developers often receive incomplete information.

Common bug reports look like:

* “The page crashed.”
* “I clicked something and it stopped working.”
* “The API failed but I do not know why.”
* “It works on my system but not on the user’s device.”

These reports usually miss the most important debugging details:

* What the user clicked
* Which page they were on
* Which API failed
* What console error happened
* What browser/device was used
* How to reproduce the issue

Rewind.dev solves this by automatically capturing the user session and converting it into a replayable timeline and structured bug report.

---

## Key Features

### Website Connection

Users can connect a website or app inside the Rewind.dev dashboard. Each connected website receives a unique tracking key.

### Tracker SDK

A lightweight JavaScript tracker script captures browser activity and sends session events to the backend.

### Fresh Session Capture

Each test run can create a fresh session, making it easy to prove that new sessions are being captured in real time.

### Event Timeline

Captured events are shown in order, including:

* Page loads
* User clicks
* Route changes
* Console errors
* Network/API failures

### Real Ghost Replay

Ghost Replay visually reconstructs the captured session timeline. Developers can play, pause, reset, and inspect every step.

### AI-Style Bug Report Generation

A captured session can be converted into a structured bug report containing:

* Bug title
* Summary
* Severity
* Steps to reproduce
* Technical evidence
* Suggested fix

### Downloadable Bug Reports

Generated reports can be downloaded as `.txt` files for developers, reviewers, or project evaluators.

### Dashboard Analytics

The dashboard shows real statistics such as:

* Connected websites
* Captured sessions
* Bug reports
* Error sessions
* High severity issues
* Recent sessions
* Recent bug reports

### Demo Flow Page

A dedicated demo guide page explains the complete live demo flow for judges and recruiters.

---

## Screenshots

### Landing Page

![Landing Page](public/screenshots/landing.png)

### Dashboard

![Dashboard](public/screenshots/dashboard.png)

### Connected Websites

![Websites](public/screenshots/websites.png)

### Captured Sessions

![Sessions](public/screenshots/sessions.png)

### Session Detail Timeline

![Session Detail](public/screenshots/session-detail.png)

### Real Ghost Replay

![Ghost Replay](public/screenshots/ghost-replay.png)

### Generated Bug Report

![Bug Report](public/screenshots/bug-report.png)

### Demo Flow Guide

![Demo Flow](public/screenshots/demo-flow.png)

---

## Tech Stack

### Frontend

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* Lucide React Icons

### Backend

* Next.js API Routes
* Node.js Runtime
* MongoDB Atlas
* Mongoose

### Authentication

* Cookie-based authentication
* Protected dashboard routes
* User-specific websites, sessions, and reports

### Deployment

* Vercel
* MongoDB Atlas

---

## System Architecture

```txt
User Website / Tracker Test Page
        |
        | loads rewind-tracker.js
        v
Tracker SDK captures browser events
        |
        | sends events to backend API
        v
Next.js API Routes
        |
        | stores sessions, events, reports
        v
MongoDB Atlas
        |
        v
Dashboard UI
        |
        | shows sessions, replay, reports, analytics
        v
Developer Debugging Workflow
```

---

## Main Product Flow

```txt
1. Create a website in Rewind.dev
2. Copy the tracking key
3. Load the tracker SDK
4. Trigger user actions or a bug scenario
5. A fresh session is created
6. Captured events appear in the session timeline
7. Ghost Replay reconstructs the session
8. Generate an AI-style bug report
9. Download the bug report
```

---

## Important Pages

```txt
/                         Landing page
/signup                   Create account
/login                    Login
/dashboard                Main dashboard
/dashboard/projects       Connected websites
/dashboard/sessions       Captured sessions
/dashboard/reports        Bug reports
/dashboard/replay         Ghost Replay overview
/dashboard/demo           Demo flow guide
/tracker-test             Tracker testing page
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/riddhiravikumar19/rewind-dev.git
cd rewind-dev
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a file named `.env.local` in the project root.

```env
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env.local` to GitHub.

### 4. Run the development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Environment Variables

| Variable      | Required | Description               |
| ------------- | -------- | ------------------------- |
| `MONGODB_URI` | Yes      | MongoDB connection string |

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rewind-dev
```

---

## Deployment

The project is deployed on Vercel.

Deployment steps:

1. Push the project to GitHub.
2. Import the GitHub repository into Vercel.
3. Add `MONGODB_URI` in Vercel Environment Variables.
4. Configure MongoDB Atlas Network Access.
5. Deploy the project.
6. Test signup, login, tracker flow, sessions, replay, and reports.

Live deployment:

```txt
https://rewind-dev.vercel.app/
```

---

## Demo Flow

During a live project demo:

1. Open the deployed website.
2. Sign up or log in.
3. Go to Websites.
4. Create or open a connected website.
5. Copy the tracking key.
6. Open the tracker test page.
7. Paste the tracking key and load the SDK.
8. Run the full bug scenario.
9. Open Sessions.
10. Show the newly captured session.
11. Open the session detail page.
12. Show the event timeline.
13. Click View Ghost Replay.
14. Play the replay.
15. Generate a bug report.
16. Open the report detail page.
17. Download the report as `.txt`.

---

## What Makes This Project Different

Rewind.dev is not a basic CRUD dashboard. It demonstrates a complete debugging workflow:

* Real tracker SDK
* Backend event ingestion
* MongoDB persistence
* Session analytics
* Replay reconstruction
* Bug report generation
* Downloadable developer reports
* Dashboard analytics
* Production-style deployment

This project shows full-stack engineering, system design, debugging workflows, API design, database modeling, authentication, deployment, and product thinking.

---

## Future Improvements

* Real screen recording support
* DOM snapshot replay
* Source map integration
* AI-powered root cause analysis
* Slack/Jira/GitHub issue integration
* Team workspace support
* Email alerts for high severity bugs
* Replay search and filtering
* Session heatmaps
* Production SDK package through npm

---

## Resume Description

Built Rewind.dev, a full-stack debugging and session replay platform that captures real browser events using a custom tracker SDK, stores sessions in MongoDB, reconstructs timelines through Ghost Replay, and generates structured bug reports with reproduction steps, severity, technical evidence, and suggested fixes.

---

## Author

**Priyadharshini R**
B.Tech Computer Science Engineering
SRM Institute of Science and Technology
