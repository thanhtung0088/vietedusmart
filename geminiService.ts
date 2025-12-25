
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  if (!apiKey) {
    console.warn("API Key chưa được cấu hình. Một số tính năng AI sẽ tạm dừng.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLessonPlan = async (data: {
  subject: string;
  grade: string;
  title: string;
  objectives: string;
}) => {
  const ai = getAI();
  if (!ai) return "Vui lòng cấu hình API Key để sử dụng tính năng này.";
  
  const prompt = `Soạn Kế hoạch bài dạy (KHBD) chuẩn Công văn 5512: môn ${data.subject}, lớp ${data.grade}, bài "${data.title}". Mục tiêu: ${data.objectives}. Trả về Markdown chuyên nghiệp.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  return response.text;
};

export const generatePPTLayout = async (topic: string) => {
  const ai = getAI();
  if (!ai) return [];
  
  const prompt = `Hãy chia bố cục 5 slide cho bài giảng PPT về chủ đề: "${topic}". Trả về JSON mảng 5 đối tượng slide {title, content_points[]}. Không giải thích thêm.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "[]");
};

export const generateTest7991 = async (data: { subject: string, grade: string, type: string }) => {
  const ai = getAI();
  if (!ai) return "Tính năng soạn đề cần API Key.";
  
  const prompt = `Soạn đề kiểm tra chuẩn 7991 môn ${data.subject} lớp ${data.grade}. Loại đề: ${data.type}. Bao gồm: Ma trận đề, Đề bài (Trắc nghiệm & Tự luận), Đáp án chi tiết. Trả về Markdown.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  return response.text;
};

export const scanTimetableImage = async (base64Data: string) => {
  const ai = getAI();
  if (!ai) return [];
  
  const prompt = "Hãy quét ảnh thời khóa biểu này và trả về dữ liệu JSON mảng các tiết học {period, subject, isMorning: boolean}. Nếu ô trống ghi subject là 'TIẾT TRỐNG'.";
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
        { text: prompt }
      ]
    },
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "[]");
};

export const generateAIComment = async (score: number, subject: string) => {
  const ai = getAI();
  if (!ai) return "Cần API Key.";
  
  const prompt = `Nhận xét học bạ chuẩn sư phạm cho học sinh có ĐTB ${score} môn ${subject}. Chỉ trả về 1 câu duy nhất.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text?.trim() || "";
};

export const chatWithAI = async (message: string) => {
  const ai = getAI();
  if (!ai) return "Tôi là Trợ lý AI VietEdu. Hiện tại API Key chưa được kết nối nên tôi chưa thể trả lời chi tiết.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: "Bạn là Trợ lý AI VietEdu Smart. Chỉ hỗ trợ dựa trên dữ liệu thật. Không tự bịa thông tin.",
    }
  });
  return response.text;
};
