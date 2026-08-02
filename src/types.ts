/**
 * PalmAI Types & Interfaces
 */

export type Language = 'English' | 'Hindi';

export interface UserInfo {
  name: string;
  age: number | '';
  language: Language;
}

export interface SectionAnalysis {
  title: string;
  description: string;
  points: string[];
  insight?: string;
}

export interface PalmReadingReport {
  name: string;
  age: number;
  language: Language;
  handType: string;
  handTypeDescription?: string;
  lifeLine: SectionAnalysis;
  headLine: SectionAnalysis;
  heartLine: SectionAnalysis;
  fateLine: SectionAnalysis;
  sunLine: SectionAnalysis;
  mountAnalysis: SectionAnalysis;
  career: SectionAnalysis;
  relationships: SectionAnalysis;
  strengths: string[];
  challenges: string[];
  futureGuidance: string;
  summary: string;
  disclaimer: string;
}

export interface StepStatus {
  step: number;
  labelEn: string;
  labelHi: string;
  durationMs: number;
}
