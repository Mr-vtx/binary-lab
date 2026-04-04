export const setAuthCookies = (res, accessToken, refreshToken, csrfToken) => {
  const secure = "Secure";
  const sameSite = "SameSite=None";

  res.setHeader("Set-Cookie", [
    `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=900; ${sameSite}; ${secure}`,
    `refreshToken=${refreshToken}; HttpOnly; Path=/api/auth/refresh; Max-Age=604800; ${sameSite}; ${secure}`,
    `csrfToken=${csrfToken}; Path=/; Max-Age=604800; ${sameSite}; ${secure}`,
  ]);
};
