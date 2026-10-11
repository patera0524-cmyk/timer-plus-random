import React from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';

interface FinishModalProps {
  isOpen: boolean;
  onExtend: () => void;
  onClose: () => void;
}

export function FinishModal({ isOpen, onExtend, onClose }: FinishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-amber-200 text-center animate-in fade-in zoom-in duration-300">
        <div className="text-6xl mb-4 animate-bounce">🚨</div>
        <h3 className="text-3xl font-extrabold text-rose-600 mb-2">시간 종료!</h3>
        <p className="text-2xl font-bold text-slate-800 mb-6">"선생님을 보세요!"</p>
        <div className="flex space-x-3">
          <button 
            onClick={onExtend}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md transition active:scale-95 text-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-5 h-5" /> 연장 +1분
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-2xl transition active:scale-95 text-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            <X className="w-5 h-5" /> 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
