/**
 * Sahayak AI - Agent Chat Component
 * Handles interactive Q&A with adaptive questioning
 */

import React, { useState } from 'react';

export function AgentChat({
  protocol,
  onComplete,
  onBack,
  currentQuestion,
  questionHistory,
  answers,
  onAnswer
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textInput, setTextInput] = useState('');

  // Calculate progress
  const totalQuestions = protocol.questions.length;
  const currentQuestionNumber = questionHistory.length + 1;

  const handleAnswer = () => {
    if (selectedAnswer === null && textInput === '') return;

    const answer = selectedAnswer !== null ? selectedAnswer : textInput;
    onAnswer(answer);

    // Reset for next question
    setSelectedAnswer(null);
    setTextInput('');
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Offline Badge */}
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-300 rounded-full px-3 py-1 mb-8 text-sm">
          <span className="text-lg">🟢</span>
          <span className="font-medium text-green-700">Offline</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {protocol.title} Emergency
          </h1>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="text-3xl">{protocol.icon}</span>
            <span className="font-medium">
              Question {currentQuestionNumber} of {Math.min(totalQuestions, 5)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
              style={{
                width: `${(currentQuestionNumber / Math.min(totalQuestions, 5)) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8">
            {currentQuestion.questionText}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.inputType === 'choice' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedAnswer(option.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all duration-200 ${
                      selectedAnswer === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          selectedAnswer === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {selectedAnswer === option.value && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.inputType === 'boolean' && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Yes', value: true, color: 'green' },
                  { label: 'No', value: false, color: 'red' }
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => setSelectedAnswer(option.value)}
                    className={`p-4 rounded-lg border-2 font-bold text-lg transition-all duration-200 ${
                      selectedAnswer === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-900`
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.inputType === 'text' && (
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAnswer();
                }}
                placeholder="Type your answer..."
                className="w-full p-4 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-lg"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors duration-200"
          >
            ← Back
          </button>
          <button
            onClick={handleAnswer}
            disabled={selectedAnswer === null && textInput === ''}
            className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedAnswer === null && textInput === ''
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Session Log Button */}
        <div className="mt-8 flex justify-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 underline">
            📋 View Session Log
          </button>
        </div>
      </div>
    </div>
  );
}
