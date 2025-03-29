export interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
}

export interface Progress {
  courseId: string;
  completed: boolean;
  watchedMinutes: number;
}

export interface User {
  id: string;
  name: string;
  cpf: string;
  role: 'student' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  progress: Progress[];
  completion_percentage: number;
  completionPercentage: number;
  bonusPoints: number;
}

export interface Mechanic {
  id: string;
  name: string;
  progress: Progress[];
  completionPercentage: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement, options: any) => any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}