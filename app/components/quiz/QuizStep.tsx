/**
 * QuizStep Component
 * 
 * Renders a single quiz step with options for the tailored shopping experience.
 * Supports both single and multi-select modes.
 */

import {useCallback} from 'react';
import type {QuizStep as QuizStepType, QuizOption} from '~/lib/quiz-config';

interface QuizStepProps {
  readonly step: QuizStepType;
  readonly selectedValues: string[];
  readonly onSelect: (values: string[]) => void;
  readonly accentColor?: string;
}

export function QuizStep({
  step,
  selectedValues,
  onSelect,
  accentColor = '#5b2be0',
}: QuizStepProps) {
  const handleOptionClick = useCallback(
    (value: string) => {
      if (step.multiSelect) {
        // Toggle selection
        if (selectedValues.includes(value)) {
          onSelect(selectedValues.filter((v) => v !== value));
        } else {
          onSelect([...selectedValues, value]);
        }
      } else {
        // Single select - replace
        onSelect([value]);
      }
    },
    [step.multiSelect, selectedValues, onSelect],
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {step.question}
        </h2>
        {step.subtitle && (
          <p className="mt-2 text-slate-600">{step.subtitle}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {step.options.map((option) => (
          <QuizOptionCard
            key={option.value}
            option={option}
            isSelected={selectedValues.includes(option.value)}
            onClick={() => handleOptionClick(option.value)}
            accentColor={accentColor}
            multiSelect={step.multiSelect}
          />
        ))}
      </div>

      {step.skipable && (
        <p className="text-center text-sm text-slate-500">
          This step is optional — skip if you have no preference
        </p>
      )}
    </div>
  );
}

interface QuizOptionCardProps {
  readonly option: QuizOption;
  readonly isSelected: boolean;
  readonly onClick: () => void;
  readonly accentColor: string;
  readonly multiSelect?: boolean;
}

function QuizOptionCard({
  option,
  isSelected,
  onClick,
  accentColor,
  multiSelect,
}: QuizOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex flex-col items-start rounded-2xl border-2 p-6 text-left transition-all duration-200
        ${
          isSelected
            ? 'border-transparent bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
        }
      `}
      style={
        isSelected
          ? {
              borderColor: accentColor,
              boxShadow: `0 20px 40px ${accentColor}30`,
            }
          : undefined
      }
    >
      {/* Selection indicator */}
      <div
        className={`
          absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all
          ${
            isSelected
              ? 'border-white bg-white'
              : 'border-slate-300 bg-transparent group-hover:border-slate-400'
          }
        `}
      >
        {isSelected && (
          <svg
            className="h-4 w-4"
            style={{color: accentColor}}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Icon */}
      {option.icon && (
        <span className="mb-3 text-3xl" aria-hidden="true">
          {option.icon}
        </span>
      )}

      {/* Label */}
      <h3
        className={`text-lg font-semibold ${
          isSelected ? 'text-white' : 'text-slate-900'
        }`}
      >
        {option.label}
      </h3>

      {/* Description */}
      {option.description && (
        <p
          className={`mt-1 text-sm ${
            isSelected ? 'text-white/80' : 'text-slate-500'
          }`}
        >
          {option.description}
        </p>
      )}

      {/* Multi-select indicator */}
      {multiSelect && !isSelected && (
        <span className="mt-3 text-xs font-medium text-slate-400">
          Click to select
        </span>
      )}
    </button>
  );
}
