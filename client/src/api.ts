const BASE = import.meta.env.VITE_API_BASE_URL;

// ✅ 模試生成（問題＋解答）
export async function fetchProblem(userId: string, difficulty: string, includeMathThree: boolean) {
    const res = await fetch(`${BASE}/api/session?userId=${userId}&difficulty=${encodeURIComponent(difficulty)}&includeMathThree=${includeMathThree}`);
    if (!res.ok) throw new Error("問題生成に失敗しました");
    return await res.json();
}

// ✅ 履歴取得（タグ付き）
export async function fetchHistory(userId: string) {
    const res = await fetch(`${BASE}/api/history?userId=${userId}`);
    if (!res.ok) throw new Error("履歴取得に失敗しました");
    return await res.json();
}

export async function updateTags(index: number, tags: string[]) {
    const res = await fetch(`${BASE}/api/history/${index}/tags`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags })
    });
    if (!res.ok) throw new Error("タグ更新に失敗しました");
    return await res.json();
}