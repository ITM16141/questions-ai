import "./App.css";
import {useState} from "react";
import { saveToken } from "../lib/auth";
import Tabs from "../components/Tabs";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();

            if (!res.ok) {
                alert("ログインに失敗:" + data.error);
                return;
            }

            saveToken(data.token);
            navigate("/");
        } catch (error) {
            alert("ログインに失敗: " + error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        navigate("/register");
    }

    return (
        <div className="login-page">
            <Tabs />
            <h1>ログイン</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="メール" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="パスワード" />
            <button onClick={handleLogin} disabled={loading}>ログイン</button>
            <u onClick={handleRegister} aria-disabled={loading}>アカウントを作成</u>
        </div>
    );
}