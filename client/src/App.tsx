import React, { useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import RangeSelector from "./components/RangeSelector";
import MarkdownRenderer from "./components/MarkdownRenderer";
import { fetchProblem, fetchSolution, fetchPdfLinks } from "./api";

function App() {
    const [difficulty, setDifficulty] = useState("標準レベル");
    const [includeMathThree, setIncludeMathThree] = useState(true);
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [pdfLinks, setPdfLinks] = useState<{ problemPdf: string; solutionPdf: string } | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");

    const generateAll = async () => {
        setLoading(true);
        setProgressMessage("🧠 思考中…問題の構想を練っています");

        const prob = await fetchProblem(difficulty, includeMathThree);
        setProgressMessage("📚 問題構成中…誘導形式を設計しています");

        const sol = await fetchSolution(difficulty, includeMathThree);
        setProgressMessage("🔍 解答と検証を準備中…");

        const pdfs = await fetchPdfLinks(difficulty, includeMathThree);
        setProblem(prob);
        setSolution(sol);
        setPdfLinks(pdfs);
        setShowSolution(false);
        setProgressMessage("✅ 完了しました！");
        setLoading(false);
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>🧠 数学模試ジェネレーター</h1>

            <DifficultySelector
                value={difficulty}
                onChange={setDifficulty}
                disabled={loading}
            />

            <RangeSelector
                value={includeMathThree}
                onChange={setIncludeMathThree}
                disabled={loading}
            />

            <button onClick={generateAll} disabled={loading}>
                {loading ? "生成中…" : "問題を生成"}
            </button>

            {loading && (
                <div style={{ marginTop: "1rem", fontStyle: "italic", color: "#555" }}>
                    {progressMessage}
                </div>
            )}

            {problem && (
                <>
                    <h2 style={{ marginTop: "2rem" }}>📝 問題</h2>
                    <MarkdownRenderer content={problem} />
                    {pdfLinks && (
                        <a href={pdfLinks.problemPdf} download="問題.pdf">📥 問題をダウンロード</a>
                    )}

                    <div style={{ marginTop: "2rem" }}>
                        <button onClick={() => setShowSolution(!showSolution)}>
                            {showSolution ? "解答・検証を隠す" : "解答・検証を見る"}
                        </button>
                    </div>

                    {showSolution && (
                        <>
                            <h2 style={{ marginTop: "2rem" }}>🔍 解答・検証</h2>
                            <MarkdownRenderer content={solution} />
                            {pdfLinks && (
                                <a href={pdfLinks.solutionPdf} download="解答と検証.pdf">📥 解答・検証をダウンロード</a>
                            )}
                        </>
                    )}
                </>
            )}


        </div>
    );
}

export default App;