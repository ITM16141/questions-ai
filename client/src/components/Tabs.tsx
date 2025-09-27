import { NavLink } from "react-router-dom";
import "./Tabs.css";

function Tabs() {
    return (
        <nav className="tabs">
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>🧪 問題生成</NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? "active" : ""}>📜 履歴</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => isActive ? "active" : ""}>🌐 ギャラリー</NavLink>
        </nav>
    );
}

export default Tabs;