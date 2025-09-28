import "./App.css";
import React, { useEffect, useState } from "react";
import {fetchHistory, updateTags, updatePinned, updateOpened} from "./api";
import Tabs from "./components/Tabs";
import {HistoryEntry} from "./types";
import MarkdownRenderer from "./components/MarkdownRenderer";

const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [tagInputs, setTagInputs] = useState<Record<number, string>>({});
    const [searchTag, setSearchTag] = useState("");
    const userId = localStorage.getItem("userId") as string;

    useEffect(() => {
        fetchHistory(userId).then(setHistory);
    }, []);

    const handleAddTag = async (id: string, index: number) => {
        const newTag = tagInputs[index]?.trim();
        if (!newTag) return;
        const updatedTags = [...history[index].tags, newTag];
        await updateTags(id, updatedTags);
        const updated = await fetchHistory(userId);
        setHistory(updated);
        setTagInputs({ ...tagInputs, [index]: "" });
    };

    const handleRemoveTag = async (id: string, index: number, tagToRemove: string) => {
        const updatedTags = history[index].tags.filter(tag => tag !== tagToRemove);
        await updateTags(id, updatedTags);
        const updated = await fetchHistory(userId);
        setHistory(updated);
    };

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

    const filteredHistory = searchTag.trim()
        ? history.filter(entry =>
            entry.tags.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase()))
        )
        : history;

    const sortedHistory = [...filteredHistory].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.timestamp - a.timestamp;
    });

    return (
        <div className="history-page">
            <Tabs />
            <h1>📚 履歴</h1>
            <input
                type="text"
                placeholder="タグで検索（例：微分）"
                value={searchTag}
                onChange={e => setSearchTag(e.target.value)}
                className="tag-search"
            />

            {sortedHistory.map((entry, idx) => (
                <div key={idx} className="history-card">
                    <div><strong>難易度：</strong>{entry.difficulty}</div>
                    <div><strong>出題範囲：</strong>{entry.includeMathThree ? "数学I・II・III・A・B・C" : "数学I・II・A・B・C"}</div>
                    <div><strong>日時：</strong>{new Date(entry.timestamp).toLocaleString()}</div>
                    <div><strong>閲覧数：</strong>{entry.views}</div>
                    <div><strong>タグ：</strong>{entry.tags.join(", ")}</div>

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

                    {entry.tags.length > 0 && (
                        <div className="tags">
                            <strong>タグ：</strong>
                            {entry.tags.map((tag, i) => (
                                <span key={i} className="tag">
                                    {tag}
                                    <button onClick={() => handleRemoveTag(entry.id, idx, tag)}>❌</button>
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
                        <button onClick={() => handleAddTag(entry.id, idx)}>追加</button>
                    </div>

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
};

export default HistoryPage;
