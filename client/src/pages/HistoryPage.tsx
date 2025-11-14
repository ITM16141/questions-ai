import "./App.css";
import React, { useEffect, useState } from "react";
import {fetchHistory, updatePinned, updateOpened} from "../api";
import Tabs from "../components/Tabs";
import {HistoryEntry} from "../types";
import MarkdownRenderer from "../components/MarkdownRenderer";

function HistoryPage(){
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [searchTopic, setSearchTopic] = useState("");
    const userId = localStorage.getItem("userId") as string;

    useEffect(() => {
        fetchHistory(userId).then(setHistory);
    }, []);

    const handleTogglePin = async (id: string, current: boolean) => {
        await updatePinned(id, !current);
        const updated = await fetchHistory(userId);
        setHistory(updated);
    };

    const handleToggleOpened = async (id: string, current: boolean) => {
        await updateOpened(id, !current);
        const updated = await fetchHistory(userId);
        setHistory(updated);
    };

    const filteredHistory = searchTopic.trim()
        ? history.filter(entry =>
            entry.topics.some(topic => topic.toLowerCase().includes(searchTopic.toLowerCase()))
        )
        : history;

    const sortedHistory = [...filteredHistory].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.created_at - a.created_at;
    });

    return (
        <div className="history-page">
            <Tabs />
            <h1>📚 履歴</h1>
            <input
                type="text"
                placeholder="出題範囲で検索（例：微分）"
                value={searchTopic}
                onChange={e => setSearchTopic(e.target.value)}
                className="topic-search"
            />

            {sortedHistory.map((entry, idx) => (
                <div key={idx} className="history-card">
                    <div><strong>難易度：</strong>{entry.difficulty}</div>
                    <div><strong>出題範囲：</strong>{entry.topics.join(", ")}</div>
                    <div><strong>日時：</strong>{new Date(entry.created_at).toLocaleString()}</div>
                    <div><strong>閲覧数：</strong>{entry.views}</div>

                    <button onClick={() => handleToggleOpened(entry.id, entry.opened)}>
                        {entry.opened ? "🌐 公開解除" : "🌐 公開する"}
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(entry.id);
                            alert("履歴IDをコピーしました！");
                        }}
                    >
                        🧾 履歴IDをコピー
                    </button>

                    <button onClick={() => handleTogglePin(entry.id, entry.pinned)}>
                        {entry.pinned ? "📌 固定解除" : "📌 ピン留め"}
                    </button>

                    <details>
                        <summary>📘 問題を見る</summary>
                        <div className="problem-block">
                            <pre><MarkdownRenderer content={entry.problem} /></pre>
                        </div>
                    </details>
                    <details>
                        <summary>🧠 解答を見る</summary>
                        <div className="solution-block">
                            <pre><MarkdownRenderer content={entry.solution} /></pre>
                        </div>
                    </details>
                </div>
            ))}
        </div>
    );
}

export default HistoryPage;
