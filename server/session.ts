import {ChatSession, GoogleGenerativeAI} from "@google/generative-ai";
import path from "path";
import fs from "fs";
import db from "./db";

const sessions = new Map<string, ChatSession>();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function loadPrompt(): string {
    const filePath = path.join(process.cwd(), "prompts", "problem-generator.md");
    return fs.readFileSync(filePath, "utf-8");
}

export function getSessionForUser(userId: string) {
    return sessions.get(userId);
}

export function createSessionForUser(userId: string): ChatSession {
    const chat: ChatSession = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }).startChat({
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

    sessions.set(userId, chat);
    return chat;
}

export async function handleSession(params: {
    userId: string;
    difficulty: string;
    includeMathThree: boolean;
    sessionId: string;
}) {
    const { userId, difficulty, includeMathThree, sessionId } = params;
    const uid = String(userId);

    let chat = getSessionForUser(uid);
    if (!chat) {
        chat = createSessionForUser(uid);
    }

    const range = includeMathThree ? "数学I・II・A・B・III" : "数学I・II・A・B";
    const prompt = `難易度：${difficulty}\n出題範囲：${range}\n特別要求：特になし`;
    const result = await chat.sendMessage(prompt);
    const fullText = result.response.text().includes("{start}")
        ? result.response.text().split("{start}").slice(-1)[0]
        : "（生成に失敗しました）";
    const [problemPart, restPart] = fullText.includes("{division}")
        ? fullText.split("{division}")
        : [fullText, "（解答・検証部分が見つかりませんでした）"];
    const problem = problemPart.trim();
    const solution = restPart.trim();
    const created_at = new Date(Date.now()).toISOString();

    const { error } = await db.from("history").insert([
        {
            id: sessionId,
            userId: userId,
            difficulty: difficulty,
            includeMathThree: includeMathThree,
            problem: problem,
            solution: solution,
            created_at: created_at,
            tags: [],
            pinned: false,
            opened: true,
            views: 0
        }
    ]);

    if(error) console.error("Supabase error:", error);

    return {
        sessionId,
        problem: problem,
        solution: solution
    };

}
