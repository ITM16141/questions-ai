import React from "react";

type Props = {
    value: number;
    onChange: (value: number) => void;
};

const DifficultySelector: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div>
            <label>難易度: </label>
            <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>
                        {level}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DifficultySelector;
