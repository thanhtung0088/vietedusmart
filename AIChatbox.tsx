
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';

const AIChatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Chào Thầy/Cô! Tôi có thể hỗ trợ gì cho việc soạn giảng và nhận xét điểm số hôm nay?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await chatWithAI(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: response || 'Lỗi kết nối AI.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Vui lòng kiểm tra API Key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#0269a4] p-4 flex items-center justify-between text-white">
            <span className="font-semibold text-sm">Trợ lý AI VietEdu</span>
            <button onClick={() => setIsOpen(false)}><i className="fas fa-times"></i></button>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 text-sm">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-[#0269a4] text-white' : 'bg-white border border-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white border-t flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Nhập câu hỏi..." className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none" />
            <button onClick={handleSend} disabled={isLoading} className="bg-[#0269a4] text-white w-10 h-10 rounded-xl flex items-center justify-center">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-[#0269a4] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
          <i className="fas fa-sparkles text-xl"></i>
        </button>
      )}
    </div>
  );
};

export default AIChatbox;
