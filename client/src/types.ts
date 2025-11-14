export type HistoryEntry = {
    id: string;
    userId: string;
    difficulty: string;
    topics: string[];
    problem: string;
    solution: string;
    created_at: number;
    pinned: boolean;
    opened: boolean;
    views: number;
};