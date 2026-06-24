export default function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <span className="text-2xl font-bold text-[#163E72]">{value}</span>
      <span className="text-gray-600">{title}</span>
    </div>
  );
}
