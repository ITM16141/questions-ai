import express from "express";
import cors from "cors";
import { handleSession } from "./session";
import db from "./db";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://questions-ai-two.vercel.app",
    methods: ["GET", "POST", "PATCH"],
    credentials: true
}));

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
    opened: boolean;
};

type RawSessionRow = {
    id: string;
    status: "pending" | "done";
    problem: string;
    solution: string;
}

app.get("/api/session", async (req, res) => {
    const { userId, difficulty, includeMathThree, sessionId } = req.query;

    db.prepare(`
        INSERT INTO sessions (id, status, problem, solution)
        VALUES (?, ?, ?, ?)
    `).run(sessionId, "pending", null, null);

    handleSession({
        userId: String(userId),
        difficulty: String(difficulty),
        includeMathThree: includeMathThree === "true"
    }).then(result => {
        db.prepare(`
            UPDATE sessions SET status = ?, problem = ?, solution = ?
            WHERE id = ?
        `).run("done", result.problem, result.solution, sessionId);

        db.prepare(`
            INSERT INTO history (
                id, userId, difficulty, includeMathThree,
                problem, solution, timestamp,
                tags, pinned, opened, views
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            sessionId,
            userId,
            difficulty,
            includeMathThree ? 1 : 0,
            result.problem,
            result.solution,
            Date.now(),
            "",
            0,
            0,
            0
        );
    });

    res.json({ sessionId });
});

app.post("/api/session/cancel", (req, res) => {
    const { sessionId } = req.body;

    db.prepare(`
        UPDATE sessions SET status = 'cancelled' WHERE id = ?
  ` ).run(sessionId);

    res.json({ success: true });
});

app.get("/api/session/status", (req, res) => {
    const { sessionId } = req.query;
    const session = db.prepare(`
        SELECT status, problem, solution FROM sessions WHERE id = ?
    `).get(sessionId) as RawSessionRow;

    if (!session) {
        return res.status(404).json({ error: "not found" });
    }

    res.json({
        status: session.status,
        result: {
            problem: session.problem,
            solution: session.solution
        }
    });
});


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

app.patch("/api/history/:id/opened", (req, res) => {
    const { id } = req.params;
    const { opened: isOpened } = req.body;
    if (typeof isOpened !== "boolean") return res.status(400).json({ error: "opened must be boolean" });

    db.prepare("UPDATE history SET opened = ? WHERE id = ?").run(isOpened ? 1 : 0, id);
    res.json({ success: true, opened: isOpened });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
