<div align="center">

# 🤱 Mom2Be
### Karnataka's First AI-Powered Pregnancy Companion

*"Amma Jothe, Prathi Hejje" — With Mother, Every Step*

[![Angular](https://img.shields.io/badge/Frontend-Angular-red?style=for-the-badge&logo=angular)](https://angular.io/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Google ADK](https://img.shields.io/badge/Agents-Google%20ADK-34A853?style=for-the-badge&logo=google)](https://cloud.google.com/)
[![Cloud Run](https://img.shields.io/badge/Deploy-Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/run)

**Gen AI Academy — APAC Hackathon 2026 | Multi-Agent Productivity Assistant**

[🌐 Live App](https://mom2be-frontend-244972601130.asia-south1.run.app) • [📡 Backend API](https://mom2be-244972601130.asia-south1.run.app) • [📘 Swagger Docs](https://mom2be-244972601130.asia-south1.run.app/docs)

</div>

---

## 💜 The Problem

Every year **12–15 lakh women** become pregnant in Karnataka. Behind each pregnancy is a mother who is:

- 😰 **Scared & confused** — especially first-time mothers with no guidance at midnight
- 💊 **Forgetting medicines** — Iron, Folic Acid, Calcium needed every single day
- 📅 **Missing appointments** — busy schedule, no reminder system, no support
- 🏡 **Far from hospitals** — especially in rural Karnataka villages
- 🗣️ **Language barrier** — cannot understand English medical reports or instructions
- 💰 **Unaware of benefits** — JSY, PMMVY, JSSK schemes worth thousands go unclaimed
- 🌙 **Alone at midnight** — when symptoms scare her and there is no one to ask

> *"Missed medicines. Missed injections. Missed scans. Missed schemes. And sometimes — missed lives."*

---

## 💡 Introducing Mom2Be

Mom2Be is **Karnataka's first AI-powered pregnancy companion** — a warm, friendly, multilingual conversational assistant that holds a mother's hand from the day she confirms her pregnancy until her baby is born — and beyond.

It is not just an app. It is like having a caring elder sister who is also a doctor — available **24 hours, 7 days, completely free**, speaking in her language, understanding her fears, celebrating her milestones, and protecting her life.

> *"We do not just track her pregnancy. We preserve her story."*

**Available in 4 Languages:**

| 🇮🇳 ಕನ್ನಡ Kannada | 🇮🇳 हिंदी Hindi | 🇮🇳 اردو Urdu | 🌐 English |
|------------------|----------------|--------------|-----------|
| Rural Karnataka | North Karnataka & migrants | Muslim community — Bidar, Kalaburagi | Urban Bangalore |

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| 🌐 Frontend App | https://mom2be-frontend-244972601130.asia-south1.run.app |
| 📡 Backend API | https://mom2be-244972601130.asia-south1.run.app |
| 📘 Swagger UI | https://mom2be-244972601130.asia-south1.run.app/docs |

---

## ✨ Features

### 🏥 Health Tracking
- 💊 **Daily Medicine Reminders** — Iron, Folic Acid, Calcium via WhatsApp in her language
- 💉 **TT Injection Reminders** — Td1, Td2, TT Booster schedule with hospital info
- 🏥 **ANC Visit Recording** — Weight, BP, hemoglobin, scan results, heartbeat BPM
- 🧪 **Lab Report Analysis** — Upload reports; AI reads and alerts on abnormal values
- 🚨 **Danger Sign Alerts** — Detects high BP, swelling, bleeding → directs to 108/104

### 🤖 AI-Powered
- 🤱 **24/7 Pregnancy Chat** — Conversational AI in Kannada, Hindi, Urdu, and English
- 👶 **Weekly Baby Updates** — Baby size and development in her language every week
- 💰 **Scheme Alerts** — JSY, PMMVY, JSSK, Bhagyalakshmi auto-tracking and reminders
- 👩‍⚕️ **Asha Worker Briefing** — Auto-brief sent to Asha worker 24 hrs before every home visit

### 📸 Memory & Journey
- 🗓️ **Monthly Belly Gallery** — Auto-dated photo timeline from Month 1 to 9
- 💑 **Couple Photo Album** — A 9-month love story, one photo per month
- 👶 **Baby Name Journey** — Weekly name tracking with husband reactions and Amma Circle votes
- 📖 **Pregnancy Memory Book** — All photos + assignments + letters auto-compiled into a PDF

### 😊 Joy & Emotional Support
- 🌅 **Daily Morning Message** — Baby size update, encouragement, and a smile — every day
- 📝 **Weekly Mini Assignments** — Letters to baby, gratitude lists, couple date nights
- 😄 **Smile Agent** — Funny pregnancy jokes and cute baby facts sent randomly
- 🙏 **Week 36–40 Countdown** — Daily prayers and community blessings as delivery approaches

### 👥 Amma Circle — Community
- 💬 **Trimester-Based Chat** — Anonymous, safe chat with mothers in the same stage
- 🗺️ **Nearby Moms Map** — See other Mom2Be users in your taluk
- 🗳️ **Baby Name Voting** — Let the community vote — *"Husband cannot argue with 47 votes!"*
- 🎉 **Celebration Wall** — Godh Bharai videos and couple photos shared with permission
- 🎊 **Birth Announcement** — Community celebrates together when baby arrives

---

## 🤖 11 Specialized AI Agents

Mom2Be uses **11 AI agents** working together, coordinated by a primary Orchestrator Agent.

```
                        ┌─────────────────────┐
                        │  #1 Orchestrator    │
                        │       Agent         │
                        └──────────┬──────────┘
           ┌──────────┬────────────┼────────────┬──────────┐
           ▼          ▼            ▼            ▼          ▼
      #2 Register  #3 ANC    #4 Medicine   #5 Inject  #6 Lab
         Agent     Visit        Agent       Agent    Report
                   Agent                             Agent
           ▼          ▼            ▼            ▼          ▼
      #7 Scheme   #8 Alert   #9 Baby Care  #10 Asha   #11 Joy
         Agent     Agent        Agent      Worker      Agent
                                           Agent
                      
```

| # | Agent | Role |
|---|-------|------|
| 1 | 🧠 **Orchestrator** | Brain — understands needs & delegates to the right sub-agent |
| 2 | 📝 **Registration** | Collects name, LMP, blood group, EDD, contacts, language preference |
| 3 | 🏥 **ANC Visit** | Records weight, BP, hemoglobin, scan results, placenta info, heartbeat |
| 4 | 💊 **Medicine** | Tracks Iron, Folic Acid, Calcium — daily reminders + confirmation |
| 5 | 💉 **Injection** | Tracks Td1, Td2, TT Booster — upcoming date reminders with hospital info |
| 6 | 🧪 **Lab Report** | Stores HIV, HBsAg, Blood Sugar, Thyroid — alerts on abnormal values |
| 7 | 💰 **Scheme** | Tracks JSY, PMMVY, JSSK, Bhagyalakshmi — reminds mother to apply & claim |
| 8 | 🚨 **Alert** | Detects danger signs (high BP, swelling, bleeding) → 108/104 helpline |
| 9 | 👶 **Baby Care** | Post-delivery immunization schedule, breastfeeding, growth tracking |
| 10 | 👩‍⚕️ **Asha Worker** | Auto-briefs Asha worker 24 hrs before every scheduled home visit |
| 11 | 😊 **Joy** | Daily motivation, funny quotes, weekly mini assignments, baby facts |
---

## 🗂️ Project Structure

```
mom2be/
├── backend/                        # FastAPI + Python
│   ├── agents/                     # 11 AI Agent definitions
│   │   ├── orchestrator.py
│   │   ├── registration_agent.py
│   │   ├── anc_visit_agent.py
│   │   ├── medicine_agent.py
│   │   ├── injection_agent.py
│   │   ├── lab_report_agent.py
│   │   ├── scheme_agent.py
│   │   ├── alert_agent.py
│   │   ├── baby_care_agent.py
│   │   ├── asha_worker_agent.py
│   │   ├── joy_agent.py
│   │   
│   │   
│   ├── utils/                      # Shared utilities (helpers, formatters)
│   ├── main.py                     # FastAPI app entry point & all routes
│   ├── scheduler.py                # APScheduler — medicine & injection reminders
│   └── requirements.txt
│
└── frontend/                       # Angular App
    ├── src/
    │   ├── app/                    # Components, services, modules
    │   └── assets/                 # Images, icons, translations
    └── environments/
        ├── environment.ts          # Dev config
        └── environment.prod.ts     # Production config
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular |
| **Backend** | FastAPI (Python) |
| **AI Model** | Google Gemini 2.5 Flash |
| **Multi-Agent Framework** | Google ADK (Agent Development Kit) |
| **Database** | Firebase Firestore + AlloyDB |
| **WhatsApp Notifications** | Twilio Sandbox |
| **Deployment** | Google Cloud Run (`asia-south1`) |
| **Reminder Scheduler** | APScheduler |
| **MCP Tools** | Calendar integration, WhatsApp alerts ,Gmail |

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/register` | `POST` | Register a new mother — profile, LMP, contacts, language |
| `/chat` | `POST` | AI pregnancy chat — 24/7 multilingual support |
| `/symptom-check` | `POST` | Check symptoms — detects danger signs, alerts helpline |
| `/schemes` | `POST` | Government scheme eligibility — JSY, PMMVY, JSSK |
| `/medicine-reminder` | `POST` | Trigger medicine reminder via WhatsApp |
| `/injection-reminder` | `POST` | Trigger injection reminder with hospital info |
| `/anganwadi-reminder` | `POST` | Trigger Anganwadi visit reminder |
| `/upload-lab-report` | `POST` | Upload & AI-analyze lab report (PDF / image) |
| `/calendar/{id}` | `GET` | Fetch full pregnancy calendar for a mother |
| `/history/{id}` | `GET` | Fetch chat history for a mother |

> 📘 Full interactive docs: **`https://mom2be-244972601130.asia-south1.run.app/docs`**

---

## ⚙️ Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Angular CLI — `npm install -g @angular/cli`

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mom2be.git
cd mom2be
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # Fill in your credentials (see below)
uvicorn main:app --reload
```

- API running at: `http://localhost:8000`
- Swagger UI at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

- App running at: `http://localhost:4200`

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
# Google AI
GEMINI_API_KEY=your_gemini_api_key

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccount.json

# AlloyDB (production)
ALLOYDB_CONNECTION_STRING=your_alloydb_connection_string

# UPI / Payments
UPI_API_KEY=your_upi_api_key

# App Config
APP_ENV=development
SECRET_KEY=your_secret_key
```

---

## 🚀 Deployment

Both services are deployed on **Google Cloud Run** in the `asia-south1` region.

### Deploy Backend

```bash
cd backend
gcloud run deploy mom2be \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

### Deploy Frontend

```bash
cd frontend
ng build --configuration production
gcloud run deploy mom2be-frontend \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

---

## 👥 Team

| Name | Role |
|------|------|
| **Mudasir Pasha** | Backend Developer |
| **Voni Purujit** | Frontend Developer |

---

## 🏆 Hackathon

**Gen AI Academy — APAC Hackathon 2026**
*Category: Multi-Agent Productivity Assistant*

---

## 📄 License

This project was built for the Gen AI Academy APAC Hackathon 2026.
All rights reserved by the Mom2Be team.

---

<div align="center">

### *"Prathi Taayi Anmola. Prathi Maguve Anmola."*
#### *Every Mother is Precious. Every Baby is Precious.*

**11 Agents · 4 Languages · ₹1,100 Rewards · Community · Memory Album · Baby Names**

💜 *Apps remind you to take medicine. **Mom2Be understands you.*** 💜

*Amma Jothe, Prathi Hejje — With Mother, Every Step* 🌸

</div>
