import "./App.css";
import { useEffect, useState } from "react";
import { getToken, removeToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import Tabs from "../components/Tabs"

type User = {
    id: string;
    email: string;
    created_at: string;
};

function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return;
        }

        fetch("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                removeToken();
                navigate("/login");
            } else {
                setUser(data);
            }
        });
    }, []);

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };

    if (!user) return <div>読み込み中...</div>;

    return (
        <div className="account-page">
            <Tabs/>
            <h1>アカウント情報</h1>
            <div><strong>メール:</strong> {user.email}</div>
            <div><strong>登録日:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
            <button onClick={handleLogout}>ログアウト</button>
        </div>
    );
}

export default AccountPage;
