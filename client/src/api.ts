const BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchProblem(difficulty: string, includeMathIII: boolean): Promise<string> {
    const res = await fetch(`${BASE}/api/problem?difficulty=${encodeURIComponent(difficulty)}&includeMathIII=${includeMathIII}`);
    const data = await res.json();
    return data.problem;
}

export async function fetchSolution(difficulty: string, includeMathIII: boolean): Promise<string> {
    const res = await fetch(`${BASE}/api/solution?difficulty=${encodeURIComponent(difficulty)}&includeMathIII=${includeMathIII}`);
    const data = await res.json();
    return data.solution;
}

export async function fetchPdfLinks(difficulty: string, includeMathIII: boolean): Promise<{ problemPdf: string; solutionPdf: string }> {
    const res = await fetch(`${BASE}/api/pdf?difficulty=${encodeURIComponent(difficulty)}&includeMathIII=${includeMathIII}`);
    const data = await res.json();
    return data;
}
