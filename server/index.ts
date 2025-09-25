import express from "express";
import { generate } from "./gemini";
import { createPdf } from "./pdf";

const app = express();

app.get("/api/problem-pdf", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const { problem, rest } = await generate(difficulty);

    const problemPath = await createPdf(problem, "problem.pdf");
    const restPath = await createPdf(rest, "solution.pdf");

    res.json({
        message: "PDF生成完了",
        files: {
            problem: problemPath,
            solution: restPath
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});