"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const router = useRouter();
  const pathname = usePathname();

  const user: User | null = session?.user ? {
    name: session.user.name || "User",
    email: session.user.email || "",
    role: "Administrator",
    initials: getInitials(session.user.name || "User"),
    image: session.user.image,
  } : null;

  // Route protection: redirect to /login if no session on dashboard pages
  useEffect(() => {
    if (isLoading) return;
    if (!user && pathname?.startsWith("/dashboard")) {
      router.replace("/login");
    }
  }, [user, pathname, isLoading, router]);

  const login = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
