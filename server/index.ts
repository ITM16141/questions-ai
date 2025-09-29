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

app.get("/api/session", async (req, res) => {
    const { userId, difficulty, includeMathThree, sessionId } = req.query;

    const { error } = await db.from("sessions").insert({
        id: sessionId,
        status: "pending",
        problem: null,
        solution: null
    });

    if(error) console.error("Supabase error:", error);

    handleSession({
        userId: String(userId),
        difficulty: String(difficulty),
        includeMathThree: String(includeMathThree).toLowerCase() === 'true',
        sessionId: String(sessionId)
    }).then(async result => {
        const { error: error1 } = await db.from("sessions").update({
            status: "done",
            problem: result.problem,
            solution: result.solution,
        }).eq("id", String(sessionId));

        if(error1) console.error("Supabase error:", error1);

        const { error: error2 } = await db.from("history").insert({
            id: sessionId,
            userId: String(userId),
            difficulty: String(difficulty),
            includeMathThree: includeMathThree,
            problem: result.problem,
            solution: result.solution,
            timestamp: new Date(Date.now()).toISOString(),
            tags: [""],
            pinned: false,
            opened: true,
            views: 0
        });

        if(error2) console.error("Supabase error:", error2);
    });

    res.json({ sessionId });
});

app.post("/api/session/cancel", async (req, res) => {
    const { sessionId } = req.body;

    const { error } = await db.from("sessions").update({
        status: "cancelled"
    }).eq("id", String(sessionId));

    if(error) console.error("Supabase error:", error);

    res.json({ success: true });
});

app.get("/api/session/status", async (req, res) => {
    const { sessionId } = req.query;
    const { data, error } = await db.from("sessions").select("status, problem, solution").eq("id", String(sessionId)).maybeSingle();

    if(error) console.error("Supabase error:", error);

    res.json(data);
});

app.get("/api/history", async (req, res) => {
    const { userId } = req.query;
    const { data, error } = await db.from("history").select("*").eq("userId", userId).order("timestamp", {ascending: false});

    if(error) console.error("Supabase error:", error);

    res.json(data);
});

app.patch("/api/history/:id/tags", async (req, res) => {
    const { id } = req.params;
    const { tags } = req.body;
    if (!Array.isArray(tags)) return res.status(400).json({ error: "tags must be array" });

    const { error } = await db.from("history").update({
        tags: tags
    }).eq("id", id);

    if(error) console.error("Supabase error:", error);

    res.json({ success: true, tags });
});

app.patch("/api/history/:id/pin", async (req, res) => {
    const { id } = req.params;
    const { pinned } = req.body;
    if (typeof pinned !== "boolean") return res.status(400).json({ error: "pinned must be boolean" });

    const { error } = await db.from("history").update({
        pinned: pinned
    }).eq("id", id);

    if(error) console.error("Supabase error:", error);

    res.json({ success: true, pinned });
});

app.patch("/api/history/:id/opened", async (req, res) => {
    const { id } = req.params;
    const { opened: isOpened } = req.body;
    if (typeof isOpened !== "boolean") return res.status(400).json({ error: "opened must be boolean" });

    const { error } = await db.from("history").update({
        opened: isOpened
    }).eq("id", id);

    if(error) console.error("Supabase error:", error);

    res.json({ success: true, opened: isOpened });
});

app.get("/api/gallery", async (req, res) => {
    const { data, error } = await db.from("history").select("*").eq("opened", true).order("timestamp", {ascending: false});

    if(error) console.error("Supabase error:", error);

    res.json(data);
});

app.get("/api/share/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await db.from("history").select("*").eq("id", id);

    if(error) console.error("Supabase error:", error);

    res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
