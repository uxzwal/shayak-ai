/**
 * Sahayak AI - Agent Logic
 * Handles dynamic question selection, severity detection, and summary generation
 */

/**
 * Get the next question based on current answers
 * Implements adaptive question flow
 */
export function getNextQuestion(protocol, answers, questionHistory) {
  if (!protocol || !protocol.questions) return null;

  // Find last asked question
  const lastQuestionId = questionHistory[questionHistory.length - 1];
  
  // If no questions asked yet, start with first
  if (!lastQuestionId) {
    return protocol.questions[0];
  }

  // Find current question object
  const currentQuestion = protocol.questions.find(q => q.id === lastQuestionId);
  if (!currentQuestion) return null;

  // Use nextQuestionMapping to determine next question
  if (currentQuestion.nextQuestionMapping) {
    const answer = answers[lastQuestionId];
    const nextQuestionId = currentQuestion.nextQuestionMapping(answer);

    if (!nextQuestionId) {
      // No more questions, ready for severity assessment
      return null;
    }

    // Find and return next question
    return protocol.questions.find(q => q.id === nextQuestionId);
  }

  return null;
}

/**
 * Assess severity based on collected answers
 * Uses decision tree logic from protocol
 */
export function assessSeverity(protocol, answers) {
  if (!protocol || !protocol.severityLogic) return 'moderate';

  try {
    const severity = protocol.severityLogic(answers);
    const validSeverities = ['mild', 'moderate', 'severe', 'critical'];
    return validSeverities.includes(severity) ? severity : 'moderate';
  } catch (error) {
    console.error('Error assessing severity:', error);
    return 'moderate';
  }
}

/**
 * Get immediate actions for a given severity level
 */
export function getImmediateActions(protocol, severity) {
  if (!protocol || !protocol.immediateActions) return [];
  return protocol.immediateActions[severity] || protocol.immediateActions['moderate'] || [];
}

/**
 * Get warnings for the emergency
 */
export function getWarnings(protocol) {
  if (!protocol || !protocol.warnings) return [];
  return protocol.warnings;
}

/**
 * Generate summary text that can be shared
 */
export function generateSummary(protocol, answers, severity) {
  if (!protocol || !protocol.summaryTemplate) return '';

  let summary = protocol.summaryTemplate;

  // Replace {{severity}} with actual severity
  summary = summary.replace(/{{severity}}/g, severity.toUpperCase());

  // Replace {{key}} with answer values
  Object.keys(answers).forEach(key => {
    const answer = answers[key];
    let displayValue = answer;

    // Format boolean answers
    if (answer === true) displayValue = 'Yes';
    if (answer === false) displayValue = 'No';

    // Replace placeholders
    const placeholder = `{{${key}}}`;
    summary = summary.replace(new RegExp(placeholder, 'g'), displayValue);
  });

  if (!summary.includes('IMPORTANT:')) {
    summary = `${summary.trim()}\n\nIMPORTANT: SEEK PROFESSIONAL MEDICAL HELP IMMEDIATELY.`;
  }

  return summary;
}

/**
 * Format actions as a readable, numbered list
 */
export function formatActions(actions) {
  if (!Array.isArray(actions)) return '';

  return actions
    .map((action, index) => `${index + 1}. ${action}`)
    .join('\n\n');
}

/**
 * Get color gradient class based on severity
 */
export function getSeverityColor(severity) {
  const colors = {
    mild: 'from-green-500 to-blue-500',
    moderate: 'from-yellow-500 to-orange-500',
    severe: 'from-orange-500 to-red-500',
    critical: 'from-red-600 to-red-800'
  };
  return colors[severity] || colors.moderate;
}

/**
 * Get severity label and icon
 */
export function getSeverityInfo(severity) {
  const info = {
    mild: { label: 'Mild', icon: '🟢', color: 'bg-green-100 text-green-800' },
    moderate: { label: 'Moderate', icon: '🟡', color: 'bg-yellow-100 text-yellow-800' },
    severe: { label: 'Severe', icon: '🟠', color: 'bg-orange-100 text-orange-800' },
    critical: { label: 'CRITICAL', icon: '🔴', color: 'bg-red-100 text-red-800' }
  };
  return info[severity] || info.moderate;
}

/**
 * Simulate agent "thinking" with a delay
 * Used for agentic behavior effect
 */
export async function simulateThinking(duration = 1500) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Check if session answers indicate critical situation
 * For early escalation
 */
export function isEarlyEscalation(answers) {
  // Check for critical indicators across different emergencies
  const criticalAnswers = [
    answers.acc_q1 === false,      // Not conscious
    answers.acc_q5 === false,      // Not breathing
    answers.chk_q1 === false,      // Cannot cough
    answers.elec_q1 === true,      // Still in contact
    answers.elec_q2 === false,     // Not conscious from shock
    answers.heat_q1 === false,     // Not conscious from heat
    answers.snake_q1 === false,    // Not conscious from bite
  ];

  return criticalAnswers.some(answer => answer === true);
}
