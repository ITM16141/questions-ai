import express from "express";
import cors from "cors";
import { handleSession, history } from "./session";
import {saveHistory} from "./storage";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "https://questions-ai-two.vercel.app"
}));

app.get("/api/session", handleSession);

app.get("/api/history", (req, res) => {
    const { userId } = req.query;
    const userHistory = history.filter(h => h.userId === userId);
    res.json(userHistory);
});

app.patch("/api/history/:index/tags", (req, res) => {
    const index = Number(req.params.index);
    const { tags } = req.body;

    if (!Array.isArray(tags)) return res.status(400).json({ error: "tags must be an array" });

    if (index < 0 || index >= history.length) return res.status(404).json({ error: "history entry not found" });

    history[index].tags = tags;
    saveHistory(history);
    res.json({ success: true, tags });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
