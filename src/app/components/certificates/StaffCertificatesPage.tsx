"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { editActionClass } from "@/app/components/AppLinks";

interface CertificateRow {
  id: number;
  code: string;
  issuedAt: string;
  examAverage: number;
  student: string;
  courseTitle: string;
}

export default function StaffCertificatesPage() {
  const [rows, setRows] = useState<CertificateRow[]>([]);

  useEffect(() => {
    api
      .get<CertificateRow[]>("/Certificates")
      .then((res) => setRows(res.data))
      .catch(() => toast.error("Não foi possível carregar os certificados."));
  }, []);

  const download = async (code: string) => {
    try {
      const res = await api.get(`/Certificates/${code}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificado-${code}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Falha ao baixar o PDF.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#163E72] mb-2">Certificados</h1>
      <p className="text-gray-600 mb-6">
        Liberados quando o aluno conclui o curso e obtém média de 70% nas provas.
      </p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between gap-4">
            <div>
              <p className="font-semibold text-[#163E72]">{row.student}</p>
              <p className="text-sm text-gray-600">
                {row.courseTitle} • média {row.examAverage}% • {row.code}
              </p>
            </div>
            <button
              type="button"
              className={editActionClass}
              onClick={() => void download(row.code)}
            >
              Baixar PDF
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="text-gray-600">Nenhum certificado emitido ainda.</p>}
      </div>
    </div>
  );
}
