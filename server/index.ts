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

app.patch("/api/history/:id/tags", (req, res) => {
    const { id } = req.params;
    const { tags } = req.body;

    if (!Array.isArray(tags)) return res.status(400).json({ error: "tags must be an array" });

    const entry = history.find(h => h.id === id);
    if (!entry) return res.status(404).json({ error: "history entry not found" });

    entry.tags = tags;
    saveHistory(history);
    res.json({ success: true, tags });
});

app.patch("/api/history/:id/pin", (req, res) => {
    const { id } = req.params;
    const { pinned } = req.body;

    if (typeof pinned !== "boolean") {
        return res.status(400).json({ error: "pinned must be boolean" });
    }

    const entry = history.find(h => h.id === id);
    if (!entry) return res.status(404).json({ error: "not found" });

    entry.pinned = pinned;
    saveHistory(history);
    res.json({ success: true, pinned });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
