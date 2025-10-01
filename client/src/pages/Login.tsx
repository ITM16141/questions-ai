import "./App.css";
import { useState } from "react";
import { saveToken } from "../lib/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok && data.token) {
            saveToken(data.token);
            window.location.href = "/home";
        } else {
            alert("ログイン失敗: " + data.error);
        }
    };

    return (
        <div>
            <h1>ログイン</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メール" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
            <button onClick={handleLogin}>ログイン</button>
        </div>
    );
}