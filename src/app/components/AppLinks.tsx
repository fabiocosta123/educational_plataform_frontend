import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const backLinkClass =
  "mb-1 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#338B97] transition hover:bg-[#338B97]/10";

export const editActionClass =
  "inline-flex items-center justify-center rounded-lg border border-[#338B97] px-3 py-1.5 text-sm font-medium text-[#338B97] transition hover:bg-[#338B97]/10";

export const dangerActionClass =
  "inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100";

export const quietActionClass =
  "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100";

export const textNavClass =
  "inline-flex items-center justify-center rounded-lg px-2 py-1 text-sm font-semibold text-[#338B97] transition hover:bg-[#338B97]/10";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={backLinkClass}>
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Link>
  );
}
