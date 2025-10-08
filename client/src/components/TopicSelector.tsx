import "./TopicSelector.css";
import React from "react";

type Props = {
    values: string[];
    onChange: (values: string[]) => void;
    disabled?: boolean;
};

const topicGroups: Record<string, string[]> = {
    "数学I": ["数と式", "集合と論理", "二次関数", "図形と計量", "データの分析"],
    "数学A": ["場合の数と確率", "整数の性質", "図形の性質"],
    "数学II": ["式と証明", "方程式と不等式", "図形と方程式", "三角関数", "指数・対数関数", "微分・積分の基礎"],
    "数学B": ["数列", "数学的帰納法", "統計的な推測"],
    "数学III": ["関数の極限", "微分法", "積分法", "微積の応用", "三角・指数・対数関数の微積"],
    "数学C": ["ベクトル", "複素数平面", "行列と一次変換", "二次曲線"]
};

const leftSubjects = ["数学I", "数学II", "数学III"];
const rightSubjects = ["数学A", "数学B", "数学C"];

function TopicSelector({ values, onChange, disabled }: Props) {
    const handleChange = (value: string, checked: boolean) => {
        if (checked) {
            onChange([...values, value]);
        } else {
            onChange(values.filter((t) => t !== value));
        }
    };

    const renderSubject = (subject: string) => {
        const topics = topicGroups[subject];
        const allSelected = topics.every((t) => values.includes(t));

        return (
            <details key={subject} className="subject-block">
                <summary>
                    <label className="subject-label">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                onChange(
                                    checked
                                        ? [...new Set([...values, ...topics])]
                                        : values.filter((t) => !topics.includes(t))
                                );
                            }}
                            disabled={disabled}
                        />
                        {subject}
                    </label>
                </summary>

                <div className="topic-row">
                    {topics.map((topic) => (
                        <label key={topic} className="topic-label">
                            <input
                                type="checkbox"
                                value={topic}
                                checked={values.includes(topic)}
                                onChange={(e) => handleChange(topic, e.target.checked)}
                                disabled={disabled}
                            />
                            {topic}
                        </label>
                    ))}
                </div>
            </details>
        );
    };

    return (
        <div className="topic-grid">
            <div className="topic-column">
                {leftSubjects.map(renderSubject)}
            </div>
            <div className="topic-column">
                {rightSubjects.map(renderSubject)}
            </div>
        </div>
    );
}


export default TopicSelector;