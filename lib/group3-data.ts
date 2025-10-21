import DATA from './group3-apps-data.json';

// 기분 전환 타입
export interface MoodData {
  moodStates: {
    mood: string;
    intensity: string;
    emoji: string;
    description: string;
    commonCauses: string[];
    physicalSymptoms: string[];
    mentalSymptoms: string[];
    immediateActions: {
      action: string;
      duration: string;
      difficulty: string;
      effectiveness: number;
      howTo: string[];
    }[];
    activities: {
      indoor: string[];
      outdoor: string[];
      creative: string[];
      physical: string[];
      social: string[];
      alone: string[];
    };
    media: {
      movies: { title: string; genre: string; why: string; mood: string; }[];
      tvShows: { title: string; genre: string; why: string; }[];
      books: { title: string; author: string; genre: string; why: string; }[];
      podcasts: { title: string; theme: string; why: string; }[];
    };
    music: {
      genre: string[];
      mood: string;
      playlist: { name: string; songs: string[]; why: string; }[];
    };
    quotes: { quote: string; author: string; why: string; }[];
  }[];
}

export const MOOD_DATA = DATA.mood as MoodData;


