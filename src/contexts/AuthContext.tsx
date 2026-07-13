import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  getAdminSession,
  signInAdmin,
  signOutAdmin,
  getUserSession,
  signInUser,
  registerUser,
  signOutUser,
} from "@/lib/auth";

interface AuthContextType {
  session: null;
  user: { id: string; email: string; name?: string } | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin session first
    const adminSession = getAdminSession();
    if (adminSession) {
      setUser({ id: "admin", email: adminSession.email, name: "Admin" });
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // Check regular user session
    const userSession = getUserSession();
    if (userSession) {
      setUser({ id: userSession.id, email: userSession.email, name: userSession.name });
      setIsAdmin(false);
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    // Try admin login first
    const adminResult = await signInAdmin(email, password);
    if (!adminResult.error) {
      setUser({ id: "admin", email, name: "Admin" });
      setIsAdmin(true);
      setLoading(false);
      return { error: null };
    }

    // Try regular user login
    const userResult = await signInUser(email, password);
    if (!userResult.error) {
      const session = getUserSession();
      if (session) {
        setUser({ id: session.id, email: session.email, name: session.name });
      } else {
        setUser({ id: "unknown", email });
      }
      setIsAdmin(false);
      setLoading(false);
      return { error: null };
    }

    setLoading(false);
    return userResult;
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    const result = await registerUser(name, email, password);
    if (!result.error) {
      const session = getUserSession();
      if (session) {
        setUser({ id: session.id, email: session.email, name: session.name });
      }
      setIsAdmin(false);
    }
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    signOutAdmin();
    signOutUser();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session: null, user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
