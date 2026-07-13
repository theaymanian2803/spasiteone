import { turso } from "@/lib/db";

const ADMIN_SESSION_KEY = "lumiere_admin_session";
const USER_SESSION_KEY = "lumiere_user_session";

interface AdminSession {
  authenticated: boolean;
  email: string;
  name: string;
}

interface UserSession {
  authenticated: boolean;
  email: string;
  name: string;
  id: string;
}

// ── Admin session helpers ──

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

export async function signInAdmin(email: string, password: string): Promise<{ error: Error | null }> {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "spa@admin.com";

  if (email !== adminEmail) {
    return { error: new Error("Email ou mot de passe invalide") };
  }

  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || "112233";
  const dbPassword = await getAdminPasswordFromDB();
  const validPassword = dbPassword ?? envPassword;

  if (password === validPassword) {
    setAdminSession(email);
    return { error: null };
  }

  return { error: new Error("Email ou mot de passe invalide") };
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ error: Error | null }> {
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || "112233";
  const dbPassword = await getAdminPasswordFromDB();
  const currentValidPassword = dbPassword ?? envPassword;

  if (currentPassword !== currentValidPassword) {
    return { error: new Error("Le mot de passe actuel est incorrect.") };
  }

  if (!newPassword || newPassword.length < 4) {
    return { error: new Error("Le nouveau mot de passe doit contenir au moins 4 caractères.") };
  }

  try {
    const existing = await turso.execute(
      "SELECT id FROM site_content WHERE section_key = ?",
      ["admin_credentials"]
    );

    const credentials = JSON.stringify({ password: newPassword });

    if (existing.rows.length > 0) {
      await turso.execute(
        "UPDATE site_content SET content = ?, updated_at = ? WHERE section_key = ?",
        [credentials, new Date().toISOString(), "admin_credentials"]
      );
    } else {
      await turso.execute(
        "INSERT INTO site_content (section_key, content, updated_at) VALUES (?, ?, ?)",
        ["admin_credentials", credentials, new Date().toISOString()]
      );
    }

    return { error: null };
  } catch {
    return { error: new Error("Erreur lors de la mise à jour du mot de passe.") };
  }
}

export async function getAdminPasswordFromDB(): Promise<string | null> {
  try {
    const result = await turso.execute(
      "SELECT content FROM site_content WHERE section_key = ?",
      ["admin_credentials"]
    );
    if (result.rows.length === 0) return null;
    const data = JSON.parse((result.rows[0] as { content: string }).content);
    return data.password ?? null;
  } catch {
    return null;
  }
}

export function signOutAdmin() {
  clearAdminSession();
}

// ── User session helpers ──

export function getUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUserSession(id: string, email: string, name: string) {
  const session: UserSession = { authenticated: true, email, name, id };
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
}

export function clearUserSession() {
  localStorage.removeItem(USER_SESSION_KEY);
}

export function isUserAuthenticated(): boolean {
  const session = getUserSession();
  return !!session?.authenticated;
}

// ── User registration ──

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ error: Error | null }> {
  try {
    const existing = await turso.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.rows.length > 0) {
      return { error: new Error("Un compte avec cet email existe déjà.") };
    }

    const idResult = await turso.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    const userId = idResult.lastInsertRowid?.toString() || crypto.randomUUID();
    setUserSession(userId, email, name);
    return { error: null };
  } catch (err: any) {
    if (err?.message?.includes("UNIQUE")) {
      return { error: new Error("Un compte avec cet email existe déjà.") };
    }
    return { error: new Error("Erreur lors de l'inscription. Veuillez réessayer.") };
  }
}

// ── User sign-in ──

export async function signInUser(
  email: string,
  password: string
): Promise<{ error: Error | null }> {
  try {
    const result = await turso.execute(
      "SELECT id, name, email FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (result.rows.length === 0) {
      return { error: new Error("Email ou mot de passe invalide.") };
    }

    const user = result.rows[0] as { id: string; name: string; email: string };
    setUserSession(user.id, user.email, user.name);
    return { error: null };
  } catch {
    return { error: new Error("Erreur de connexion. Veuillez réessayer.") };
  }
}

// ── User sign-out ──

export function signOutUser() {
  clearUserSession();
}
