"use client";
import { Account } from "@/types/db.types";
import { Session } from "lucia";
import { createContext, useContext } from "react";

interface SessionProviderProps {
  account: Account | null;
  session: Session | null;
}

const SessionContext = createContext<SessionProviderProps>(
  {} as SessionProviderProps,
);

export const SessionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionProviderProps;
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const sessionContext = useContext(SessionContext);

  if (!sessionContext) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return sessionContext;
};
