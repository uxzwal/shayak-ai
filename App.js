/**
 * Sahayak AI - Main Application Component
 * State machine for emergency response flow
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

import React, { useState, useEffect } from 'react';
import { EmergencyGrid } from './EmergencyGrid';
import { AgentChat } from './AgentChat';
import { ResultCard } from './ResultCard';
import { emergencyProtocols } from '../protocols';
import {
  getNextQuestion,
  assessSeverity,
  getImmediateActions,
  getWarnings,
  generateSummary,
  simulateThinking
} from '../agentLogic';
import {
  saveSessionLog,
  saveCurrentSessionState,
  clearCurrentSession
} from '../storage';

export default function App() {
  // State machine: 'categorySelection' | 'questioning' | 'processing' | 'results'
  const [currentStep, setCurrentStep] = useState('categorySelection');
  
  // Selected emergency
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  
  // Q&A state
  const [questionHistory, setQuestionHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Results state
  const [severity, setSeverity] = useState(null);
  const [immediateActions, setImmediateActions] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [summary, setSummary] = useState('');

  // Emergency selection
  const handleSelectEmergency = (emergency) => {
    const protocol = emergencyProtocols[emergency.id];
    setSelectedProtocol(protocol);
    setQuestionHistory([]);
    setAnswers({});
    setSeverity(null);
    
    // Start with first question
    if (protocol.questions.length > 0) {
      setCurrentQuestion(protocol.questions[0]);
      setQuestionHistory([protocol.questions[0].id]);
    }
    
    setCurrentStep('questioning');
  };

  // Handle answer submission
  const handleAnswer = (answer) => {
    const lastQuestionId = questionHistory[questionHistory.length - 1];
    const newAnswers = { ...answers, [lastQuestionId]: answer };
    setAnswers(newAnswers);

    // Get next question
    const nextQuestion = getNextQuestion(selectedProtocol, newAnswers, questionHistory);

    if (nextQuestion) {
      // Continue questioning
      setQuestionHistory([...questionHistory, nextQuestion.id]);
      setCurrentQuestion(nextQuestion);
    } else {
      // Ready for processing/results
      processResults(newAnswers);
    }
  };

  // Process results after all questions
  const processResults = async (finalAnswers) => {
    setCurrentStep('processing');
    
    // Simulate agent thinking (agentic behavior)
    await simulateThinking(1500);

    // Calculate severity
    const detectedSeverity = assessSeverity(selectedProtocol, finalAnswers);
    setSeverity(detectedSeverity);

    // Get actions and warnings
    const actions = getImmediateActions(selectedProtocol, detectedSeverity);
    setImmediateActions(actions);

    const warns = getWarnings(selectedProtocol);
    setWarnings(warns);

    // Generate summary
    const summaryText = generateSummary(selectedProtocol, finalAnswers, detectedSeverity);
    setSummary(summaryText);

    // Save session
    saveSessionLog(selectedProtocol.id, finalAnswers, detectedSeverity);

    setCurrentStep('results');
  };

  // Handle going back
  const handleBack = () => {
    if (questionHistory.length > 1) {
      // Remove last question
      const newHistory = questionHistory.slice(0, -1);
      const lastQuestionId = newHistory[newHistory.length - 1];
      
      setQuestionHistory(newHistory);
      
      // Find and set previous question
      const prevQuestion = selectedProtocol.questions.find(
        q => q.id === lastQuestionId
      );
      setCurrentQuestion(prevQuestion);

      // Remove last answer
      const newAnswers = { ...answers };
      delete newAnswers[lastQuestionId];
      setAnswers(newAnswers);
    } else {
      // Go back to category selection
      setCurrentStep('categorySelection');
      setSelectedProtocol(null);
      setQuestionHistory([]);
      setAnswers({});
      setCurrentQuestion(null);
      clearCurrentSession();
    }
  };

  // Handle new emergency
  const handleNewEmergency = () => {
    setCurrentStep('categorySelection');
    setSelectedProtocol(null);
    setQuestionHistory([]);
    setAnswers({});
    setCurrentQuestion(null);
    setSeverity(null);
    setImmediateActions([]);
    setWarnings([]);
    setSummary('');
    clearCurrentSession();
  };

  // Get all protocols as array
  const emergenciesList = Object.values(emergencyProtocols);

  return (
    <div className="bg-white min-h-screen">
      {/* Category Selection */}
      {currentStep === 'categorySelection' && (
        <EmergencyGrid
          emergencies={emergenciesList}
          onSelectEmergency={handleSelectEmergency}
        />
      )}

      {/* Questioning */}
      {currentStep === 'questioning' && selectedProtocol && currentQuestion && (
        <AgentChat
          protocol={selectedProtocol}
          currentQuestion={currentQuestion}
          questionHistory={questionHistory}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}

      {/* Processing */}
      {currentStep === 'processing' && (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Analyzing your responses...
            </h2>
            <p className="text-slate-600">
              The agent is determining severity and preparing guidance
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {currentStep === 'results' && selectedProtocol && severity && (
        <ResultCard
          protocol={selectedProtocol}
          severity={severity}
          immediateActions={immediateActions}
          warnings={warnings}
          summary={summary}
          onNewEmergency={handleNewEmergency}
        />
      )}
    </div>
  );
}

/*
 * DEMO SCRIPT
 * 
 * This is what the user sees when trying the app with a Snake Bite emergency:
 * 
 * 1. Opens app → Sees emergency grid with 7 options
 * 2. Clicks "Snake Bite" (🐍)
 * 3. Question 1: "Is the person conscious?" → User selects "Yes"
 * 4. Question 2: "Do you see fang marks?" → User selects "Yes"
 * 5. Question 3: "Is there rapid swelling spreading up the limb?" → User selects "Yes"
 * 6. Question 4: "Is there bleeding from bite, mouth, or nose?" → User selects "No"
 * 7. App shows loading animation: "Analyzing your responses..."
 * 8. Results page shows:
 *    - Severity: 🔴 CRITICAL
 *    - Tab 1: Immediate Actions (step-by-step guidance)
 *    - Tab 2: What NOT to Do (warnings)
 *    - Tab 3: Emergency Summary (can be copied)
 * 9. User can "New Emergency" to restart
 * 
 * Key Features Demonstrated:
 * - Offline: No internet needed, all data local
 * - Agentic: Adapts questions based on answers, shows thinking delay
 * - Medical: Culturally appropriate for India, medically sound
 * - Practical: Step-by-step actions, clear warnings, shareable summary
 */
