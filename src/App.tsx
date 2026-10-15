/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Aperture,
  Award,
  Sparkles,
  BookOpen,
  Shuffle,
  GraduationCap,
  Sliders,
  HelpCircle
} from 'lucide-react';
import {
  QUIZ_QUESTIONS,
  DifficultyLevel,
  LEVEL_METADATA,
  QuizQuestion
} from './data/quizData';
import { QuizCard } from './components/QuizCard';
import { ExposureSimulator, SimulatorTabType } from './components/ExposureSimulator';
import { StudyGuide } from './components/StudyGuide';
import { playShutterSound, playDialClick } from './utils/cameraAudio';

export default function App() {
  // Current active difficulty level or 'all'
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | 'all'>('basics');

  // Main active view mode: 'study' (learn first) | 'quiz' (take test) | 'simulator' (interactive playground)
  const [activeView, setActiveView] = useState<'study' | 'quiz' | 'simulator'>('quiz');

  // Question Set: 1 | 2 | 'random'
  const [activeSet, setActiveSet] = useState<1 | 2 | 'random'>(1);

  // Retake counter
  const [retakeCount, setRetakeCount] = useState(0);

  // Answers store: id -> 'A' | 'B' | 'C' | 'D'
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulatorTab, setSimulatorTab] = useState<SimulatorTabType>('shutter');

  const simulatorRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);

  // Filter questions based on level and selected set
  const levelFiltered = selectedLevel === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.level === selectedLevel);

  // Further filter or pick by set
  const activeQuestions = (() => {
    if (selectedLevel === 'all') {
      return QUIZ_QUESTIONS.filter((q) => q.set === (activeSet === 'random' ? 1 : activeSet));
    }
    if (activeSet === 'random') {
      // Pick dynamic mix
      return levelFiltered.filter((_, i) => (i % 2 === retakeCount % 2));
    }
    return levelFiltered.filter((q) => q.set === activeSet);
  })();

  // Calculate score for active questions
  const activeScore = activeQuestions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  const activeAnsweredCount = activeQuestions.filter((q) => answers[q.id] !== undefined).length;
  const activePercentage = activeQuestions.length > 0 ? Math.round((activeScore / activeQuestions.length) * 100) : 0;

  // Answer handler
  const handleSelectOption = (questionId: number, option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  // Evaluate
  const handleEvaluate = () => {
    if (soundEnabled) playShutterSound();
    setIsEvaluated(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Fill perfect answers for active questions
  const handleFillPerfectAnswers = () => {
    if (soundEnabled) playShutterSound();
    const updated = { ...answers };
    activeQuestions.forEach((q) => {
      updated[q.id] = q.correctAnswer;
    });
    setAnswers(updated);
    setIsEvaluated(true);
  };

  // Reset quiz
  const handleReset = () => {
    if (soundEnabled) playDialClick();
    const updated = { ...answers };
    activeQuestions.forEach((q) => {
      delete updated[q.id];
    });
    setAnswers(updated);
    setIsEvaluated(false);
  };

  // Retake with alternate questions
  const handleRetakeWithNewQuestions = () => {
    if (soundEnabled) playShutterSound();
    setRetakeCount((prev) => prev + 1);
    // Toggle between Set 1 and Set 2 or random
    setActiveSet((prev) => (prev === 1 ? 2 : 1));
    setAnswers({});
    setIsEvaluated(false);
    setActiveView('quiz');
    setTimeout(() => {
      quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Copy results string
  const handleCopyResults = () => {
    const formatted = activeQuestions.map((q) => {
      const choice = answers[q.id] || '?';
      return `${q.id}${choice}`;
    }).join(', ');

    navigator.clipboard.writeText(formatted);
    setCopiedCode(true);
    if (soundEnabled) playDialClick();
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Jump to simulator tab
  const handleOpenSimulator = (tab?: SimulatorTabType) => {
    if (tab) {
      setSimulatorTab(tab);
    }
    setActiveView('simulator');
    if (soundEnabled) playDialClick();
    setTimeout(() => {
      simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // Determine Rank
  const getRank = () => {
    if (selectedLevel === 'basics') {
      if (activeScore === activeQuestions.length) return { title: 'Mistr základů expozice', desc: 'Skvělá práce! Clonu, čas, ISO, WB i pravidlo třetin ovládáte dokonale.', badge: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40' };
      if (activeScore >= activeQuestions.length * 0.75) return { title: 'Zkušený začátečník', desc: 'Pevný základ, doporučujeme si projít zbylá vysvětlení a zkusit střední úroveň.', badge: 'text-amber-400 bg-amber-950/80 border-amber-500/40' };
      return { title: 'Fotografický objevitel', desc: 'Dobrý začátek! Projděte si Studijní zónu a vyzkoušejte trenažér expozice.', badge: 'text-sky-400 bg-sky-950/80 border-sky-500/40' };
    }
    if (selectedLevel === 'intermediate') {
      if (activeScore === activeQuestions.length) return { title: 'Technický expert fotoaparátu', desc: 'Vynikající! Histogram, ETTR, bodové měření, difrakci i ND filtry máte v malíčku.', badge: 'text-amber-400 bg-amber-950/80 border-amber-500/40' };
      if (activeScore >= activeQuestions.length * 0.75) return { title: 'Pokročilý fotograf', desc: 'Skvělá technická orientace, téměř profesionální úroveň.', badge: 'text-sky-400 bg-sky-950/80 border-sky-500/40' };
      return { title: 'Ambiciózní nadšenec', desc: 'Pokročilá technika vyžaduje cvik – prostudujte principy difrakce a histogramu v teorii.', badge: 'text-purple-400 bg-purple-950/80 border-purple-500/40' };
    }
    if (selectedLevel === 'pro') {
      if (activeScore === activeQuestions.length) return { title: 'Masterclass & Studiový velmistr', desc: 'Respekt! Zákon obrácených čtverců, hyperfokál, LoCA, Global Shutter i ProPhoto RGB ovládáte jako špičkový profesionál.', badge: 'text-rose-400 bg-rose-950/80 border-rose-500/40' };
      if (activeScore >= activeQuestions.length * 0.75) return { title: 'Profesionální fotograf', desc: 'Vysoká úroveň optických i studiových vědomostí.', badge: 'text-amber-400 bg-amber-950/80 border-amber-500/40' };
      return { title: 'Studiový asistent na cestě k pro', desc: 'Profi úroveň je náročná – prostudujte si zákon obrácených čtverců ve studijní zóně.', badge: 'text-sky-400 bg-sky-950/80 border-sky-500/40' };
    }
    if (activeScore === activeQuestions.length) return { title: 'Absolutní fotografický velmistr', desc: 'Dokonalé skóre napříč všemi úrovněmi!', badge: 'text-amber-300 bg-amber-950 border-amber-400 font-bold' };
    return { title: 'Komplexní fotografický student', desc: 'Skvělý maratón! Projděte si detailní vysvětlení u chybných tipů.', badge: 'text-sky-400 bg-sky-950 border-sky-500/40' };
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#"
            className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-neutral-100 whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
          >
            <Camera className="w-5 h-5 text-amber-500" />
            <span>FOTO AKADEMIE & TEST</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
            <button
              onClick={() => {
                setActiveView('study');
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeView === 'study' ? 'text-amber-400 font-semibold' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Studium teorie</span>
            </button>
            <button
              onClick={() => {
                setActiveView('quiz');
                quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeView === 'quiz' ? 'text-amber-400 font-semibold' : ''}`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Kvíz ({activeQuestions.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveView('simulator');
                simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeView === 'simulator' ? 'text-amber-400 font-semibold' : ''}`}
            >
              <Sliders className="w-4 h-4" />
              <span>Trenažér & Motion Blur</span>
            </button>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Zvuk závěrky zapnutý' : 'Zvuk závěrky vypnutý'}
              className="p-2 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {isEvaluated ? (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetovat</span>
              </button>
            ) : (
              <button
                onClick={handleEvaluate}
                disabled={activeAnsweredCount === 0}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm whitespace-nowrap shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Vyhodnotit ({activeAnsweredCount}/{activeQuestions.length})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-10">
        
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-amber-400">Výukový portál & Kvíz</span>
                <span aria-hidden="true">·</span>
                <span>Základy · Střední · Úplně profi</span>
                <span aria-hidden="true">·</span>
                <span>Opakování s obměnou otázek</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-100 text-balance">
                Naučte se fotografii od základů až po studiovou masterclass
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Nahoře si vyberte úroveň. Nejdříve si prostudujte přehlednou teorii s tipy z praxe,
                vyzkoušejte si parametry v interaktivním trenažéru (včetně rozšířeného času závěrky a motion bluru)
                a otestujte se. Test můžete kdykoliv zopakovat s novou sadou otázek!
              </p>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    playDialClick();
                    setActiveView('study');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeView === 'study'
                      ? 'bg-amber-400 text-neutral-950 shadow-md'
                      : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>1. Prostudovat teorii</span>
                </button>

                <button
                  onClick={() => {
                    playDialClick();
                    setActiveView('quiz');
                    quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeView === 'quiz'
                      ? 'bg-amber-400 text-neutral-950 shadow-md'
                      : 'bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>2. Vyplnit test ({activeQuestions.length} otázek)</span>
                </button>

                <button
                  onClick={handleRetakeWithNewQuestions}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-sky-300 text-xs font-semibold transition-colors flex items-center gap-2"
                >
                  <Shuffle className="w-4 h-4 text-sky-400" />
                  <span>Zopakovat s jinými otázkami (Sada {activeSet === 1 ? '2' : '1'})</span>
                </button>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-xl aspect-[4/3] group">
                <img
                  src="/src/assets/images/hero_camera_lens_1792087429009.jpg"
                  alt="Fotoaparát a optika"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-xs text-neutral-300">
                  <div className="font-mono text-amber-400 font-bold text-sm">Trenažér & Teorie</div>
                  <div className="text-[11px] text-neutral-400">Clona · Čas & Motion Blur · ISO · Histogram · Blesk</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Level Selector Tabs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Vyberte úroveň vzdělávání & testu</span>
            </h2>
            <div className="text-xs text-neutral-400 font-mono">
              Sada otázek: <span className="font-bold text-sky-300">{activeSet === 'random' ? 'Náhodný mix' : `Varianta ${activeSet}`}</span>
              {retakeCount > 0 && <span className="text-neutral-500 ml-1">· Zopakováno {retakeCount}×</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'basics',
                title: '🟢 1. Základy',
                subtitle: '8 otázek / sada',
                desc: 'Clona, čas závěrky, ISO, vyvážení bílé, RAW a pravidlo třetin.',
                border: selectedLevel === 'basics' ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50' : 'border-neutral-800 bg-neutral-900/60'
              },
              {
                id: 'intermediate',
                title: '🟡 2. Středně pokročilý',
                subtitle: '8 otázek / sada',
                desc: 'Histogram, ETTR, bodové měření, difrakce, CPL, ND filtry a X-Sync.',
                border: selectedLevel === 'intermediate' ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/50' : 'border-neutral-800 bg-neutral-900/60'
              },
              {
                id: 'pro',
                title: '🔴 3. Úplně profi',
                subtitle: '8 otázek / sada',
                desc: 'Zákon 1/d², hyperfokál, LoCA aberace, ProPhoto RGB, Global Shutter.',
                border: selectedLevel === 'pro' ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500/50' : 'border-neutral-800 bg-neutral-900/60'
              },
              {
                id: 'all',
                title: '🏆 Celý maratón',
                subtitle: 'Všechny úrovně',
                desc: 'Kompletní přezkoušení od základů až po studiovou optiku.',
                border: selectedLevel === 'all' ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/50' : 'border-neutral-800 bg-neutral-900/60'
              }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  playDialClick();
                  setSelectedLevel(lvl.id as typeof selectedLevel);
                  setAnswers({});
                  setIsEvaluated(false);
                }}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${lvl.border} hover:border-neutral-600`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-neutral-100">{lvl.title}</span>
                    <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded">
                      {lvl.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                    {lvl.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">
                    {selectedLevel === lvl.id ? 'Aktivní úroveň' : 'Zvolit úroveň'}
                  </span>
                  {selectedLevel === lvl.id && (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      Vybráno <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl max-w-md">
            <button
              onClick={() => {
                playDialClick();
                setActiveView('study');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeView === 'study' ? 'bg-amber-400 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Studium teorie</span>
            </button>

            <button
              onClick={() => {
                playDialClick();
                setActiveView('quiz');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeView === 'quiz' ? 'bg-amber-400 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Testování</span>
            </button>

            <button
              onClick={() => {
                playDialClick();
                setActiveView('simulator');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeView === 'simulator' ? 'bg-amber-400 text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Trenažér</span>
            </button>
          </div>
        </section>

        {/* View Mode 1: Study Guide */}
        {activeView === 'study' && selectedLevel !== 'all' && (
          <section className="animate-in fade-in duration-300">
            <StudyGuide
              level={selectedLevel}
              onOpenSimulator={handleOpenSimulator}
              onStartQuiz={() => {
                setActiveView('quiz');
                setTimeout(() => quizSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
              }}
            />
          </section>
        )}

        {/* Evaluation Banner (if evaluated) */}
        {isEvaluated && (
          <section className="rounded-2xl border border-neutral-700 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-800">
              <div className="flex items-center gap-5 text-left w-full md:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center shrink-0">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-400">
                    {activeScore}
                    <span className="text-sm font-normal text-neutral-500">/{activeQuestions.length}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">{activePercentage}%</span>
                </div>

                <div className="space-y-1">
                  <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-1 ${getRank().badge}`}>
                    <Award className="w-3.5 h-3.5" />
                    <span>{getRank().title}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-100">
                    Výsledek: {activeScore === activeQuestions.length ? '100% bezchybný výkon!' : `${activeScore} z ${activeQuestions.length} správně`}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    {getRank().desc}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={handleRetakeWithNewQuestions}
                  className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Zopakovat s jinými otázkami</span>
                </button>

                <button
                  onClick={handleCopyResults}
                  className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-medium text-neutral-200 flex items-center gap-2 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Zkopírováno!' : 'Kopírovat výsledky'}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Resetovat
                </button>
              </div>
            </div>

            {/* Quick Question breakdown chips */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {activeQuestions.map((q) => {
                const userChoice = answers[q.id];
                const isCorrect = userChoice === q.correctAnswer;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      const el = document.getElementById(`question-${q.id}`);
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
                        : 'bg-red-950/40 border-red-500/40 hover:border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-neutral-300">Otázka {q.id}</span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-neutral-400">
                      Volba: <span className="font-bold text-neutral-200">{userChoice || '—'}</span>
                      {!isCorrect && (
                        <span className="text-emerald-400 ml-1">({q.correctAnswer})</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Interactive Simulator Section (Always available, highlighted if active) */}
        <section ref={simulatorRef} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 flex items-center gap-2">
                <Aperture className="w-6 h-6 text-amber-500" />
                <span>Interaktivní trenažér fotoaparátu & Motion Blur</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Otestujte vliv rychlosti závěrky od 1/8000 s až po 4 s, techniku Panning (švenkování), clonu, ISO a histogram.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">Režim:</span>
              <span className="font-mono text-sky-400 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">
                Čas & Motion Blur rozšířen
              </span>
            </div>
          </div>

          <ExposureSimulator initialTab={simulatorTab} onSoundPlay={soundEnabled ? playDialClick : undefined} />
        </section>

        {/* Quiz Questions Section */}
        <section ref={quizSectionRef} className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/40">
                  {activeSet === 'random' ? 'Náhodný mix' : `SADA OTÁZEK ${activeSet}`}
                </span>
                <span className="text-xs text-neutral-500">
                  (Test lze opakovat s novými otázkami)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-500" />
                <span>
                  {selectedLevel === 'basics' && 'Úroveň 1: Fotografické základy'}
                  {selectedLevel === 'intermediate' && 'Úroveň 2: Středně pokročilá technika'}
                  {selectedLevel === 'pro' && 'Úroveň 3: Masterclass & Úplně profi'}
                  {selectedLevel === 'all' && 'Kompletní fotografický maratón'}
                </span>
              </h2>
            </div>

            {/* Quick Set Switcher & Answered count */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRetakeWithNewQuestions}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-xs font-semibold text-sky-300 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Přepnout na sadu {activeSet === 1 ? '2' : '1'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Vyplněno: {activeAnsweredCount} z {activeQuestions.length}</span>
              </div>
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-6">
            {activeQuestions.map((question) => (
              <QuizCard
                key={question.id}
                question={question}
                selectedOption={answers[question.id]}
                onSelectOption={(opt) => handleSelectOption(question.id, opt)}
                isEvaluated={isEvaluated}
                onOpenSimulator={handleOpenSimulator}
              />
            ))}
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400 text-center sm:text-left">
              {activeAnsweredCount === activeQuestions.length ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                  <Check className="w-4 h-4" /> Všechny otázky této sady jsou zodpovězené!
                </span>
              ) : (
                <span>Zbývá vyplnit ještě {activeQuestions.length - activeAnsweredCount} otázek.</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRetakeWithNewQuestions}
                className="px-4 py-2.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Zopakovat s jinými otázkami</span>
              </button>

              <button
                onClick={handleFillPerfectAnswers}
                className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
              >
                Vyplnit správné volby
              </button>

              <button
                onClick={handleEvaluate}
                disabled={activeAnsweredCount === 0}
                className="px-6 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-neutral-950 text-xs font-bold transition-all shadow-md"
              >
                {isEvaluated ? 'Aktualizovat vyhodnocení' : 'Vyhodnotit test'}
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-6 text-xs text-neutral-400 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-neutral-300">Fotografická akademie · Trenažér & Kvíz</span>
          </div>
          <div>
            Aktivní sada: <span className="font-mono text-amber-400 font-bold">Varianta {activeSet}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
