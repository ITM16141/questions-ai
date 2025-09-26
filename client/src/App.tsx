import "./App.css";
import React, { useEffect, useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import RangeSelector from "./components/RangeSelector";
import MarkdownRenderer from "./components/MarkdownRenderer";
import {
    BASE,
    createSession,
    fetchProblem,
    fetchSolution,
    fetchPdfLinks,
    fetchHistory,
    deleteHistory,
    updateTags,
    searchHistory,
} from "./api";

function App() {
    const [difficulty, setDifficulty] = useState("標準レベル");
    const [includeMathThree, setIncludeMathThree] = useState(true);
    const [userId, setUserId] = useState("");
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [pdfLinks, setPdfLinks] = useState<{ problemPdf: string; solutionPdf: string } | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState<"timestamp" | "difficulty" | "tag">("timestamp");
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) {
            setUserId(storedId);
        } else {
            const newId = crypto.randomUUID();
            localStorage.setItem("userId", newId);
            setUserId(newId);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            createSession(userId);
            fetchHistory(userId).then(setHistory);
        }
    }, [userId]);

    const generateAll = async () => {
        setLoading(true);
        setProgressMessage("🧠 思考中…問題の構想を練っています");

        const prob = await fetchProblem(userId, difficulty, includeMathThree);
        setProgressMessage("📚 問題構成中…誘導形式を設計しています");

        const sol = await fetchSolution(userId, difficulty, includeMathThree);
        setProgressMessage("🔍 解答と検証を準備しています");

        const pdfs = await fetchPdfLinks(userId, difficulty, includeMathThree);

        setProblem(prob);
        setSolution(sol);
        setPdfLinks(pdfs);
        setShowSolution(false);
        setProgressMessage("✅ 完了しました！");
        setLoading(false);

        fetchHistory(userId).then(setHistory);
    };

    const sortedHistory = [...history].sort((a, b) => {
        switch (sortBy) {
            case "timestamp":
                return b.timestamp - a.timestamp;
            case "difficulty":
                return a.difficulty.localeCompare(b.difficulty);
            case "tag":
                return (a.tags[0] || "").localeCompare(b.tags[0] || "");
            default:
                return 0;
        }
    });

    const handleSearch = async () => {
        const results = await searchHistory(userId, searchKeyword);
        setHistory(results);
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h1>🧠 数学問題ジェネレーター</h1>

            <DifficultySelector value={difficulty} onChange={setDifficulty} disabled={loading} />
            <RangeSelector value={includeMathThree} onChange={setIncludeMathThree} disabled={loading} />

            <button onClick={generateAll} disabled={loading}>
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
                    {pdfLinks && <a href={BASE + pdfLinks.problemPdf} download>📥 問題をダウンロード</a>}

                    <div style={{ marginTop: "1rem" }}>
                        <button onClick={() => setShowSolution(!showSolution)}>
                            {showSolution ? "解答・検証を隠す" : "解答・検証を見る"}
                        </button>
                    </div>

                    {showSolution && (
                        <>
                            <MarkdownRenderer content={solution} />
                            {pdfLinks && <a href={BASE + pdfLinks.solutionPdf} download>📥 解答・検証をダウンロード</a>}
                        </>
                    )}
                </>
            )}

            <hr style={{ margin: "2rem 0" }} />
            <h2>📚 履歴</h2>

            <div>
                <label>並び替え：</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="timestamp">🕒 新着順</option>
                    <option value="difficulty">📘 難易度順</option>
                    <option value="tag">🏷️ タグ順</option>
                </select>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <input
                    type="text"
                    placeholder="キーワード検索"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button onClick={handleSearch}>🔍 検索</button>
            </div>

            <ul>
                {sortedHistory.map((entry) => (
                    <li key={entry.id} style={{ marginBottom: "1rem" }}>
                        <strong>{new Date(entry.timestamp).toLocaleString()}</strong>（{entry.difficulty} / {entry.includeMathThree ? "数学IIIを含む" : "数学IIIを除く"}）<br />
                        タグ: {entry.tags.join(", ") || "なし"}<br />
                        <a href= {BASE + entry.problemPdf} download>📥 問題PDF</a> ／ <a href={BASE + entry.solutionPdf} download>📥 解答PDF</a><br />
                        <button onClick={() => deleteHistory(userId, entry.id).then(() => fetchHistory(userId).then(setHistory))}>🗑️ 削除</button>
                        <input
                            type="text"
                            placeholder="タグ（カンマ区切り）"
                            onBlur={(e) => updateTags(userId, entry.id, e.target.value.split(",").map(t => t.trim())).then(() => fetchHistory(userId).then(setHistory))}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;