/**
 * Sahayak AI - Emergency Protocols Database
 * All medical protocols stored locally in JSON structure
 * Based on St John Ambulance India & Ministry of Health guidelines
 */

export const emergencyProtocols = {
  burn: {
    id: 'burn',
    title: 'Burn',
    icon: '🔥',
    color: 'from-orange-500 to-red-600',
    questions: [
      {
        id: 'burn_q1',
        questionText: 'What percentage of body is burned? (rough estimate)',
        inputType: 'choice',
        options: [
          { label: 'Small area (palm size or smaller)', value: 'small' },
          { label: 'Medium area (hand size to arm size)', value: 'medium' },
          { label: 'Large area (torso or multiple areas)', value: 'large' }
        ],
        nextQuestionMapping: (answer) => 'burn_q2'
      },
      {
        id: 'burn_q2',
        questionText: 'What degree of burn? (appearance)',
        inputType: 'choice',
        options: [
          { label: 'Red, painful, no blisters (1st degree)', value: 'first' },
          { label: 'Red/pink, painful, with blisters (2nd degree)', value: 'second' },
          { label: 'White/charred, may be painless (3rd degree)', value: 'third' }
        ],
        nextQuestionMapping: (answer) => 'burn_q3'
      },
      {
        id: 'burn_q3',
        questionText: 'Is the person conscious and breathing normally?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'burn_q4' : null
      },
      {
        id: 'burn_q4',
        questionText: 'Are face, hands, genitals, or joints affected?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => null
      }
    ],
    severityLogic: (answers) => {
      const area = answers.burn_q1;
      const degree = answers.burn_q2;
      const conscious = answers.burn_q3;
      const critical_area = answers.burn_q4;

      if (!conscious || degree === 'third' || (area === 'large' && degree === 'second')) {
        return 'critical';
      } else if (area === 'large' || (degree === 'second' && critical_area) || degree === 'third') {
        return 'severe';
      } else if (area === 'medium' || (degree === 'second' && !critical_area)) {
        return 'moderate';
      } else {
        return 'mild';
      }
    },
    immediateActions: {
      mild: [
        'Stop the burn: Rinse with cool (not cold) running water for 10-20 minutes.',
        'Remove jewelry, watches, or tight clothing near the burn.',
        'Let it air dry or cover with clean, dry cloth.',
        'Do NOT apply ice, turmeric, butter, oil, or toothpaste.',
        'Over-the-counter pain relief if needed (paracetamol or ibuprofen).',
        'Watch for signs of infection over next few days.'
      ],
      moderate: [
        'Stop the burn: Rinse with cool running water for at least 20 minutes.',
        'Remove tight items from the burned area (rings, bracelets, tight clothing).',
        'Cover with a clean, dry cloth or sterile gauze.',
        'Elevate burned limbs to reduce swelling.',
        'Do NOT apply ice directly, toothpaste, turmeric, or any home remedy.',
        'Do NOT pop blisters.',
        'Seek medical attention within 1-2 hours.',
        'Pain management: Give paracetamol or ibuprofen if conscious.'
      ],
      severe: [
        'CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'Stop the burn: Cool with water if possible without removing clothing stuck to skin.',
        'Remove jewelry and tight items from unburned skin near burn.',
        'Cover with clean, dry cloth. Do NOT use wet cloth for extended time.',
        'Lie person down, elevate legs to prevent shock.',
        'Do NOT apply ice, ointment, butter, or any home remedy.',
        'Do NOT remove stuck clothing.',
        'Keep person warm with blanket (avoid covering burn directly).',
        'If conscious and able to swallow: give small sips of water.',
        'Prepare for possible shock: keep monitoring breathing and consciousness.'
      ],
      critical: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'Check if person is breathing. If not, begin CPR immediately.',
        'If conscious: Lie down, elevate legs to counter shock.',
        'Cool with water only if person is conscious and cooperative.',
        'Do NOT remove stuck clothing.',
        'Do NOT apply anything to burn.',
        'Monitor breathing and pulse continuously.',
        'If person loses consciousness: Place in recovery position (on side).',
        'Prepare family info: location, age, estimated burn size for paramedics.',
        'Stay calm and reassure person until help arrives.'
      ]
    },
    warnings: [
      '⚠️ NEVER apply ice directly on burn—causes further damage.',
      '⚠️ NEVER apply turmeric, butter, oil, toothpaste, or talc—traps heat.',
      '⚠️ NEVER pop blisters—risk of infection.',
      '⚠️ NEVER use vinegar or home remedies.',
      '⚠️ NEVER wrap tightly—restrict circulation.',
      '⚠️ Large burns lead to shock and organ damage—hospital care is essential.'
    ],
    summaryTemplate: `🔥 BURN EMERGENCY
Severity: {{severity}}
Area affected: {{burn_q1}}
Degree: {{burn_q2}}
Conscious: {{burn_q3}}
Critical areas: {{burn_q4}}

Immediate actions taken:
- Cool water applied
- Jewelry/tight items removed
- Covered with clean cloth

⚠️ DO NOT use turmeric, butter, oil, or ice.

🏥 SEEK MEDICAL HELP NOW if moderate/severe.
`
  },

  accident: {
    id: 'accident',
    title: 'Accident (Trauma/Fracture)',
    icon: '🚗',
    color: 'from-blue-500 to-purple-600',
    questions: [
      {
        id: 'acc_q1',
        questionText: 'Is the person conscious?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'acc_q2' : null
      },
      {
        id: 'acc_q2',
        questionText: 'Is there active bleeding?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'acc_q3' : 'acc_q4'
      },
      {
        id: 'acc_q3',
        questionText: 'Is the bleeding heavy and uncontrollable?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => 'acc_q4'
      },
      {
        id: 'acc_q4',
        questionText: 'Is there suspected fracture or severe pain?',
        inputType: 'choice',
        options: [
          { label: 'No pain or mild pain', value: 'none' },
          { label: 'Pain but can move limb', value: 'mild_fracture' },
          { label: 'Severe pain, cannot move, swelling', value: 'severe_fracture' },
          { label: 'Suspected spine/neck injury', value: 'spine' }
        ],
        nextQuestionMapping: (answer) => 'acc_q5'
      },
      {
        id: 'acc_q5',
        questionText: 'Is the person breathing normally?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => null
      }
    ],
    severityLogic: (answers) => {
      const conscious = answers.acc_q1;
      const bleeding = answers.acc_q2;
      const heavy_bleed = answers.acc_q3;
      const fracture = answers.acc_q4;
      const breathing = answers.acc_q5;

      if (!conscious || !breathing || (bleeding && heavy_bleed) || fracture === 'spine') {
        return 'critical';
      } else if (bleeding || fracture === 'severe_fracture') {
        return 'severe';
      } else if (fracture === 'mild_fracture') {
        return 'moderate';
      } else {
        return 'mild';
      }
    },
    immediateActions: {
      mild: [
        'Keep the person calm and sitting or lying down.',
        'Apply ice or cold compress to minor injuries (15-20 min, with cloth in between).',
        'Do NOT move injured area more than necessary.',
        'Pain relief: paracetamol or ibuprofen if conscious.',
        'Monitor for worsening symptoms.',
        'Seek medical evaluation if swelling or pain increases.'
      ],
      moderate: [
        'Call for medical assistance if not already done.',
        'IMMOBILIZE the suspected fracture—do not move the injured limb.',
        'Apply ice wrapped in cloth (15 min on, 15 min off) for swelling.',
        'Elevate the injured limb if possible.',
        'Do NOT try to straighten a deformed limb.',
        'Cover any wounds with clean cloth; apply pressure if bleeding.',
        'Pain relief: paracetamol or ibuprofen if conscious.',
        'Keep person warm and comfortable.',
        'Transport to hospital for X-ray and assessment.'
      ],
      severe: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'Do NOT move the person—risk of spinal injury.',
        'Control severe bleeding: Apply firm, continuous pressure with clean cloth for 10+ minutes.',
        'If bleeding continues: add more cloth on top (do not remove first layer).',
        'Elevate bleeding limb if possible, above heart level.',
        'Immobilize all suspected fractures—use pillows, blankets, or make-shift sling.',
        'Check for consciousness, breathing, and pulse regularly.',
        'Keep person warm with blankets; avoid covering wounds.',
        'If conscious: give water only in sips if no abdominal injury suspected.',
        'Reassure person and keep them calm until paramedics arrive.'
      ],
      critical: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'CHECK BREATHING: If not breathing, start CPR immediately.',
        'If unconscious: Place in recovery position (on side, head tilted).',
        'DO NOT move neck/spine—use rolled cloth to stabilize head.',
        'Control life-threatening bleeding: Apply extreme pressure with cloth.',
        'Monitor pulse and breathing every 1-2 minutes.',
        'Immobilize all limbs to prevent further injury.',
        'Keep warm with blankets. Elevate legs slightly to prevent shock.',
        'Prepare all details for paramedics (location, injuries, vital signs).',
        'Stay on phone with emergency services for instructions.'
      ]
    },
    warnings: [
      '⚠️ NEVER move someone with suspected spinal injury.',
      '⚠️ NEVER straighten a deformed limb.',
      '⚠️ NEVER remove an object embedded in a wound.',
      '⚠️ NEVER apply tourniquet unless limb is detached and bleeding unstoppable.',
      '⚠️ NEVER leave unconscious person on back—risk of choking.',
      '⚠️ Spinal injuries can cause permanent paralysis if moved incorrectly.'
    ],
    summaryTemplate: `🚗 ACCIDENT/TRAUMA EMERGENCY
Severity: {{severity}}
Conscious: {{acc_q1}}
Bleeding: {{acc_q2}}
Heavy bleeding: {{acc_q3}}
Fracture type: {{acc_q4}}
Breathing: {{acc_q5}}

Actions taken:
- Stopped movement
- Controlled bleeding
- Immobilized fracture
- Monitored vital signs

⚠️ DO NOT move person with spinal injury.
⚠️ DO NOT straighten deformed limbs.

🏥 RUSH TO HOSPITAL OR CALL 102/108.
`
  },

  choking: {
    id: 'choking',
    title: 'Choking',
    icon: '🫁',
    color: 'from-red-500 to-pink-600',
    questions: [
      {
        id: 'chk_q1',
        questionText: 'Can the person cough or make any sound?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'chk_q2' : null
      },
      {
        id: 'chk_q2',
        questionText: "What is the person's age?",
        inputType: 'choice',
        options: [
          { label: 'Child (1-12 years)', value: 'child' },
          { label: 'Adult (12+ years)', value: 'adult' },
          { label: 'Infant (under 1 year)', value: 'infant' }
        ],
        nextQuestionMapping: (answer) => 'chk_q3'
      },
      {
        id: 'chk_q3',
        questionText: 'Is the person able to speak or cry?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => null
      }
    ],
    severityLogic: (answers) => {
      const can_cough = answers.chk_q1;
      const can_speak = answers.chk_q3;

      if (!can_cough) {
        return 'critical';
      } else if (can_cough && !can_speak) {
        return 'severe';
      } else {
        return 'moderate';
      }
    },
    immediateActions: {
      moderate: [
        'Encourage the person to KEEP COUGHING—do NOT pat on back.',
        'Ask them to try to cough out the object forcefully.',
        'Encourage them to try to speak or breathe between coughs.',
        'Do NOT give water—may push object deeper.',
        'Do NOT give food or liquids.',
        'Stay with them and monitor closely.',
        'If coughing clears object: seek medical check-up.',
        'If choking persists for more than 2-3 minutes: CALL FOR HELP.'
      ],
      severe: [
        '🚨 Call for help immediately.',
        'Person cannot cough or speak—object is blocking airway.',
        'ADULT (12+): Stand behind person. Make a fist above navel, below ribcage.',
        'Grasp fist with other hand. Press hard into abdomen with quick upward thrusts.',
        'Repeat 5 times rapidly. Check if object comes out. If not, repeat cycle.',
        'CHILD (1-12 years): Use smaller, gentler thrusts.',
        'INFANT (under 1): Use back blows and chest thrusts alternately (5 each).',
        'Continue until object is coughed out or person becomes unconscious.',
        'Do NOT perform these if person is coughing effectively.'
      ],
      critical: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'Person is SILENT—no cough, no breathing sounds, no consciousness.',
        'ADULT: Heimlich Maneuver—stand behind, fist above navel, below ribcage. Press hard, pull up. Repeat.',
        'CHILD: Perform gentler Heimlich thrusts—adjust hand position.',
        'INFANT: 5 back blows between shoulder blades + 5 chest thrusts. Repeat.',
        'If person loses consciousness: Start CPR (chest compressions 100-120/min).',
        'Continue CPR until emergency responders arrive.',
        'Do NOT give up—sometimes object dislodges during CPR.'
      ]
    },
    warnings: [
      '⚠️ NEVER pat on back while person is coughing—may lodge object deeper.',
      '⚠️ NEVER give water, food, or liquids.',
      '⚠️ NEVER perform Heimlich on a conscious, coughing person.',
      '⚠️ NEVER try to remove object with fingers if cannot see it.',
      '⚠️ NEVER delay in calling for help if unsure.',
      '⚠️ Ribs can break during Heimlich—still necessary to save life.'
    ],
    summaryTemplate: `🫁 CHOKING EMERGENCY
Severity: {{severity}}
Can cough: {{chk_q1}}
Age: {{chk_q2}}
Can speak: {{chk_q3}}

Actions taken:
- Encouraged coughing
- Positioned for airway clearance
- Performed relief maneuvers as needed

⚠️ DO NOT pat on back.
⚠️ DO NOT give water or food.

🏥 SEEK MEDICAL HELP IMMEDIATELY.
`
  },

  electricShock: {
    id: 'electricShock',
    title: 'Electric Shock',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-600',
    questions: [
      {
        id: 'elec_q1',
        questionText: 'Is the person still in contact with the electrical source?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => 'elec_q2'
      },
      {
        id: 'elec_q2',
        questionText: 'Is the person conscious?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'elec_q3' : null
      },
      {
        id: 'elec_q3',
        questionText: 'Is there visible burn at contact point?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => 'elec_q4'
      },
      {
        id: 'elec_q4',
        questionText: 'Is the person breathing normally?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => null
      }
    ],
    severityLogic: (answers) => {
      const in_contact = answers.elec_q1;
      const conscious = answers.elec_q2;
      const burn = answers.elec_q3;
      const breathing = answers.elec_q4;

      if (in_contact || !conscious || !breathing) {
        return 'critical';
      } else if (burn) {
        return 'severe';
      } else {
        return 'moderate';
      }
    },
    immediateActions: {
      moderate: [
        'Do NOT touch person if still in contact with electricity.',
        'SWITCH OFF power at main switch/circuit breaker IMMEDIATELY.',
        'If cannot reach switch: use wooden stick, dry rope, or clothing to move person away.',
        'Once safe: examine for burns at entry/exit points.',
        'Treat burns according to burn protocol (cool water 10-20 min).',
        'Cover burn with clean, dry cloth.',
        'Do NOT apply ice or ointment.',
        'Monitor for signs of cardiac arrhythmia (irregular pulse, chest pain).',
        'Seek medical evaluation—internal injuries may not be visible.'
      ],
      severe: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'Do NOT touch person if still in contact with electricity.',
        'TURN OFF power at main switch/circuit breaker IMMEDIATELY.',
        'If switch is inaccessible: use DRY wooden stick, plastic rod, or clothing to move person away.',
        'Once safe: Check consciousness and breathing.',
        'If person is conscious: lay them down, elevate legs slightly.',
        'Cool any burns with water (not ice) for 10-20 minutes.',
        'Cover burns with clean, dry cloth.',
        'Monitor pulse and breathing closely.',
        'Be ready for seizures or cardiac arrest—stay prepared to do CPR.'
      ],
      critical: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'DANGER: Do NOT touch person if still in contact with electricity.',
        'TURN OFF POWER at main switch/circuit breaker or unplug device.',
        'If impossible: use long, dry, non-conductive object (wooden stick, plastic rod) to move person away.',
        'Check for breathing. If NOT breathing: START CPR immediately (100-120 compressions/min).',
        'If unconscious but breathing: Place in recovery position (on side).',
        'Do NOT move unnecessarily—risk of spinal injury from shock.',
        'Cool any visible burns with cool water (not ice).',
        'Cover burns with clean cloth.',
        'Continue CPR and monitoring until paramedics arrive.',
        'Electric shock can cause delayed cardiac arrest—keep observing.'
      ]
    },
    warnings: [
      '⚠️ NEVER touch person while in contact with electricity—you will be shocked too.',
      '⚠️ NEVER use metal objects to move person away from electricity.',
      '⚠️ NEVER apply ointment, turmeric, or home remedies to electrical burns.',
      '⚠️ NEVER ignore "mild" electric shock—internal organs can be damaged.',
      '⚠️ Electric shock can cause cardiac arrest hours later—monitor closely.'
    ],
    summaryTemplate: `⚡ ELECTRIC SHOCK EMERGENCY
Severity: {{severity}}
Still in contact: {{elec_q1}}
Conscious: {{elec_q2}}
Burn present: {{elec_q3}}
Breathing: {{elec_q4}}

Actions taken:
- Turned off power source
- Removed from contact
- Treated burns if present
- Monitored vital signs

⚠️ DO NOT touch person while in contact.
⚠️ DO NOT use metal to move person.
⚠️ Monitor for delayed cardiac arrest.

🏥 SEEK HOSPITAL CARE IMMEDIATELY.
`
  },

  heatstroke: {
    id: 'heatstroke',
    title: 'Heatstroke',
    icon: '🌡️',
    color: 'from-red-600 to-orange-700',
    questions: [
      {
        id: 'heat_q1',
        questionText: 'Is the person conscious and able to respond?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'heat_q2' : null
      },
      {
        id: 'heat_q2',
        questionText: 'Is the skin hot and either DRY or VERY SWEATY?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => 'heat_q3'
      },
      {
        id: 'heat_q3',
        questionText: 'Is the person confused, drowsy, or having difficulty thinking?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => 'heat_q4'
      },
      {
        id: 'heat_q4',
        questionText: 'Approximate body temperature (if known)?',
        inputType: 'choice',
        options: [
          { label: 'Below 40°C', value: 'low' },
          { label: '40-41°C (104-106°F)', value: 'moderate' },
          { label: 'Above 41°C (above 106°F)', value: 'high' },
          { label: 'Unknown', value: 'unknown' }
        ],
        nextQuestionMapping: (answer) => null
      }
    ],
    severityLogic: (answers) => {
      const conscious = answers.heat_q1;
      const hot_skin = answers.heat_q2;
      const confused = answers.heat_q3;
      const temp = answers.heat_q4;

      if (!conscious || confused || temp === 'high') {
        return 'critical';
      } else if (hot_skin && temp === 'moderate') {
        return 'severe';
      } else if (hot_skin) {
        return 'moderate';
      } else {
        return 'mild';
      }
    },
    immediateActions: {
      mild: [
        'Move to a cool, shaded, well-ventilated place immediately.',
        'Lie down with legs elevated slightly.',
        'Drink cool (not ice-cold) water or oral rehydration solution (ORS).',
        'Remove excess clothing.',
        'Apply cool (not cold) water or damp cloth to neck, armpits, groin.',
        'Spray or sponge skin with cool water.',
        'Rest for at least 1-2 hours.',
        'Avoid strenuous activity for the rest of the day.',
        'Monitor for worsening symptoms (confusion, seizure, loss of consciousness).'
      ],
      moderate: [
        '🚨 Call for medical help if symptoms worsen.',
        'MOVE IMMEDIATELY to cool place—air-conditioned room preferred.',
        'Lie down, elevate legs to improve circulation.',
        'Remove all unnecessary clothing.',
        'COOL THE BODY RAPIDLY:',
        '  - Apply ice packs or cold water to neck, armpits, groin, behind ears.',
        '  - Spray body with cool water repeatedly.',
        '  - Fan vigorously to increase evaporative cooling.',
        'If conscious: Sip cool water or ORS gradually (not gulping).',
        'Do NOT give alcohol or caffeine.',
        'Monitor temperature if possible.',
        'Continue cooling for at least 30 minutes or until temperature drops.'
      ],
      severe: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'MOVE TO COOL PLACE—air-conditioned room or shaded area.',
        'Lie down, legs elevated to prevent shock.',
        'Check if person is breathing. If struggling: assist breathing.',
        'AGGRESSIVE COOLING:',
        '  - Immerse in cool (15-18°C) water if available, or sponge entire body.',
        '  - Apply ice packs to neck, groin, armpits—major blood vessel areas.',
        '  - Fan continuously to aid evaporation.',
        '  - Spray repeatedly with cool water.',
        'If conscious and can swallow: give sips of cool water.',
        'Do NOT give ice water if unconscious.',
        'Monitor vital signs and level of consciousness continuously.',
        'If person loses consciousness: place in recovery position.'
      ],
      critical: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'CHECK BREATHING—if not breathing, start CPR immediately.',
        'If unconscious: Place in recovery position (on side, head tilted back).',
        'AGGRESSIVE, IMMEDIATE COOLING IS CRITICAL:',
        '  - Immerse body in cool/cold water if available (cold bath, pool, wet sheets).',
        '  - Apply ice packs or cold water bottles to neck, groin, armpits.',
        '  - Spray with cool water and fan intensely.',
        '  - Cold intravenous fluids if available (paramedics will do this).',
        'Remove clothing.',
        'Monitor breathing, pulse, temperature every 1-2 minutes.',
        'Be prepared for seizures—if occurs, protect from injury.',
        'Continue cooling until emergency services arrive.',
        'Heat stroke at this stage causes organ damage—every minute counts.'
      ]
    },
    warnings: [
      '⚠️ NEVER give ice water to an unconscious person—risk of aspiration.',
      '⚠️ NEVER delay cooling—brain damage begins at 40°C.',
      '⚠️ NEVER give alcohol or caffeine—worsens dehydration.',
      '⚠️ Heatstroke is a MEDICAL EMERGENCY—internal organs shut down.',
      '⚠️ Even after cooling, seek hospital care for monitoring.'
    ],
    summaryTemplate: `🌡️ HEATSTROKE EMERGENCY
Severity: {{severity}}
Conscious: {{heat_q1}}
Hot/sweaty skin: {{heat_q2}}
Confused: {{heat_q3}}
Temperature: {{heat_q4}}

Actions taken:
- Moved to cool place
- Removed excess clothing
- Applied cool water/ice
- Monitored symptoms

⚠️ DO NOT give ice water if unconscious.
⚠️ Brain damage occurs above 40°C.

🏥 SEEK HOSPITAL CARE IMMEDIATELY.
`
  },

  bleeding: {
    id: 'bleeding',
    title: 'Severe Bleeding',
    icon: '🩸',
    color: 'from-red-600 to-red-800',
    questions: [
      {
        id: 'bleed_q1',
        questionText: 'Is the bleeding continuous or spurting?',
        inputType: 'choice',
        options: [
          { label: 'Slow oozing', value: 'oozing' },
          { label: 'Continuous flow', value: 'continuous' },
          { label: 'Spurting with pulse', value: 'spurting' }
        ],
        nextQuestionMapping: (answer) => 'bleed_q2'
      },
      {
        id: 'bleed_q2',
        questionText: 'Where is the bleeding?',
        inputType: 'choice',
        options: [
          { label: 'Limb (arm/leg)', value: 'limb' },
          { label: 'Head/face', value: 'head' },
          { label: 'Torso/abdomen', value: 'torso' },
          { label: 'Internal (mouth, nose, ears)', value: 'internal' }
        ],
        nextQuestionMapping: (answer) => 'bleed_q3'
      },
      {
        id: 'bleed_q3',
        questionText: 'Is the person conscious?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'bleed_q4' : null
      },
      {
        id: 'bleed_q4',
        questionText: "Is the person's skin pale and clammy?",
        inputType: 'boolean',
        nextQuestionMapping: (answer) => null
      }
    ],
    severityLogic: (answers) => {
      const type = answers.bleed_q1;
      const location = answers.bleed_q2;
      const conscious = answers.bleed_q3;
      const shock_signs = answers.bleed_q4;

      if (type === 'spurting' || !conscious || shock_signs || location === 'torso') {
        return 'critical';
      } else if (type === 'continuous' || location === 'head' || location === 'internal') {
        return 'severe';
      } else if (type === 'oozing' && location === 'limb') {
        return 'moderate';
      } else {
        return 'mild';
      }
    },
    immediateActions: {
      mild: [
        'Apply firm, direct pressure on wound with clean cloth.',
        'Do NOT remove cloth—add more cloth if blood soaks through.',
        'Press for 5-10 minutes continuously.',
        'Once bleeding slows: wash wound gently with clean water.',
        'Apply antibiotic ointment if available.',
        'Cover with sterile bandage.',
        'Elevate limb above heart level if possible.',
        'Watch for signs of infection over next few days.',
        "Seek medical attention if bleeding doesn't stop or wound is deep."
      ],
      moderate: [
        '🚨 Call for medical help if bleeding does not slow within 10 minutes.',
        'Apply firm, CONTINUOUS pressure with clean cloth.',
        'Do NOT remove cloth—keep pressure on. Add more cloth if needed.',
        'Press for at least 10-15 minutes without lifting cloth.',
        'Elevate bleeding limb above heart level.',
        'If bleeding continues: apply pressure to artery above wound.',
        'Once bleeding slows: Wrap firmly with bandage or cloth (not tourniquet).',
        'Immobilize limb to prevent re-bleeding.',
        'Ice wrapped in cloth can help reduce bleeding.',
        'Seek medical attention for wound assessment and closure if needed.'
      ],
      severe: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'APPLY EXTREME PRESSURE: Use clean cloth, press hard directly on wound.',
        'Do NOT remove cloth if blood soaks—add more cloth on top.',
        'Maintain pressure for 10-20 minutes minimum (do NOT peek under cloth).',
        'If bleeding from limb is uncontrollable: Apply pressure above wound (between wound and heart) on artery.',
        'Elevate bleeding limb high above heart level.',
        'Lie person down, elevate legs to prevent shock.',
        'Keep person warm with blanket.',
        'If bleeding continues for more than 20 minutes: Consider tourniquet (above wound, below shoulder/hip).',
        'Monitor consciousness and breathing—be ready for CPR.'
      ],
      critical: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'SPURTING BLOOD—arterial bleed is life-threatening.',
        'APPLY TOURNIQUET if available and limb bleeding:',
        '  - Place 2-3 inches above wound, between wound and heart.',
        '  - Tighten until bleeding STOPS completely.',
        '  - Note exact time tourniquet was applied.',
        '  - Do NOT remove tourniquet until in hospital.',
        'If tourniquet not available: Apply extreme pressure with cloth for 10-20 minutes.',
        'For torso/head bleeding: Apply steady, firm pressure without removing cloth.',
        'Lie person down, elevate legs to counter shock.',
        'Monitor breathing and consciousness every minute.',
        'If person loses consciousness: place in recovery position.',
        'Continue pressure and monitoring until ambulance arrives.',
        'Prepare info: when bleeding started, tourniquet time, vital signs.'
      ]
    },
    warnings: [
      '⚠️ NEVER remove cloth from wound—will restart bleeding.',
      '⚠️ NEVER apply tourniquet unless arterial bleeding or limb detached.',
      '⚠️ If tourniquet applied, mark time on skin—prolonged use causes tissue damage.',
      '⚠️ NEVER try to close or stitch deep wounds—hospital closure is needed.',
      '⚠️ Shock from blood loss kills—elevate legs and keep warm.',
      '⚠️ Internal bleeding (no visible blood) is also life-threatening.'
    ],
    summaryTemplate: `🩸 SEVERE BLEEDING EMERGENCY
Severity: {{severity}}
Bleeding type: {{bleed_q1}}
Location: {{bleed_q2}}
Conscious: {{bleed_q3}}
Shock signs: {{bleed_q4}}

Actions taken:
- Applied direct pressure
- Elevated limb
- Monitored vital signs
- Applied tourniquet if needed

⚠️ DO NOT remove cloth.
⚠️ Note tourniquet application time.

🏥 RUSH TO HOSPITAL IMMEDIATELY.
`
  },

  snakeBite: {
    id: 'snakeBite',
    title: 'Snake Bite',
    icon: '🐍',
    color: 'from-green-600 to-emerald-700',
    questions: [
      {
        id: 'snake_q1',
        questionText: 'Is the person conscious?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'snake_q2' : null
      },
      {
        id: 'snake_q2',
        questionText: 'Do you see fang marks?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => answer ? 'snake_q3' : 'snake_q4'
      },
      {
        id: 'snake_q3',
        questionText: 'Is there rapid swelling spreading up the limb?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => 'snake_q5'
      },
      {
        id: 'snake_q4',
        questionText: 'Time since bite (if known)?',
        inputType: 'choice',
        options: [
          { label: 'Less than 15 minutes', value: 'recent' },
          { label: '15 minutes to 1 hour', value: 'moderate_time' },
          { label: 'More than 1 hour', value: 'old' },
          { label: 'Unknown', value: 'unknown' }
        ],
        nextQuestionMapping: (answer) => 'snake_q5'
      },
      {
        id: 'snake_q5',
        questionText: 'Is there bleeding from bite, mouth, or nose?',
        inputType: 'boolean',
        nextQuestionMapping: (answer) => null
      }
    ],
    severityLogic: (answers) => {
      const conscious = answers.snake_q1;
      const fang_marks = answers.snake_q2;
      const rapid_swell = answers.snake_q3;
      const time_elapsed = answers.snake_q4;
      const hemorrhage = answers.snake_q5;

      if (!conscious || (fang_marks && rapid_swell) || hemorrhage) {
        return 'critical';
      } else if (fang_marks || time_elapsed === 'recent') {
        return 'severe';
      } else if (time_elapsed === 'moderate_time') {
        return 'moderate';
      } else {
        return 'mild';
      }
    },
    immediateActions: {
      mild: [
        'Even if no visible marks: assume poisonous bite and seek hospital care.',
        'Immobilize the bitten limb—keep it still and below heart level.',
        'Remove jewelry, watches, bracelets near bite area.',
        'Do NOT panic—panic increases heart rate and venom spread.',
        'Do NOT apply ice, tourniquet, or tight bandages.',
        'Do NOT try to catch or kill snake.',
        'Do NOT cut wound or try to suck venom.',
        'Rest completely for at least 30 minutes.',
        'Seek medical attention within 2-3 hours for anti-venom evaluation.'
      ],
      moderate: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) OR GO TO HOSPITAL IMMEDIATELY.',
        'Confirmed poisonous bite—anti-venom may be needed.',
        'Keep bitten limb IMMOBILIZED and BELOW HEART LEVEL.',
        'Remove all jewelry, watches, tight items near bite.',
        'Do NOT massage, cut, or apply anything to wound.',
        'Do NOT apply ice, heat, or tourniquets.',
        'Do NOT try to extract venom.',
        'Lie down and rest—minimize movement.',
        'Keep track of swelling progression (mark swelling edge with pen, note time).',
        'Monitor for systemic symptoms: difficulty breathing, blurred vision, facial swelling.',
        'Transport carefully—minimize limb movement.',
        'If available: bring information about snake species (or photo).'
      ],
      severe: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'Rapid systemic envenomation—anti-venom is critical.',
        'KEEP BITTEN LIMB IMMOBILIZED AND BELOW HEART LEVEL.',
        'Immobilize entire limb using splint, sling, or pillow.',
        'Mark swelling edge with pen, note time, monitor progression every 15 min.',
        'Remove all jewelry and tight items immediately.',
        'Do NOT apply ice, tourniquet, compression, or any home treatment.',
        'Do NOT cut, suck, or massage wound.',
        'If bitten on limb: consider gentle compression bandage (not tourniquet)—ask paramedics.',
        'Lie down, elevate legs if no torso bite.',
        'Monitor for difficulty breathing, facial swelling, or bleeding.',
        'If breathing difficulty starts: keep airway clear, be ready for CPR.',
        'Transport urgently to hospital with anti-venom facility.'
      ],
      critical: [
        '🚨 CALL EMERGENCY SERVICES (102 / 108) IMMEDIATELY.',
        'SEVERE ENVENOMATION—immediate hospitalization and anti-venom required.',
        'Check if person is breathing. If struggling, keep airway clear.',
        'If unconscious: Place in recovery position (on side).',
        'Keep bitten limb completely IMMOBILIZED AND BELOW HEART LEVEL.',
        'Do NOT apply tourniquet, ice, compression, or anything to wound.',
        'Do NOT cut or try to extract venom.',
        'Monitor for signs of shock: pale skin, rapid/weak pulse, confusion.',
        'If shock signs present: Lie down, elevate legs (if no neck injury).',
        'Monitor breathing every minute—be ready for CPR.',
        'If breathing stops: Start CPR immediately.',
        'Keep person warm with blankets.',
        'Note exact time of bite and progression of symptoms for paramedics.',
        'Transport to hospital with anti-venom capability—time is critical.'
      ]
    },
    warnings: [
      '⚠️ NEVER apply tourniquet—restricts circulation, increases tissue death.',
      '⚠️ NEVER cut or try to suck venom—spreads venom deeper.',
      '⚠️ NEVER use ice—causes frostbite and worsens venom damage.',
      '⚠️ NEVER apply turmeric, herbs, charms, or unproven remedies.',
      '⚠️ NEVER try to catch or kill snake—risk of another bite.',
      '⚠️ Some snake bites have delayed symptoms—watch for 24 hours.',
      '⚠️ Coagulopathy (bleeding disorder) can develop hours later.'
    ],
    summaryTemplate: `🐍 SNAKE BITE EMERGENCY
Severity: {{severity}}
Conscious: {{snake_q1}}
Fang marks visible: {{snake_q2}}
Rapid swelling: {{snake_q3}}
Time since bite: {{snake_q4}}
Bleeding signs: {{snake_q5}}

Actions taken:
- Immobilized bitten limb
- Removed constricting items
- Monitored swelling
- Prepared for hospital transport

⚠️ DO NOT apply tourniquet.
⚠️ DO NOT cut or try to suck venom.
⚠️ Swelling can continue for 24+ hours.

🏥 RUSH TO HOSPITAL WITH ANTI-VENOM FACILITY.
`
  }
};
