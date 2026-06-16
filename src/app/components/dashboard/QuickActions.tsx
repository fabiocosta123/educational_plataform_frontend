"use client";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-[#338B97] text-white rounded-md hover:bg-[#255690] transition">
          Start New Course
        </button>
        <button className="px-4 py-2 bg-[#66BCA1] text-white rounded-md hover:bg-[#4FA58A] transition">
          Continue Last Course
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
          Profile
        </button>
      </div>
    </div>
  );
}
