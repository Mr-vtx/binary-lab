export function cors(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:5173",
    "https://binary-lab.vercel.app/",
  ); 
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}
