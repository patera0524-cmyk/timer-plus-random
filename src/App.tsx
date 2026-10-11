/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Maximize, Settings as SettingsIcon, GraduationCap } from 'lucide-react';
import { DrawMode } from './types';
import { TimerSection } from './components/TimerSection';
import { RandomPickerSection } from './components/RandomPickerSection';
import { SettingsModal } from './components/SettingsModal';
import { CustomTimeModal } from './components/CustomTimeModal';
import { FinishModal } from './components/FinishModal';

const defaultStudents = [
  "강래연", "강애림", "김예영", "다이아나", "신예슬", "우예기",
  "이승환", "이예현", "이준성", "이찬", "장연아", "전서윤",
  "지은진", "최민준", "최아준", "한혜정", "조상혁"
];

export default function App() {
  // State initialization from localStorage
  const [students, setStudents] = useState<string[]>(() => {
    const saved = localStorage.getItem('pyeongtaek_61_students');
    return saved ? JSON.parse(saved) : [...defaultStudents];
  });

  const [remainingStudents, setRemainingStudents] = useState<string[]>(() => {
    const saved = localStorage.getItem('pyeongtaek_61_remaining_students');
    return saved ? JSON.parse(saved) : [...defaultStudents];
  });

  const [totalGroups, setTotalGroups] = useState<number>(() => {
    const saved = localStorage.getItem('pyeongtaek_61_group_count');
    return saved ? parseInt(saved) : 5;
  });

  const generateGroupsArray = (count: number) => {
    let arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(`${i}모둠`);
    }
    return arr;
  };

  const [remainingGroups, setRemainingGroups] = useState<string[]>(() => {
    const saved = localStorage.getItem('pyeongtaek_61_remaining_groups');
    return saved ? JSON.parse(saved) : generateGroupsArray(5);
  });

  const [currentMode, setCurrentMode] = useState<DrawMode>(() => {
    const saved = localStorage.getItem('pyeongtaek_61_draw_mode');
    return (saved as DrawMode) || 'student';
  });

  const [activityText, setActivityText] = useState<string>(() => {
    return localStorage.getItem('pyeongtaek_61_activity') || '';
  });

  const [history, setHistory] = useState<{ type: DrawMode; name: string; time: string }[]>(() => {
    const saved = localStorage.getItem('pyeongtaek_61_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Timer states
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 minutes default
  const [leftSeconds, setLeftSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('pyeongtaek_61_students', JSON.stringify(students));
    localStorage.setItem('pyeongtaek_61_remaining_students', JSON.stringify(remainingStudents));
    localStorage.setItem('pyeongtaek_61_group_count', totalGroups.toString());
    localStorage.setItem('pyeongtaek_61_remaining_groups', JSON.stringify(remainingGroups));
    localStorage.setItem('pyeongtaek_61_draw_mode', currentMode);
    localStorage.setItem('pyeongtaek_61_activity', activityText);
    localStorage.setItem('pyeongtaek_61_history', JSON.stringify(history));
  }, [students, remainingStudents, totalGroups, remainingGroups, currentMode, activityText, history]);

  // Audio chime on finish
  const playBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const playTone = (delay: number, freq: number) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }, delay);
      };

      playTone(0, 880);
      playTone(300, 880);
      playTone(600, 1174.66);
    } catch (e) {
      console.log('AudioContext not supported', e);
    }
  };

  const handleTimerFinish = () => {
    playBeepSound();
    setIsFinishModalOpen(true);
  };

  const handleExtend = () => {
    setIsFinishModalOpen(false);
    setTotalSeconds(60);
    setLeftSeconds(60);
    setIsRunning(true);
  };

  const handleAddHistory = (type: DrawMode, name: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setHistory((prev) => [{ type, name, time: timeStr }, ...prev.slice(0, 19)]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSaveSettings = (newStudents: string[], newGroupCount: number) => {
    setStudents(newStudents);
    setRemainingStudents([...newStudents]);
    setTotalGroups(newGroupCount);
    setRemainingGroups(generateGroupsArray(newGroupCount));
  };

  const handleCustomTimeConfirm = (minutes: number) => {
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setLeftSeconds(secs);
    setIsRunning(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-between bg-[#FFF9F0] text-slate-800 m-0 p-0 selection:bg-amber-200">

      {/* 상단 헤더 */}
      <header className="w-full bg-white/95 backdrop-blur border-b border-amber-100 px-6 py-3 flex items-center justify-between shadow-sm shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-700 tracking-tight flex items-center gap-2">
              스마트 교실 타이머
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">동물의 숲 에디션 🍃</span>
            </h1>
            <p className="text-xs text-slate-500">수업 집중 타이머 및 동물의 숲 랜덤 뽑기</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="flex items-center space-x-1 bg-sky-100 hover:bg-sky-200 text-sky-800 px-3.5 py-2 rounded-xl font-semibold shadow-sm transition active:scale-95 text-xs md:text-sm cursor-pointer"
          >
            <Maximize className="w-4 h-4" />
            <span className="hidden sm:inline">전체화면</span>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center space-x-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3.5 py-2 rounded-xl font-semibold shadow-sm transition active:scale-95 text-xs md:text-sm cursor-pointer"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>항목 설정</span>
          </button>
        </div>
      </header>

      {/* 메인 대시보드 영역 */}
      <main className="flex-1 w-full h-[calc(100vh-65px-45px)] p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-stretch overflow-hidden">
        
        {/* 좌측: 타이머 및 컨트롤 섹션 */}
        <TimerSection 
          activityText={activityText}
          onActivityChange={setActivityText}
          onTimerFinish={handleTimerFinish}
          onOpenCustomTime={() => setIsCustomTimeOpen(true)}
          totalSeconds={totalSeconds}
          leftSeconds={leftSeconds}
          setTotalSeconds={setTotalSeconds}
          setLeftSeconds={setLeftSeconds}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
        />

        {/* 우측: 미션 / 랜덤 뽑기 통합 섹션 */}
        <RandomPickerSection 
          students={students}
          remainingStudents={remainingStudents}
          setRemainingStudents={setRemainingStudents}
          totalGroups={totalGroups}
          remainingGroups={remainingGroups}
          setRemainingGroups={setRemainingGroups}
          currentMode={currentMode}
          setCurrentMode={setCurrentMode}
          onAddHistory={handleAddHistory}
          history={history}
        />

      </main>

      {/* 모달들 */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        students={students}
        totalGroups={totalGroups}
        onSave={handleSaveSettings}
      />

      <CustomTimeModal 
        isOpen={isCustomTimeOpen}
        onClose={() => setIsCustomTimeOpen(false)}
        onConfirm={handleCustomTimeConfirm}
      />

      <FinishModal 
        isOpen={isFinishModalOpen}
        onExtend={handleExtend}
        onClose={() => setIsFinishModalOpen(false)}
      />

      <footer className="w-full text-center py-2 text-xs text-slate-400 border-t border-amber-100/60 shrink-0 bg-white/50 backdrop-blur">
        스마트 교실 도구 • 닌텐도 동물의 숲 에디션 🍃
      </footer>

    </div>
  );
}
