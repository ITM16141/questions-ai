type HistoryEntry = {
    id: string;
    timestamp: number;
    difficulty: string;
    includeMathThree: boolean;
    problem: string;
    solution: string;
    problemPdf: string;
    solutionPdf: string;
    tags: string[];
};

const historyMap = new Map<string, HistoryEntry[]>();

export function saveHistory(userId: string, entry: HistoryEntry) {
    const existing = historyMap.get(userId) || [];
    historyMap.set(userId, [...existing, entry]);
}

export function getHistory(userId: string): HistoryEntry[] {
    return historyMap.get(userId) || [];
}

export function deleteHistoryEntry(userId: string, entryId: string) {
    const history = historyMap.get(userId) || [];
    const updated = history.filter((entry) => entry.id !== entryId);
    historyMap.set(userId, updated);
}

export function updateTags(userId: string, entryId: string, tags: string[]) {
    const history = historyMap.get(userId) || [];
    const entry = history.find((e) => e.id === entryId);
    if (entry) entry.tags = tags;
}

export function searchHistory(userId: string, keyword: string): HistoryEntry[] {
    const history = historyMap.get(userId) || [];
    return history.filter((entry) =>
        entry.problem.includes(keyword) ||
        entry.solution.includes(keyword) ||
        entry.tags.some((tag) => tag.includes(keyword))
    );
}