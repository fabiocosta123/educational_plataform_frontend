interface ProgressBarProps{
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  let color = "red";
  if (progress >= 70) color = "green";
  else if (progress >= 30) color = "orange";

  return (
    <div className="progress-bar">
      <div
        className="progress"
        style={{ width: `${progress}%`, backgroundColor: color }}
      ></div>
    </div>
  );
}
