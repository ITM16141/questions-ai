import React, { useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import { fetchMathProblem } from "./api";
import ProgressBar from "./components/ProgressBar";
import MarkdownRenderer from "./components/MarkdownRenderer";

function App() {
    const [difficulty, setDifficulty] = useState(1);
    const [problem, setProblem] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0); // 実時間（ms）

    const generateProblem = async () => {
        setLoading(true);
        setProgress(0);

        const start = performance.now();

        const interval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 1, 100));
        }, 100);

        const result = await fetchMathProblem(difficulty);

        const end = performance.now();
        const elapsed = end - start;
        setDuration(elapsed);

        clearInterval(interval);
        setProgress(100);
        setProblem(result);
        setLoading(false);
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>🧠 数学問題ジェネレーター</h1>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
            <button onClick={generateProblem} disabled={loading}>
                {loading ? "生成中…" : "問題を生成"}
            </button>

            {loading && <ProgressBar progress={progress} />}
            {duration > 0 && <p>⏱️ 生成時間: {Math.round(duration)} ms</p>}
            {problem && <MarkdownRenderer content={problem} />}
        </div>
    );
}

export default App;