const EMAIL_FORMAT = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmailFormat(value: string) {
  const email = value.trim();
  if (!EMAIL_FORMAT.test(email) || email.includes("..")) {
    return false;
  }

  const domain = email.split("@")[1] ?? "";
  const tld = domain.split(".").pop() ?? "";
  return tld.length >= 2;
}
