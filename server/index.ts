import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

app.get("/api/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "トークンがありません" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const { data, error } = await db
            .from("users")
            .select("id, email, created_at")
            .eq("id", decoded.userId)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: "ユーザーが見つかりません" });
        }

        res.json(data);
    } catch (err) {
        if (err instanceof Error && err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "トークンの有効期限が切れています" });
        }
        return res.status(401).json({ error: "トークンが無効です" });
    }

});

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
            created_at: new Date(Date.now()).toISOString(),
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
    const { data, error } = await db.from("history").select("*").eq("userId", userId).order("created_at", {ascending: false});

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
    const { data, error } = await db.from("history").select("*").eq("opened", true).order("created_at", {ascending: false});

    if(error) console.error("Supabase error:", error);

    res.json(data);
});

app.get("/api/share/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await db.from("history").select("*").eq("id", id);

    if(error) console.error("Supabase error:", error);

    res.json(data);
});

app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await db.from("users").insert([
        { email, password_hash },
    ]);

    if(error) console.error("Supabase error:", error);
    res.json({ success: true });
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await db
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if(error) console.error("Supabase error:", error);

    const match = await bcrypt.compare(password, data.password_hash);
    if (!match) return res.status(401).json({ error: "パスワード不一致" });

    const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });

    console.log(token);
    res.json({ token });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
