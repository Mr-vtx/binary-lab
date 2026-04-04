export const validateEmail = (email) => {
  if (typeof email !== "string") return false;

  const cleaned = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return emailRegex.test(cleaned) && cleaned.length <= 254;
};

export const validateUsername = (username) => {
  if (typeof username !== "string") return false;

  const cleaned = username.trim();

  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  return (
    cleaned.length >= 2 && cleaned.length <= 20 && usernameRegex.test(cleaned)
  );
};

export const validatePassword = (password) => {
  if (typeof password !== "string") return false;

  return password.length >= 6 && password.length <= 100;
};

export const sanitize = (str) => {
  if (typeof str !== "string") return "";

  return str.trim();
};

export const normalizeEmail = (email) => {
  return sanitize(email).toLowerCase();
};

export const pick = (obj, allowedFields = []) => {
  const result = {};
  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
};
