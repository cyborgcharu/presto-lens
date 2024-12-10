// src/types/script.ts
export interface Script {
    id: string;
    title: string;
    content: string[];
    fontSize?: number;
    scrollSpeed?: number;
    lastModified: Date;
  }