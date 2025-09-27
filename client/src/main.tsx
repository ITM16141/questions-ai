import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SharePage from "./SharePage";
import HistoryPage from "./HistoryPage";
import GalleryPage from "./GalleryPage";
import ReactDOM from "react-dom/client";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/share/:id" element={<SharePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
    </BrowserRouter>
);