export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCpf(value: string) {
  return digitsOnly(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function isValidCpf(value: string) {
  const cpf = digitsOnly(value);

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const checkDigit = (length: number) => {
    let sum = 0;
    const weight = length + 1;

    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (weight - i);
    }

    const remainder = sum % 11;
    const digit = remainder < 2 ? 0 : 11 - remainder;

    return Number(cpf[length]) === digit;
  };

  return checkDigit(9) && checkDigit(10);
}
