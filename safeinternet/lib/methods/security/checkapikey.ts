export function checkApiKey(req: Request) {
  return req.headers.get("x-api-key") === process.env.API_KEY;
}