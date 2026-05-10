
function isProduction() {
  return process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview";
}

function cookieFlags() {
  if (isProduction()) {
    return "SameSite=None; Secure";
  }
  return "SameSite=Lax";
}

export const setAuthCookies = (res, accessToken, refreshToken, csrfToken) => {
  const flags = cookieFlags();

  res.setHeader("Set-Cookie", [
    `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=900; ${flags}`,
    `refreshToken=${refreshToken}; HttpOnly; Path=/api/auth/refresh; Max-Age=604800; ${flags}`,
    // csrfToken is intentionally readable by JS so the client can send it as a header
    `csrfToken=${csrfToken}; Path=/; Max-Age=604800; ${flags}`,
  ]);
};

export const clearAuthCookies = (res) => {
  const flags = cookieFlags();

  res.setHeader("Set-Cookie", [
    `accessToken=; HttpOnly; Path=/; Max-Age=0; ${flags}`,
    `refreshToken=; HttpOnly; Path=/api/auth/refresh; Max-Age=0; ${flags}`,
    `csrfToken=; Path=/; Max-Age=0; ${flags}`,
  ]);
};
