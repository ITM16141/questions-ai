import { useEffect, useState } from "react";
import { fetchGallery } from "./api";

type HistoryEntry = {
    id: string;
    userId: string;
    difficulty: string;
    includeMathThree: boolean;
    problem: string;
    solution: string;
    timestamp: number;
    tags: string[];
    pinned: boolean;
};

function GalleryPage() {
    const [entries, setEntries] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        fetchGallery().then(setEntries);
    }, []);

    return (
        <div>
            <h1>🌐 公開ギャラリー</h1>
            {entries.map((entry, idx) => (
                <div key={idx} className="history-card">
                    <div><strong>難易度：</strong>{entry.difficulty}</div>
                    <div><strong>出題範囲：</strong>{entry.includeMathThree ? "数学I〜III" : "数学I〜II"}</div>
                    <div><strong>日時：</strong>{new Date(entry.timestamp).toLocaleString()}</div>
                    <div><strong>タグ：</strong>{entry.tags.join(", ")}</div>
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

export default GalleryPage;