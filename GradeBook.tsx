
import React, { useState, useEffect } from 'react';
import { generateAIComment } from '../services/geminiService';
import { Student } from '../types';

const GradeBook: React.FC<{onBack: () => void}> = ({ onBack }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState('6');
  const [selectedClass, setSelectedClass] = useState('6.1');
  const [selectedSubject, setSelectedSubject] = useState('GDCD');
  const [semester, setSemester] = useState<'HK1' | 'HK2' | 'YEAR'>('HK1');
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelPasteData, setExcelPasteData] = useState('');
  const [loading, setLoading] = useState(false);

  const subjects = [
    'Toán học', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học', 
    'Lịch sử', 'Địa lý', 'GDCD', 'Công nghệ', 'Tin học', 'Giáo dục thể chất', 
    'Nghệ thuật', 'Hoạt động trải nghiệm', 'Nội dung địa phương'
  ];

  const classList = Array.from({ length: 10 }, (_, i) => `${selectedGrade}.${i + 1}`);

  useEffect(() => {
    const key = `vietedu_grades_${selectedGrade}_${selectedClass}_${selectedSubject}_${semester}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents([]); 
    }
  }, [selectedGrade, selectedClass, selectedSubject, semester]);

  const saveToLocal = (data: Student[]) => {
    const key = `vietedu_grades_${selectedGrade}_${selectedClass}_${selectedSubject}_${semester}`;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const calculateAvg = (s: Student) => {
    const t1 = parseFloat(s.tx1) || 0;
    const t2 = parseFloat(s.tx2) || 0;
    const g = parseFloat(s.gk) || 0;
    const c = parseFloat(s.ck) || 0;
    const result = (t1 + t2 + g * 2 + c * 3) / 7;
    return isNaN(result) ? '0.0' : result.toFixed(1);
  };

  const handleUpdateGrade = (idx: number, field: keyof Student, value: string) => {
    const updated = [...students];
    (updated[idx] as any)[field] = value;
    updated[idx].avg = calculateAvg(updated[idx]);
    setStudents(updated);
    saveToLocal(updated);
  };

  const handleAIComment = async (idx: number) => {
    const s = students[idx];
    if (!s.avg || s.avg === '0.0') return alert('Vui lòng nhập điểm trước!');
    const updated = [...students];
    updated[idx].isGenerating = true;
    setStudents([...updated]);
    try {
      const comment = await generateAIComment(parseFloat(s.avg), selectedSubject);
      updated[idx].comment = comment;
    } catch (e) {
      updated[idx].comment = "Học sinh có nỗ lực, cần phát huy thêm kỹ năng trình bày.";
    } finally {
      updated[idx].isGenerating = false;
      setStudents([...updated]);
      saveToLocal(updated);
    }
  };

  const handleImportExcel = () => {
    if (!excelPasteData.trim()) return alert('Dữ liệu trống!');
    const rows = excelPasteData.trim().split('\n');
    const newStudents = rows.map((row, i) => {
      const cols = row.split('\t');
      return {
        id: Date.now().toString() + i,
        selected: false,
        code: cols[0] || '---',
        name: cols[1] || 'Học sinh mới',
        tx1: cols[2] || '',
        tx2: cols[3] || '',
        gk: cols[4] || '',
        ck: cols[5] || '',
        avg: '0.0',
        comment: ''
      };
    });
    const final = [...students, ...newStudents];
    setStudents(final);
    saveToLocal(final);
    setIsExcelModalOpen(false);
    setExcelPasteData('');
    alert(`Đã nạp ${newStudents.length} học sinh thành công!`);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 animate-in fade-in">
      <div className="flex items-center justify-between bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0269a4] rounded-lg flex items-center justify-center text-white shadow-lg"><i className="fas fa-table-list text-xs"></i></div>
          <span className="text-[#0269a4] font-black text-sm uppercase italic">Sổ điểm điện tử THCS</span>
        </div>
        <div className="flex gap-2">
           <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-4">
              {[
                { id: 'HK1', label: 'Học kỳ 1' },
                { id: 'HK2', label: 'Học kỳ 2' },
                { id: 'YEAR', label: 'Cả năm' }
              ].map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setSemester(t.id as any)}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${semester === t.id ? 'bg-[#0269a4] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t.label}
                </button>
              ))}
           </div>
          <button onClick={() => setIsExcelModalOpen(true)} className="bg-[#0269a4] text-white px-5 py-2 rounded-lg text-[10px] font-black border border-blue-800 shadow-lg hover:scale-105 transition-all uppercase tracking-widest">Dán từ excel</button>
          <button onClick={() => alert('Đã lưu dữ liệu!')} className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-[10px] font-black shadow-lg hover:scale-105 transition-all uppercase tracking-widest">Cập nhật</button>
        </div>
      </div>

      <div className="bg-[#f2f2f2] px-6 py-4 border-b border-slate-200 flex flex-wrap items-center gap-8 text-[13px] font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-slate-400">Khối:</span>
          <select className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white shadow-sm outline-none" value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}>
            <option value="6">Khối 6</option><option value="7">Khối 7</option><option value="8">Khối 8</option><option value="9">Khối 9</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-slate-400">Lớp:</span>
          <select className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white shadow-sm outline-none" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            {classList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-slate-400">Môn học:</span>
          <select className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white shadow-sm outline-none" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
           <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[11px] font-black text-slate-400 uppercase italic tracking-[0.2em]">Danh sách học sinh - {semester}</span>
              <button onClick={() => setStudents([...students, { id: Date.now().toString(), selected: false, code: '', name: '', tx1: '', tx2: '', gk: '', ck: '', avg: '0.0', comment: '' }])} className="text-[#0269a4] font-black text-[10px] uppercase tracking-widest hover:underline">+ Thêm học sinh</button>
           </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead className="bg-[#0269a4] text-white font-bold">
                <tr>
                  <th className="p-4 border border-white/10 w-12" rowSpan={2}>STT</th>
                  <th className="p-4 border border-white/10 w-32" rowSpan={2}>Mã định danh</th>
                  <th className="p-4 border border-white/10" rowSpan={2}>Họ tên học sinh</th>
                  <th className="p-2 border border-white/10" colSpan={2}>TX (Thường xuyên)</th>
                  <th className="p-4 border border-white/10 w-20" rowSpan={2}>GK</th>
                  <th className="p-4 border border-white/10 w-20" rowSpan={2}>CK</th>
                  <th className="p-4 border border-white/10 w-24" rowSpan={2}>ĐTB Môn</th>
                  <th className="p-4 border border-white/10" rowSpan={2}>Nhận xét AI Sư phạm</th>
                </tr>
                <tr>
                  <th className="p-2 border border-white/10 w-14">1</th>
                  <th className="p-2 border border-white/10 w-14">2</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={9} className="p-20 text-center text-slate-300 italic">Hệ thống sẵn sàng. Vui lòng dán dữ liệu Excel hoặc nhập tay.</td></tr>
                ) : (
                  students.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-blue-50/50 border-b border-slate-100 transition-colors">
                      <td className="p-3 text-center text-slate-400 border-r border-slate-50">{idx + 1}</td>
                      <td className="p-3 border-r border-slate-50"><input className="w-full bg-transparent outline-none text-center" value={s.code} onChange={e => handleUpdateGrade(idx, 'code', e.target.value)} placeholder="..." /></td>
                      <td className="p-3 border-r border-slate-50 font-bold text-slate-800"><input className="w-full bg-transparent outline-none uppercase" value={s.name} onChange={e => handleUpdateGrade(idx, 'name', e.target.value)} placeholder="..." /></td>
                      <td className="p-0 border-r border-slate-50"><input className="w-full h-10 text-center outline-none focus:bg-white" value={s.tx1} onChange={e => handleUpdateGrade(idx, 'tx1', e.target.value)} /></td>
                      <td className="p-0 border-r border-slate-50"><input className="w-full h-10 text-center outline-none focus:bg-white" value={s.tx2} onChange={e => handleUpdateGrade(idx, 'tx2', e.target.value)} /></td>
                      <td className="p-0 border-r border-slate-50"><input className="w-full h-10 text-center outline-none font-bold text-blue-600 focus:bg-white" value={s.gk} onChange={e => handleUpdateGrade(idx, 'gk', e.target.value)} /></td>
                      <td className="p-0 border-r border-slate-50"><input className="w-full h-10 text-center outline-none font-bold text-red-500 focus:bg-white" value={s.ck} onChange={e => handleUpdateGrade(idx, 'ck', e.target.value)} /></td>
                      <td className="p-3 text-center border-r border-slate-50 font-black text-[#0269a4] italic">{s.avg}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2 group">
                          <input className="flex-1 bg-transparent px-2 outline-none italic text-[11px] truncate text-slate-500" value={s.comment} onChange={e => handleUpdateGrade(idx, 'comment', e.target.value)} placeholder="Click AI để nhận xét..." />
                          <button onClick={() => handleAIComment(idx)} className="w-8 h-8 rounded-lg bg-blue-50 text-[#0269a4] hover:bg-[#0269a4] hover:text-white transition-all">
                             {s.isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-robot text-[10px]"></i>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={onBack} className="mt-8 text-slate-400 font-black uppercase text-[10px] tracking-widest italic hover:text-[#0269a4]"><i className="fas fa-arrow-left mr-2"></i> Trở về Dashboard</button>
      </div>

      {isExcelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white">
              <div className="p-6 bg-[#0269a4] text-white flex justify-between items-center">
                 <h3 className="text-lg font-black uppercase italic tracking-tighter">Nhập dữ liệu Excel</h3>
                 <button onClick={() => setIsExcelModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><i className="fas fa-times"></i></button>
              </div>
              <div className="p-8 space-y-4">
                 <p className="text-[11px] text-slate-400 italic">Thầy hãy copy vùng dữ liệu (Mã, Tên, TX1, TX2, GK, CK) từ Excel và dán vào đây:</p>
                 <textarea 
                    autoFocus
                    value={excelPasteData}
                    onChange={e => setExcelPasteData(e.target.value)}
                    rows={10}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-[11px] outline-none font-mono focus:ring-4 focus:ring-blue-500/10"
                    placeholder="MãHS [TAB] TênHS [TAB] Điểm..."
                 />
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setIsExcelModalOpen(false)} className="flex-1 py-4 text-xs font-black text-slate-300 uppercase tracking-widest">Hủy bỏ</button>
                    <button onClick={handleImportExcel} className="flex-1 bg-[#0269a4] text-white font-black py-4 rounded-xl shadow-lg uppercase text-xs tracking-widest hover:bg-blue-700">Kích hoạt nạp dữ liệu</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GradeBook;
