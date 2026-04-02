export const verifyCSRF = (req) => {
  const token = req.headers["x-csrf-token"];
  const cookie = req.cookies.csrfToken;
  return token && cookie && token === cookie;
};
