import "./App.css";
import React, { useEffect, useState } from "react";
import {fetchProblem, fetchHistory, updateTags} from "./api";
import DifficultySelector from "./components/DifficultySelector";
import RangeSelector from "./components/RangeSelector";
import MarkdownRenderer from "./components/MarkdownRenderer";

type HistoryEntry = {
    userId: string;
    difficulty: string;
    includeMathThree: boolean;
    problem: string;
    solution: string;
    timestamp: number;
    tags: string[];
};

function App() {
    const [userId] = useState("your-user-id");
    const [difficulty, setDifficulty] = useState("標準レベル");
    const [includeMathThree, setIncludeMathThree] = useState(false);
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [tagInputs, setTagInputs] = useState<Record<number, string>>({});
    const [searchTag, setSearchTag] = useState("");
    const [showSolution, setShowSolution] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");

    const generate = async () => {
        setLoading(true);

        setProgressMessage("📚 パッケージ構成中……問題および解答を生成しています");
        const { problem, solution } = await fetchProblem(userId, difficulty, includeMathThree);

        setProblem(problem);
        setSolution(solution);
        setProgressMessage("✅ 完了しました！");
        setLoading(false);

        const updated = await fetchHistory(userId);
        setHistory(updated);
    };

    useEffect(() => {
        fetchHistory(userId).then(setHistory);
    }, []);

    const handleAddTag = async (index: number) => {
        const newTag = tagInputs[index]?.trim();
        if (!newTag) return;
        const updatedTags = [...history[index].tags, newTag];
        await updateTags(index, updatedTags);
        const updated = await fetchHistory(userId);
        setHistory(updated);
        setTagInputs({ ...tagInputs, [index]: "" });
    };

    const handleRemoveTag = async (index: number, tagToRemove: string) => {
        const updatedTags = history[index].tags.filter(tag => tag !== tagToRemove);
        await updateTags(index, updatedTags);
        const updated = await fetchHistory(userId);
        setHistory(updated);
    };

    const filteredHistory = searchTag.trim()
        ? history.filter(entry =>
            entry.tags.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase()))
        )
        : history;

    return (
        <div>
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

            <h2>📚 履歴</h2>

            <input
                type="text"
                placeholder="タグで検索（例：微分）"
                value={searchTag}
                onChange={e => setSearchTag(e.target.value)}
                className="tag-search"
            />

            {filteredHistory.map((entry, idx) => (
                <div key={idx} className="history-card">
                    <div><strong>難易度：</strong>{entry.difficulty}</div>
                    <div><strong>出題範囲：</strong>{entry.includeMathThree ? "数学I〜III" : "数学I〜II"}</div>
                    <div><strong>日時：</strong>{new Date(entry.timestamp).toLocaleString()}</div>

                    {entry.tags.length > 0 && (
                        <div className="tags">
                            <strong>タグ：</strong>
                            {entry.tags.map((tag, i) => (
                                <span key={i} className="tag">
                                    {tag}
                                    <button className="tag-remove" onClick={() => handleRemoveTag(idx, tag)}>❌</button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="tag-editor">
                        <input
                            type="text"
                            value={tagInputs[idx] || ""}
                            onChange={e => setTagInputs({ ...tagInputs, [idx]: e.target.value })}
                            placeholder="タグを追加"
                        />
                        <button onClick={() => handleAddTag(idx)}>追加</button>
                    </div>

                    <details>
                        <summary>📘 問題を見る</summary>
                        <pre>{entry.problem}</pre>
                    </details>
                    <details>
                        <summary>🧠 解答を見る</summary>
                        <pre>{entry.solution}</pre>
                    </details>
                </div>
            ))}
        </div>
    );
}

export default App;