import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isLoggedIn: false,
    role: null, // 'admin' or 'user'
    token: null,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (token && user && role) {
      setAuthData({
        isLoggedIn: true,
        token,
        role,
        user: JSON.parse(user),
      });
    }
  }, []);

  const login = (token, user, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", role);

    setAuthData({
      isLoggedIn: true,
      token,
      role,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setAuthData({
      isLoggedIn: false,
      token: null,
      role: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
