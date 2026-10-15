import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sun,
  Sparkles,
  Aperture,
  Timer,
  Activity,
  Grid,
  BarChart2,
  Zap,
  Layers,
  Play,
  Pause,
  Compass,
  Gauge,
  Flame,
  Droplets
} from 'lucide-react';
import { playDialClick } from '../utils/cameraAudio';

export type SimulatorTabType =
  | 'aperture'
  | 'shutter'
  | 'iso'
  | 'whiteBalance'
  | 'raw'
  | 'thirds'
  | 'focal'
  | 'histogram'
  | 'flash'
  | 'ndFilter';

interface Props {
  initialTab?: SimulatorTabType;
  onSoundPlay?: () => void;
}

export const ExposureSimulator: React.FC<Props> = ({ initialTab = 'shutter', onSoundPlay }) => {
  const [activeTab, setActiveTab] = useState<SimulatorTabType>(initialTab);

  // Aperture state
  const apertureStops = [1.4, 1.8, 2.8, 4.0, 5.6, 8.0, 11, 16, 22];
  const [apertureIndex, setApertureIndex] = useState(1); // f/1.8 default

  // ============================================================
  // ENHANCED SHUTTER SPEED & MOTION BLUR ENGINE
  // ============================================================
  const shutterSpeeds = [
    { label: '1/8000 s', value: 8000, seconds: 1 / 8000, blurFactor: 0, freezeScore: 100, desc: 'Mrazicí čas – kapky vody i křídla kolibříka visí nehybně ve vzduchu.' },
    { label: '1/4000 s', value: 4000, seconds: 1 / 4000, blurFactor: 0, freezeScore: 100, desc: 'Extrémní akce, motorsport, sprintující atlet na slunci.' },
    { label: '1/2000 s', value: 2000, seconds: 1 / 2000, blurFactor: 0, freezeScore: 100, desc: 'Pes v plném skoku – zmrazené i nejrychlejší chlupy a tlapky.' },
    { label: '1/1000 s', value: 1000, seconds: 1 / 1000, blurFactor: 0.2, freezeScore: 98, desc: 'Zlatý standard pro běžící zvířata a dynamický sport.' },
    { label: '1/500 s', value: 500, seconds: 1 / 500, blurFactor: 1.2, freezeScore: 90, desc: 'Pomalý běh, cyklista; tlapky mohou mít lehký pohyb.' },
    { label: '1/250 s', value: 250, seconds: 1 / 250, blurFactor: 3.5, freezeScore: 75, desc: 'Běžná chůze lidí. U psa už znatelné rozmazání tlapek a ocasu.' },
    { label: '1/125 s', value: 125, seconds: 1 / 125, blurFactor: 7, freezeScore: 50, desc: 'Limit pro lidi z ruky; běžící pes má rozmazané celé tělo.' },
    { label: '1/60 s', value: 60, seconds: 1 / 60, blurFactor: 14, freezeScore: 30, desc: 'Výrazný motion blur – pes je rozmazaný, ale obrysy jsou patrné.' },
    { label: '1/30 s', value: 30, seconds: 1 / 30, blurFactor: 24, freezeScore: 15, desc: 'Silný pohybový pruh; ideální čas pro techniku Panning (švenkování)!' },
    { label: '1/15 s', value: 15, seconds: 1 / 15, blurFactor: 36, freezeScore: 5, desc: 'Dramatický pohybový vír, z ruky hrozí i roztřesení pozadí.' },
    { label: '1/4 s', value: 4, seconds: 1 / 4, blurFactor: 55, freezeScore: 0, desc: 'Plynoucí voda zjemňuje, pes je jen duchová šmouha (nutný stativ).' },
    { label: '1 s', value: 1, seconds: 1, blurFactor: 80, freezeScore: 0, desc: 'Hedvábná voda u vodopádu, běžící objekt zcela splyne s pozadím.' },
    { label: '4 s', value: 0.25, seconds: 4, blurFactor: 120, freezeScore: 0, desc: 'Dlouhá expozice ze stativu – mlha, noční světla aut.' }
  ];
  const [shutterIndex, setShutterIndex] = useState(3); // 1/1000 s default

  // Subject speed multiplier
  type SubjectType = 'dog' | 'car' | 'water' | 'walk';
  const [subjectType, setSubjectType] = useState<SubjectType>('dog');

  // Shooting mode: 'static' (camera stationary) vs 'panning' (camera follows moving subject)
  const [motionTechnique, setMotionTechnique] = useState<'static' | 'panning'>('static');

  // Animation playback
  const [isPlayingMotion, setIsPlayingMotion] = useState(false);
  const [animProgress, setAnimProgress] = useState(50);

  useEffect(() => {
    let animFrame: number;
    if (isPlayingMotion) {
      const step = () => {
        setAnimProgress((prev) => (prev >= 100 ? 0 : prev + 0.8));
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isPlayingMotion]);

  // ISO state
  const isoValues = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
  const [isoIndex, setIsoIndex] = useState(1);

  // White balance state
  const [kelvin, setKelvin] = useState<number>(5500);

  // RAW split
  const [splitPos, setSplitPos] = useState<number>(50);

  // Rule of thirds
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(true);

  // Focal length
  const focalLengths = [
    { mm: 16, type: 'Ultra-širokáč', distortion: 'Silné zkreslení obličeje, velký nos, environmentální scéna' },
    { mm: 35, type: 'Širší reportážní', distortion: 'Přirozený kontext, mírné zkreslení při detailu' },
    { mm: 50, type: 'Základní 50mm', distortion: 'Přirozená lidská perspektiva' },
    { mm: 85, type: 'Portrétní král (85 mm)', distortion: 'Ideální proporce obličeje bez deformace, luxusní bokeh' },
    { mm: 200, type: 'Teleobjektiv', distortion: 'Silná perspektivní komprese, zploštělé pozadí' }
  ];
  const [focalIndex, setFocalIndex] = useState(3);

  // Histogram EV
  const [exposureEv, setExposureEv] = useState<number>(0);

  // Flash distance
  const [flashDistance, setFlashDistance] = useState<number>(1.5);

  // ND Filter
  const ndFilters = [
    { name: 'Bez filtru', stops: 0, time: '1/500 s', silk: 0 },
    { name: 'ND8 (3 EV)', stops: 3, time: '1/60 s', silk: 2 },
    { name: 'ND64 (6 EV)', stops: 6, time: '1/8 s', silk: 6 },
    { name: 'ND1000 (10 EV)', stops: 10, time: '2 sekundy', silk: 14 }
  ];
  const [ndIndex, setNdIndex] = useState(0);

  const currentAperture = apertureStops[apertureIndex];
  const currentShutter = shutterSpeeds[shutterIndex];
  const currentIso = isoValues[isoIndex];
  const currentFocal = focalLengths[focalIndex];
  const currentNd = ndFilters[ndIndex];

  // Subject speed factor
  const speedMultipliers: Record<SubjectType, { factor: number; speedKmH: string; name: string }> = {
    dog: { factor: 1.0, speedKmH: '45 km/h', name: 'Běžící pes (Border Collie)' },
    car: { factor: 2.5, speedKmH: '180 km/h', name: 'Závodní vůz na okruhu' },
    water: { factor: 0.8, speedKmH: 'Dravý proud', name: 'Horský vodopád' },
    walk: { factor: 0.35, speedKmH: '5 km/h', name: 'Chodící člověk' }
  };

  const subjectSpeed = speedMultipliers[subjectType];
  const calculatedBlur = currentShutter.blurFactor * subjectSpeed.factor;

  const handleDialChange = (cb: () => void) => {
    playDialClick();
    if (onSoundPlay) onSoundPlay();
    cb();
  };

  const flashIntensityPercent = Math.round((1 / Math.pow(flashDistance, 2)) * 100);
  const flashEvDrop = (-2 * Math.log2(flashDistance)).toFixed(1);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top simulator bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <Aperture className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold tracking-wide text-neutral-200">
            Interaktivní trenažér expozice & Motion Blur
          </span>
          <span className="text-xs text-neutral-400 hidden md:inline">· Reálná simulace fyziky závěrky</span>
        </div>

        {/* Live exposure HUD readout */}
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-neutral-400 bg-neutral-900/90 px-3 py-1 rounded-lg border border-neutral-800 self-start sm:self-auto">
          <span className="text-amber-300 font-semibold">f/{currentAperture.toFixed(1)}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-sky-300 font-bold bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-500/30">
            {currentShutter.label}
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-emerald-300 font-semibold">ISO {currentIso}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-orange-300 font-semibold">{kelvin} K</span>
        </div>
      </div>

      {/* Simulator Mode Tabs */}
      <div className="flex overflow-x-auto border-b border-neutral-800 bg-neutral-950/40 p-1.5 gap-1 text-xs font-medium no-scrollbar">
        {[
          { id: 'shutter', label: '⏱️ Čas & Motion Blur (Rozšířeno)', icon: Timer, highlight: true },
          { id: 'aperture', label: 'Clona & Difrakce', icon: Aperture },
          { id: 'iso', label: 'Citlivost ISO', icon: Activity },
          { id: 'whiteBalance', label: 'Vyvážení bílé (WB)', icon: Sun },
          { id: 'raw', label: 'RAW vs JPEG', icon: Sparkles },
          { id: 'thirds', label: 'Pravidlo třetin', icon: Grid },
          { id: 'focal', label: 'Ohnisko & Portrét', icon: Camera },
          { id: 'histogram', label: 'Histogram & ETTR', icon: BarChart2 },
          { id: 'ndFilter', label: 'ND Filtry (10 EV)', icon: Layers },
          { id: 'flash', label: 'Záblesk & 1/d²', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleDialChange(() => setActiveTab(tab.id as SimulatorTabType))}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                  : tab.highlight
                  ? 'text-sky-300 bg-sky-950/40 border border-sky-500/30 hover:bg-sky-900/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Sandbox Area */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Visual Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative aspect-[16/10] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center select-none shadow-inner">
            
            {/* ============================================================ */}
            {/* 1. ADVANCED SHUTTER SPEED & REAL-TIME MOTION BLUR STAGE */}
            {/* ============================================================ */}
            {activeTab === 'shutter' && (
              <div className="relative w-full h-full overflow-hidden">
                {/* SVG Filter for realistic linear horizontal motion blur */}
                <svg className="absolute w-0 h-0 pointer-events-none">
                  <defs>
                    <filter id="motionBlurFilter" x="-50%" y="-20%" width="200%" height="140%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation={`${Math.min(45, calculatedBlur * 0.8)}, 0`} />
                    </filter>
                    <filter id="panningBgFilter" x="-50%" y="-20%" width="200%" height="140%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation={`${Math.min(50, calculatedBlur * 1.1)}, 0`} />
                    </filter>
                  </defs>
                </svg>

                {/* Background Layer: When Panning, background gets horizontal motion streak; in Static, background is crisp */}
                <div
                  className="absolute inset-0 w-full h-full transition-all duration-200"
                  style={{
                    filter: motionTechnique === 'panning' && calculatedBlur > 1 ? 'url(#panningBgFilter)' : 'none',
                    transform: motionTechnique === 'panning' && calculatedBlur > 5 ? 'scale(1.05)' : 'none'
                  }}
                >
                  <img
                    src="/src/assets/images/dog_running_action_1792087457726.jpg"
                    alt="Běžící pes v akci"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Moving Subject Layer in Static Mode: subject gets blurred */}
                {motionTechnique === 'static' && calculatedBlur > 1 && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-200"
                    style={{
                      filter: 'url(#motionBlurFilter)',
                      opacity: Math.min(1, 0.4 + (calculatedBlur / 50))
                    }}
                  >
                    <img
                      src="/src/assets/images/dog_running_action_1792087457726.jpg"
                      alt="Pohybové rozmazání"
                      className="w-full h-full object-cover mix-blend-screen opacity-70"
                    />
                  </div>
                )}

                {/* Animated Ghost trails for long exposures (> 1/15s) */}
                {currentShutter.value <= 15 && (
                  <div
                    className="absolute inset-0 pointer-events-none bg-sky-500/10 mix-blend-overlay"
                    style={{
                      opacity: Math.min(0.8, (20 - currentShutter.value) * 0.05)
                    }}
                  />
                )}

                {/* Dark Vignette & Gradient for HUD contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                {/* Top Left: Shutter Status Badge */}
                <div className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 rounded-xl p-2.5 flex items-center gap-3 shadow-xl">
                  <div className={`p-2 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                    currentShutter.freezeScore >= 90
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : currentShutter.freezeScore >= 50
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      : currentShutter.freezeScore > 0
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  }`}>
                    <Timer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-300 text-sm">{currentShutter.label}</span>
                      <span className="text-[10px] font-mono text-neutral-400">({currentShutter.seconds.toFixed(4)} s)</span>
                    </div>
                    <div className="text-[11px] text-neutral-300 font-medium">
                      {currentShutter.freezeScore >= 95
                        ? '❄️ Pohyb dokonale zmrazen'
                        : currentShutter.freezeScore >= 70
                        ? '⚡ Mírné rozmazání končetin'
                        : currentShutter.freezeScore >= 20
                        ? '💨 Výrazný Motion Blur'
                        : '🌊 Dlouhá expozice (Hedvábný závoj)'}
                    </div>
                  </div>
                </div>

                {/* Top Right: Technique indicator (Static vs Panning) */}
                <div className="absolute top-3 right-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-[11px] font-mono">
                  {motionTechnique === 'panning' ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> Panning (Švenk)
                    </span>
                  ) : (
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" /> Statický záběr
                    </span>
                  )}
                </div>

                {/* Freeze Percentage Gauge */}
                <div className="absolute bottom-14 right-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono">
                  <span className="text-neutral-400">Ostrost pohybu:</span>
                  <span className={`font-bold ${currentShutter.freezeScore >= 80 ? 'text-emerald-400' : currentShutter.freezeScore >= 40 ? 'text-amber-400' : 'text-purple-400'}`}>
                    {currentShutter.freezeScore}%
                  </span>
                </div>

                {/* Bottom Analysis Banner */}
                <div className="absolute bottom-3 left-3 right-3 text-xs text-neutral-300 bg-neutral-950/90 backdrop-blur-md p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-sky-400 font-semibold">{subjectSpeed.name} ({subjectSpeed.speedKmH}):</span>{' '}
                  {motionTechnique === 'panning'
                    ? `Při švenkování (Panningu) při ${currentShutter.label} sledujete fotoaparátem pohyb psa – pes zůstává zřetelný a celé pozadí má dramatické dynamické pruhy pohybu!`
                    : currentShutter.desc}
                </div>
              </div>
            )}

            {/* 2. APERTURE STAGE (Paní je dokonale zaostřená, pozadí se rozostřuje) */}
            {activeTab === 'aperture' && (
              <div className="relative w-full h-full overflow-hidden">
                {/* Layer 1: Background layer with progressive bokeh blur */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src="/src/assets/images/portrait_bokeh_1792087443048.jpg"
                    alt="Rozostřené pozadí portrétu"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{
                      filter: `blur(${Math.max(0, (16 - currentAperture) * 1.35)}px) brightness(${
                        currentAperture < 2.8 ? 1.05 : currentAperture > 11 ? 0.92 : 1
                      })`,
                      transform: 'scale(1.04)',
                      opacity: currentAperture === 22 ? 0.92 : 1
                    }}
                  />
                </div>

                {/* Layer 2: Foreground subject (Lady) KEPT RAZOR SHARP IN FOCUS */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-all duration-200"
                  style={{
                    maskImage: 'radial-gradient(ellipse 52% 68% at 53% 54%, black 52%, rgba(0,0,0,0.85) 72%, transparent 92%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 52% 68% at 53% 54%, black 52%, rgba(0,0,0,0.85) 72%, transparent 92%)'
                  }}
                >
                  <img
                    src="/src/assets/images/portrait_bokeh_1792087443048.jpg"
                    alt="Zaostřená modelka"
                    className="w-full h-full object-cover"
                    style={{
                      filter: `brightness(${currentAperture < 2.8 ? 1.04 : 1}) contrast(102%)`
                    }}
                  />
                </div>

                {/* Subtle vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

                {/* Camera Eye-AF Focus Target Reticle on the lady's eye */}
                <div className="absolute left-[47%] top-[35.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-emerald-400 rounded-sm shadow-lg shadow-emerald-500/20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </div>
                  <span className="mt-1 bg-neutral-950/90 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                    ● Eye-AF [Zaostřeno na oko]
                  </span>
                </div>

                {/* Top Left: Aperture HUD readout */}
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-2.5 flex items-center gap-3 text-xs">
                  <svg width="44" height="44" viewBox="0 0 100 100" className="text-amber-400">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4" />
                    <circle cx="50" cy="50" r={Math.max(4, 44 - (currentAperture / 22) * 40)} fill="#f59e0b" opacity="0.85" />
                  </svg>
                  <div>
                    <div className="font-mono font-bold text-amber-400 text-sm">f/{currentAperture.toFixed(1)}</div>
                    <div className="text-[11px] text-neutral-300">
                      {currentAperture <= 2.8 ? 'Malá hloubka (Bokeh)' : currentAperture === 22 ? 'Difrakce clony' : 'Vysoká hloubka ostrosti'}
                    </div>
                  </div>
                </div>

                {/* Top Right: Subject Focus Confirmation */}
                <div className="absolute top-3 right-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Modelka 100% ostrá</span>
                </div>

                {/* Bottom Analysis */}
                <div className="absolute bottom-3 left-3 right-3 text-xs text-neutral-300 bg-neutral-950/90 backdrop-blur-md p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-emerald-400 font-semibold">Zaostřená modelka:</span>{' '}
                  {currentAperture <= 2.8
                    ? 'Tvář i oči paní jsou dokonale břitce ostré, zatímco stromy a světla v pozadí se rozpíjí do krémového bokehu (malá hloubka ostrosti).'
                    : currentAperture >= 16
                    ? currentAperture === 22
                      ? 'Při cloně f/22 dochází k optické difrakci – světlo se ohýbá o lamely a mikrokontrast mírně měkne.'
                      : 'Ostrá je modelka i celé pozadí se stromy (velká hloubka ostrosti).'
                    : 'Univerzální clona s přirozenou separací tváře od pozadí.'}
                </div>
              </div>
            )}

            {/* 3. ISO STAGE */}
            {activeTab === 'iso' && (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/src/assets/images/hero_camera_lens_1792087429009.jpg"
                  alt="Scéna pro simulaci ISO šumu"
                  className="w-full h-full object-cover"
                  style={{ filter: `contrast(${100 - (isoIndex * 4)}%) brightness(${100 + (isoIndex * 2)}%)` }}
                />
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: (isoIndex / (isoValues.length - 1)) * 0.65 }}>
                  <filter id="noiseFilterIso">
                    <feTurbulence type="fractalNoise" baseFrequency={0.8 + (isoIndex * 0.1)} numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#noiseFilterIso)" opacity="0.8" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-2.5">
                  <div className="font-mono font-bold text-emerald-400 text-sm">ISO {currentIso}</div>
                  <div className="text-[11px] text-neutral-300">
                    {currentIso <= 400 ? 'Čistý obraz · Max dynamický rozsah' : currentIso >= 6400 ? 'Vysoký digitální šum · Ztráta mikrokontrastu' : 'Střední šum'}
                  </div>
                </div>
              </div>
            )}

            {/* 4. WHITE BALANCE STAGE */}
            {activeTab === 'whiteBalance' && (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/src/assets/images/hero_camera_lens_1792087429009.jpg"
                  alt="Scéna pro vyvážení bílé"
                  className="w-full h-full object-cover transition-all duration-150"
                  style={{
                    filter: `sepia(${(kelvin > 5500 ? (kelvin - 5500) / 4000 : 0) * 0.7}) hue-rotate(${
                      kelvin < 5500 ? (kelvin - 5500) / 35 : 0
                    }deg) saturate(${100 + Math.abs(kelvin - 5500) / 80}%)`
                  }}
                />
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-2.5">
                  <div className="font-mono font-bold text-orange-400 text-sm">{kelvin} K</div>
                  <div className="text-[11px] text-neutral-300">{kelvin < 4000 ? 'Chladný nádech (Žárovka)' : kelvin > 6500 ? 'Teplý nádech (Stín)' : 'Denní světlo (5500 K)'}</div>
                </div>
              </div>
            )}

            {/* 5. RAW VS JPEG STAGE */}
            {activeTab === 'raw' && (
              <div className="relative w-full h-full overflow-hidden cursor-ew-resize">
                <div className="absolute inset-0">
                  <img src="/src/assets/images/portrait_bokeh_1792087443048.jpg" alt="RAW data" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded text-xs font-mono font-semibold">
                    RAW (14-bit)
                  </div>
                </div>
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${splitPos}%`, borderRight: '2px solid #f59e0b' }}>
                  <div className="w-[100vw] h-full max-w-[800px] relative">
                    <img src="/src/assets/images/portrait_bokeh_1792087443048.jpg" alt="JPEG" className="w-full h-full object-cover" style={{ filter: 'contrast(135%) brightness(120%)' }} />
                    <div className="absolute top-3 left-3 bg-red-950/80 border border-red-500/40 text-red-300 px-2.5 py-1 rounded text-xs font-mono font-semibold">
                      JPEG (8-bit)
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 text-neutral-950 shadow-lg flex items-center justify-center font-bold text-xs pointer-events-none" style={{ left: `${splitPos}%` }}>
                  ↔
                </div>
              </div>
            )}

            {/* 6. RULE OF THIRDS STAGE */}
            {activeTab === 'thirds' && (
              <div className="relative w-full h-full overflow-hidden">
                <img src="/src/assets/images/dog_running_action_1792087457726.jpg" alt="Kompozice" className="w-full h-full object-cover" />
                {showGrid && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-amber-400/50" />
                    <div className="border-r border-b border-amber-400/50" />
                    <div className="border-b border-amber-400/50" />
                    <div className="border-r border-b border-amber-400/50" />
                    <div className="border-r border-b border-amber-400/50" />
                    <div className="border-b border-amber-400/50" />
                    <div className="border-r border-b border-amber-400/50" />
                    <div className="border-r border-b border-amber-400/50" />
                    <div />
                  </div>
                )}
                {showPoints && (
                  <>
                    <div className="absolute left-[33.33%] top-[33.33%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white pointer-events-none" />
                    <div className="absolute left-[66.66%] top-[33.33%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white pointer-events-none" />
                    <div className="absolute left-[33.33%] top-[66.66%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white pointer-events-none" />
                    <div className="absolute left-[66.66%] top-[66.66%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 border-2 border-white pointer-events-none" />
                  </>
                )}
              </div>
            )}

            {/* 7. FOCAL LENGTH STAGE */}
            {activeTab === 'focal' && (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/src/assets/images/portrait_bokeh_1792087443048.jpg"
                  alt="Ohnisko"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ transform: `scale(${0.9 + (currentFocal.mm / 85) * 0.15})` }}
                />
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-2.5">
                  <div className="font-mono font-bold text-amber-400 text-sm">{currentFocal.mm} mm · {currentFocal.type}</div>
                </div>
              </div>
            )}

            {/* 8. HISTOGRAM STAGE */}
            {activeTab === 'histogram' && (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/src/assets/images/hero_camera_lens_1792087429009.jpg"
                  alt="Histogram scéna"
                  className="w-full h-full object-cover transition-all duration-200"
                  style={{ filter: `brightness(${100 + exposureEv * 35}%) contrast(${100 + Math.abs(exposureEv) * 10}%)` }}
                />
                <div className="absolute top-3 right-3 bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 rounded-xl p-3 w-56 shadow-2xl">
                  <div className="text-[11px] font-mono text-neutral-400 mb-1 flex justify-between">
                    <span>Stíny</span>
                    <span className="text-amber-400 font-bold">Histogram</span>
                    <span>Světla</span>
                  </div>
                  <svg viewBox="0 0 100 40" className="w-full h-16 bg-neutral-900/90 rounded border border-neutral-800">
                    <path
                      d={`M 0 40 Q ${25 + exposureEv * 10} ${Math.max(5, 35 - Math.max(0, -exposureEv * 12))}, ${50 + exposureEv * 12} ${Math.max(2, 10 + Math.abs(exposureEv) * 5)} T 100 40 Z`}
                      fill="#f59e0b"
                      opacity="0.8"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* 9. ND FILTER STAGE */}
            {activeTab === 'ndFilter' && (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/src/assets/images/dog_running_action_1792087457726.jpg"
                  alt="ND filtr"
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter: currentNd.silk > 0 ? `blur(${currentNd.silk * 0.8}px)` : 'none' }}
                />
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-2.5">
                  <div className="font-mono font-bold text-purple-300 text-sm">{currentNd.name}</div>
                  <div className="text-[11px] text-neutral-300">Čas: {currentNd.time} (-{currentNd.stops} EV)</div>
                </div>
              </div>
            )}

            {/* 10. FLASH INVERSE SQUARE STAGE */}
            {activeTab === 'flash' && (
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/src/assets/images/portrait_bokeh_1792087443048.jpg"
                  alt="Blesk"
                  className="w-full h-full object-cover"
                  style={{ filter: `contrast(${100 + (3 - flashDistance) * 15}%)` }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 45% 45%, transparent 20%, rgba(0,0,0,${Math.min(0.95, (flashDistance - 0.8) * 0.35)}) 85%)` }}
                />
                <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 rounded-lg p-2.5">
                  <div className="font-mono font-bold text-amber-400 text-sm">{flashDistance.toFixed(1)} m · {flashIntensityPercent}% ({flashEvDrop} EV)</div>
                </div>
              </div>
            )}

          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>Posuvníkem měňte rychlost závěrky a sledujte změnu pohybového rozostření (Motion Blur).</span>
          </div>
        </div>

        {/* Right: Parameter Controls Deck (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80">
          
          {/* ============================================================ */}
          {/* ENHANCED SHUTTER SPEED CONTROLS DECK */}
          {/* ============================================================ */}
          {activeTab === 'shutter' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-sky-400" />
                    <span>Čas závěrky (Shutter Speed)</span>
                  </label>
                  <span className="text-base font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-500/40">
                    {currentShutter.label}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={shutterSpeeds.length - 1}
                  step="1"
                  value={shutterIndex}
                  onChange={(e) => handleDialChange(() => setShutterIndex(Number(e.target.value)))}
                  className="w-full accent-sky-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-1">
                  <span>1/8000s</span>
                  <span>1/1000s (Zmrazení)</span>
                  <span>1/30s (Panning)</span>
                  <span>4s (Stativ)</span>
                </div>
              </div>

              {/* Subject Speed Selector */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
                  <span>Focený objekt & rychlost:</span>
                  <span className="text-sky-300 font-mono">{subjectSpeed.speedKmH}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'dog', label: '🐕 Pes v běhu (45 km/h)' },
                    { id: 'car', label: '🏎️ Závodní vůz (180 km/h)' },
                    { id: 'walk', label: '🚶 Chodec (5 km/h)' },
                    { id: 'water', label: '🌊 Vodopád (proud)' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleDialChange(() => setSubjectType(sub.id as SubjectType))}
                      className={`p-2 rounded-lg border text-left text-[11px] transition-colors truncate ${
                        subjectType === sub.id
                          ? 'bg-sky-500/20 border-sky-500/60 text-sky-200 font-semibold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shooting Technique: Static Camera vs Panning (Švenk) */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Technika snímání:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleDialChange(() => setMotionTechnique('static'))}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      motionTechnique === 'static'
                        ? 'bg-neutral-800 border-neutral-600 text-neutral-100 font-semibold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-sky-400" />
                      <span>Statický záběr</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Pozadí je ostré, pohybující se objekt se rozmaže.
                    </p>
                  </button>

                  <button
                    onClick={() => handleDialChange(() => setMotionTechnique('panning'))}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      motionTechnique === 'panning'
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-semibold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 text-amber-400">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Panning (Švenk)</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Sledujete cíl: objekt je ostrý, pozadí má šmouhy pohybu!
                    </p>
                  </button>
                </div>
              </div>

              {/* Real-time Hand-held vs Tripod indicator */}
              <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-300">Stabilita expozice:</span>
                  <span className={`font-mono text-[11px] font-bold ${
                    currentShutter.value >= 125
                      ? 'text-emerald-400'
                      : currentShutter.value >= 30
                      ? 'text-amber-400'
                      : 'text-purple-400'
                  }`}>
                    {currentShutter.value >= 125
                      ? '✅ Bezpečně z ruky'
                      : currentShutter.value >= 30
                      ? '⚠️ Opatrně z ruky (klidový dech)'
                      : '🛑 Nutný stativ (Tripod required)'}
                  </span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  {currentShutter.value >= 1000
                    ? 'Při čase 1/1000 s a kratším zmrazíte i kapičky vody vyprsknuté od tlapek psa.'
                    : currentShutter.value >= 125
                    ? 'Zlaté pravidlo: Pro 50mm objektiv udržíte z ruky čas 1/50 s nebo kratší.'
                    : 'Při čase pod 1/30 s hrozí roztřesení celého záběru chvěním rukou.'}
                </p>
              </div>
            </div>
          )}

          {/* APERTURE CONTROLS */}
          {activeTab === 'aperture' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Clonové číslo (f-stop)
                  </label>
                  <span className="text-base font-mono font-bold text-amber-400">
                    f/{currentAperture.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={apertureStops.length - 1}
                  step="1"
                  value={apertureIndex}
                  onChange={(e) => handleDialChange(() => setApertureIndex(Number(e.target.value)))}
                  className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-1.5">
                  {apertureStops.map((f, i) => (
                    <button key={f} onClick={() => handleDialChange(() => setApertureIndex(i))} className={i === apertureIndex ? 'text-amber-400 font-bold' : ''}>
                      f/{f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-neutral-900/90 rounded-lg p-3 border border-neutral-800 space-y-2 text-xs">
                <div className="font-semibold text-neutral-200">Klíčová pravidla clony:</div>
                <div className="text-neutral-400 text-[11px]">f/1.4–f/2.8: Bokeh a portrét · f/8: Sweet spot ostrosti · f/22: Pozor na difrakci!</div>
              </div>
            </div>
          )}

          {/* ISO CONTROLS */}
          {activeTab === 'iso' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Citlivost snímače (ISO)
                  </label>
                  <span className="text-base font-mono font-bold text-emerald-400">ISO {currentIso}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={isoValues.length - 1}
                  step="1"
                  value={isoIndex}
                  onChange={(e) => handleDialChange(() => setIsoIndex(Number(e.target.value)))}
                  className="w-full accent-emerald-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
              <div className="bg-neutral-900/90 rounded-lg p-3 border border-neutral-800 text-xs text-neutral-400">
                Základní ISO 100 má nejvyšší dynamický rozsah. Zvyšujte ho pouze tehdy, když nemůžete více otevřít clonu ani prodloužit čas bez rozmazání.
              </div>
            </div>
          )}

          {/* WHITE BALANCE */}
          {activeTab === 'whiteBalance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Kelviny</label>
                <span className="text-base font-mono font-bold text-orange-400">{kelvin} K</span>
              </div>
              <input
                type="range"
                min="2500"
                max="8500"
                step="100"
                value={kelvin}
                onChange={(e) => handleDialChange(() => setKelvin(Number(e.target.value)))}
                className="w-full accent-orange-400 h-2 bg-gradient-to-r from-blue-400 via-white to-amber-500 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* RAW */}
          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Rozdělení náhledu</label>
                <span className="text-xs font-mono text-neutral-400">{splitPos}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={splitPos}
                onChange={(e) => setSplitPos(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* THIRDS */}
          {activeTab === 'thirds' && (
            <div className="space-y-2">
              <button onClick={() => handleDialChange(() => setShowGrid(!showGrid))} className="w-full p-2.5 rounded-lg border text-xs bg-neutral-900 border-neutral-800 text-neutral-300">
                Mřížka 3x3: {showGrid ? 'ZAPNUTO' : 'VYPNUTO'}
              </button>
              <button onClick={() => handleDialChange(() => setShowPoints(!showPoints))} className="w-full p-2.5 rounded-lg border text-xs bg-neutral-900 border-neutral-800 text-neutral-300">
                Průsečíky: {showPoints ? 'ZAPNUTO' : 'VYPNUTO'}
              </button>
            </div>
          )}

          {/* FOCAL */}
          {activeTab === 'focal' && (
            <div className="space-y-1.5">
              {focalLengths.map((f, i) => (
                <button
                  key={f.mm}
                  onClick={() => handleDialChange(() => setFocalIndex(i))}
                  className={`w-full p-2.5 rounded-lg border text-xs flex justify-between ${i === focalIndex ? 'bg-amber-500/20 border-amber-500/60 text-amber-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}
                >
                  <span>{f.type}</span>
                  <span className="font-mono font-bold">{f.mm} mm</span>
                </button>
              ))}
            </div>
          )}

          {/* HISTOGRAM */}
          {activeTab === 'histogram' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Korekce expozice</label>
                <span className="text-base font-mono font-bold text-amber-400">{exposureEv > 0 ? `+${exposureEv}` : exposureEv} EV</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={exposureEv}
                onChange={(e) => handleDialChange(() => setExposureEv(Number(e.target.value)))}
                className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* ND FILTER */}
          {activeTab === 'ndFilter' && (
            <div className="space-y-2">
              {ndFilters.map((nd, idx) => (
                <button
                  key={nd.name}
                  onClick={() => handleDialChange(() => setNdIndex(idx))}
                  className={`w-full p-2.5 rounded-lg border text-xs flex justify-between ${idx === ndIndex ? 'bg-purple-500/20 border-purple-500/60 text-purple-300' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}
                >
                  <span>{nd.name}</span>
                  <span className="font-mono font-bold text-amber-400">{nd.time}</span>
                </button>
              ))}
            </div>
          )}

          {/* FLASH */}
          {activeTab === 'flash' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Vzdálenost světla</label>
                <span className="text-base font-mono font-bold text-amber-400">{flashDistance.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="4.0"
                step="0.2"
                value={flashDistance}
                onChange={(e) => handleDialChange(() => setFlashDistance(Number(e.target.value)))}
                className="w-full accent-amber-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* Bottom quick tip card */}
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center gap-2 text-neutral-400 text-[11px]">
            <Camera className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Kombinace času a pohybu vytváří buď ostré zmrazení, nebo dynamické linie rychlosti.</span>
          </div>

        </div>
      </div>
    </div>
  );
};
