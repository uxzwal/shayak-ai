/**
 * Sahayak AI - Main Application Component
 * State machine for emergency response flow
 *
 * Demo Pitch:
 * "Internet often fails during emergencies. Sahayak AI works fully offline and acts like an intelligent emergency response agent for India. It reasons through situations, adapts guidance, and helps users take immediate action."
 *
 * Demo Flow:
 * 1. User selects "Snake Bite"
 * 2. Agent asks: "Is the person conscious?" (Yes)
 * 3. Agent asks: "Do you see fang marks?" (Yes)
 * 4. Agent asks: "Is swelling spreading rapidly?" (Yes)
 * 5. Agent detects: CRITICAL
 * 6. Shows actions: Keep still, immobilize, remove jewelry, no tourniquet, rush to hospital
 * 7. Shows warnings: Don't cut, don't suck venom, don't apply ice
 * 8. Generates summary user can copy and share with paramedics
 */

import React, { useReducer } from 'react';
import { EmergencyGrid } from './components/EmergencyGrid';
import { AgentChat } from './components/AgentChat';
import { ResultCard } from './components/ResultCard';
import { emergencyProtocols } from './data/protocols';
import {
  getNextQuestion,
  assessSeverity,
  getImmediateActions,
  getWarnings,
  generateSummary,
  simulateThinking
} from './utils/agentLogic';
import {
  saveSessionLog,
  getSessionLog,
  clearSessionLog,
  saveCompletedSession,
  clearCurrentSession
} from './utils/storage';

const initialState = {
  currentStep: 'categorySelection',
  selectedProtocol: null,
  questionHistory: [],
  answers: {},
  currentQuestion: null,
  severity: null,
  immediateActions: [],
  warnings: [],
  summary: '',
  sessionLog: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'START_EMERGENCY':
      return {
        ...initialState,
        currentStep: 'questioning',
        selectedProtocol: action.protocol,
        currentQuestion: action.currentQuestion,
        questionHistory: action.questionHistory,
        sessionLog: action.sessionLog
      };
    case 'UPDATE_QUESTION':
      return {
        ...state,
        answers: action.answers,
        questionHistory: action.questionHistory,
        currentQuestion: action.currentQuestion
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        currentStep: 'processing',
        answers: action.answers
      };
    case 'SET_RESULTS':
      return {
        ...state,
        currentStep: 'results',
        severity: action.severity,
        immediateActions: action.immediateActions,
        warnings: action.warnings,
        summary: action.summary
      };
    case 'UPDATE_SESSION_LOG':
      return {
        ...state,
        sessionLog: action.sessionLog
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

function formatAnswer(question, answer) {
  if (!question) return String(answer ?? '');
  if (question.inputType === 'boolean') {
    return answer ? 'Yes' : 'No';
  }
  if (question.inputType === 'choice') {
    const match = question.options?.find(option => option.value === answer);
    return match ? match.label : String(answer);
  }
  return String(answer);
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState, () => ({
    ...initialState,
    sessionLog: getSessionLog()
  }));

  const emergenciesList = Object.values(emergencyProtocols);

  const handleSelectEmergency = (emergency) => {
    const protocol = emergencyProtocols[emergency.id];
    const firstQuestion = protocol.questions[0] || null;
    const freshLog = [];

    clearSessionLog();
    saveSessionLog(freshLog);

    dispatch({
      type: 'START_EMERGENCY',
      protocol,
      currentQuestion: firstQuestion,
      questionHistory: firstQuestion ? [firstQuestion.id] : [],
      sessionLog: freshLog
    });
  };

  const handleAnswer = (answer) => {
    const lastQuestionId = state.questionHistory[state.questionHistory.length - 1];
    const questionMeta = state.selectedProtocol.questions.find(
      question => question.id === lastQuestionId
    );
    const updatedAnswers = { ...state.answers, [lastQuestionId]: answer };
    const updatedLog = [
      ...state.sessionLog,
      {
        id: lastQuestionId,
        questionText: questionMeta?.questionText ?? 'Question',
        answer,
        displayAnswer: formatAnswer(questionMeta, answer),
        timestamp: new Date().toISOString()
      }
    ];

    dispatch({ type: 'UPDATE_SESSION_LOG', sessionLog: updatedLog });
    saveSessionLog(updatedLog);

    const nextQuestion = getNextQuestion(
      state.selectedProtocol,
      updatedAnswers,
      state.questionHistory
    );

    if (nextQuestion) {
      dispatch({
        type: 'UPDATE_QUESTION',
        answers: updatedAnswers,
        questionHistory: [...state.questionHistory, nextQuestion.id],
        currentQuestion: nextQuestion
      });
    } else {
      processResults(updatedAnswers);
    }
  };

  const processResults = async (finalAnswers) => {
    dispatch({ type: 'SET_PROCESSING', answers: finalAnswers });
    await simulateThinking(1500);

    const detectedSeverity = assessSeverity(state.selectedProtocol, finalAnswers);
    const actions = getImmediateActions(state.selectedProtocol, detectedSeverity);
    const warns = getWarnings(state.selectedProtocol);
    const summaryText = generateSummary(state.selectedProtocol, finalAnswers, detectedSeverity);

    saveCompletedSession(state.selectedProtocol.id, finalAnswers, detectedSeverity);

    dispatch({
      type: 'SET_RESULTS',
      severity: detectedSeverity,
      immediateActions: actions,
      warnings: warns,
      summary: summaryText
    });
  };

  const handleBack = () => {
    if (state.questionHistory.length > 1) {
      const newHistory = state.questionHistory.slice(0, -1);
      const lastQuestionId = newHistory[newHistory.length - 1];
      const prevQuestion = state.selectedProtocol.questions.find(
        question => question.id === lastQuestionId
      );
      const trimmedAnswers = { ...state.answers };
      delete trimmedAnswers[state.questionHistory[state.questionHistory.length - 1]];

      const trimmedLog = state.sessionLog.slice(0, -1);
      saveSessionLog(trimmedLog);

      dispatch({
        type: 'UPDATE_SESSION_LOG',
        sessionLog: trimmedLog
      });

      dispatch({
        type: 'UPDATE_QUESTION',
        answers: trimmedAnswers,
        questionHistory: newHistory,
        currentQuestion: prevQuestion
      });
    } else {
      clearSessionLog();
      clearCurrentSession();
      dispatch({ type: 'RESET' });
    }
  };

  const handleNewEmergency = () => {
    clearSessionLog();
    clearCurrentSession();
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 z-50 w-full bg-green-50 border-b border-green-200">
        <div className="max-w-5xl mx-auto px-4 py-2 text-center text-sm font-semibold text-green-700 flex items-center justify-center gap-2">
          <span className="text-base">🟢</span>
          <span>Offline Ready — No Internet Needed</span>
        </div>
      </div>

      {state.currentStep === 'categorySelection' && (
        <EmergencyGrid
          emergencies={emergenciesList}
          onSelectEmergency={handleSelectEmergency}
        />
      )}

      {state.currentStep === 'questioning' && state.selectedProtocol && state.currentQuestion && (
        <AgentChat
          protocol={state.selectedProtocol}
          currentQuestion={state.currentQuestion}
          questionHistory={state.questionHistory}
          sessionLog={state.sessionLog}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}

      {state.currentStep === 'processing' && (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Agent is analyzing your responses...
            </h2>
            <p className="text-slate-600">
              The agent is determining severity and preparing guidance
            </p>
          </div>
        </div>
      )}

      {state.currentStep === 'results' && state.selectedProtocol && state.severity && (
        <ResultCard
          protocol={state.selectedProtocol}
          severity={state.severity}
          immediateActions={state.immediateActions}
          warnings={state.warnings}
          summary={state.summary}
          onNewEmergency={handleNewEmergency}
        />
      )}
    </div>
  );
}
