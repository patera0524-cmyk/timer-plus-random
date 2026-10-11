export type DrawMode = 'student' | 'group';

export interface AppState {
  students: string[];
  remainingStudents: string[];
  totalGroups: number;
  remainingGroups: string[];
  currentMode: DrawMode;
  activityText: string;
  history: { type: 'student' | 'group'; name: string; time: string }[];
}
