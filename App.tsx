import React, { useState } from 'react';

import Dashboard from './Dashboard';
import LessonPlanner from './LessonPlanner';
import ClassBook from './ClassBook';
import GradeBook from './GradeBook';
import VideoHub from './VideoHub';
import ResourceHub from './ResourceHub';
import Timetable from './Timetable';
import ProfessionalPlan from './ProfessionalPlan';
import Rubrics from './Rubrics';

import { UserRole } from './types';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.TEACHER);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const navigateTo = (path: string) => setCurrentPath(path);
  const handleBack = () => navigateTo('dashboard');

  /* ================= LOGIN ================= */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-2xl flex max-w-4xl w-full overflow-hidden">
          <div className="hidden md:flex w-2/5 bg-[#0269a4] p-12 text-white flex-col justify-between">
            <div>
              <h1 className="text-3xl font-black italic uppercase">
                VietEdu <br />
                <span className="text-blue-200">Smart</span>
              </h1>
              <p className="opacity-80 text-sm mt-4 italic">
                Kỷ nguyên Giáo dục Số
              </p>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
              Professional Edition 2025
            </p>
          </div>

          <div className="w-full md:w-3/5 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-black uppercase italic mb-8">
              Đăng nhập Lab Số
            </h2>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-[#0269a4] text-white font-black py-5 rounded-xl uppercase"
            >
              Vào hệ thống làm việc
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= APP ================= */
  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* SIDEBAR */}

      {/* MAIN */}
      <main className="flex-1 ml-64 p-6 min-h-screen">
        {currentPath === 'dashboard' && (
          <Dashboard
            onNavigate={navigateTo}
            onOpenShare={() => setIsShareModalOpen(true)}
          />
        )}
        {currentPath === 'lesson-planner' && (
          <LessonPlanner onBack={handleBack} />
        )}
        {currentPath === 'grade-book' && (
          <GradeBook onBack={handleBack} />
        )}
        {currentPath === 'class-book' && (
          <ClassBook onBack={handleBack} />
        )}
        {currentPath === 'videos' && <VideoHub onBack={handleBack} />}
        {currentPath === 'resources' && (
          <ResourceHub onBack={handleBack} />
        )}
        {currentPath === 'schedule' && (
          <Timetable onBack={handleBack} />
        )}
        {currentPath === 'pro-plan' && (
          <ProfessionalPlan onBack={handleBack} />
        )}
        {currentPath === 'rubrics' && (
          <Rubrics onBack={handleBack} />
        )}
      </main>

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
            <h3 className="font-black uppercase italic text-sm mb-4">
              Chia sẻ với đồng nghiệp
            </h3>
            <img
              src={`https://quickchart.io/qr?text=${encodeURIComponent(
                window.location.href
              )}&size=200`}
              className="mx-auto mb-4"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết!');
              }}
              className="w-full bg-[#0269a4] text-white py-3 rounded-xl font-black uppercase text-xs"
            >
              Sao chép liên kết
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
