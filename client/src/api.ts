export const BASE = import.meta.env.VITE_API_BASE_URL;


export async function createSession(userId: string): Promise<void> {
    await fetch(`${BASE}/api/session?userId=${userId}`);
}

export async function fetchProblem(userId: string, difficulty: string, includeMathThree: boolean): Promise<string> {
    const res = await fetch(`${BASE}/api/problem?userId=${userId}&difficulty=${encodeURIComponent(difficulty)}&includeMathThree=${includeMathThree}`);
    const data = await res.json();
    return data.problem;
}

export async function fetchSolution(userId: string, difficulty: string, includeMathThree: boolean): Promise<string> {
    const res = await fetch(`${BASE}/api/problem?userId=${userId}&difficulty=${encodeURIComponent(difficulty)}&includeMathThree=${includeMathThree}`);
    const data = await res.json();
    return data.solution;
}

export async function fetchPdfLinks(userId: string, difficulty: string, includeMathThree: boolean): Promise<{ problemPdf: string; solutionPdf: string }> {
    const res = await fetch(`${BASE}/api/pdf?userId=${userId}&difficulty=${encodeURIComponent(difficulty)}&includeMathThree=${includeMathThree}`);
    return await res.json();
}

export async function fetchHistory(userId: string): Promise<any[]> {
    const res = await fetch(`${BASE}/api/history?userId=${userId}`);
    const data = await res.json();
    return data.history;
}

export async function deleteHistory(userId: string, entryId: string): Promise<void> {
    await fetch(`${BASE}/api/history?userId=${userId}&entryId=${entryId}`, { method: "DELETE" });
}

export async function updateTags(userId: string, entryId: string, tags: string[]): Promise<void> {
    await fetch(`${BASE}/api/history/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, entryId, tags })
    });
}

export async function searchHistory(userId: string, keyword: string): Promise<any[]> {
    const res = await fetch(`${BASE}/api/history/search?userId=${userId}&keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();
    return data.history;
}