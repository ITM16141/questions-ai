import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createSessionForUser, getSessionForUser } from "./session";
import { createMockExamPdf } from "./pdf";
import { saveHistory, getHistory, deleteHistoryEntry, updateTags, searchHistory } from "./history";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/session", (req, res) => {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    if (!getSessionForUser(userId)) {
        createSessionForUser(userId);
    }

    res.json({ sessionId: userId });
});

app.get("/api/problem", async (req, res) => {
    const { userId, difficulty, includeMathThree } = req.query;
    const chat = getSessionForUser(userId as string);
    if (typeof chat === "undefined") return res.status(400).json({ error: "Invalid session" });

    const range = includeMathThree === "true" ? "数学I・II・A・B・III" : "数学I・II・A・B";
    const userInput = `難易度：${difficulty}\n出題範囲：${range}\n特別要求：特になし`;

    const result = await chat.sendMessage(userInput);
    const fullText = result.response.text();
    const [problemPart, restPart] = fullText.includes("<division>")
        ? fullText.split("<division>")
        : [fullText, "（解答・検証部分が見つかりませんでした）"];

    res.json({
        problem: problemPart.trim(),
        solution: restPart.trim()
    });
});

app.get("/api/pdf", async (req, res) => {
    const { userId, difficulty, includeMathThree } = req.query;
    const chat = getSessionForUser(userId as string);
    if (!chat) return res.status(400).json({ error: "Invalid session" });

    const range = includeMathThree === "true" ? "数学I・II・III・A・B・C" : "数学I・II・A・B・C";
    const userInput = `難易度：${difficulty}\n出題範囲：${range}\n特別要求：特になし`;

    const result = await chat.sendMessage(userInput);
    const fullText = result.response.text();
    const [problemPart, restPart] = fullText.includes("<division>")
        ? fullText.split("<division>")
        : [fullText, "（解答・検証部分が見つかりませんでした）"];

    const timestamp = Date.now();
    const problemFile = `problem-${timestamp}.pdf`;
    const solutionFile = `solution-${timestamp}.pdf`;

    await createMockExamPdf(problemPart.trim(), problemFile, `数学模試問題（${difficulty}）`);
    await createMockExamPdf(restPart.trim(), solutionFile, `数学模試 解答・検証（${difficulty}）`);

    saveHistory(userId as string, {
        id: `${timestamp}`,
        timestamp,
        difficulty: difficulty as string,
        includeMathThree: includeMathThree === "true",
        problem: problemPart.trim(),
        solution: restPart.trim(),
        problemPdf: `/download/${problemFile}`,
        solutionPdf: `/download/${solutionFile}`,
        tags: []
    });

    res.json({
        problemPdf: `/download/${problemFile}`,
        solutionPdf: `/download/${solutionFile}`
    });
});

app.get("/api/history", (req, res) => {
    const userId = req.query.userId as string;
    const history = getHistory(userId);
    res.json({ history });
});

app.delete("/api/history", (req, res) => {
    const { userId, entryId } = req.query;
    deleteHistoryEntry(userId as string, entryId as string);
    res.json({ success: true });
});

app.post("/api/history/tag", (req, res) => {
    const { userId, entryId, tags } = req.body;
    updateTags(userId, entryId, tags);
    res.json({ success: true });
});

app.get("/api/history/search", (req, res) => {
    const { userId, keyword } = req.query;
    const results = searchHistory(userId as string, keyword as string);
    res.json({ history: results });
});

app.use("/download", express.static(path.join(__dirname)));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});