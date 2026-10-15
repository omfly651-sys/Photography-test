import React, { useState } from 'react';
import {
  DifficultyLevel,
  LEVEL_STUDY_GUIDES,
  StudySection
} from '../data/quizData';
import {
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { SimulatorTabType } from './ExposureSimulator';
import { playDialClick } from '../utils/cameraAudio';

interface Props {
  level: DifficultyLevel;
  onOpenSimulator: (tab: SimulatorTabType) => void;
  onStartQuiz: () => void;
}

export const StudyGuide: React.FC<Props> = ({ level, onOpenSimulator, onStartQuiz }) => {
  const guide = LEVEL_STUDY_GUIDES[level];
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const activeSection = guide.sections[activeSectionIndex];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800 bg-neutral-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Studijní zóna & Teorie
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">{guide.title}</h2>
          <p className="text-xs sm:text-sm text-neutral-400">{guide.description}</p>
        </div>

        <button
          onClick={() => {
            playDialClick();
            onStartQuiz();
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/10 shrink-0 self-start md:self-auto"
        >
          <span>Přejít na test ({level === 'basics' ? 'Úroveň 1' : level === 'intermediate' ? 'Úroveň 2' : 'Úroveň 3'})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Layout: Sidebar of topics + Detailed Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left: Topic Selector (4 cols) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-800 bg-neutral-950/40 p-3 space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-3 py-2">
            Kapitoly ({guide.sections.length})
          </div>

          {guide.sections.map((section, idx) => {
            const isActive = idx === activeSectionIndex;
            return (
              <button
                key={section.title}
                onClick={() => {
                  playDialClick();
                  setActiveSectionIndex(idx);
                }}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-semibold shadow-sm'
                    : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`w-5 h-5 rounded-md font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{section.title.split('. ')[1] || section.title}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-neutral-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Topic View (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-mono font-semibold text-amber-400 mb-1">
                KAPITOLA {activeSectionIndex + 1} Z {guide.sections.length}
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-neutral-100">{activeSection.title}</h3>
              <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
                {activeSection.summary}
              </p>
            </div>

            {/* Key takeaway cards */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Klíčové principy pro test & praxi:
              </div>

              {activeSection.keyPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/90 text-xs text-neutral-300 space-y-1"
                >
                  <div className="font-semibold text-amber-300 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{pt.label}</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed pl-5.5">{pt.text}</p>
                </div>
              ))}
            </div>

            {/* Pro Tip Box */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-neutral-200">Zkušenost z fotografické praxe: </span>
                <span className="text-neutral-300">{activeSection.proTip}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={() => onOpenSimulator(activeSection.simulatorTab)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-semibold border border-neutral-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vyzkoušet v interaktivním trenažéru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={activeSectionIndex === 0}
                onClick={() => {
                  playDialClick();
                  setActiveSectionIndex((prev) => Math.max(0, prev - 1));
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Předchozí
              </button>

              <button
                disabled={activeSectionIndex === guide.sections.length - 1}
                onClick={() => {
                  playDialClick();
                  setActiveSectionIndex((prev) => Math.min(guide.sections.length - 1, prev + 1));
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                Další kapitola
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
