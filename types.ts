
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface Student {
  id: string;
  selected: boolean;
  code: string;
  name: string;
  tx1: string;
  tx2: string;
  gk: string;
  ck: string;
  avg: string;
  comment: string;
  isGenerating?: boolean;
}

export interface SlideData {
  id: string;
  title: string;
  content: string;
  media?: string;
}

export interface TimetableEntry {
  period: number;
  subject: string;
  isMorning: boolean;
}
