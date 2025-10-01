import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import App from "./pages/App";
import HistoryPage from "./pages/HistoryPage";
import GalleryPage from "./pages/GalleryPage";
import ReactDOM from "react-dom/client";
import "./styles.css";
import SharePage from "./pages/SharePage";
import Login from "./pages/Login";
import Register from "./pages/Register";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <SessionProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/share/:id" element={<SharePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    </SessionProvider>
);