export function normalizeDomain(domain: string) {
  return domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")   //  http/https
    .replace(/^www\./, "");        //  www
}