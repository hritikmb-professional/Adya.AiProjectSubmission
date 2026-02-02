import api from "./axios";

export const signup = (
  name: string,
  email: string,
  password: string
) => api.post("/auth/signup", { name, email, password });

export const login = (
  email: string,
  password: string
) => api.post("/auth/login", { email, password });
