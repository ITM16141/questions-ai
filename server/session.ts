import {ChatSession, GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const sessions = new Map<string, {
    chat: ChatSession;
    createdAt: number;
}>();

export function createSessionForUser(userId: string): void {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const chat: ChatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "あなたは大学入試模試の問題作成者です。以下の形式で問題を生成してください…" }]
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