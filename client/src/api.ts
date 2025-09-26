const BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchProblem(difficulty: string, includeMathThree: boolean): Promise<string> {
    const res = await fetch(`${BASE}/api/problem?difficulty=${encodeURIComponent(difficulty)}&includeMathThree=${includeMathThree}`);
    const data = await res.json();
    return data.problem;
}

export async function fetchSolution(difficulty: string, includeMathThree: boolean): Promise<string> {
    const res = await fetch(`${BASE}/api/solution?difficulty=${encodeURIComponent(difficulty)}&includeMathThree=${includeMathThree}`);
    const data = await res.json();
    return data.solution;
}

export async function fetchPdfLinks(difficulty: string, includeMathThree: boolean): Promise<{ problemPdf: string; solutionPdf: string }> {
    const res = await fetch(`${BASE}/api/pdf?difficulty=${encodeURIComponent(difficulty)}&includeMathThree=${includeMathThree}`);
    return await res.json();
}
