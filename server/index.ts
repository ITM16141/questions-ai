import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { generateSplit } from "./gemini";
import { createPdf } from "./pdf";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/problem", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const { problem } = await generateSplit(difficulty);
    res.json({ problem });
});

app.get("/api/solution", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const { rest } = await generateSplit(difficulty);
    res.json({ solution: rest });
});

app.get("/api/pdf", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const { problem, rest } = await generateSplit(difficulty);
    const problemPath = await createPdf(problem, "problem.pdf");
    const solutionPath = await createPdf(rest, "solution.pdf");

    res.json({
        problemPdf: "/download/problem.pdf",
        solutionPdf: "/download/solution.pdf"
    });
});

app.use("/download", express.static(path.join(__dirname)));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});