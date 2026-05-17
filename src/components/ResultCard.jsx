/**
 * Sahayak AI - Result Card Component
 * Displays immediate actions, warnings, and summary after questioning
 */

import React, { useState } from 'react';
import { copyToClipboard } from '../utils/storage';

export function ResultCard({
  protocol,
  severity,
  immediateActions,
  warnings,
  summary,
  onNewEmergency
}) {
  const [activeTab, setActiveTab] = useState('actions');
  const [copied, setCopied] = useState(false);

  // Get severity color and info
  const getSeverityStyle = () => {
    const styles = {
      mild: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', label: 'Mild', icon: '🟢' },
      moderate: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900', label: 'Moderate', icon: '🟡' },
      severe: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900', label: 'Severe', icon: '🟠' },
      critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900', label: '🚨 CRITICAL', icon: '🔴' }
    };
    return styles[severity] || styles.moderate;
  };

  const severityStyle = getSeverityStyle();
  const summaryLines = summary.split('\n');

  const getSummaryLineKey = (line, index) => {
    const base = `${line}-${index}`;
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = (hash << 5) - hash + base.charCodeAt(i);
      hash |= 0;
    }
    return `summary-${Math.abs(hash)}`;
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(summary);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            {protocol.icon} {protocol.title} Response Plan
          </h1>

          {/* Severity Badge */}
          <div className={`${severityStyle.bg} border-2 ${severityStyle.border} ${severityStyle.text} rounded-lg p-4 mb-6 inline-block`}>
            <p className="font-bold text-lg">
              Severity: {severityStyle.icon} {severityStyle.label}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow-md">
          {[
            { id: 'actions', label: '🚑 Immediate Actions', icon: '✓' },
            { id: 'warnings', label: '⚠️ What NOT to Do', icon: '!' },
            { id: 'summary', label: '📋 Summary', icon: '📄' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Immediate Actions */}
          {activeTab === 'actions' && (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                🚑 Immediate Actions
              </h2>
              <div className="space-y-4">
                {immediateActions.map((action, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-800 text-lg leading-relaxed">
                        {action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Critical actions emphasis */}
              {severity === 'critical' && (
                <div className="mt-8 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
                  <p className="font-bold text-red-900 text-lg mb-2">
                    🚨 This is a life-threatening emergency!
                  </p>
                  <p className="text-red-800">
                    Call emergency services (102 or 108) immediately if you haven't already. Follow the above steps while waiting for paramedics. Do not delay seeking professional medical help.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Warnings */}
          {activeTab === 'warnings' && (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                ⚠️ Common Mistakes to Avoid
              </h2>
              <div className="space-y-4">
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg"
                  >
                    <p className="text-red-900 font-semibold text-lg leading-relaxed">
                      {warning}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <p className="text-amber-900 font-semibold">
                  💡 Why these matter:
                </p>
                <p className="text-amber-800 text-sm mt-2">
                  Many myths and home remedies can worsen injuries. Even with good intentions, applying wrong first aid can delay recovery or cause permanent damage. Always prioritize safe, medically-backed approaches.
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          {activeTab === 'summary' && (
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                📋 Emergency Summary
              </h2>
              
              {/* Summary Text */}
              <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200 mb-6 font-mono text-sm text-slate-700 max-h-96 overflow-y-auto">
                {summaryLines.map((line, index) => {
                  const isImportant = line.trim().startsWith('IMPORTANT:');
                  return (
                    <div
                      key={getSummaryLineKey(line, index)}
                      className={isImportant ? 'font-bold text-red-700' : ''}
                    >
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Summary (for sharing with paramedics)
                  </>
                )}
              </button>

              {/* Info */}
              <p className="text-sm text-slate-600 mt-4 text-center">
                Share this summary with emergency responders when they arrive.
              </p>
            </div>
          )}
        </div>

        {/* Critical reminder */}
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-red-900 text-lg mb-2">
            🏥 Professional Medical Help is Essential
          </h3>
          <p className="text-red-800">
            This app provides first aid guidance only. It is NOT a replacement for professional medical care. Always seek medical attention for serious emergencies. Call emergency services (102 or 108) for:
          </p>
          <ul className="list-disc list-inside text-red-800 mt-3 space-y-1 text-sm">
            <li>Any emergency marked as Severe or Critical</li>
            <li>Injuries causing loss of consciousness</li>
            <li>Difficulty breathing or chest pain</li>
            <li>Uncontrolled bleeding</li>
            <li>Suspected spinal injuries</li>
            <li>Any injury causing severe pain</li>
          </ul>
        </div>

        {/* New Emergency Button */}
        <button
          onClick={onNewEmergency}
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Emergency
        </button>
      </div>
    </div>
  );
}
