import React from "react";

type Props = {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
};

const RangeSelector: React.FC<Props> = ({ value, onChange, disabled }) => (
    <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="range">出題範囲：</label>
        <select
            id="range"
            value={value ? "true" : "false"}
            onChange={(e) => onChange(e.target.value === "true")}
            disabled={disabled}
        >
            <option value="true">数学IIIを含む</option>
            <option value="false">数学IIIを含まない</option>
        </select>
    </div>
);

export default RangeSelector;
