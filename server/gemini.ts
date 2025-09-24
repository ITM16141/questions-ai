import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

export async function generate(difficulty: number): Promise<string> {
    const prompt = `数学の問題を1問生成してください。難易度は${difficulty}です。問題文のみを返してください。`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}
