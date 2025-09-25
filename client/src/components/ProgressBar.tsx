import React from "react";

type Props = {
    progress: number;
};

const ProgressBar: React.FC<Props> = ({ progress }) => (
    <div style={{ marginTop: "1rem", width: "100%", maxWidth: "400px", margin: "auto" }}>
        <div style={{
            height: "10px",
            backgroundColor: "#eee",
            borderRadius: "5px",
            overflow: "hidden"
        }}>
            <div style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ff69b4, #ffd700)",
                transition: "width 0.1s ease-out"
            }} />
        </div>
    </div>
);

export default ProgressBar;