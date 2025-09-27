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
        if (saved) {
            setSessionId(saved);
            setLoading(true);
            setProgressMessage("前回の生成を再開します");
        }
    }, [setLoading, setProgressMessage]);

    useEffect(() => {
        if (!sessionId) return;

        const interval = setInterval(() => {
            fetch(`/api/session/status?sessionId=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === "done") {
                    setProblem(data.result.problem);
                    setSolution(data.result.solution);
                    setLoading(false);
                    setProgressMessage("パッケージの生成が完了しました！");
                    clearInterval(interval);
                    localStorage.removeItem("activeSessionId");
                } else {
                    setProgressMessage("🌀 パッケージ構成中……問題および解答を生成しています");
                }
            })
            .catch(() => {
                setLoading(false);
                clearInterval(interval);
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [sessionId, setLoading, setProgressMessage]);

    const generate = async () => {
        setProblem("");
        setSolution("");
        setLoading(true);
        setProgressMessage("パッケージの生成を開始しました");

        const newSessionId = uuid();
        setSessionId(newSessionId);
        localStorage.setItem("activeSessionId", newSessionId);

        await fetch(
            `/api/session?sessionId=${newSessionId}&userId=${userId}&difficulty=${difficulty}&includeMathThree=${includeMathThree}`
        );
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