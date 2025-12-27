import React from "react";

interface ScoreBarProps {
  label: string;
  score: number;
  leftLabel: string;
  rightLabel: string;
  reasoning?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  score,
  leftLabel,
  rightLabel,
  reasoning,
}) => {
  const percentage = ((score + 5) / 10) * 100;

  let barColor = "bg-slate-500";
  if (score > 2) barColor = "bg-indigo-500";
  if (score < -2) barColor = "bg-rose-500";

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>{label}</span>
        <span className="font-mono">{score > 0 ? `+${score}` : score}</span>
      </div>
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-1">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 z-10" />
        <div
          className={`absolute top-0 bottom-0 transition-all duration-1000 ${barColor}`}
          style={{
            left: score < 0 ? `${percentage}%` : "50%",
            width: `${Math.abs(score) * 10}%`,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {reasoning && (
        <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic leading-relaxed">
          "{reasoning}"
        </div>
      )}
    </div>
  );
};

export default ScoreBar;
