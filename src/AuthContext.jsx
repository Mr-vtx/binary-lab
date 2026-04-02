import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/user/me");
      setProfile(data);
      setUser(data.user);
    } catch {
      setUser(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    loadProfile().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handle = () => {
      setUser(null);
      setProfile(null);
    };
    window.addEventListener("auth:logout", handle);
    return () => window.removeEventListener("auth:logout", handle);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    await loadProfile();
    return data;
  };

  const register = async (email, username, password, confirmPassword) => {
    const { data } = await api.post("/auth/register", {
      email,
      username,
      password,
      confirmPassword,
    });
    await loadProfile();
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout"); 
    } catch {
     
    }
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = useCallback(() => loadProfile(), [loadProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
