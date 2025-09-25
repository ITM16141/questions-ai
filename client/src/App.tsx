import React, { useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import { fetchMathProblem } from "./api";
import "./styles.css";
import MarkdownRenderer from "./components/MarkdownRenderer";

function App() {
    const [difficulty, setDifficulty] = useState(1);
    const [problem, setProblem] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await fetchMathProblem(difficulty);
            setProblem(result);
        } catch {
            setError("問題の取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>🧠 数学問題ジェネレーター</h1>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? "生成中…" : "問題を生成"}
            </button>
            {error && <p className="error">{error}</p>}
            {problem && <MarkdownRenderer content={problem} />}
        </div>
    );
}

export default App;
