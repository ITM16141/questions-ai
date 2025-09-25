import React, { useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import { fetchMathProblem } from "./api";
import MarkdownRenderer from "./components/MarkdownRenderer";

function App() {
    const [difficulty, setDifficulty] = useState("標準レベル");
    const [problem, setProblem] = useState("");
    const [loading] = useState(false);

    const generate = async () => {
        const result = await fetchMathProblem(difficulty);
        setProblem(result);
    };


    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>🧠 数学問題ジェネレーター</h1>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
            <button onClick={generate} disabled={loading}>
                {loading ? "生成中…" : "問題を生成"}
            </button>
            {problem && <MarkdownRenderer content={problem} />}
        </div>
    );
}

export default App;