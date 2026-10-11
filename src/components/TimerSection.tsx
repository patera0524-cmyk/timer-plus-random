import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, RotateCcw, Clock, Sparkles } from 'lucide-react';

interface TimerSectionProps {
  activityText: string;
  onActivityChange: (text: string) => void;
  onTimerFinish: () => void;
  onOpenCustomTime: () => void;
  totalSeconds: number;
  leftSeconds: number;
  setTotalSeconds: React.Dispatch<React.SetStateAction<number>>;
  setLeftSeconds: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TimerSection({
  activityText,
  onActivityChange,
  onTimerFinish,
  onOpenCustomTime,
  totalSeconds,
  leftSeconds,
  setTotalSeconds,
  setLeftSeconds,
  isRunning,
  setIsRunning,
}: TimerSectionProps) {
  const [statusText, setStatusText] = useState('준비 완료');

  // SVG circle progress calculation
  const radius = 220;
  const circumference = 2 * Math.PI * radius;
  const ratio = totalSeconds > 0 ? leftSeconds / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - ratio);

  // Determine color and status message based on remaining time ratio
  let barColor = '#C8F0E0'; // Mint
  let currentStatusMsg = '여유로운 진행 중';

  if (ratio <= 0.2) {
    barColor = '#FFB088'; // Peach
    currentStatusMsg = '⏰ 마무리 단계!';
  } else if (ratio <= 0.5) {
    barColor = '#FFE88A'; // Yellow
    currentStatusMsg = '⚡ 서둘러주세요!';
  }

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && leftSeconds > 0) {
      interval = setInterval(() => {
        setLeftSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, leftSeconds, onTimerFinish, setLeftSeconds, setIsRunning]);

  // Update status text
  useEffect(() => {
    if (!isRunning && leftSeconds === totalSeconds) {
      setStatusText('준비 완료');
    } else if (!isRunning && leftSeconds > 0) {
      setStatusText('일시정지됨');
    } else if (isRunning) {
      setStatusText(currentStatusMsg);
    }
  }, [isRunning, leftSeconds, totalSeconds, currentStatusMsg]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handlePresetClick = (secs: number) => {
    setTotalSeconds(secs);
    setLeftSeconds(secs);
    setIsRunning(false);
  };

  const handleStart = () => {
    if (leftSeconds <= 0) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStatusText('정지됨');
  };

  const handleReset = () => {
    setIsRunning(false);
    setLeftSeconds(totalSeconds);
    setStatusText('준비 완료');
  };

  const activityPresets = ['쉬는 시간', '중간 놀이 시간', '점심 시간', '활동 시간', '평가 시간'];

  return (
    <section id="timer-section" className="lg:col-span-8 flex flex-col items-center justify-between bg-white/95 backdrop-blur p-4 sm:p-5 md:p-6 rounded-3xl shadow-xl border border-amber-100 h-full overflow-y-auto">
      
      {/* 상단 바: 지금은 입력 & 활동 프리셋 */}
      <div className="w-full max-w-2xl flex flex-col space-y-2 shrink-0">
        <div className="w-full flex items-center bg-amber-50/85 border border-amber-200/80 rounded-2xl px-4 py-2 sm:py-2.5 shadow-inner">
          <span className="text-amber-800 font-bold text-sm md:text-base mr-3 shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" /> 지금은:
          </span>
          <input 
            type="text" 
            value={activityText}
            onChange={(e) => onActivityChange(e.target.value)}
            placeholder="예: 수학 익힘책 풀이 및 발표" 
            className="w-full bg-transparent text-sm md:text-base font-semibold text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* 활동 프리셋 5개 */}
        <div className="w-full flex flex-nowrap overflow-x-auto pb-1 gap-1.5 justify-start md:justify-center">
          {activityPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => onActivityChange(preset)}
              className="shrink-0 bg-amber-200/80 hover:bg-amber-300 text-amber-950 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 중앙 타이머 및 SVG 원형 프로그레스 바 (반응형 축소 지원) */}
      <div className="relative flex items-center justify-center my-auto py-1 sm:py-2 shrink-0">
        <svg className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 max-h-[38vh] transform -rotate-90" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r={radius} stroke="#F1F5F9" strokeWidth="28" fill="none" />
          <circle 
            cx="250" 
            cy="250" 
            r={radius} 
            stroke={barColor} 
            strokeWidth="28" 
            fill="none" 
            strokeLinecap="round" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className={`font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wider ${leftSeconds <= 3 && leftSeconds > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-800'}`}>
            {formatTime(leftSeconds)}
          </div>
          <div className="text-xs md:text-sm font-semibold text-slate-400 mt-1 sm:mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {statusText}
          </div>
        </div>
      </div>

      {/* 하단 타이머 컨트롤 및 시간 프리셋 */}
      <div className="w-full max-w-xl flex flex-col space-y-2.5 sm:space-y-3 shrink-0">
        {/* 시간 프리셋: 1분, 3분, 5분, 10분, 15분, 20분(추가), 직접입력 */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          <button onClick={() => handlePresetClick(60)} className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer">1분</button>
          <button onClick={() => handlePresetClick(180)} className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer">3분</button>
          <button onClick={() => handlePresetClick(300)} className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer">5분</button>
          <button onClick={() => handlePresetClick(600)} className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer">10분</button>
          <button onClick={() => handlePresetClick(900)} className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer">15분</button>
          <button onClick={() => handlePresetClick(1200)} className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer">20분</button>
          <button onClick={onOpenCustomTime} className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 sm:py-1.5 rounded-xl font-bold text-xs md:text-sm transition active:scale-95 shadow-sm cursor-pointer">직접입력</button>
        </div>

        {/* 컨트롤 버튼: 창을 줄여도 선명하게 유지 */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full">
          <button 
            onClick={handleStart}
            disabled={isRunning}
            className={`font-black py-2.5 sm:py-3.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-1 text-xs sm:text-sm md:text-base cursor-pointer min-w-0 ${isRunning ? 'bg-emerald-300 text-white cursor-not-allowed opacity-70' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" /><span className="truncate">시작</span>
          </button>
          <button 
            onClick={handlePause}
            disabled={!isRunning}
            className={`font-black py-2.5 sm:py-3.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center gap-1 text-xs sm:text-sm md:text-base cursor-pointer min-w-0 ${!isRunning ? 'bg-amber-200 text-amber-800 opacity-70 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-500 text-amber-950'}`}
          >
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" /><span className="truncate">일시정지</span>
          </button>
          <button 
            onClick={handleStop}
            className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-black py-2.5 sm:py-3.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1 text-xs sm:text-sm md:text-base cursor-pointer min-w-0"
          >
            <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" /><span className="truncate">정지</span>
          </button>
          <button 
            onClick={handleReset}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-2.5 sm:py-3.5 px-1 sm:px-2 rounded-xl sm:rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1 text-xs sm:text-sm md:text-base cursor-pointer min-w-0"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /><span className="truncate">초기화</span>
          </button>
        </div>
      </div>

    </section>
  );
}
