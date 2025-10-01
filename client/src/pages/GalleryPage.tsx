import "./App.css";
import React, { useEffect, useState } from "react";
import { fetchGallery } from "../api";
import MarkdownRenderer from "../components/MarkdownRenderer";
import Tabs from "../components/Tabs";
import {HistoryEntry} from "../types";
import {useNavigate} from "react-router-dom";

function GalleryPage(){
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [searchTag, setSearchTag] = useState("");
    const [inputId, setInputId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchGallery().then(setEntries);
    }, []);

    const filtered = searchTag.trim()
        ? entries.filter(entry =>
            entry.tags.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase()))
        )
        : entries;

    return (
        <div className="gallery-page">
            <Tabs />
            <h1>🌐 公開ギャラリー</h1>
            <h2>履歴IDから検索</h2>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (inputId.trim()) navigate(`/share/${inputId.trim()}`);
                }}
            >
                <input
                    type="text"
                    placeholder="履歴IDを入力して表示"
                    value={inputId}
                    onChange={e => setInputId(e.target.value)}
                />
                <button type="submit">表示</button>
            </form>
            <h2>タグから検索</h2>
            <input
                type="text"
                placeholder="タグで検索"
                value={searchTag}
                onChange={e => setSearchTag(e.target.value)}
            />

            {filtered.map((entry, idx) => (
                <div key={idx} className="history-card">
                    <div><strong>難易度：</strong>{entry.difficulty}</div>
                    <div><strong>出題範囲：</strong>{entry.includeMathThree ? "数学I・II・III・A・B・C" : "数学I・II・A・B・C"}</div>
                    <div><strong>日時：</strong>{new Date(entry.created_at).toLocaleString()}</div>
                    <div><strong>閲覧数：</strong>{entry.views}</div>
                    <div><strong>タグ：</strong>{entry.tags.join(", ")}</div>
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

export default GalleryPage;