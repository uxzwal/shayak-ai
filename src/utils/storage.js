/**
 * Sahayak AI - Storage Utilities
 * Handles offline LocalStorage for session history and user preferences
 */

const STORAGE_PREFIX = 'sahayak_';

const SESSION_LOG_KEY = `${STORAGE_PREFIX}session_log`;

/**
 * Save current session Q&A log to LocalStorage
 */
export function saveSessionLog(logEntries) {
  try {
    localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(logEntries));
    return true;
  } catch (error) {
    console.error('Error saving session log:', error);
    return false;
  }
}

/**
 * Get current session Q&A log from LocalStorage
 */
export function getSessionLog() {
  try {
    const data = localStorage.getItem(SESSION_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading session log:', error);
    return [];
  }
}

/**
 * Clear current session log
 */
export function clearSessionLog() {
  try {
    localStorage.removeItem(SESSION_LOG_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing session log:', error);
    return false;
  }
}

/**
 * Save completed session summary to LocalStorage
 */
export function saveCompletedSession(emergencyType, answers, severity) {
  const sessionLog = {
    timestamp: new Date().toISOString(),
    emergencyType,
    answers,
    severity,
    id: Date.now()
  };

  try {
    const key = `${STORAGE_PREFIX}session_${sessionLog.id}`;
    localStorage.setItem(key, JSON.stringify(sessionLog));

    // Also add to sessions list for easy retrieval
    const sessionsList = getSessionsList();
    sessionsList.push({
      id: sessionLog.id,
      emergencyType,
      timestamp: sessionLog.timestamp,
      severity
    });
    localStorage.setItem(`${STORAGE_PREFIX}sessions_list`, JSON.stringify(sessionsList));

    return sessionLog;
  } catch (error) {
    console.error('Error saving session:', error);
    return null;
  }
}

/**
 * Get all saved sessions from LocalStorage
 */
export function getSessionsList() {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}sessions_list`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sessions list:', error);
    return [];
  }
}

/**
 * Get a specific session by ID
 */
export function getSession(sessionId) {
  try {
    const key = `${STORAGE_PREFIX}session_${sessionId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Clear all session history
 */
export function clearAllSessions() {
  try {
    // Get all keys
    const keys = Object.keys(localStorage);
    
    // Remove all sahayak sessions
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing sessions:', error);
    return false;
  }
}

/**
 * Clear current session (for new emergency)
 */
export function clearCurrentSession() {
  try {
    const key = `${STORAGE_PREFIX}current_session`;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing current session:', error);
    return false;
  }
}

/**
 * Save current in-progress session state
 */
export function saveCurrentSessionState(emergencyType, answers, currentStep) {
  try {
    const state = {
      emergencyType,
      answers,
      currentStep,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`${STORAGE_PREFIX}current_session`, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error('Error saving current session state:', error);
    return false;
  }
}

/**
 * Get current in-progress session state
 */
export function getCurrentSessionState() {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}current_session`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current session state:', error);
    return null;
  }
}

/**
 * Check if offline status has been acknowledged
 */
export function hasAcknowledgedOfflineMode() {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}offline_acknowledged`) === 'true';
  } catch (error) {
    return false;
  }
}

/**
 * Mark offline mode as acknowledged
 */
export function setOfflineModeAcknowledged() {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}offline_acknowledged`, 'true');
    return true;
  } catch (error) {
    console.error('Error setting offline acknowledgment:', error);
    return false;
  }
}

/**
 * Get app statistics
 */
export function getAppStats() {
  try {
    const sessionsList = getSessionsList();
    const emergencyTypes = {};
    const severityCount = {
      mild: 0,
      moderate: 0,
      severe: 0,
      critical: 0
    };

    sessionsList.forEach(session => {
      emergencyTypes[session.emergencyType] = (emergencyTypes[session.emergencyType] || 0) + 1;
      severityCount[session.severity] = (severityCount[session.severity] || 0) + 1;
    });

    return {
      totalSessions: sessionsList.length,
      emergencyTypes,
      severityCount,
      firstUse: sessionsList.length > 0 ? sessionsList[0].timestamp : null,
      lastUse: sessionsList.length > 0 ? sessionsList[sessionsList.length - 1].timestamp : null
    };
  } catch (error) {
    console.error('Error getting app stats:', error);
    return {
      totalSessions: 0,
      emergencyTypes: {},
      severityCount: { mild: 0, moderate: 0, severe: 0, critical: 0 },
      firstUse: null,
      lastUse: null
    };
  }
}

/**
 * Export session data as JSON for sharing/backup
 */
export function exportSessionData(sessionId) {
  const session = getSession(sessionId);
  if (!session) return null;

  return {
    ...session,
    exportedAt: new Date().toISOString(),
    appVersion: 'Sahayak AI v1.0'
  };
}

/**
 * Copy text to clipboard (works offline)
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Get storage status and available space
 */
export function getStorageStatus() {
  try {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { available: true, message: 'Storage available' };
    }

    navigator.storage.estimate().then(estimate => {
      const percentUsed = (estimate.usage / estimate.quota) * 100;
      return {
        available: percentUsed < 90,
        usage: estimate.usage,
        quota: estimate.quota,
        percentUsed
      };
    });
  } catch (error) {
    return { available: true, message: 'Storage available' };
  }
}

/**
 * Debug: Get all storage keys (for development)
 */
export function getAllStorageKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_PREFIX)) {
      keys.push(key);
    }
  }
  return keys;
}
