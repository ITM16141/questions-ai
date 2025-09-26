import express from "express";
import cors from "cors";
import { handleSession } from "./session";
import db from "./db";

const app = express();
app.use(express.json());

type RawHistoryRow = {
    id: string;
    userId: string;
    difficulty: string;
    includeMathThree: number;
    problem: string;
    solution: string;
    timestamp: number;
    tags: string;
    pinned: number;
    public: boolean;
};

app.use(cors({
    origin: "https://questions-ai-two.vercel.app"
}));

app.get("/api/session", handleSession);

app.get("/api/history", (req, res) => {
    const { userId } = req.query;
    const rows = db.prepare("SELECT * FROM history WHERE userId = ? ORDER BY timestamp DESC").all(userId);
    const parsed = rows.map(row => {
        const r = row as RawHistoryRow;
        return {
            ...r,
            includeMathThree: !!r.includeMathThree,
            pinned: !!r.pinned,
            tags: JSON.parse(r.tags)
        };
    });

    res.json(parsed);
});

app.get("/api/share/:id", (req, res) => {
    const { id } = req.params;
    const row = db.prepare("SELECT * FROM history WHERE id = ?").get(id);
    if (!row) return res.status(404).json({ error: "not found" });

    const r = row as RawHistoryRow;
    const entry = {
        ...r,
        includeMathThree: !!r.includeMathThree,
        pinned: !!r.pinned,
        tags: JSON.parse(r.tags)
    };

    res.json(entry);
});

app.get("/api/gallery", (req, res) => {
    const rows = db.prepare("SELECT * FROM history WHERE public = 1 ORDER BY timestamp DESC").all();
    const parsed = rows.map(row => {
        const r = row as RawHistoryRow;
        return {
            ...r,
            includeMathThree: !!r.includeMathThree,
            pinned: !!r.pinned,
            public: !!r.public,
            tags: JSON.parse(r.tags)
        }
    });
    res.json(parsed);
});

app.patch("/api/history/:id/tags", (req, res) => {
    const { id } = req.params;
    const { tags } = req.body;
    if (!Array.isArray(tags)) return res.status(400).json({ error: "tags must be array" });

    db.prepare("UPDATE history SET tags = ? WHERE id = ?").run(JSON.stringify(tags), id);
    res.json({ success: true, tags });
});

app.patch("/api/history/:id/pin", (req, res) => {
    const { id } = req.params;
    const { pinned } = req.body;
    if (typeof pinned !== "boolean") return res.status(400).json({ error: "pinned must be boolean" });

    db.prepare("UPDATE history SET pinned = ? WHERE id = ?").run(pinned ? 1 : 0, id);
    res.json({ success: true, pinned });
});

app.patch("/api/history/:id/public", (req, res) => {
    const { id } = req.params;
    const { public: isPublic } = req.body;
    if (typeof isPublic !== "boolean") return res.status(400).json({ error: "public must be boolean" });

    db.prepare("UPDATE history SET public = ? WHERE id = ?").run(isPublic ? 1 : 0, id);
    res.json({ success: true, public: isPublic });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
