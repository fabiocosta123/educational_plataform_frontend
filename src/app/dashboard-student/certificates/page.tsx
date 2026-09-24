"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface CertificateItem {
  courseId: number;
  courseTitle: string;
  progressPercentage: number;
  eligible: boolean;
  reason: string;
  examAverage: number;
  issued: boolean;
  code?: string;
}

export default function StudentCertificatesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CertificateItem[]>([]);

  const load = () =>
    api.get<CertificateItem[]>("/Certificates/mine").then((res) => setItems(res.data));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    load().catch(() => toast.error("Não foi possível carregar os certificados."));
  }, [user, loading, router]);

  const issue = async (courseId: number) => {
    try {
      await api.post(`/Certificates/issue/${courseId}`);
      toast.success("Certificado emitido.");
      await load();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Ainda não é possível emitir.");
    }
  };

  const download = async (code: string) => {
    const res = await api.get(`/Certificates/${code}/pdf`, { responseType: "blob" });
    const url = window.URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `certificado-${code}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading || !user) return <p>Carregando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#163E72] mb-2">Certificados</h1>
      <p className="text-gray-600 mb-6">
        Liberados após concluir o curso e obter média de 70% nas provas.
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.courseId} className="bg-white rounded-lg shadow-md p-4">
            <p className="font-semibold text-[#163E72]">{item.courseTitle}</p>
            <p className="text-sm text-gray-600 mb-3">{item.reason}</p>
            {item.issued && item.code ? (
              <button type="button" className="bg-[#338B97] text-white px-4 py-2 rounded" onClick={() => void download(item.code!)}>
                Baixar PDF
              </button>
            ) : (
              <button
                type="button"
                disabled={!item.eligible}
                className="bg-[#338B97] disabled:opacity-50 text-white px-4 py-2 rounded"
                onClick={() => void issue(item.courseId)}
              >
                Emitir certificado
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-600">Nenhum curso matriculado.</p>}
      </div>
    </div>
  );
}
