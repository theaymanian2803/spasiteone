import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAdminSession, signInAdmin, signOutAdmin, isAdminAuthenticated } from "@/lib/auth";

interface AuthContextType {
  session: null;
  user: { id: string; email: string } | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (_email: string, _password: string, _name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      setUser({ id: "admin", email: session.email });
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = signInAdmin(email, password);
    if (error) {
      setLoading(false);
      return { error };
    }
    setUser({ id: "admin", email });
    setIsAdmin(true);
    setLoading(false);
    return { error: null };
  };

  const signUp = async (_email: string, _password: string, _name: string) => {
    return { error: new Error("Sign up is not available. Contact admin to create accounts.") };
  };

  const signOut = async () => {
    signOutAdmin();
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
