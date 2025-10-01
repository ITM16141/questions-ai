import { NavLink } from "react-router-dom";
import "./Tabs.css";

function Tabs() {
    return (
        <>
            <nav className="services">
                <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>🧪 問題生成</NavLink>
                <NavLink to="/history" className={({isActive}) => isActive ? "active" : ""}>📜 履歴</NavLink>
                <NavLink to="/gallery" className={({isActive}) => isActive ? "active" : ""}>🌐 ギャラリー</NavLink>
            </nav>
            <nav className={"account"}>
                <NavLink to={"/login"} className={({isActive}) => isActive ? "actiove" : ""}>アカウント</NavLink>
            </nav>
        </>
    );
}

export default Tabs;