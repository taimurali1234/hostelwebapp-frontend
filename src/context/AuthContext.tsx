import { disconnectSocket, initializeSocket } from "@/services/socket";
import  {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/* ======================
   TYPES
====================== */

export interface User {
  userId: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "COORDINATOR";
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
}

/* ======================
   CONTEXT
====================== */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/* ======================
   PROVIDER
====================== */

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");

    }
    setUserState(user);
  };

 



  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ======================
   HOOK
====================== */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
