/**
 * Sahayak AI - Emergency Grid Component
 * Displays emergency categories for user selection
 */

import React from 'react';

export function EmergencyGrid({ emergencies, onSelectEmergency }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3">
            Sahayak AI
          </h1>
          <p className="text-lg text-slate-600 mb-4">
            Emergency Response Agent — India
          </p>
          
          <p className="text-slate-600 text-center max-w-2xl mx-auto">
            Select an emergency below. The agent will ask adaptive questions and provide immediate, medically-sound guidance based on your responses.
          </p>
        </div>

        {/* Emergency Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {emergencies.map((emergency) => (
            <button
              key={emergency.id}
              onClick={() => onSelectEmergency(emergency)}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${emergency.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative p-6 flex flex-col items-center justify-center">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {emergency.icon}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-800 text-center mb-2">
                  {emergency.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-slate-500 text-center group-hover:text-slate-600 transition-colors">
                  Get immediate guidance
                </p>

                {/* Arrow */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How It Works</h3>
          <p className="text-blue-800 text-sm">
            1. Select your emergency type above
            2. Answer adaptive questions from the agent
            3. Get severity assessment and immediate actions
            4. View warnings and summary to share with paramedics
          </p>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded p-4">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ Medical Disclaimer</h3>
          <p className="text-amber-800 text-xs">
            This app provides first aid guidance only. It is NOT a substitute for professional medical care. Always call emergency services (102/108) for serious injuries. Use this app to supplement, not replace, professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
