import express from "express";
import cors from "cors";
import { generate } from "./gemini";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/problem", async (req, res) => {
    const difficulty = parseInt(req.query.difficulty as string);
    const problem = await generateMathProblem(difficulty);
    res.json({ problem });
});

app.listen(3001, () => console.log("Server running on port 3001"));
