import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownRenderer from "./components/MarkdownRenderer";

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
        <div>
            <h1>📘 共有されたパッケージ</h1>
            <div><strong>難易度：</strong>{entry.difficulty}</div>
            <div><strong>出題範囲：</strong>{entry.includeMathThree ? "数学I・II・III・A・B・C" : "数学I・II・A・B・C"}</div>
            <div><strong>日時：</strong>{new Date(entry.timestamp).toLocaleString()}</div>
            <div><strong>タグ：</strong>{entry.tags.join(", ")}</div>

            <h2>問題</h2>
            <pre><MarkdownRenderer content={entry.problem} /></pre>
            <h2>解答</h2>
            <pre><MarkdownRenderer content={entry.solution} /></pre>
        </div>
    );
}

export default SharePage;