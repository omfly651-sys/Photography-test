import React from 'react';
import { QuizQuestion } from '../data/quizData';
import { Check, X, Sparkles, ExternalLink, HelpCircle } from 'lucide-react';
import { playDialClick } from '../utils/cameraAudio';

interface Props {
  question: QuizQuestion;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  isEvaluated: boolean;
  onOpenSimulator: (tab: QuizQuestion['simulatorTab']) => void;
}

export const QuizCard: React.FC<Props> = ({
  question,
  selectedOption,
  onSelectOption,
  isEvaluated,
  onOpenSimulator
}) => {
  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div
      id={`question-${question.id}`}
      className={`relative rounded-xl border transition-all duration-200 bg-neutral-900/90 overflow-hidden ${
        isEvaluated
          ? isCorrect
            ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/20'
            : 'border-red-500/60 shadow-lg shadow-red-950/20'
          : selectedOption
          ? 'border-neutral-700 shadow-md'
          : 'border-neutral-800'
      }`}
    >
      {/* Question Header */}
      <div className="p-5 border-b border-neutral-800/80 bg-neutral-950/40">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-800 text-amber-400 font-mono text-sm font-bold border border-neutral-700">
              {question.id}
            </span>
            <span className="text-xs uppercase font-semibold tracking-wider text-neutral-400">
              {question.topic}
            </span>
          </div>

          {/* Evaluated badge */}
          {isEvaluated && (
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isCorrect
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950 border border-red-500/40 text-red-300'
              }`}
            >
              {isCorrect ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Správně (+1 bod)
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" /> Chybně (Správně je {question.correctAnswer})
                </>
              )}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-neutral-100 leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="p-5 space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          const isThisCorrect = opt.key === question.correctAnswer;

          let optionStyle = 'border-neutral-800 bg-neutral-950/40 hover:bg-neutral-800/50 text-neutral-300';
          let keyBadgeStyle = 'bg-neutral-800 text-neutral-300 border-neutral-700';

          if (isEvaluated) {
            if (isThisCorrect) {
              optionStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-100 shadow-sm';
              keyBadgeStyle = 'bg-emerald-600 text-white border-emerald-400';
            } else if (isSelected && !isThisCorrect) {
              optionStyle = 'border-red-500/80 bg-red-950/30 text-red-200 line-through';
              keyBadgeStyle = 'bg-red-600 text-white border-red-400';
            } else {
              optionStyle = 'border-neutral-900 bg-neutral-950/20 text-neutral-500 opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'border-amber-500/80 bg-amber-950/30 text-neutral-100 shadow-sm';
            keyBadgeStyle = 'bg-amber-500 text-neutral-950 font-bold border-amber-400';
          }

          return (
            <button
              key={opt.key}
              onClick={() => {
                playDialClick();
                onSelectOption(opt.key);
              }}
              className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3.5 transition-all ${optionStyle}`}
            >
              <span
                className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 transition-colors ${keyBadgeStyle}`}
              >
                {opt.key}
              </span>
              <span className="text-sm leading-relaxed flex-1 pt-0.5">
                {opt.text}
              </span>
              {isEvaluated && isThisCorrect && (
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              )}
              {isEvaluated && isSelected && !isThisCorrect && (
                <X className="w-5 h-5 text-red-400 shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Pro Tip Footer (Visible after evaluation or when selected) */}
      {isEvaluated && (
        <div className="px-5 py-4 bg-neutral-950/70 border-t border-neutral-800/80 space-y-3">
          <div className="text-xs text-neutral-300 leading-relaxed">
            <span className="font-semibold text-amber-400 block mb-1">💡 Vysvětlení fotografa:</span>
            {question.explanation}
          </div>

          <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-neutral-200">Tip z praxe: </span>
              {question.proTip}
            </div>
          </div>

          <div className="pt-1 flex items-center justify-end">
            <button
              onClick={() => onOpenSimulator(question.simulatorTab)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Vyzkoušet v trenažéru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
