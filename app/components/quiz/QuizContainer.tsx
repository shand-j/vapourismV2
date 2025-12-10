/**
 * QuizContainer Component
 * 
 * Main container for the tailored shopping quiz experience.
 * Manages quiz state, navigation, and results generation.
 */

import {useCallback, useState} from 'react';
import {useNavigate} from '@remix-run/react';
import {QuizStep} from './QuizStep';
import {
  type QuizConfig,
  type QuizState,
  initialQuizState,
  shouldShowStep,
  getNextStepIndex,
  getPreviousStepIndex,
  calculateProgress,
  buildSearchParamsFromAnswers,
} from '~/lib/quiz-config';

interface QuizContainerProps {
  readonly config: QuizConfig;
  readonly resultsPath?: string;
}

export function QuizContainer({
  config,
  resultsPath = '/search',
}: QuizContainerProps) {
  const navigate = useNavigate();
  const [state, setState] = useState<QuizState>(initialQuizState);

  const currentStep = config.steps[state.currentStepIndex];
  const selectedValues = state.answers[currentStep?.id] || [];
  const progress = calculateProgress(config, state.currentStepIndex, state.answers);

  const canGoBack = getPreviousStepIndex(config, state.currentStepIndex, state.answers) !== null;
  const nextStepIndex = getNextStepIndex(config, state.currentStepIndex, state.answers);
  const isLastStep = nextStepIndex === null;
  const canProceed = currentStep?.skipable || selectedValues.length > 0;

  const handleSelect = useCallback((values: string[]) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentStep.id]: values,
      },
    }));
  }, [currentStep?.id]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      // Generate results URL and navigate
      const params = buildSearchParamsFromAnswers(config, state.answers);
      navigate(`${resultsPath}?${params.toString()}`);
    } else if (nextStepIndex !== null) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: nextStepIndex,
        completedSteps: [...prev.completedSteps, currentStep.id],
      }));
    }
  }, [isLastStep, nextStepIndex, config, state.answers, navigate, resultsPath, currentStep?.id]);

  const handleBack = useCallback(() => {
    const prevIndex = getPreviousStepIndex(config, state.currentStepIndex, state.answers);
    if (prevIndex !== null) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: prevIndex,
      }));
    }
  }, [config, state.currentStepIndex, state.answers]);

  const handleSkip = useCallback(() => {
    if (currentStep?.skipable && nextStepIndex !== null) {
      setState((prev) => ({
        ...prev,
        currentStepIndex: nextStepIndex,
        completedSteps: [...prev.completedSteps, currentStep.id],
      }));
    } else if (currentStep?.skipable && isLastStep) {
      const params = buildSearchParamsFromAnswers(config, state.answers);
      navigate(`${resultsPath}?${params.toString()}`);
    }
  }, [currentStep, nextStepIndex, isLastStep, config, state.answers, navigate, resultsPath]);

  const handleStartOver = useCallback(() => {
    setState(initialQuizState);
  }, []);

  if (!currentStep) {
    return null;
  }

  // Check if this step should be shown (dependency check)
  if (!shouldShowStep(currentStep, state.answers)) {
    // Auto-advance to next visible step
    const next = getNextStepIndex(config, state.currentStepIndex, state.answers);
    if (next !== null) {
      setState((prev) => ({...prev, currentStepIndex: next}));
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden bg-slate-950 py-16 text-white"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${config.accentColor}30, transparent), url(${config.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 to-slate-900/70" />
        <div className="container-custom relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
            Guided shopping
          </p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">{config.title}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">{config.subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: config.accentColor,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Step {state.currentStepIndex + 1} of {config.steps.length} • {progress}% complete
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartOver}
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Start over
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container-custom py-12">
        <div className="mx-auto">
          <QuizStep
            step={currentStep}
            selectedValues={selectedValues}
            onSelect={handleSelect}
            accentColor={config.accentColor}
          />

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between gap-4">
            <div>
              {canGoBack && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m6-6l-6 6 6 6" />
                  </svg>
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {currentStep.skipable && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Skip this step
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className={`
                  inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition
                  ${canProceed ? 'shadow-lg hover:opacity-90' : 'cursor-not-allowed opacity-50'}
                `}
                style={{
                  backgroundColor: canProceed ? config.accentColor : '#94a3b8',
                  boxShadow: canProceed ? `0 15px 40px ${config.accentColor}40` : undefined,
                }}
              >
                {isLastStep ? 'See my results' : 'Continue'}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Panel (shows selected answers) */}
      {Object.keys(state.answers).length > 0 && (
        <div className="border-t border-slate-200 bg-white py-8">
          <div className="container-custom">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Your selections
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(state.answers).flatMap(([stepId, values]) => {
                const step = config.steps.find((s) => s.id === stepId);
                return values.map((value) => {
                  const option = step?.options.find((o) => o.value === value);
                  return (
                    <span
                      key={`${stepId}-${value}`}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700"
                    >
                      {option?.label || value}
                    </span>
                  );
                });
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
