
import React, { useState, useEffect } from 'react';

const ClassBook: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vietedu_classbook_v2');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const handleAddEntry = () => {
    if (!quickInput.trim()) return;
    const newEntry = { id: Date.now(), week: 16, content: quickInput, type: 'plan', tasks: [] };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('vietedu_classbook_v2', JSON.stringify(updated));
    setQuickInput('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end">
        <button onClick={onBack} className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest italic"><i className="fas fa-arrow-left"></i> QUAY LẠI</button>
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Sổ Chủ nhiệm Thông minh</h2>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <textarea 
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="Thầy hãy gõ nội dung vào đây..."
          className="w-full bg-slate-50 border-none rounded-[1.5rem] p-6 text-sm font-bold text-slate-700 outline-none italic leading-relaxed"
        ></textarea>
        <button onClick={handleAddEntry} className="mt-4 bg-[#0269a4] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-xl">Lưu dữ liệu</button>
      </div>

      <div className="space-y-4 mt-8">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
             <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[9px] font-black uppercase mb-4 inline-block">Tuần {entry.week}</span>
             <p className="text-slate-700 text-lg font-bold italic leading-relaxed">"{entry.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassBook;
