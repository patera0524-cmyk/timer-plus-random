import React, { useState } from 'react';
import { Dice5, User, Users, RefreshCcw, Sparkles } from 'lucide-react';
import { DrawMode } from '../types';

interface RandomPickerSectionProps {
  students: string[];
  remainingStudents: string[];
  setRemainingStudents: React.Dispatch<React.SetStateAction<string[]>>;
  totalGroups: number;
  remainingGroups: string[];
  setRemainingGroups: React.Dispatch<React.SetStateAction<string[]>>;
  currentMode: DrawMode;
  setCurrentMode: (mode: DrawMode) => void;
  onAddHistory: (type: DrawMode, name: string) => void;
  history: { type: DrawMode; name: string; time: string }[];
}

export function RandomPickerSection({
  students,
  remainingStudents,
  setRemainingStudents,
  totalGroups,
  remainingGroups,
  setRemainingGroups,
  currentMode,
  setCurrentMode,
  onAddHistory,
  history,
}: RandomPickerSectionProps) {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateGroupsArray = (count: number) => {
    let arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(`${i}모둠`);
    }
    return arr;
  };

  const totalGroupsArr = generateGroupsArray(totalGroups);

  const handleResetList = () => {
    if (currentMode === 'student') {
      setRemainingStudents([...students]);
    } else {
      setRemainingGroups([...totalGroupsArr]);
    }
    setSelectedResult(null);
  };

  const executeDraw = () => {
    if (isAnimating) return;

    if (currentMode === 'student') {
      if (students.length === 0) {
        setSelectedResult('등록된 학생이 없습니다!');
        return;
      }
      let currentRem = [...remainingStudents];
      if (currentRem.length === 0) {
        currentRem = [...students];
      }
      
      setIsAnimating(true);
      let count = 0;
      const shuffleInterval = setInterval(() => {
        const randIdx = Math.floor(Math.random() * students.length);
        setSelectedResult(students[randIdx]);
        count++;
        if (count > 8) {
          clearInterval(shuffleInterval);
          const finalIdx = Math.floor(Math.random() * currentRem.length);
          const chosen = currentRem.splice(finalIdx, 1)[0];
          setRemainingStudents(currentRem);
          setSelectedResult(chosen);
          onAddHistory('student', chosen);
          setIsAnimating(false);
        }
      }, 70);

    } else {
      if (totalGroupsArr.length === 0) {
        setSelectedResult('모둠 개수가 0개입니다!');
        return;
      }
      let currentRemG = [...remainingGroups];
      if (currentRemG.length === 0) {
        currentRemG = [...totalGroupsArr];
      }

      setIsAnimating(true);
      let count = 0;
      const shuffleInterval = setInterval(() => {
        const randIdx = Math.floor(Math.random() * totalGroupsArr.length);
        setSelectedResult(totalGroupsArr[randIdx]);
        count++;
        if (count > 8) {
          clearInterval(shuffleInterval);
          const finalIdx = Math.floor(Math.random() * currentRemG.length);
          const chosen = currentRemG.splice(finalIdx, 1)[0];
          setRemainingGroups(currentRemG);
          setSelectedResult(chosen);
          onAddHistory('group', chosen);
          setIsAnimating(false);
        }
      }, 70);
    }
  };

  return (
    <section className="lg:col-span-4 flex flex-col justify-between bg-white/95 backdrop-blur p-4 md:p-6 rounded-3xl shadow-xl border border-amber-100 h-full overflow-y-auto">
      
      <div className="flex flex-col h-full justify-between">
        <div>
          {/* 카드 상단 타이틀 및 모드 뱃지 */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold text-slate-700 flex items-center space-x-2">
              <Dice5 className="w-5 h-5 text-amber-600" />
              <span>랜덤 뽑기</span>
            </h2>
            <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-lg">
              {currentMode === 'student' ? '👤 학생 모드' : '👥 모둠 모드'}
            </span>
          </div>
          
          {/* 모드 선택 버튼 */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button 
              onClick={() => { setCurrentMode('student'); setSelectedResult(null); }}
              className={`font-bold py-2.5 px-3 rounded-xl shadow transition active:scale-95 flex items-center justify-center space-x-1.5 text-sm cursor-pointer ${currentMode === 'student' ? 'bg-sky-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              <User className="w-4 h-4" /><span>학생</span>
            </button>
            <button 
              onClick={() => { setCurrentMode('group'); setSelectedResult(null); }}
              className={`font-bold py-2.5 px-3 rounded-xl shadow transition active:scale-95 flex items-center justify-center space-x-1.5 text-sm cursor-pointer ${currentMode === 'group' ? 'bg-sky-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              <Users className="w-4 h-4" /><span>모둠</span>
            </button>
          </div>

          {/* 남은 인원 / 모둠 현황 및 초기화 */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
            <span>
              {currentMode === 'student' 
                ? `남은 인원: ${remainingStudents.length}명 / 전체 ${students.length}명`
                : `남은 모둠: ${remainingGroups.length}개 / 전체 ${totalGroupsArr.length}개`
              }
            </span>
            <button 
              onClick={handleResetList}
              className="text-rose-600 hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" /> 남은 뽑기 초기화
            </button>
          </div>

          {/* 뽑기 디스플레이 카드 */}
          <div 
            onClick={executeDraw}
            className="w-full h-44 md:h-56 bg-gradient-to-br from-amber-50/80 to-sky-50/80 border-2 border-dashed border-amber-200 rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-inner cursor-pointer hover:border-amber-400 transition transform hover:scale-[1.01]"
          >
            <Sparkles className={`w-8 h-8 md:w-10 md:h-10 text-amber-500 mb-2 ${isAnimating ? 'animate-spin' : 'animate-bounce'}`} />
            <div className={`text-2xl md:text-4xl font-black text-slate-700 tracking-wide transition-all ${isAnimating ? 'scale-110 text-sky-600' : ''}`}>
              {selectedResult || '뽑기 버튼을 누르세요!'}
            </div>
            <span className="text-xs text-amber-600/70 mt-3 font-medium">카드를 클릭하거나 아래 버튼을 누르세요</span>
          </div>

          {/* 최근 뽑힌 기록 목록 (간소화) */}
          {history.length > 0 && (
            <div className="mt-3 bg-slate-50 border border-slate-100 rounded-2xl p-2.5 max-h-28 overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center justify-between">
                <span>최근 뽑기 기록</span>
                <span>{history.length}건</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {history.slice(0, 8).map((h, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-semibold shadow-2xs">
                    {h.name} <span className="text-[10px] text-slate-400">({h.time})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 실행 버튼 */}
        <div className="mt-4">
          <button 
            onClick={executeDraw}
            disabled={isAnimating}
            className="w-full bg-gradient-to-r from-sky-400 to-amber-300 hover:from-sky-500 hover:to-amber-400 text-slate-900 font-black py-3.5 md:py-4 px-6 rounded-2xl shadow-lg transition active:scale-95 text-lg md:text-xl flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-80"
          >
            <Dice5 className="w-6 h-6 animate-pulse" />
            <span>{isAnimating ? '추첨 중...' : '랜덤 뽑기 실행'}</span>
          </button>
        </div>
      </div>

    </section>
  );
}
