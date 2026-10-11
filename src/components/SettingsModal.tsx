import React, { useState } from 'react';
import { X, Users, UserCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: string[];
  totalGroups: number;
  onSave: (newStudents: string[], newGroupCount: number) => void;
}

export function SettingsModal({ isOpen, onClose, students, totalGroups, onSave }: SettingsModalProps) {
  const [textValue, setTextValue] = useState(students.join('\n'));
  const [groupCount, setGroupCount] = useState(totalGroups);

  if (!isOpen) return null;

  const handleSave = () => {
    const list = textValue
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    onSave(list, groupCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-amber-100 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            항목 설정 (학생 목록 및 모둠 수)
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
            👥 총 모둠 개수 설정
          </label>
          <input 
            type="number" 
            min="1" 
            max="20" 
            value={groupCount} 
            onChange={(e) => setGroupCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        <div className="flex-1 flex flex-col mb-4 min-h-[200px]">
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
            <UserCheck className="w-4 h-4 text-sky-600" />
            학생 명단 편집 (줄바꿈으로 구분)
          </label>
          <textarea 
            value={textValue} 
            onChange={(e) => setTextValue(e.target.value)}
            className="w-full flex-1 p-4 border border-slate-200 rounded-2xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none text-sm leading-relaxed" 
            rows={8}
          />
          <p className="text-xs text-slate-400 mt-1">※ 줄바꿈을 기준으로 학생 이름이 등록되며, 남은 뽑기 목록이 새로고침됩니다.</p>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={handleSave}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow transition cursor-pointer active:scale-95"
          >
            저장하기
          </button>
          <button 
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition cursor-pointer active:scale-95"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
