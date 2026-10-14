import { FileText } from "lucide-react";
import { API_BASE_URL } from "@/app/services/api";

export function materialHref(pdfUrl?: string | null) {
  if (!pdfUrl) return "";
  if (pdfUrl.startsWith("http")) return pdfUrl;
  return `${API_BASE_URL}${pdfUrl.startsWith("/") ? "" : "/"}${pdfUrl}`;
}

export default function MaterialOpenLink({
  pdfUrl,
  label = "Abrir material (PDF)",
}: {
  pdfUrl?: string | null;
  label?: string;
}) {
  const href = materialHref(pdfUrl);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mb-4 inline-flex items-center gap-3 rounded-xl border border-[#338B97]/30 bg-white px-4 py-3 text-[#163E72] shadow-sm transition hover:border-[#338B97] hover:bg-[#338B97]/5 hover:shadow-md"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#338B97]/10 text-[#338B97]">
        <FileText className="h-5 w-5" />
      </span>
      <span className="text-left">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-gray-500">Abre em uma nova aba</span>
      </span>
    </a>
  );
}
