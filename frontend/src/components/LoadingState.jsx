/**
 * LoadingState Component
 *
 * Beautiful animated loading experience with three distinct stages:
 * 1. Fetching transcript - Shows a download/network animation
 * 2. Processing transcript - Shows a text processing animation
 * 3. Generating summary - Shows an AI/sparkle animation
 *
 * Each stage has its own icon, color, and progress indicator.
 * Fully responsive with Tailwind animations.
 */

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STEP DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "fetch",
    label: "Fetching transcript",
    description: "Retrieving video captions from YouTube",
    color: "blue",
    duration: 3000,
  },
  {
    id: "process",
    label: "Processing transcript",
    description: "Cleaning and preparing text for analysis",
    color: "purple",
    duration: 2000,
  },
  {
    id: "generate",
    label: "Generating summary",
    description: "AI is analyzing content and extracting insights",
    color: "amber",
    duration: 8000,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Advance through steps with realistic timing
  useEffect(() => {
    const timers = [];
    let elapsed = 0;

    STEPS.forEach((step, index) => {
      if (index > 0) {
        const timer = setTimeout(() => {
          setCurrentStep(index);
          setProgress(0);
        }, elapsed);
        timers.push(timer);
      }
      elapsed += step.duration;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Smooth progress bar animation within each step
  useEffect(() => {
    const step = STEPS[currentStep];
    const intervalTime = 50;
    const increment = 100 / (step.duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Don't fully complete the last step (it ends when data arrives)
        const max = currentStep === STEPS.length - 1 ? 90 : 95;
        return prev < max ? prev + increment : prev;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
      <div className="card p-6 sm:p-8 overflow-hidden relative">
        {/* Background shimmer effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Main animation area */}
        <div className="flex flex-col items-center mb-8">
          {/* Animated icon for current step */}
          <StepIcon step={STEPS[currentStep]} />

          {/* Current step label */}
          <h3 className="text-lg font-semibold text-gray-900 mt-5 text-center">
            {STEPS[currentStep].label}
          </h3>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {STEPS[currentStep].description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: getGradient(STEPS[currentStep].color),
              }}
            />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((step, index) => (
            <StepIndicator
              key={step.id}
              step={step}
              index={index}
              currentStep={currentStep}
            />
          ))}
        </div>

        {/* Bouncing dots at the bottom */}
        <div className="flex justify-center items-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-400 animate-bounce-dot"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Animated icon that changes based on the current processing step.
 */
function StepIcon({ step }) {
  const colorClasses = getColorClasses(step.color);

  return (
    <div className={`relative w-20 h-20 flex items-center justify-center animate-float`}>
      {/* Outer glow ring */}
      <div className={`absolute inset-0 rounded-full ${colorClasses.bgLight} animate-scale-pulse`} />

      {/* Inner circle */}
      <div className={`relative w-14 h-14 rounded-full ${colorClasses.bgMedium} flex items-center justify-center shadow-lg`}>
        {step.id === "fetch" && <FetchIcon className={colorClasses.text} />}
        {step.id === "process" && <ProcessIcon className={colorClasses.text} />}
        {step.id === "generate" && <GenerateIcon className={colorClasses.text} />}
      </div>

      {/* Orbiting dot */}
      <div className="absolute inset-0 animate-spin-slow">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${colorClasses.bgSolid} shadow-md`} />
      </div>
    </div>
  );
}

/**
 * Individual step indicator in the progress bar footer.
 */
function StepIndicator({ step, index, currentStep }) {
  const isActive = index === currentStep;
  const isCompleted = index < currentStep;
  const colorClasses = getColorClasses(step.color);

  return (
    <div className="flex flex-col items-center flex-1">
      {/* Dot */}
      <div
        className={`w-3 h-3 rounded-full transition-all duration-500 ${
          isCompleted
            ? "bg-green-500 scale-100"
            : isActive
            ? `${colorClasses.bgSolid} scale-125 ring-4 ${colorClasses.ringLight}`
            : "bg-gray-200 scale-100"
        }`}
      />

      {/* Label */}
      <span
        className={`text-xs mt-2 text-center hidden sm:block transition-colors duration-300 ${
          isActive ? "text-gray-900 font-medium" : "text-gray-400"
        }`}
      >
        {step.label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────

/** Download/fetch icon with animation */
function FetchIcon({ className }) {
  return (
    <svg className={`w-7 h-7 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  );
}

/** Text processing icon */
function ProcessIcon({ className }) {
  return (
    <svg className={`w-7 h-7 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

/** AI/sparkle generation icon */
function GenerateIcon({ className }) {
  return (
    <svg className={`w-7 h-7 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns Tailwind color classes for a given color name.
 */
function getColorClasses(color) {
  const map = {
    blue: {
      bgLight: "bg-blue-100/60",
      bgMedium: "bg-blue-100",
      bgSolid: "bg-blue-500",
      text: "text-blue-600",
      ringLight: "ring-blue-100",
    },
    purple: {
      bgLight: "bg-purple-100/60",
      bgMedium: "bg-purple-100",
      bgSolid: "bg-purple-500",
      text: "text-purple-600",
      ringLight: "ring-purple-100",
    },
    amber: {
      bgLight: "bg-amber-100/60",
      bgMedium: "bg-amber-100",
      bgSolid: "bg-amber-500",
      text: "text-amber-600",
      ringLight: "ring-amber-100",
    },
  };
  return map[color] || map.blue;
}

/**
 * Returns a CSS gradient string for the progress bar.
 */
function getGradient(color) {
  const map = {
    blue: "linear-gradient(90deg, #3b82f6, #60a5fa)",
    purple: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
    amber: "linear-gradient(90deg, #f59e0b, #fbbf24)",
  };
  return map[color] || map.blue;
}

export default LoadingState;
