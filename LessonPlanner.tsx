
import React, { useState } from 'react';
import { generateLessonPlan, generatePPTLayout, generateTest7991 } from '../services/geminiService';

interface LessonPlannerProps {
  onBack: () => void;
}

const LessonPlanner: React.FC<LessonPlannerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'5512' | 'PPT' | '7991'>('5512');
  const [formData, setFormData] = useState({ subject: 'Toán học', grade: '6', title: '', objectives: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGen5512 = async () => {
    if (!formData.title) return alert('Nhập tên bài học');
    setLoading(true);
    try {
      const res = await generateLessonPlan(formData);
      setResult(res);
    } catch (e) { setResult('Lỗi AI'); } finally { setLoading(false); }
  };

  const handleGenPPT = async () => {
    if (!formData.title) return alert('Nhập chủ đề PPT');
    setLoading(true);
    try {
      const res = await generatePPTLayout(formData.title);
      setResult(res);
    } catch (e) { setResult([]); } finally { setLoading(false); }
  };

  const handleGen7991 = async () => {
    setLoading(true);
    try {
      const res = await generateTest7991({ subject: formData.subject, grade: formData.grade, type: 'Kết hợp' });
      setResult(res);
    } catch (e) { setResult('Lỗi AI'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center gap-2 uppercase tracking-widest">
            <i className="fas fa-arrow-left text-[10px]"></i> QUAY LẠI
        </button>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          {['5512', 'PPT', '7991'].map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab as any); setResult(null); }}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-[#0269a4] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab === '5512' ? 'SOẠN GIẢNG 5512' : tab === 'PPT' ? 'BÀI GIẢNG PPT' : 'ĐỀ KIỂM TRA 7991'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-fit space-y-6">
          <h2 className="font-extrabold text-slate-800 uppercase text-xs border-b border-slate-50 pb-5">Tham số bài dạy</h2>
          <div className="space-y-4">
            <input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Môn học..." className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold" />
            <input value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} placeholder="Lớp..." className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold" />
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Tên bài học..." className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold" />
            <textarea value={formData.objectives} onChange={e => setFormData({...formData, objectives: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold min-h-[120px]" placeholder="Mục tiêu bài học..."></textarea>
          </div>
          <button 
            onClick={activeTab === '5512' ? handleGen5512 : activeTab === 'PPT' ? handleGenPPT : handleGen7991}
            className="w-full bg-[#0269a4] text-white font-black py-5 rounded-2xl shadow-xl uppercase text-[11px] tracking-widest"
          >
            {loading ? 'ĐANG KHỞI TẠO...' : 'BẮT ĐẦU SOẠN THẢO'}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[700px] p-12">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 border-4 border-[#0269a4]/10 border-t-[#0269a4] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">AI đang soạn bài cho Thầy...</p>
              </div>
            ) : result ? (
                <div className="whitespace-pre-wrap font-serif text-slate-700 leading-relaxed text-xl font-medium">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-200 py-32">
                <i className="fas fa-pen-nib text-8xl mb-8 opacity-10"></i>
                <p className="text-xs font-black uppercase tracking-[0.5em] opacity-30 text-center">Nội dung sẽ hiển thị tại đây</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;
