import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import HistoryPage from "./HistoryPage";
import GalleryPage from "./GalleryPage";
import SharePage from "./SharePage";
import ReactDOM from "react-dom/client";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <SessionProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/share/:id" element={<SharePage />} />
            </Routes>
        </BrowserRouter>
    </SessionProvider>
);