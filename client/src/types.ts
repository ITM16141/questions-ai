export type HistoryEntry = {
    id: string;
    userId: string;
    difficulty: string;
    includeMathThree: boolean;
    problem: string;
    solution: string;
    timestamp: number;
    tags: string[];
    pinned: boolean;
    public: boolean;
    views: number;
};