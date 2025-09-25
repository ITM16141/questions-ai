import React, { useState } from "react";
import DifficultySelector from "./components/DifficultySelector";
import MarkdownRenderer from "./components/MarkdownRenderer";
import { fetchProblem, fetchSolution, fetchPdfLinks } from "./api";

function App() {
    const [difficulty, setDifficulty] = useState("標準レベル");
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [pdfLinks, setPdfLinks] = useState<{ problemPdf: string; solutionPdf: string } | null>(null);
    const [showSolution, setShowSolution] = useState(false);

    const generateAll = async () => {
        const prob = await fetchProblem(difficulty);
        const sol = await fetchSolution(difficulty);
        const pdfs = await fetchPdfLinks(difficulty);
        setProblem(prob);
        setSolution(sol);
        setPdfLinks(pdfs);
        setShowSolution(false);
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>🧠 数学模試ジェネレーター</h1>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
            <button onClick={generateAll}>問題を生成</button>

            {problem && (
                <>
                    <MarkdownRenderer content={problem} />
                    {pdfLinks && (
                        <a href={pdfLinks.problemPdf} download="問題.pdf">📥 問題をダウンロード</a>
                    )}
                    <div style={{ marginTop: "1rem" }}>
                        <button onClick={() => setShowSolution(!showSolution)}>
                            {showSolution ? "解答・検証を隠す" : "解答・検証を見る"}
                        </button>
                    </div>
                    {showSolution && (
                        <>
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