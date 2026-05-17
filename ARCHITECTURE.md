# Sahayak AI — Technical Architecture

Detailed technical documentation of Sahayak AI's design, data structures, and algorithms.

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                  User Interface                         │
│  (React Components + Tailwind CSS)                      │
│                                                         │
│  ┌──────────┐  ┌────────────┐  ┌────────────┐        │
│  │Emergency │  │Agent Chat  │  │Result Card │        │
│  │Grid      │  │            │  │            │        │
│  └──────────┘  └────────────┘  └────────────┘        │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                    App State Machine                    │
│  (React useState/useReducer)                            │
│                                                         │
│  currentStep: categorySelection|questioning|            │
│              processing|results                        │
│                                                         │
│  Data: selectedProtocol, answers, severity             │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Agent Logic   │  │Protocols DB  │  │LocalStorage  │
│              │  │              │  │              │
│• Question    │  │• Emergency   │  │• Session     │
│  selection   │  │  metadata    │  │  history     │
│• Severity    │  │• Questions   │  │• User prefs  │
│  detection   │  │• Actions     │  │• App state   │
│• Summary     │  │• Warnings    │  │              │
│  generation  │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                ┌──────────▼──────────┐
                │  Service Worker    │
                │  (Offline Support) │
                │                    │
                │ • Cache assets     │
                │ • Network fallback │
                │ • Background sync  │
                └────────────────────┘
```

## State Machine Diagram

```
START
  │
  ▼
┌─────────────────────────┐
│  categorySelection       │
│  (Emergency Grid)       │
│                         │
│ User selects emergency  │
│ → Set selectedProtocol  │
│ → Load first question   │
└────────────┬────────────┘
             │ onSelectEmergency
             ▼
┌─────────────────────────────┐
│  questioning                │
│  (Agent Chat)              │
│                            │
│ User answers questions      │
│ → Store in answers{}        │
│ → Get next question         │
│ → OR go to processing       │
└────────────┬────────────────┘
             │ handleAnswer
             ├─ If next question exists:
             │   └─ Update currentQuestion
             │      Return to questioning loop
             │
             └─ If no more questions:
                 ▼
┌─────────────────────────────┐
│  processing                 │
│  (1.5s delay)              │
│                            │
│ Simulate AI thinking        │
│ → assessSeverity()          │
│ → getImmediateActions()     │
│ → getWarnings()             │
│ → generateSummary()         │
│ → saveSessionLog()          │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  results                    │
│  (Result Card)             │
│                            │
│ Display:                    │
│ • Severity badge            │
│ • Immediate actions         │
│ • Warnings                  │
│ • Shareable summary         │
└────────────┬────────────────┘
             │ onNewEmergency
             ├─ OR handleBack → categorySelection
             │
             └─────────────────────┐
                                  │
                                  ▼
                            START (loop)
```

## Data Structures

### Protocol Object

```javascript
{
  id: 'snakeBite',                    // Unique identifier
  title: 'Snake Bite',                // Display name
  icon: '🐍',                         // Emoji icon
  color: 'from-green-600 to-emerald-700',  // Tailwind gradient
  
  questions: [
    {
      id: 'snake_q1',                 // Question ID
      questionText: 'Is the person conscious?',
      inputType: 'boolean',           // 'choice' | 'boolean' | 'text'
      options: [                      // For 'choice' type
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ],
      nextQuestionMapping: (answer) => {  // Decision logic
        return answer ? 'snake_q2' : null; // Next Q ID or null
      }
    },
    // ... more questions
  ],
  
  severityLogic: (answers) => {       // Decision tree function
    // Takes collected answers
    // Returns: 'mild' | 'moderate' | 'severe' | 'critical'
  },
  
  immediateActions: {                 // Actions by severity
    mild: ['Action 1', 'Action 2'],
    moderate: ['Action 1', 'Action 2'],
    severe: ['Action 1', 'Action 2'],
    critical: ['Action 1', 'Action 2']
  },
  
  warnings: [                         // What NOT to do
    '⚠️ NEVER apply tourniquet',
    '⚠️ NEVER cut wound'
  ],
  
  summaryTemplate: `
    🐍 SNAKE BITE EMERGENCY
    Severity: {{severity}}
    ...
  `
}
```

### App State

```javascript
// Current application state
{
  currentStep: 'questioning',  // State in machine
  
  selectedProtocol: {          // Current emergency
    id: 'snakeBite',
    title: 'Snake Bite',
    // ... full protocol object
  },
  
  questionHistory: [           // Questions asked so far
    'snake_q1',
    'snake_q2',
    'snake_q3'
  ],
  
  answers: {                   // User answers
    snake_q1: true,
    snake_q2: true,
    snake_q3: true
  },
  
  currentQuestion: {           // Currently displayed Q
    id: 'snake_q4',
    questionText: 'Is there bleeding...',
    // ... full question object
  },
  
  severity: 'critical',        // Calculated severity
  immediateActions: [],        // Actions for severity
  warnings: [],                // Warnings to display
  summary: ''                  // Generated summary text
}
```

### LocalStorage Schema

```javascript
// Sessions list (metadata)
sahayak_sessions_list = [
  {
    id: 1715342500000,
    emergencyType: 'snakeBite',
    timestamp: '2024-05-10T12:35:00Z',
    severity: 'critical'
  },
  // ... more sessions
]

// Individual session
sahayak_session_1715342500000 = {
  timestamp: '2024-05-10T12:35:00Z',
  emergencyType: 'snakeBite',
  answers: {
    snake_q1: true,
    snake_q2: true,
    snake_q3: true,
    snake_q4: false
  },
  severity: 'critical',
  id: 1715342500000
}

// Current in-progress session
sahayak_current_session = {
  emergencyType: 'burn',
  answers: { burn_q1: 'small' },
  currentStep: 'questioning',
  savedAt: '2024-05-10T13:00:00Z'
}

// App preferences
sahayak_offline_acknowledged = 'true'
```

## Algorithm: Question Flow

### Adaptive Question Selection

```javascript
function getNextQuestion(protocol, answers, questionHistory) {
  // Get last asked question
  const lastQuestionId = questionHistory[questionHistory.length - 1];
  const currentQuestion = protocol.questions.find(q => q.id === lastQuestionId);
  
  // Use question's nextQuestionMapping to determine next
  if (currentQuestion.nextQuestionMapping) {
    const answer = answers[lastQuestionId];
    const nextQuestionId = currentQuestion.nextQuestionMapping(answer);
    
    if (!nextQuestionId) {
      // No more questions - ready for assessment
      return null;
    }
    
    // Find and return next question
    return protocol.questions.find(q => q.id === nextQuestionId);
  }
  
  return null;
}
```

**Example: Snake Bite Flow**

```
User answers: conscious=true
↓
nextQuestionMapping(true) → returns 'snake_q2'
↓
User answers: fang_marks=true
↓
nextQuestionMapping(true) → returns 'snake_q3'
↓
User answers: rapid_swelling=true
↓
nextQuestionMapping(true) → returns 'snake_q5'
↓
User answers: bleeding=false
↓
nextQuestionMapping(false) → returns null (NO MORE QUESTIONS)
↓
Proceed to severity assessment
```

## Algorithm: Severity Detection

### Decision Tree Example (Snake Bite)

```javascript
function severityLogic(answers) {
  const conscious = answers.snake_q1;
  const fang_marks = answers.snake_q2;
  const rapid_swell = answers.snake_q3;
  const time_elapsed = answers.snake_q4;
  const hemorrhage = answers.snake_q5;

  // Check for CRITICAL conditions
  if (!conscious || (fang_marks && rapid_swell) || hemorrhage) {
    return 'critical';
  }
  
  // Check for SEVERE conditions
  else if (fang_marks || time_elapsed === 'recent') {
    return 'severe';
  }
  
  // Check for MODERATE conditions
  else if (time_elapsed === 'moderate_time') {
    return 'moderate';
  }
  
  // Default to MILD
  else {
    return 'mild';
  }
}
```

Decision tree structure:
```
Critical ←─ Loss of consciousness OR
            Rapid swelling AND fang marks OR
            Hemorrhage

Severe  ←─  Confirmed fang marks OR
            Recent bite (< 15 min)

Moderate ←─ Bite 15 min - 1 hour ago

Mild    ←─  Bite > 1 hour ago
```

## Algorithm: Summary Generation

### Template-based generation

```javascript
function generateSummary(protocol, answers, severity) {
  let summary = protocol.summaryTemplate;
  
  // Replace {{severity}} placeholder
  summary = summary.replace(/{{severity}}/g, severity.toUpperCase());
  
  // Replace answer placeholders {{key}}
  Object.keys(answers).forEach(key => {
    const answer = answers[key];
    let displayValue = answer;
    
    // Format boolean answers
    if (answer === true) displayValue = 'Yes';
    if (answer === false) displayValue = 'No';
    
    // Replace {{snake_q1}} with actual answer
    const placeholder = `{{${key}}}`;
    summary = summary.replace(new RegExp(placeholder, 'g'), displayValue);
  });
  
  return summary;
}
```

Example:
```
Template:
"Severity: {{severity}}
Conscious: {{snake_q1}}
Fang marks: {{snake_q2}}"

Answers:
{ snake_q1: true, snake_q2: true }

Result:
"Severity: CRITICAL
Conscious: Yes
Fang marks: Yes"
```

## Component Architecture

### EmergencyGrid.jsx

```
┌─────────────────────────────┐
│    Emergency Selection      │
├─────────────────────────────┤
│  ┌──────────────────────┐   │
│  │   Offline Badge      │   │
│  │   🟢 Offline Ready   │   │
│  └──────────────────────┘   │
│                             │
│  Grid of 7 emergency cards: │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │ 🔥   │ │ 🚗   │ │ 🫁   ││
│  │ Burn │ │Accid │ │Choke ││
│  └──────┘ └──────┘ └──────┘│
│  ... more cards ...         │
│                             │
│  onClick → onSelectEmergency│
└─────────────────────────────┘
```

### AgentChat.jsx

```
┌──────────────────────────────────┐
│    Interactive Q&A               │
├──────────────────────────────────┤
│ Progress: Question 2 of 4         │
│ ████████░░░░░░░░░░░░░░░░ 50%    │
│                                  │
│ "Do you see fang marks?"         │
│                                  │
│ ┌─────────────────────────────┐  │
│ │ ○ Yes  (clickable)          │  │
│ ├─────────────────────────────┤  │
│ │ ○ No   (clickable)          │  │
│ └─────────────────────────────┘  │
│                                  │
│ [← Back]  [Next →]               │
└──────────────────────────────────┘
```

### ResultCard.jsx

```
┌──────────────────────────────┐
│    Emergency Response Plan   │
├──────────────────────────────┤
│  🐍 Snake Bite               │
│  🔴 CRITICAL                │
│                              │
│  [🚑 Actions] [⚠️ Warnings] │
│  [📋 Summary]                │
│                              │
│  Tab 1: Immediate Actions    │
│  1. Keep person still        │
│  2. Immobilize limb          │
│  ...                         │
│                              │
│  [Copy Summary]              │
│  [🔄 New Emergency]          │
└──────────────────────────────┘
```

## Performance Considerations

### Time Complexity

```
Question selection: O(n) where n = num of questions
  • Linear search through questions to find ID

Severity detection: O(1)
  • Simple conditional checks

Summary generation: O(m) where m = num of placeholders
  • Linear string replacements

LocalStorage access: O(1)
  • Direct key lookup
```

### Space Complexity

```
Protocol data: ~50KB (all 7 emergencies)
Session history: O(n) where n = past sessions
  • Each session ~1-2KB
  • 100 sessions ≈ 200KB max

Browser LocalStorage: 5-10MB available
  • Typical usage: <1MB
```

### Optimization Strategies

1. **Question skipping**: Early escalation skips less relevant questions
2. **Caching**: Protocols loaded once at app start
3. **Lazy rendering**: Only current question visible
4. **LocalStorage batching**: Save session at end, not after each question

## Security Architecture

### Data Protection

```
┌─────────────────────────────────────┐
│  User's Browser (Secure)            │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  LocalStorage                │   │
│  │  (User's device only)        │   │
│  │  - Session history           │   │
│  │  - Preferences               │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  Memory (RAM)                │   │
│  │  (Cleared on page refresh)   │   │
│  │  - Current answers           │   │
│  │  - Active session            │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
        │
        │ NO NETWORK CALLS
        │
        X (Nothing leaves device)
```

### CSP (Content Security Policy)

```
default-src 'self'
script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com
style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com
img-src 'self' data:
object-src 'none'
frame-ancestors 'none'
```

## Offline Architecture

### Service Worker Strategy

```
Request
  │
  ├─ Network available?
  │  ├─ Yes → Try fetch
  │  │        ├─ Success → Return + Cache
  │  │        └─ Fail → Try cache
  │  │
  │  └─ No → Use cache
  │
  ├─ Cache hit?
  │  ├─ Yes → Return cached
  │  └─ No → Offline page
  │
Response
```

### Cache Invalidation

```javascript
// Versioned cache name
CACHE_NAME = 'sahayak-ai-v1'

// On new version (v2):
// Old v1 cache cleared
// New v2 cache populated

// Immutable resources (hashed names)
Cache-Control: max-age=31536000, immutable

// HTML (service worker handles updates)
Cache-Control: max-age=3600
```

## Testing Strategy

### Unit Tests (agentLogic.js)

```javascript
// Example test cases:

test('getNextQuestion follows decision tree', () => {
  const answers = { snake_q1: true };
  const next = getNextQuestion(protocol, answers, ['snake_q1']);
  expect(next.id).toBe('snake_q2');
});

test('severityLogic detects critical', () => {
  const answers = { 
    snake_q1: false,  // unconscious
    snake_q2: true,
    snake_q3: true
  };
  expect(assessSeverity(protocol, answers)).toBe('critical');
});
```

### Integration Tests (Component flow)

```javascript
// Test complete emergency flow
test('Full snake bite flow', () => {
  // 1. Render emergency grid
  // 2. Click snake bite
  // 3. Answer all questions
  // 4. Verify results displayed
  // 5. Verify severity is critical
  // 6. Verify actions shown
});
```

### Manual Testing Checklist

- [ ] All 7 emergencies selectable
- [ ] Questions adapt based on answers
- [ ] Severity correctly detected (all levels)
- [ ] Actions display for each severity
- [ ] Warnings prominently shown
- [ ] Summary can be copied
- [ ] LocalStorage saves session
- [ ] Back button works
- [ ] New Emergency resets state
- [ ] Works offline (disconnect WiFi)
- [ ] Mobile responsive
- [ ] Accessibility: keyboard nav, screen reader

## Future Improvements

1. **Multi-language support**: i18n framework
2. **Video demonstrations**: Embedded video for techniques
3. **Voice input**: Hands-free answering
4. **Geolocation**: Find nearest hospital
5. **Emergency contacts**: Quick call to 102
6. **Sync across devices**: Cloud backup (optional)
7. **Machine learning**: Better severity prediction
8. **Augmented Reality**: AR for CPR guidance

---

**Questions?** See README.md or open an issue.
