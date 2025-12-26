import React, { useState } from 'react';
import VietEduSidebar from './VietEduSidebar';
import VietEduChat from './VietEduChat';
import Dashboard from './pages/Dashboard';
import LessonPlanner from './pages/LessonPlanner';
import ClassBook from './pages/ClassBook';
import GradeBook from './pages/GradeBook'; 
import VideoHub from './pages/VideoHub';
import ResourceHub from './pages/ResourceHub';
import Timetable from './pages/Timetable';
import ProfessionalPlan from './pages/ProfessionalPlan';
import Rubrics from './pages/Rubrics';
import { UserRole } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.TEACHER);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const navigateTo = (path: string) => setCurrentPath(path);
  const handleBack = () => navigateTo('dashboard');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl flex max-w-4xl w-full overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500">
          <div className="hidden md:flex w-2/5 bg-[#0269a4] p-12 text-white flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8"><i className="fas fa-graduation-cap text-2xl"></i></div>
              <h1 className="text-3xl font-black italic uppercase leading-tight">VietEdu <br/><span className="text-blue-200">Smart</span></h1>
              <p className="opacity-80 text-sm mt-4 font-medium italic">Kỷ nguyên Giáo dục Số.</p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 relative z-10">Professional Edition 2025</p>
            <i className="fas fa-microchip absolute -bottom-10 -right-10 text-[15rem] opacity-5"></i>
          </div>
          <div className="w-full md:w-3/5 p-12 flex flex-col justify-center bg-white">
            <h2 className="text-2xl font-black text-slate-800 uppercase italic mb-8">Đăng nhập Lab Số</h2>
            <button onClick={() => setIsLoggedIn(true)} className="w-full bg-[#0269a4] text-white font-black py-5 rounded-xl shadow-lg hover:bg-blue-700 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-3">
              <i className="fas fa-sign-in-alt"></i> Vào hệ thống làm việc
            </button>
            <p className="text-center mt-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Hỗ trợ giáo viên 24/7</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      <VietEduSidebar 
        currentPath={currentPath} 
        onNavigate={navigateTo} 
        role={role} 
        onOpenSecurity={() => alert('Dữ liệu được bảo vệ đa lớp bởi VietEdu.')}
        onOpenShare={() => setIsShareModalOpen(true)}
      />
      
      <main className="flex-1 ml-64 p-6 transition-all min-h-screen flex flex-col">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1">
          {currentPath === 'dashboard' && <Dashboard onNavigate={navigateTo} onOpenShare={() => setIsShareModalOpen(true)} />}
          {currentPath === 'lesson-planner' && <LessonPlanner onBack={handleBack} />}
          {currentPath === 'grade-book' && <GradeBook onBack={handleBack} />}
          {currentPath === 'class-book' && <ClassBook onBack={handleBack} />}
          {currentPath === 'videos' && <VideoHub onBack={handleBack} />}
          {currentPath === 'resources' && <ResourceHub onBack={handleBack} />}
          {currentPath === 'schedule' && <Timetable onBack={handleBack} />}
          {currentPath === 'pro-plan' && <ProfessionalPlan onBack={handleBack} />}
          {currentPath === 'rubrics' && <Rubrics onBack={handleBack} />}
        </div>
      </main>

      <VietEduChat />

      {isShareModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white animate-in zoom-in-95">
            <div className="p-6 bg-[#0269a4] text-white flex justify-between items-center">
              <h3 className="font-black uppercase italic tracking-tighter text-sm">Chia sẻ với đồng nghiệp</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><i className="fas fa-times text-xs"></i></button>
            </div>
            <div className="p-10 flex flex-col items-center">
              <div className="p-4 bg-white rounded-3xl shadow-inner border border-slate-100 mb-6">
                 <img src={`https://quickchart.io/qr?text=${encodeURIComponent(window.location.href)}&size=200`} className="w-40 h-40" alt="QR Code" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic text-center leading-relaxed">Đồng nghiệp quét mã này <br/> để vào ngay Lab Số của Thầy</p>
              <button 
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Đã sao chép liên kết!'); }} 
                className="w-full bg-slate-50 border border-slate-100 py-4 rounded-xl text-[#0269a4] text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-sm"
              >SAO CHÉP LIÊN KẾT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
