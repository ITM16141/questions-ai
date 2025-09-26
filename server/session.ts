import {ChatSession, GoogleGenerativeAI} from "@google/generative-ai";
import path from "path";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const sessions = new Map<string, {
    chat: ChatSession;
    createdAt: number;
}>();

function loadPrompt(): string {
    const filePath = path.join(process.cwd(), "prompts", "problem-generator.md");
    return fs.readFileSync(filePath, "utf-8");
}

export function createSessionForUser(userId: string): void {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const chat: ChatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: loadPrompt() }]
            },
            {
                role: "model",
                parts: [{ text: "了解しました。問題生成の準備ができています。" }]
            }
        ]
    });

    sessions.set(userId, {chat, createdAt: Date.now() });
}

export function getSessionForUser(userId: string) {
    return sessions.get(userId)?.chat;
}