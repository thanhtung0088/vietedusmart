import React, { useState, useEffect } from 'react';

interface DashboardProps {
  onNavigate: (path: string) => void;
  onOpenShare: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenShare }) => {
  const [illustration, setIllustration] = useState<string | null>(null);
  const [scheduleMorning, setScheduleMorning] = useState<any[]>([]);
  const [scheduleAfternoon, setScheduleAfternoon] = useState<any[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<string[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    const savedImg = localStorage.getItem('vietedu_dashboard_img');
    if (savedImg) setIllustration(savedImg);

    const savedSchedule = localStorage.getItem('vietedu_schedule');
    if (savedSchedule) {
      const allSchedule = JSON.parse(savedSchedule);
      setScheduleMorning(allSchedule.filter((s: any) => s.isMorning).slice(0, 5));
      setScheduleAfternoon(allSchedule.filter((s: any) => !s.isMorning).slice(0, 5));
    }

    const savedClassbook = localStorage.getItem('vietedu_classbook_v2');
    if (savedClassbook) {
      const entries = JSON.parse(savedClassbook);
      const planEntry = entries.find((e: any) => e.type === 'plan');
      if (planEntry) setWeeklyTasks(planEntry.tasks || []);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        const base64 = re.target?.result as string;
        setIllustration(base64);
        localStorage.setItem('vietedu_dashboard_img', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTask = () => {
    if (!newTaskInput.trim()) return;
    const updated = [...weeklyTasks, newTaskInput.trim()];
    setWeeklyTasks(updated);
    setNewTaskInput('');

    const saved = localStorage.getItem('vietedu_classbook_v2');
    let entries = saved ? JSON.parse(saved) : [];
    let planIdx = entries.findIndex((e: any) => e.type === 'plan' && e.week === 16);
    if (planIdx >= 0) entries[planIdx].tasks = updated;
    else entries.unshift({ id: Date.now(), week: 16, content: 'Kế hoạch tuần 16', tasks: updated, type: 'plan' });
    localStorage.setItem('vietedu_classbook_v2', JSON.stringify(entries));
  };

  const removeTask = (idx: number) => {
    const updated = weeklyTasks.filter((_, i) => i !== idx);
    setWeeklyTasks(updated);

    const saved = localStorage.getItem('vietedu_classbook_v2');
    if (saved) {
      let entries = JSON.parse(saved);
      let planIdx = entries.findIndex((e: any) => e.type === 'plan' && e.week === 16);
      if (planIdx >= 0) {
        entries[planIdx].tasks = updated;
        localStorage.setItem('vietedu_classbook_v2', JSON.stringify(entries));
      }
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-10">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Trung tâm điều hành số VietEdu - Đang trực tuyến</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onOpenShare} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#0269a4] hover:text-white transition-all shadow-sm">
            <i className="fas fa-share-nodes text-xs"></i>
          </button>
          <button onClick={() => alert('Đã sao lưu dữ liệu lên đám mây.')} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
            <i className="fas fa-cloud-arrow-up text-xs"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 rounded-[2.5rem] p-10 text-white flex items-center justify-between shadow-2xl relative overflow-hidden card-3d border border-white/20">
          <div className="relative z-10 flex items-center gap-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-inner">
              <i className="fas fa-user-astronaut text-4xl"></i>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 text-white/60 italic leading-none">Chủ nhiệm lớp 6A1</p>
              <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter">Thầy Tùng Nguyễn</h1>
              <p className="text-[11px] font-bold text-orange-100/70 mt-5 uppercase tracking-widest italic">Chúc Thầy một ngày làm việc tràn đầy năng lượng!</p>
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
            <button onClick={() => onNavigate('lesson-planner')} className="bg-white text-orange-600 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-50 shadow-xl transition-all italic">Soạn bài AI</button>
            <button onClick={() => onNavigate('class-book')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all italic">Sổ chủ nhiệm</button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-full bg-white/5 -skew-x-12"></div>
        </div>

        <div className="lg:col-span-4 h-full">
          <label className="cursor-pointer group block h-full">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <div className="h-full min-h-[180px] bg-slate-800 rounded-[2.5rem] overflow-hidden relative border-8 border-white shadow-2xl group-hover:border-amber-400 transition-all card-3d">
              {illustration ? (
                <img src={illustration} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Class" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4 py-8">
                  <i className="fas fa-camera text-2xl opacity-20"></i>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">Ảnh kỉ niệm lớp học</span>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col card-3d min-h-[400px]">
          <div className="p-5 bg-slate-900 border-b border-white/5 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <i className="fas fa-calendar-check text-blue-400 text-xs"></i>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] italic">Thời khóa biểu thực tế - Tuần 16</h3>
            </div>
            <button onClick={() => onNavigate('schedule')} className="text-[9px] font-black text-blue-400 uppercase hover:underline">Điều chỉnh</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-100 flex-1">
            <div className="p-8">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-6 block italic"><i className="fas fa-sun mr-2"></i> Buổi Sáng</span>
              <div className="space-y-3">
                {scheduleMorning.length > 0 ? scheduleMorning.map((s, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${s.subject === 'TIẾT TRỐNG' ? 'bg-slate-50/50 border-slate-100 opacity-30' : 'bg-blue-50/50 border-blue-200 shadow-sm'}`}>
                    <span className="text-[10px] font-black text-slate-400 italic">Tiết 0{s.period}</span>
                    <span className="text-[13px] font-black text-slate-800 uppercase tracking-tighter">{s.subject}</span>
                  </div>
                )) : <div className="py-10 text-center text-slate-200 italic text-[11px] uppercase font-black">Chưa có tiết dạy</div>}
              </div>
            </div>
            <div className="p-8 bg-slate-50/30">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6 block italic"><i className="fas fa-moon mr-2"></i> Buổi Chiều</span>
              <div className="space-y-3">
                {scheduleAfternoon.length > 0 ? scheduleAfternoon.map((s, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${s.subject === 'TIẾT TRỐNG' ? 'bg-slate-50/50 border-slate-100 opacity-30' : 'bg-indigo-50/50 border-indigo-200 shadow-sm'}`}>
                    <span className="text-[10px] font-black text-slate-400 italic">Tiết 0{s.period}</span>
                    <span className="text-[13px] font-black text-slate-800 uppercase tracking-tighter">{s.subject}</span>
                  </div>
                )) : <div className="py-10 text-center text-slate-200 italic text-[11px] uppercase font-black">Chưa có tiết dạy</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col card-3d">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 italic text-center border-b pb-4">Công việc tuần 16</h3>
          <div className="mb-6 flex gap-3">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Gõ việc cần làm & Enter..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#0269a4] transition-all italic"
            />
            <button onClick={addTask} className="bg-[#0269a4] text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/10 hover:scale-105 active:scale-95 transition-all">
              <i className="fas fa-plus text-sm"></i>
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-[250px] pr-2">
            {weeklyTasks.map((task, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-transparent group hover:border-blue-200 transition-all">
                <span className="text-[11px] font-bold text-slate-600 italic leading-snug">{task}</span>
                <button onClick={() => removeTask(idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-4">
                  <i className="fas fa-times-circle text-[11px]"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
