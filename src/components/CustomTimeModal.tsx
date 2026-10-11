import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';

interface CustomTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
}

export function CustomTimeModal({ isOpen, onClose, onConfirm }: CustomTimeModalProps) {
  const [minutes, setMinutes] = useState(5);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (minutes > 0) {
      onConfirm(minutes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-amber-100 text-center">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Clock className="w-5 h-5 text-sky-600" />
            직접 시간 설정
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-4">원하시는 시간을 분 단위로 입력하세요.</p>
        <input 
          type="number" 
          min="1" 
          max="180" 
          value={minutes} 
          onChange={(e) => setMinutes(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full text-center text-3xl font-bold py-3 border border-slate-200 rounded-2xl mb-6 focus:outline-none focus:ring-2 focus:ring-sky-300 font-mono"
        />
        <div className="flex space-x-3">
          <button 
            onClick={handleConfirm}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow cursor-pointer transition active:scale-95"
          >
            확인
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl cursor-pointer transition active:scale-95"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
