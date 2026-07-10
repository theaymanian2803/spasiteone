const ADMIN_SESSION_KEY = "lumiere_admin_session";

interface AdminSession {
  authenticated: boolean;
  email: string;
  name: string;
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(email: string) {
  const session: AdminSession = { authenticated: true, email, name: "Admin" };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return !!session?.authenticated;
}

export function signInAdmin(email: string, password: string): { error: Error | null } {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@lumiere.com";
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  if (email === adminEmail && password === adminPassword) {
    setAdminSession(email);
    return { error: null };
  }

  return { error: new Error("Invalid email or password") };
}

export function signOutAdmin() {
  clearAdminSession();
}
