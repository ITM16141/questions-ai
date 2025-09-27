import { useEffect, useState } from "react";
import { fetchGallery } from "./api";
import MarkdownRenderer from "./components/MarkdownRenderer";
import Tabs from "./components/Tabs";
import {HistoryEntry} from "./types";

function GalleryPage() {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [searchTag, setSearchTag] = useState("");

    useEffect(() => {
        fetchGallery().then(setEntries);
    }, []);

    const filtered = searchTag.trim()
        ? entries.filter(entry =>
            entry.tags.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase()))
        )
        : entries;

    return (
        <div>
            <Tabs />
            <h1>🌐 公開ギャラリー</h1>
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
                    <div><strong>日時：</strong>{new Date(entry.timestamp).toLocaleString()}</div>
                    <div><strong>閲覧数：</strong>{entry.views}</div>
                    <div><strong>タグ：</strong>{entry.tags.join(", ")}</div>
                    <details>
                        <summary>📘 問題を見る</summary>
                        <pre><MarkdownRenderer content={entry.problem} /></pre>
                    </details>
                    <details>
                        <summary>🧠 解答を見る</summary>
                        <pre><MarkdownRenderer content={entry.solution} /></pre>
                    </details>
                </div>
            ))}
        </div>
    );
}

export default GalleryPage;