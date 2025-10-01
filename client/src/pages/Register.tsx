import "./App.css";
import {useState} from "react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("登録成功！ログインしてください");
            window.location.href = "/login";
        } else {
            alert("登録失敗: " + data.error);
        }
    };

    return (
        <div>
            <h1>新規登録</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メール" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
            <button onClick={handleRegister}>登録</button>
        </div>
    );
}