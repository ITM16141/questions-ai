import "./App.css";
import React, { useEffect, useState, useContext } from "react";
import { v4 as uuid } from "uuid";
import { SessionContext } from "./context/SessionContext";
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
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const { loading, setLoading, progressMessage, setProgressMessage } = useContext(SessionContext);

    useEffect(() => {
        const saved = localStorage.getItem("activeSessionId");
        if (saved) setSessionId(saved);
    }, []);

    useEffect(() => {
        if (!sessionId) return;

        const interval = setInterval(() => {
            fetch(`/api/session/status?sessionId=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === "done") {
                        setProblem(data.result.problem);
                        setSolution(data.result.solution);
                        clearInterval(interval);
                        localStorage.removeItem("activeSessionId");
                    }
                })
                .catch(() => clearInterval(interval));
        }, 2000);

        return () => clearInterval(interval);
    }, [sessionId]);

    const generate = async () => {
        setLoading(true);
        const newSessionId = uuid();
        setSessionId(newSessionId);
        localStorage.setItem("activeSessionId", newSessionId);

        setProgressMessage(" パッケージ構成中……問題および解答を生成しています");
        const res = await fetch(`/api/session?sessionId=${newSessionId}&userId=${userId}&difficulty=${difficulty}&includeMathThree=${includeMathThree}`);
        const data = await res.json();

        setProblem(data.problem);
        setSolution(data.solution);
        localStorage.removeItem("activeSessionId");
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