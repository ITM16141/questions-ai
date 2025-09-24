import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function fetchMathProblem(difficulty: number): Promise<string> {
    const res = await axios.get(`${BASE_URL}/api/problem`, {
        params: { difficulty },
    });
    return res.data.problem;
}
