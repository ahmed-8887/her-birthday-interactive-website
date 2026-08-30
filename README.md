# Her Birthday — An Interactive Birthday Experience ✦

An interactive, cinematic birthday website crafted with React, Framer Motion, and Tailwind CSS, backed by an Express and Nodemailer service for multimedia message delivery.

---

## 🌟 Overview & Experience Flow

The project is structured into sequential interactive chapters:

1. **`/` (Intro & Heart Supernova)**: Opening dark starry universe with a pulsing heart, breathing glow, and radial supernova particle burst when entering.
2. **`/stars` (Constellation Journey)**: Interactive star field where connecting 7 constellation stars in order traces a luminous heart shape.
3. **`/gift` (Secret Gift Box)**: 3D interactive gift box that opens on tap with lid elevation, particle bursts, and sequential surprise messages.
4. **`/memories` (Polaroid Scrapbook)**: Scattered Polaroid photo scrapbook with tape overlays on desktop, vertical timeline on mobile, and interactive photo lightbox.
5. **`/messages` (Things I Want You to Know)**: 6 personal messages revealed one at a time with unique styling, progress indicators, and keyboard navigation.
6. **`/birthday` (Make a Wish & Cake Reveal)**: Realistic multi-layer candle flame blowout interaction, expanding ambient light, 2-tier CSS birthday cake, celebration confetti, and heart rain.
7. **`/universe` (Our Little Universe)**: Constellation star map with 7 interactive stars orbiting a central glowing heart, glass memory modals, dynamic SVG energy lines, completion climax, and replay control.
8. **`/message` (Leave a Message 💌)**: Multimedia message center supporting written notes and voice audio recordings with live timer, playback preview, and automated email delivery.

---

## 🛠️ Technologies Used

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4** + Custom Radial Glow Utilities
- **Framer Motion** (orchestrated spring animations, SVG path animations, layout transitions)
- **Lucide React** (feather icons)
- **HTML5 MediaRecorder API** (voice note recording)
- **React Router v7**

### Backend
- **Node.js** (v18+) & **Express**
- **Nodemailer** (Gmail SMTP integration with attachment support)
- **CORS** & In-memory IP Rate Limiting
- **Dotenv** (secure server environment variables)

---

## 🚀 Getting Started & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Clone Repository
```bash
git clone https://github.com/your-username/her-birthday.git
cd her-birthday
```

### 3. Backend Setup
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend/` directory by copying `.env.example`:
```bash
cp .env.example .env
```

Edit `backend/.env` with your desired configuration:
```env
PORT=5000
MESSAGE_RECEIVER_EMAIL=your-email@example.com

# Optional Gmail SMTP setup for real inbox delivery:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-gmail@example.com
SMTP_PASS=your-16-character-gmail-app-password
```

> **Note on Gmail App Passwords:**
> To generate an App Password: Go to your **Google Account** ➔ **Security** ➔ **2-Step Verification** ➔ **App Passwords** ➔ Generate a password for "Mail".

#### Start Backend Server
```bash
npm start
```
*Backend runs on `http://localhost:5000`.*

---

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` with automated proxy to `/api`.*

---

## 💌 Testing Message & Email Functionality

1. Open [http://localhost:3000/message](http://localhost:3000/message).
2. Choose either **Write** or **Voice Note**:
   - **Write**: Type your message and click **`SEND MY MESSAGE 💌`**.
   - **Voice Note**: Click **`Start Recording`**, record audio, and click **`SEND MY VOICE NOTE 🎙️`**.
3. Upon submission:
   - The message / audio file is safely saved locally in `backend/messages/`.
   - If SMTP credentials are provided, Nodemailer delivers the email with attachments directly to `MESSAGE_RECEIVER_EMAIL`.
   - The frontend transitions to the confirmation state.

---

## 🔒 Security & Privacy Notice

> [!WARNING]
> **CRITICAL SECURITY RULE:**
> Never commit `.env` or real credentials to GitHub.
> 
> - `.env` files are ignored via `.gitignore`.
> - All SMTP credentials exist solely on the server side in `backend/.env`.
> - Frontend JavaScript code never receives or exposes server secrets.
> - Only push `.env.example` with sanitized placeholder values.

---

## 📄 License
Created for personal celebrations and educational showcase. Customize and enjoy!
