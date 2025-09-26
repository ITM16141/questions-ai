import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SharePage from "./SharePage";
import GalleryPage from "./GalleryPage";
import ReactDOM from "react-dom/client";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/share/:id" element={<SharePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
    </BrowserRouter>
);