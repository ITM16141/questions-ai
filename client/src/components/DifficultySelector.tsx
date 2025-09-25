import React from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const levels = [
    { label: "基礎レベル", value: "基礎レベル" },
    { label: "標準レベル", value: "標準レベル" },
    { label: "応用レベル", value: "応用レベル" },
    { label: "発展レベル", value: "発展レベル" },
];

const DifficultySelector: React.FC<Props> = ({ value, onChange }) => (
    <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="difficulty">難易度：</label>
        <select
            id="difficulty"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {levels.map((level) => (
                <option key={level.value} value={level.value}>
                    {level.label}
                </option>
            ))}
        </select>
    </div>
);

export default DifficultySelector;