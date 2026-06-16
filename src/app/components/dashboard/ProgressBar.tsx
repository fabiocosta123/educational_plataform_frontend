export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all ${
          progress >= 70 ? "bg-green-500" : progress >= 40 ? "bg-yellow-500" : "bg-red-500"
        }`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
