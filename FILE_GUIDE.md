# Sahayak AI - Complete File Guide

A comprehensive reference of all files in the Sahayak AI application.

## 📁 Project Structure

```
sahayak-ai/
├── public/
│   ├── index.html              ← HTML entry point (PWA meta + React root)
│   ├── manifest.json           ← PWA manifest (installable app)
│   └── service-worker.js       ← Offline support & caching
│
├── src/
│   ├── App.js                  ← Main component (state machine)
│   ├── index.js                ← React entry point
│   ├── index.css               ← Global styles
│   │
│   ├── components/
│   │   ├── EmergencyGrid.jsx   ← Emergency selection UI
│   │   ├── AgentChat.jsx       ← Interactive Q&A interface
│   │   └── ResultCard.jsx      ← Results & guidance display
│   │
│   ├── data/
│   │   └── protocols.js        ← All medical protocols (7 emergencies)
│   │
│   └── utils/
│       ├── agentLogic.js       ← Decision trees & algorithms
│       └── storage.js          ← LocalStorage utilities
│
├── Configuration Files
│   ├── package.json            ← Dependencies & scripts
│   ├── tailwind.config.js      ← Tailwind CSS configuration
│   ├── postcss.config.js       ← PostCSS plugins
│   └── .gitignore              ← Git ignore rules
│
└── Documentation
    ├── README.md               ← Overview & quick start
    ├── DEPLOYMENT.md           ← Deployment guide
    ├── ARCHITECTURE.md         ← Technical deep dive
    └── FILE_GUIDE.md           ← This file
```

## 📄 Detailed File Reference

### Entry Points

#### `public/index.html` (523 lines)
**Purpose**: HTML entry point for the application
**Key Features**:
- React root element mount point
- Bundler-injected JS/CSS assets
- PWA meta tags and manifest link

**When to edit**:
- Modify PWA settings
- Update meta tags for SEO

---

#### `src/index.js` (20 lines)
**Purpose**: Bootstrap React application
**Imports**: App, React, ReactDOM, styles
**When to edit**: Very rarely - only for React configuration changes

---

### Core Application Component

#### `src/App.js` (275 lines)
**Purpose**: Main application component with state machine
**Key Features**:
- Manages entire application flow
- 4-step state machine: categorySelection → questioning → processing → results
- Orchestrates component coordination
- Handles emergency selection, Q&A, result generation

**Key Functions**:
- `handleSelectEmergency()` - Initiates emergency flow
- `handleAnswer()` - Processes user answers
- `processResults()` - Calculates severity and generates guidance
- `handleBack()` - Navigation within flow
- `handleNewEmergency()` - Resets app state

**When to edit**:
- Add new state management
- Modify flow between components
- Adjust processing delay

---

### User Interface Components

#### `src/components/EmergencyGrid.jsx` (127 lines)
**Purpose**: Displays emergency selection grid
**Features**:
- 7 emergency cards with icons
- Responsive grid layout
- Offline badge
- Information sections
- Medical disclaimer

**Props**:
- `emergencies` - Array of emergency objects
- `onSelectEmergency` - Callback when user selects emergency

**When to edit**:
- Customize card styling
- Modify grid layout
- Update disclaimer text

---

#### `src/components/AgentChat.jsx` (185 lines)
**Purpose**: Interactive Q&A interface
**Features**:
- Adaptive question display
- Multiple input types: boolean, choice, text
- Progress indicator
- Back/Next navigation
- Answer validation

**Props**:
- `protocol` - Current emergency protocol
- `currentQuestion` - Question to display
- `questionHistory` - Array of asked question IDs
- `answers` - Object of user answers
- `onAnswer()` - Callback for answer submission
- `onBack()` - Callback for back navigation
- `onComplete()` - Callback when questions done

**Question Input Types**:
- `boolean` - Yes/No buttons
- `choice` - Multiple choice buttons
- `text` - Text input field

**When to edit**:
- Customize question display
- Modify input styles
- Adjust progress indicator
- Add new input types

---

#### `src/components/ResultCard.jsx` (323 lines)
**Purpose**: Displays emergency response guidance
**Features**:
- Severity badge with color coding
- 3 tabbed sections: Actions, Warnings, Summary
- Copy-to-clipboard for summary
- Medical disclaimer
- New Emergency button

**Props**:
- `protocol` - Current emergency protocol
- `severity` - Calculated severity level
- `immediateActions` - Array of action strings
- `warnings` - Array of warning strings
- `summary` - Generated summary text
- `onNewEmergency()` - Start new emergency
- `onCopySummary()` - Copy summary to clipboard

**Display Modes**:
- **Actions tab**: Numbered step-by-step guidance
- **Warnings tab**: Prominent warning cards
- **Summary tab**: Copyable text summary

**When to edit**:
- Customize action display format
- Modify warning styling
- Change summary layout
- Adjust color coding

---

### Data & Logic

#### `src/data/protocols.js` (850+ lines)
**Purpose**: Medical protocols database for all emergencies
**Structure**: `emergencyProtocols` object with 7 emergencies

**Emergencies**:
1. `burn` - Burn injuries (mild to critical)
2. `accident` - Trauma/fractures/spinal injuries
3. `choking` - Airway obstruction (Heimlich)
4. `electricShock` - Electrocution
5. `heatstroke` - Heat exhaustion/stroke
6. `bleeding` - Severe bleeding/arterial
7. `snakeBite` - Snake venom envenomation

**Each Protocol Contains**:
```javascript
{
  id: string              // Unique ID
  title: string           // Display name
  icon: string            // Emoji icon
  color: string           // Tailwind gradient
  questions: [...]        // Q&A flow
  severityLogic: fn       // Severity calculator
  immediateActions: {}    // Actions by severity
  warnings: [...]         // What NOT to do
  summaryTemplate: str    // Text template
}
```

**Question Structure**:
```javascript
{
  id: string                      // Question ID
  questionText: string            // Display text
  inputType: 'boolean'|'choice'|'text'
  options: [{label, value}]       // For 'choice'
  nextQuestionMapping: fn         // Decision logic
}
```

**Medical Sources**:
- St John Ambulance India
- Ministry of Health & Family Welfare
- WHO guidelines
- Evidence-based emergency medicine

**When to edit**:
- Update medical protocols
- Add new emergency types
- Modify decision trees
- Improve action guidance
- Add new warnings

---

#### `src/utils/agentLogic.js` (200+ lines)
**Purpose**: Agent decision-making algorithms
**Key Functions**:

**Question Flow**:
- `getNextQuestion(protocol, answers, history)` - Adaptive question selection

**Severity Assessment**:
- `assessSeverity(protocol, answers)` - Calculates severity level
- `isEarlyEscalation(answers)` - Detects critical conditions early

**Guidance Generation**:
- `getImmediateActions(protocol, severity)` - Gets actions array
- `getWarnings(protocol)` - Gets warnings array
- `generateSummary(protocol, answers, severity)` - Creates text summary
- `formatActions(actions)` - Formats actions as numbered list

**Helper Functions**:
- `getSeverityColor(severity)` - Returns Tailwind gradient class
- `getSeverityInfo(severity)` - Returns label and icon
- `simulateThinking(duration)` - Async delay for agentic behavior

**When to edit**:
- Modify decision tree logic
- Improve severity detection
- Change summary format
- Adjust processing delay
- Add new assessment criteria

---

#### `src/utils/storage.js` (300+ lines)
**Purpose**: LocalStorage management for offline functionality
**Key Functions**:

**Session Management**:
- `saveSessionLog(type, answers, severity)` - Save completed session
- `getSessionsList()` - Get all past sessions
- `getSession(sessionId)` - Get specific session
- `clearAllSessions()` - Delete all history

**Current Session**:
- `saveCurrentSessionState(type, answers, step)` - Save in-progress session
- `getCurrentSessionState()` - Resume in-progress session
- `clearCurrentSession()` - Clear current session

**User Preferences**:
- `hasAcknowledgedOfflineMode()` - Check if user saw offline badge
- `setOfflineModeAcknowledged()` - Mark offline mode acknowledged

**Analytics**:
- `getAppStats()` - Get usage statistics
- `exportSessionData(sessionId)` - Export session as JSON

**Utilities**:
- `copyToClipboard(text)` - Works offline
- `getStorageStatus()` - Check LocalStorage usage
- `getAllStorageKeys()` - Debug helper

**Storage Keys** (prefix: `sahayak_`):
```
sahayak_session_{id}        // Saved session
sahayak_sessions_list       // Session metadata list
sahayak_current_session     // In-progress session
sahayak_offline_acknowledged // User preferences
```

**When to edit**:
- Modify storage structure
- Change session format
- Add new data types
- Implement sync features
- Add persistence logic

---

### Styles

#### `src/index.css` (250+ lines)
**Purpose**: Global styles and Tailwind directives
**Includes**:
- Tailwind CSS core directives (@tailwind)
- Typography configuration
- Animation definitions
- Custom utilities
- Accessibility features
- Media query utilities
- Print styles

**Key Sections**:
- Root CSS variables
- Typography & fonts
- Smooth scrolling
- Selection colors
- Custom scrollbar
- Focus styles
- Button/input styling
- Animation keyframes
- Responsive breakpoints
- Dark mode support
- Accessibility (prefers-reduced-motion)

**When to edit**:
- Customize color palette
- Modify animations
- Add new utilities
- Adjust typography
- Update responsive breakpoints

---

### Configuration Files

#### `package.json` (55 lines)
**Purpose**: Node.js project configuration
**Contains**:
- Dependencies (react, react-dom, tailwindcss)
- Dev dependencies (react-scripts)
- Build scripts (start, build, test)
- Project metadata
- Browser compatibility

**Scripts**:
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run serve` - Serve build folder

**When to edit**:
- Add dependencies
- Modify build scripts
- Update project metadata

---

#### `tailwind.config.js` (100+ lines)
**Purpose**: Tailwind CSS customization
**Contains**:
- Custom colors
- Extended theme options
- Animation definitions
- Font families
- Shadow definitions
- Custom plugins
- Severity utilities

**When to edit**:
- Add custom colors
- Create new utilities
- Modify spacing scale
- Customize animations

---

#### `postcss.config.js` (8 lines)
**Purpose**: PostCSS configuration for Tailwind
**Plugins**:
- tailwindcss
- autoprefixer

**When to edit**: Rarely - only to add other PostCSS plugins

---

#### `.gitignore` (55 lines)
**Purpose**: Git ignore patterns
**Ignores**:
- Dependencies (node_modules)
- Build output (build, dist)
- Environment files
- IDE/Editor files
- OS files
- Logs and temp files

**When to edit**: Add project-specific ignores

---

### PWA & Offline Support

#### `public/manifest.json` (150+ lines)
**Purpose**: Progressive Web App manifest
**Contains**:
- App metadata (name, description, icons)
- Display mode (standalone)
- Colors (theme, background)
- Shortcuts (quick access)
- File handlers
- Share target
- Permissions

**Enables**:
- Home screen installation
- App icon
- Splash screen
- Status bar color
- Share functionality

**When to edit**:
- Change app name/description
- Add custom icons
- Modify shortcuts
- Change colors

---

#### `public/service-worker.js` (200+ lines)
**Purpose**: Service Worker for offline functionality
**Key Features**:
- Asset caching (install event)
- Cache cleanup (activate event)
- Network-first strategy (fetch event)
- Offline fallback
- Background sync support
- Push notifications support
- Message handling

**Cache Strategy**:
1. Try network
2. Cache on success
3. Fall back to cache if offline
4. Serve offline page if not cached

**When to edit**:
- Modify cache strategy
- Add new cached files
- Change cache version
- Add sync events
- Implement push notifications

---

### Documentation

#### `README.md` (400+ lines)
**Overview**: Main project documentation
**Sections**:
- Feature overview
- Emergency categories
- Quick start (3 options)
- Project structure
- Agent behavior
- Data privacy
- PWA features
- Customization
- Testing
- Deployment
- License & credits

**Audience**: Developers & users

---

#### `DEPLOYMENT.md` (400+ lines)
**Overview**: Complete deployment guide
**Sections**:
- Prerequisites
- Local setup
- 5 deployment options
  - Vercel
  - Netlify
  - GitHub Pages
  - AWS/DigitalOcean
  - Self-hosted
- Configuration & optimization
- Security
- Testing
- Monitoring
- Troubleshooting

**Audience**: DevOps & deployment engineers

---

#### `ARCHITECTURE.md` (500+ lines)
**Overview**: Technical architecture documentation
**Sections**:
- System overview diagrams
- State machine details
- Data structures
- Algorithms (question flow, severity, summary)
- Component architecture
- Performance analysis
- Security architecture
- Offline architecture
- Testing strategy
- Future improvements

**Audience**: Technical team & architects

---

#### `FILE_GUIDE.md` (This file)
**Overview**: Complete file reference
**Purpose**: Quick lookup guide for all files

---

## 🔍 Quick Reference by Task

### "I want to add a new emergency type"
1. Edit: `src/data/protocols.js`
   - Add new protocol object
   - Define questions and decision tree
   - Set severity logic
   - Add actions and warnings

### "I want to modify styling"
1. Edit: `src/index.css`
2. Edit: `tailwind.config.js` (for new utilities)
3. Edit: Individual `.jsx` files (for component classes)

### "I want to fix a severity detection bug"
1. Check: `src/data/protocols.js` (severityLogic)
2. Check: `src/utils/agentLogic.js` (assess logic)
3. Add: Test case in test file

### "I want to customize questions for an emergency"
1. Edit: `src/data/protocols.js`
2. Update: `questions` array
3. Update: `nextQuestionMapping` functions

### "I want to change the offline message"
1. Edit: `src/components/EmergencyGrid.jsx` (badge text)
2. Edit: `src/components/AgentChat.jsx` (offline badge)
3. Edit: `src/components/ResultCard.jsx` (offline badge)

### "I want to deploy to production"
1. Read: `DEPLOYMENT.md`
2. Choose platform (Vercel/Netlify recommended)
3. Follow deployment instructions

### "I want to understand how the app works"
1. Start: `README.md` (overview)
2. Read: `ARCHITECTURE.md` (deep dive)
3. Review: `src/App.js` (state machine)
4. Check: `src/utils/agentLogic.js` (algorithms)

### "I want to add a new feature"
1. Plan: Which files need changes?
2. Check: `ARCHITECTURE.md` for affected systems
3. Review: Related component/utility files
4. Test: Full flow with new feature
5. Update: Documentation

---

## 📊 File Statistics

| Category | Files | Lines | Purpose |
|----------|-------|-------|---------|
| Components | 3 | 635 | UI rendering |
| Data | 1 | 850+ | Medical protocols |
| Utils | 2 | 500+ | Logic & storage |
| Configuration | 4 | 400+ | Build & project setup |
| Entry Points | 2 | 550+ | Bootstrap & styling |
| PWA | 2 | 400+ | Offline support |
| Documentation | 4 | 1500+ | Guides & reference |
| **TOTAL** | **18** | **5000+** | **Complete app** |

---

## 🔐 File Access Patterns

### Read-Only (Don't modify unless you know what you're doing)
- `package.json` - Could break build
- `postcss.config.js` - Tailwind integration
- `tailwind.config.js` - Global theme

### Frequently Modified
- `src/data/protocols.js` - Add emergencies/improve guidance
- `.jsx` files - UI/UX improvements
- `src/utils/agentLogic.js` - Better algorithms

### Rarely Modified
- `public/index.html` - Only for meta tags or PWA settings
- `src/index.js` - Only for React config changes
- `src/index.css` - Usually use tailwind.config.js instead

### Never Modified (Generated/External)
- `node_modules/` - Installed dependencies
- `build/` - Production build output
- `service-worker.js` - Auto-registered

---

## 🎯 Testing File Locations

**Unit Tests** (would go in):
- `src/utils/__tests__/agentLogic.test.js`
- `src/utils/__tests__/storage.test.js`

**Component Tests** (would go in):
- `src/components/__tests__/AgentChat.test.js`
- `src/components/__tests__/EmergencyGrid.test.js`

**Integration Tests** (would go in):
- `src/__tests__/App.test.js`

---

## 📈 File Dependency Graph

```
public/index.html
  └─ src/index.js (bundled by React scripts)
       └─ src/App.js
            ├─ src/components/EmergencyGrid.jsx
            ├─ src/components/AgentChat.jsx
            ├─ src/components/ResultCard.jsx
            ├─ src/data/protocols.js
            ├─ src/utils/agentLogic.js
            └─ src/utils/storage.js

src/index.css
  ├─ Tailwind @import
  └─ Custom styles

public/service-worker.js
  └─ Caches all above files

manifest.json
  └─ Describes app metadata
```

---

## 🚀 Deployment File Checklist

Before deploying, ensure these files are present:

- [ ] `public/index.html` - Entry point
- [ ] `src/App.js` - Main component
- [ ] All components in `src/components/`
- [ ] `src/data/protocols.js` - Medical data
- [ ] All utilities in `src/utils/`
- [ ] `package.json` - Dependencies
- [ ] `public/manifest.json` - PWA manifest
- [ ] `public/service-worker.js` - Offline support
- [ ] `tailwind.config.js` - Styling
- [ ] `.gitignore` - Version control

---

**Need more details?** See individual file sections above or check specific documentation files.

---

*Last updated: 2024*
*Version: 1.0.0*
