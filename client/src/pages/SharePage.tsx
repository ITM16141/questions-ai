import "./App.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {HistoryEntry} from "../types";
import MarkdownRenderer from "../components/MarkdownRenderer";
import Tabs from "../components/Tabs";

function SharePage() {
    const { id } = useParams();
    const [entry, setEntry] = useState<HistoryEntry | null>(null);

    useEffect(() => {
        fetch(`/api/share/${id}`)
            .then(res => res.json())
            .then(setEntry)
            .catch(() => setEntry(null));
    }, [id]);

    if (!entry) return <p>履歴が見つかりませんでした。</p>;

    return (
        <div className="share-page">
            <Tabs />
            <h1>📘 共有されたパッケージ</h1>
            <div><strong>難易度：</strong>{entry.difficulty}</div>
            <div><strong>出題範囲：</strong>{entry.includeMathThree ? "数学I・II・III・A・B・C" : "数学I・II・A・B・C"}</div>
            <div><strong>日時：</strong>{new Date(entry.created_at).toLocaleString()}</div>
            <div><strong>閲覧数：</strong>{entry.views}</div>
            <div><strong>タグ：</strong>{entry.tags?.join?.(", ") || ""}</div>

            <div className="problem-block">
                <pre><MarkdownRenderer content={entry.problem} /></pre>
            </div>
            <div className="solution-block">
                <pre><MarkdownRenderer content={entry.solution} /></pre>
            </div>
        </div>
    );
}

export default SharePage;