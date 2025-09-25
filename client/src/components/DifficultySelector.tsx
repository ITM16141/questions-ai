import React from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const levels = [
    "基礎レベル",
    "標準レベル",
    "応用レベル",
    "発展レベル"
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
                <option key={level} value={level}>
                    {level}
                </option>
            ))}
        </select>
    </div>
);

export default DifficultySelector;