export const setAuthCookies = (res, accessToken, refreshToken, csrfToken) => {
  const isProd = process.env.NODE_ENV === "production";

  res.setHeader("Set-Cookie", [
    `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=900; SameSite=Strict${isProd ? "; Secure" : ""}`,
    `refreshToken=${refreshToken}; HttpOnly; Path=/api/auth/refresh; Max-Age=604800; SameSite=Strict${isProd ? "; Secure" : ""}`,
    `csrfToken=${csrfToken}; Path=/; SameSite=Strict${isProd ? "; Secure" : ""}`,
  ]);
};
