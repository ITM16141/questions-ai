import "./App.css";
import React, { useEffect, useState } from "react";
import { fetchGallery } from "../api";
import Tabs from "../components/Tabs";
import {HistoryEntry} from "../types";
import {useNavigate} from "react-router-dom";

function GalleryPage(){
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [searchTopic, setSearchTopic] = useState("");
    const [inputId, setInputId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchGallery().then(setEntries);
    }, []);

    const filtered = searchTopic.trim()
        ? entries.filter(entry =>
            entry.topics.some(topic => topic.toLowerCase().includes(searchTopic.toLowerCase()))
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
            <h2>出題範囲から検索</h2>
            <input
                type="text"
                placeholder="出題範囲で検索"
                value={searchTopic}
                onChange={e => setSearchTopic(e.target.value)}
            />

            {filtered.map((entry, idx) => (
                <div key={idx} className="history-card">
                    <div><strong>難易度：</strong>{entry.difficulty}</div>
                    <div><strong>出題範囲：</strong>{entry.topics.join(", ")}</div>
                    <div><strong>日時：</strong>{new Date(entry.created_at).toLocaleString()}</div>
                    <div><strong>閲覧数：</strong>{entry.views}</div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            navigate(`/share/${entry.id}`);
                        }}
                    >
                        <button type="submit">閲覧</button>
                    </form>
                </div>
            ))}
        </div>
    );
}

export default GalleryPage;