
export function parseCookies(req) {
  const raw = req.headers.cookie || "";
  req.cookies = Object.fromEntries(
    raw
      .split(";")
      .map((s) => s.trim().split("="))
      .filter(([k]) => k)
      .map(([k, ...v]) => [k.trim(), decodeURIComponent(v.join("=").trim())]),
  );
}
