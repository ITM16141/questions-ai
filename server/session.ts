import { Request, Response } from "express";
import {ChatSession, GoogleGenerativeAI} from "@google/generative-ai";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
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

export async function handleSession(req: Request, res: Response) {
    const { userId, difficulty, includeMathThree } = req.query;
    const uid = String(userId);

    let chat = getSessionForUser(uid);
    if (!chat) {
        chat = createSessionForUser(uid);
    }

    const range = includeMathThree === "true" ? "数学I・II・A・B・III" : "数学I・II・A・B";
    const prompt = `難易度：${difficulty}\n出題範囲：${range}\n特別要求：特になし`;
    const result = await chat.sendMessage(prompt);
    const fullText = result.response.text().includes("<start>")
        ? result.response.text().split("<start>").slice(-1)[0]
        : "（生成に失敗しました）";
    const [problemPart, restPart] = fullText.includes("<division>")
        ? fullText.split("<division>")
        : [fullText, "（解答・検証部分が見つかりませんでした）"];
    const problem = problemPart.trim();
    const solution = restPart.trim();

    const id = randomUUID();
    const timestamp = Date.now();

    db.prepare(`
        INSERT INTO history (id, userId, difficulty, includeMathThree, problem, solution, timestamp, tags, pinned, public)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, uid, difficulty, includeMathThree === "true" ? 1 : 0, problem, solution, timestamp, JSON.stringify([]), 0, 0);

    res.json({ problem, solution });
}
