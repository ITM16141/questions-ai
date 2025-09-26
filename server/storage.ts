import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "history.json");

export function loadHistory(): any[] {
    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function saveHistory(history: any[]) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf-8");
    } catch (err) {
        console.error("履歴保存に失敗しました:", err);
    }
}