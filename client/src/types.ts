export type HistoryEntry = {
    id: string;
    userId: string;
    difficulty: string;
    includeMathThree: boolean;
    problem: string;
    solution: string;
    created_at: number;
    tags: string[];
    pinned: boolean;
    opened: boolean;
    views: number;
};