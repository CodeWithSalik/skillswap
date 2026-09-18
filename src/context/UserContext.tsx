"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserRole } from "@/lib/types";

interface UserContextType {
  /** Current role: "creator" or "client" */
  role: UserRole;
  /** Switch between creator and client */
  setRole: (role: UserRole) => void;
  /** Display name for the current user */
  userName: string;
  /** Set the display name */
  setUserName: (name: string) => void;
  /** Whether the context has loaded from localStorage */
  isReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY_ROLE = "skillswap_role";
const STORAGE_KEY_NAME = "skillswap_username";

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("client");
  const [userName, setUserNameState] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole;
    const savedName = localStorage.getItem(STORAGE_KEY_NAME);

    if (savedRole === "creator" || savedRole === "client") {
      setRoleState(savedRole);
    }
    if (savedName) {
      setUserNameState(savedName);
    }
    setIsReady(true);
  }, []);

  // Persist role to localStorage
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEY_ROLE, newRole);
  };

  // Persist name to localStorage
  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem(STORAGE_KEY_NAME, name);
  };

  return (
    <UserContext.Provider
      value={{ role, setRole, userName, setUserName, isReady }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
