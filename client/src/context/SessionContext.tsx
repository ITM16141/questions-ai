import { createContext, useState } from "react";

export const SessionContext = createContext<{
  loading: boolean;
  setLoading: (v: boolean) => void;
  progressMessage: string;
  setProgressMessage: (v: string) => void;
}>({
  loading: false,
  setLoading: () => {},
  progressMessage: "",
  setProgressMessage: () => {}
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");

  return (
    <SessionContext.Provider value={{ loading, setLoading, progressMessage, setProgressMessage }}>
      {children}
    </SessionContext.Provider>
  );
}