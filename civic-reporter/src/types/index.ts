// types.ts

export interface Issue {
  id: string;   //it was string originally
  title: string;
  description: string;
  // change photo -> File | string (so it can handle both uploads & urls)
  photo?: File | string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'submitted' | 'in_progress' | 'completed';
  category: string;
  timestamp: number;
  createdAt: string;
  address?: string;
}

// For creating a new issue (without id, createdAt, etc.)
export type IssueInput = Omit<Issue, "id" | "createdAt" | "timestamp">;

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}