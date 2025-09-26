import express from "express";
import cors from "cors";
import { handleSession, history } from "./session";

const app = express();
app.use(express.json());

app.use(cors({
    origin: "https://questions-ai-two.vercel.app"
}));

app.get("/api/session", handleSession);

// 履歴取得API
app.get("/api/history", (req, res) => {
    const { userId } = req.query;
    const userHistory = history.filter(h => h.userId === userId);
    res.json(userHistory);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
