// "use client";

// export default function CoordinatorCard({ title, value }: { title: string; value: number }) {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
//       <span className="text-2xl font-bold text-[#163E72]">{value}</span>
//       <span className="text-gray-600">{title}</span>
//     </div>
//   );
// }

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CoordinatorCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="shadow-sm rounded-lg flex flex-col items-center text-center">
      <CardHeader>
        <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-[#163E72]">{value}</p>
      </CardContent>
    </Card>
  );
}
