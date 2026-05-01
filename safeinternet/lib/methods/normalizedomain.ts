export function normalizeDomain(domain: string) {
  return domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")   // quita http/https
    .replace(/^www\./, "");        // quita www
}