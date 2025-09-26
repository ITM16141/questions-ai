import React from "react";

type Props = {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
};

function RangeSelector({ value, onChange, disabled }: Props) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <label>出題範囲：</label>
            <select value={value ? "true" : "false"} onChange={(e) => onChange(e.target.value === "true")} disabled={disabled}>
                <option value="false">数学IIIを除く</option>
                <option value="true">数学IIIを含む</option>
            </select>
        </div>
    );
}

export default RangeSelector;