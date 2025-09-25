export async function fetchMathProblem(difficulty: number): Promise<string> {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/problem?difficulty=${difficulty}`
        );

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        return data.problem;
    } catch (err) {
        console.error("問題の取得に失敗しました:", err);
        return "問題の取得に失敗しました。";
    }
}
