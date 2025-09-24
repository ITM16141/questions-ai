import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

export async function generate(difficulty: string): Promise<string> {

    const prompt = ``

    const result = await model.generateContent(prompt);
    return result.response.text();
}
