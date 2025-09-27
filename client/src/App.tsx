import "./App.css";
import React, { useState } from "react";
import {fetchProblem} from "./api";
import DifficultySelector from "./components/DifficultySelector";
import RangeSelector from "./components/RangeSelector";
import MarkdownRenderer from "./components/MarkdownRenderer";
import Tabs from "./components/Tabs";

function App() {
    const [userId] = useState("your-user-id");
    const [difficulty, setDifficulty] = useState("標準レベル");
    const [includeMathThree, setIncludeMathThree] = useState(false);
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [loading, setLoading] = useState(false);

    const [showSolution, setShowSolution] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");

    const generate = async () => {
        setLoading(true);

        setProgressMessage(" パッケージ構成中……問題および解答を生成しています");
        const { problem, solution } = await fetchProblem(userId, difficulty, includeMathThree);

        setProblem(problem);
        setSolution(solution);
        setProgressMessage("✅ 完了しました！");
        setLoading(false);
    };

    return (
        <div>
            <Tabs />
            <h1>🧠 数学問題ジェネレーター</h1>

            <DifficultySelector value={difficulty} onChange={setDifficulty} disabled={loading} />
            <RangeSelector value={includeMathThree} onChange={setIncludeMathThree} disabled={loading} />

            <button onClick={generate} disabled={loading}>
                {loading ? "生成中…" : "問題を生成"}
            </button>

            {loading && (
                <div className="progress-message loading-dots" style={{ marginTop: "1rem" }}>
                    {progressMessage}
                </div>
            )}

            {problem && (
                <>
                    <MarkdownRenderer content={problem} />
                    <div style={{ marginTop: "1rem" }}>
                        <button onClick={() => setShowSolution(!showSolution)}>
                            {showSolution ? "解答・検証を隠す" : "解答・検証を見る"}
                        </button>
                    </div>

                    {showSolution && (
                        <>
                            <MarkdownRenderer content={solution} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default App;