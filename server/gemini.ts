import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function loadPromptTemplate(): string {
    const filePath = path.join(__dirname, "prompts", "problem-generator.md");
    return fs.readFileSync(filePath, "utf-8");
}

export async function generate(difficulty: string, includeMathIII: boolean): Promise<{
    problem: string;
    rest: string;
}> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const template = loadPromptTemplate();

    const range = includeMathIII ? "数学I・II・III・A・B・C" : "数学I・II・A・B・C";
    const prompt = template
        .replace("${difficulty}", difficulty)
        .replace("${range}", range);

    const result = await model.generateContent(prompt);
    const fullText = result.response.text();
    const [problemPart, restPart] = fullText.split("<division>");

    return {
        problem: problemPart.trim(),
        rest: restPart.trim()
    };
}
