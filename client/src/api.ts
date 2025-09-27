const BASE = process.env.VITE_API_BASE_URL!;

export async function fetchHistory(userId: string) {
    const res = await fetch(`${BASE}/api/history?userId=${userId}`);
    if (!res.ok) throw new Error("履歴取得に失敗しました");
    return await res.json();
}

export async function updateTags(id: string, tags: string[]) {
    const res = await fetch(`${BASE}/api/history/${id}/tags`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags })
    });
    if (!res.ok) throw new Error("タグ更新に失敗しました");
    return await res.json();
}

export async function updatePinned(id: string, pinned: boolean) {
    const res = await fetch(`${BASE}/api/history/${id}/pin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned })
    });
    if (!res.ok) throw new Error("ピン状態の更新に失敗しました");
    return await res.json();
}

export async function updatePublic(id: string, isPublic: boolean) {
    const res = await fetch(`${BASE}/api/history/${id}/public`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public: isPublic })
    });
    if (!res.ok) throw new Error("公開状態の更新に失敗しました");
    return await res.json();
}

export async function fetchGallery() {
    const res = await fetch(`${BASE}/api/gallery`);
    if (!res.ok) throw new Error("ギャラリー取得に失敗しました");
    return await res.json();
}