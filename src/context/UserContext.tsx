"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
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

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("skillswap_user_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("skillswap_user_change", callback);
  };
}

function getRoleSnapshot(): UserRole {
  if (typeof window === "undefined") return "client";
  const saved = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole;
  return saved === "creator" || saved === "client" ? saved : "client";
}

function getRoleServerSnapshot(): UserRole {
  return "client";
}

function getUserNameSnapshot(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY_NAME) || "";
}

function getUserNameServerSnapshot(): string {
  return "";
}

export function UserProvider({ children }: { children: ReactNode }) {
  const role = useSyncExternalStore(subscribe, getRoleSnapshot, getRoleServerSnapshot);
  const userName = useSyncExternalStore(subscribe, getUserNameSnapshot, getUserNameServerSnapshot);

  const setRole = (newRole: UserRole) => {
    localStorage.setItem(STORAGE_KEY_ROLE, newRole);
    window.dispatchEvent(new Event("skillswap_user_change"));
  };

  const setUserName = (name: string) => {
    localStorage.setItem(STORAGE_KEY_NAME, name);
    window.dispatchEvent(new Event("skillswap_user_change"));
  };

  return (
    <UserContext.Provider
      value={{ role, setRole, userName, setUserName, isReady: true }}
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
