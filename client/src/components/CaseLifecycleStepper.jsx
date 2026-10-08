import React from 'react';
import { CheckCircle2, Clock, AlertOctagon, ArrowRight } from 'lucide-react';

const STEPS = [
  { key: 'New', label: 'New' },
  { key: 'Under Review', label: 'Under Review' },
  { key: 'Visit Scheduled', label: 'Visit Scheduled' },
  { key: 'In Treatment', label: 'In Treatment' },
  { key: 'Resolved', label: 'Resolved' }
];

export default function CaseLifecycleStepper({
  currentStatus = 'New',
  isEscalated = false,
  onEscalate,
  onStatusChange,
  isVet = false
}) {
  const currentIndex = STEPS.findIndex(s => s.key === currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Case Lifecycle
          </h3>
          <p className="text-sm font-semibold text-slate-800">
            Current Status: <span className="text-navy">{currentStatus}</span>
            {isEscalated && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                <AlertOctagon size={12} /> Emergency Escalated
              </span>
            )}
          </p>
        </div>

        {/* Red Escalate Case Button */}
        {!isEscalated && (
          <button
            type="button"
            onClick={onEscalate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <AlertOctagon size={14} />
            <span>Escalate Case</span>
          </button>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative pt-2 pb-1">
        <div className="grid grid-cols-5 gap-2 relative">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative">
                {/* Connecting Bar */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-1 -z-0 transition-colors ${
                      idx < activeIdx ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Circle Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-navy text-white ring-4 ring-blue-100 shadow-sm'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : isCurrent ? (
                    <Clock size={16} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-2 text-[11px] sm:text-xs leading-tight font-medium transition-colors ${
                    isCurrent
                      ? 'font-bold text-navy-dark'
                      : isCompleted
                      ? 'text-emerald-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vet Quick Advance Controls */}
      {isVet && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium">Veterinarian Action:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {STEPS.map((step, idx) => (
              <button
                key={step.key}
                type="button"
                onClick={() => onStatusChange && onStatusChange(step.key)}
                disabled={step.key === currentStatus}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  step.key === currentStatus
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                Mark {step.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
