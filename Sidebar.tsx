import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  role: UserRole;
  onOpenSecurity: () => void;
  onOpenShare: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, role, onOpenSecurity, onOpenShare }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'fa-th-large', path: 'dashboard' },
    { id: 'lesson-planner', label: 'Soạn bài AI', icon: 'fa-wand-magic-sparkles', path: 'lesson-planner' },
    { id: 'grade-book', label: 'Sổ điểm THCS', icon: 'fa-table-list', path: 'grade-book' },
    { id: 'class-book', label: 'Sổ chủ nhiệm', icon: 'fa-book-open-reader', path: 'class-book' },
    { id: 'rubrics', label: 'Bộ Rubrics', icon: 'fa-star-half-stroke', path: 'rubrics' },
    { id: 'schedule', label: 'Thời khóa biểu', icon: 'fa-calendar-days', path: 'schedule' },
    { id: 'pro-plan', label: 'KH Chuyên môn', icon: 'fa-briefcase', path: 'pro-plan' },
    { id: 'resources', label: 'Kho học liệu', icon: 'fa-layer-group', path: 'resources' },
    { id: 'videos', label: 'Video bài giảng', icon: 'fa-video', path: 'videos' },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col h-screen fixed left-0 top-0 z-40 border-r border-white/5 shadow-2xl">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#0269a4] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i className="fas fa-graduation-cap text-2xl"></i>
        </div>
        <div>
          <h1 className="font-black text-sm tracking-tighter italic leading-none">VIETEDU SMART</h1>
          <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mt-2">Phòng Lab Số 4.0</p>
        </div>
      </div>
      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.path)}
            className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 ${
              currentPath === item.path 
                ? 'bg-[#0269a4] text-white shadow-xl font-bold scale-[1.02]' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} text-lg w-6`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest italic">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-8 text-center text-[10px] text-slate-700 italic font-bold uppercase tracking-[0.3em] border-t border-white/5">VietEdu © 2025</div>
    </aside>
  );
};

export default Sidebar;