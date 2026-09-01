export function validateBirthDate(date: string) {
  const birth = new Date(date);
  const today = new Date();

  const min = new Date();
  min.setFullYear(today.getFullYear() - 100);

  const max = new Date();
  max.setFullYear(today.getFullYear() - 12);

  if (birth < min)
    return "O aluno deve ter no máximo 100 anos.";

  if (birth > max)
    return "O aluno deve ter pelo menos 12 anos.";

  return null;
}