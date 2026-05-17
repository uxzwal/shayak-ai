# Sahayak AI — Offline Emergency Response Agent for India

**An intelligent, offline-first emergency response agent that provides immediate first aid guidance for common medical emergencies. Works completely without internet.**

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Status: Production Ready](https://img.shields.io/badge/Status-Production--Ready-brightgreen)
![Platform: Web + PWA](https://img.shields.io/badge/Platform-Web%2BPWA-blue)

## 🚑 Overview

Sahayak AI is a **progressive web app (PWA)** that acts as an intelligent emergency response agent. It guides users through medical emergencies with:

- **Adaptive Questioning**: The agent asks context-specific follow-up questions based on your responses
- **Severity Detection**: Automatic assessment (Mild → Moderate → Severe → Critical)
- **Immediate Actions**: Step-by-step first aid guidance in plain language, culturally adapted for India
- **Warning Prevention**: Prominent warnings about dangerous myths and common mistakes
- **Shareable Summary**: Generate a text summary to share with paramedics

### ✨ Key Features

✅ **100% Offline** — Works without internet. All medical data stored locally.
✅ **No Backend Required** — Single-page app, no server or database needed
✅ **Agentic AI** — Reasoning, adaptive planning, memory of session history
✅ **Medical Accuracy** — Based on St. John Ambulance India, WHO guidelines
✅ **Mobile-First** — Responsive design, works on phones and tablets
✅ **PWA Support** — Install as app, works offline, native feel
✅ **Fast & Reliable** — Loads instantly, no loading states during emergencies

## 🎯 Emergency Categories

The app provides guidance for these emergencies:

1. **🔥 Burn** — Minor, moderate, severe, and critical burns
2. **🚗 Accident (Trauma/Fracture)** — Injuries, fractures, spinal injuries, bleeding
3. **🫁 Choking** — Airway obstruction, Heimlich maneuver
4. **⚡ Electric Shock** — Electrocution, cardiac effects
5. **🌡️ Heatstroke** — Heat exhaustion and critical heat stroke
6. **🩸 Severe Bleeding** — Arterial bleeding, tourniquet guidance
7. **🐍 Snake Bite** — Venom, swelling, systemic effects

## 📋 Quick Start

### Option 1: Using Create React App (Recommended for Development)

```bash
# Create a new React app
npx create-react-app sahayak-ai
cd sahayak-ai

# Copy the app files into the src directory
cp -r src/* (all the component and utility files)

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Add Tailwind directives to src/index.css
# (See index.css in the output)

# Start development server
npm start
```

### Option 2: Direct HTML/JS (Simpler for Deployment)

```bash
# Copy all files to your web server directory
cp -r ./* /var/www/sahayak-ai/

# Serve with any HTTP server
# Python 3
python -m http.server 8000

# Node.js (http-server)
npm install -g http-server
http-server
```

Then open: `http://localhost:8000`

### Option 3: GitHub Pages / Netlify

```bash
# Build the project
npm run build

# Deploy the 'build' folder to:
# - GitHub Pages: Push to gh-pages branch
# - Netlify: Drag and drop the build folder
```

## 🏗️ Project Structure

```
sahayak-ai/
├── public/
│   ├── index.html              # HTML entry point
│   ├── manifest.json           # PWA manifest
│   └── service-worker.js       # Offline support
├── src/
│   ├── App.js                  # Main component (state machine)
│   ├── index.js                # React entry point
│   ├── index.css               # Global styles + Tailwind
│   ├── components/
│   │   ├── EmergencyGrid.jsx   # Emergency selection grid
│   │   ├── AgentChat.jsx       # Q&A interaction
│   │   └── ResultCard.jsx      # Results & guidance
│   ├── data/
│   │   └── protocols.js        # Medical protocols database
│   ├── utils/
│   │   ├── agentLogic.js       # Decision trees & severity
│   │   └── storage.js          # LocalStorage utilities
│   ├── package.json            # Dependencies
│   └── README.md               # This file
```

## 🧠 Agent Behavior & Architecture

### State Machine

The app flows through 4 main states:

```
categorySelection → questioning → processing → results
       ↑                            ↓
       └────── new emergency ──────┘
```

1. **categorySelection**: User selects emergency type from grid
2. **questioning**: Agent asks adaptive questions, collects answers
3. **processing**: (1.5s delay) Agent "thinks" and analyzes
4. **results**: Display severity, actions, warnings, summary

### Question Flow

Each emergency has its own decision tree:

```javascript
// Example: Snake Bite
Q1: "Is the person conscious?"
├─ Yes → Q2: "Do you see fang marks?"
│  ├─ Yes → Q3: "Is swelling spreading rapidly?"
│  └─ No  → Q4: "Time since bite?"
└─ No  → (Skip to critical assessment)
```

### Severity Detection

Uses `severityLogic()` function to assess:

```javascript
Mild       ← Minor symptoms, no risk
Moderate   ← Localized injury, needs monitoring
Severe     ← Significant injury, seek hospital
Critical   ← Life-threatening, call 102/108 NOW
```

### LocalStorage Structure

```
localStorage keys with 'sahayak_' prefix:
- sahayak_session_${id}         // Saved session Q&A
- sahayak_sessions_list         // Metadata of all sessions
- sahayak_current_session       // In-progress session state
- sahayak_offline_acknowledged  // User has seen offline badge
```

## 🔒 Data Privacy & Offline

✅ **Zero Data Transmission** — No API calls, no backend
✅ **Local Storage Only** — Data never leaves your device
✅ **No Authentication** — No login, no tracking, no analytics
✅ **Works Offline** — Service Worker caches all assets
✅ **User Control** — Clear session data anytime in app

## 📱 PWA Features

Install on home screen:

- **iOS**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Menu → Install App
- **Desktop**: Chrome → Install button (top-right)

Once installed:
- App icon on home screen
- No address bar
- Works offline
- Push notifications support (future)

## 🎨 Styling & Customization

Uses **Tailwind CSS** for styling. To customize:

1. Edit `tailwind.config.js` (if using Create React App)
2. Modify color palette in `src/index.css`
3. Update component classes in `.jsx` files

Key colors:
- **Green (#10b981)**: Mild, success states
- **Yellow (#f59e0b)**: Moderate, warnings
- **Orange (#f97316)**: Severe, urgent
- **Red (#ef4444)**: Critical, danger

## 📖 Medical Protocol Format

All medical data is stored in `protocols.js`:

```javascript
{
  id: 'snakeBite',
  title: 'Snake Bite',
  icon: '🐍',
  color: 'from-green-600 to-emerald-700',
  questions: [ /* Q&A structure */ ],
  severityLogic: (answers) => { /* decision tree */ },
  immediateActions: { /* mild, moderate, severe, critical */ },
  warnings: [ /* what NOT to do */ ],
  summaryTemplate: `/* text template with {{placeholders}} */`
}
```

### Adding a New Emergency

1. Add protocol object to `protocols.js`
2. Define questions with adaptive flow
3. Implement `severityLogic` function
4. Add immediate actions for each severity
5. List warnings (dangerous myths)
6. Create summary template

## 🧪 Testing

### Manual Testing Flows

#### Snake Bite (Critical)
- Select: Snake Bite
- Q1: Conscious? → Yes
- Q2: Fang marks? → Yes
- Q3: Swelling? → Yes
- Expected: CRITICAL severity, CPR instructions

#### Burn (Severe)
- Select: Burn
- Q1: Area? → Large
- Q2: Degree? → Second (blisters)
- Q3: Conscious? → Yes
- Q4: Critical areas? → Yes
- Expected: SEVERE severity, cool water guidance

#### Choking (Critical)
- Select: Choking
- Q1: Can cough? → No
- Expected: CRITICAL, Heimlich instructions

### Browser DevTools

Check LocalStorage in DevTools:

```javascript
// View all sessions
Object.keys(localStorage)
  .filter(k => k.startsWith('sahayak_'))
  .forEach(k => console.log(k, localStorage.getItem(k)))
```

## 🚀 Deployment

### Vercel (Easiest)

```bash
npm install -g vercel
vercel
# Follow prompts
```

### Netlify

```bash
# Build locally
npm run build

# Drag and drop 'build' folder to Netlify
# Or use CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Self-Hosted

```bash
# Build
npm run build

# Copy to web server
scp -r build/* user@server:/var/www/sahayak-ai/

# Ensure service-worker.js is served with correct MIME type
```

## 📝 License

MIT License — See LICENSE file for details

## 🤝 Contributing

Contributions welcome! To add features or improve medical protocols:

1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit pull request

## ⚠️ Medical Disclaimer

**This app provides first aid guidance only. It is NOT a substitute for professional medical care.**

- Always call emergency services (102/108 in India) for serious injuries
- Use this app to supplement, not replace, professional medical advice
- When in doubt, seek immediate medical help

## 📧 Support

For issues, suggestions, or questions:
- Open an issue on GitHub
- Check medical accuracy with experts before deployment
- Test thoroughly on multiple devices

## 🎯 Future Features

- [ ] Video demonstrations of techniques
- [ ] Multi-language support
- [ ] Emergency location sharing
- [ ] Medical history tracking
- [ ] Offline maps for hospitals
- [ ] Voice input for hands-free use
- [ ] Integration with emergency services
- [ ] Offline video call with medical experts

## 🏆 Credits

Medical guidance based on:
- **St John Ambulance India** — First aid standards
- **Ministry of Health & Family Welfare, India** — Official guidelines
- **WHO** — World Health Organization recommendations
- **Emergency Medicine** — Evidence-based practices

---

**Sahayak AI** — *Your Offline Emergency Response Agent*

*"When internet fails, we're here to help."*
