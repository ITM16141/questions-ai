import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { generate } from "./gemini";
import { createPdf } from "./pdf";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/problem", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const includeMathThree = req.query.includeMathThree === "true";
    const { problem } = await generate(difficulty, includeMathThree);
    res.json({ problem });
});

app.get("/api/solution", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const includeMathThree = req.query.includeMathThree === "true";
    const { rest } = await generate(difficulty, includeMathThree);
    res.json({ solution: rest });
});

app.get("/api/pdf", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const includeMathThree = req.query.includeMathThree === "true";
    const { problem, rest } = await generate(difficulty, includeMathThree);
    const problemPath = await createPdf(problem, "problem.pdf");
    const solutionPath = await createPdf(rest, "solution.pdf");
    res.json({
        problemPdf: `/download/${path.basename(problemPath)}`,
        solutionPdf: `/download/${path.basename(solutionPath)}`
    });
});


app.use("/download", express.static(path.join(__dirname)));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});