import API from "../config/apiClient";
import type { User, Session } from "../types";

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ResetPasswordData {
  verificationCode: string;
  password: string;
}

export const register = async (data: RegisterData) =>
  API.post("/auth/register", data);
export const login = async (data: LoginData) => API.post("/auth/login", data);
export const logout = async () => API.get("/auth/logout");
export const verifyEmail = async (verificationCode: string) =>
  API.get(`/auth/email/verify/${verificationCode}`);
export const resendVerificationEmail = async () =>
  API.post("/auth/email/verify/resend");
export const sendPasswordResetEmail = async (email: string) =>
  API.post("/auth/password/forgot", { email });
export const resetPassword = async ({
  verificationCode,
  password,
}: ResetPasswordData) =>
  API.post("/auth/password/reset", { verificationCode, password });

export const getUser = async (): Promise<User> => API.get("/user");
export const getSessions = async (): Promise<{ sessions: Session[] }> =>
  API.get("/sessions");
export const deleteSession = async (id: string) =>
  API.delete(`/sessions/${id}`);
