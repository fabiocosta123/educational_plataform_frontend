const ENROLLMENT_STATUS_PT: Record<string, string> = {
  active: "Ativo",
  ativo: "Ativo",
  pending: "Pendente",
  pendente: "Pendente",
  completed: "Concluído",
  concluido: "Concluído",
  concluído: "Concluído",
  cancelled: "Cancelado",
  canceled: "Cancelado",
  cancelado: "Cancelado",
  inactive: "Inativo",
  inativo: "Inativo",
};

export function enrollmentStatusLabel(status?: string) {
  const value = (status ?? "").trim();
  if (!value) return "Não informado";
  return ENROLLMENT_STATUS_PT[value.toLowerCase()] ?? value;
}
