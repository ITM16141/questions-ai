import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import App from "./pages/App";
import HistoryPage from "./pages/HistoryPage";
import GalleryPage from "./pages/GalleryPage";
import ReactDOM from "react-dom/client";
import "./styles.css";
import SharePage from "./pages/SharePage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <SessionProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/share/:id" element={<SharePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    </SessionProvider>
);
