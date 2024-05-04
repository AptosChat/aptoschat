import { FC, ReactNode, useEffect, useState } from "react";
import  { createContext, useContext } from "react";

const AUTO_CONNECT_LOCAL_STORAGE_KEY = "AptosWalletAutoConnect";

export interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

export const AutoConnectContext = createContext<AutoConnectContextState>(
  {} as AutoConnectContextState
);

// eslint-disable-next-line react-refresh/only-export-components
export function useAutoConnect(): AutoConnectContextState {
  return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoConnect, setAutoConnect] = useState<boolean>(() => {
    try {
      const isAutoConnect = localStorage.getItem(
        AUTO_CONNECT_LOCAL_STORAGE_KEY
      );
      if (isAutoConnect) return JSON.parse(isAutoConnect);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (typeof window !== "undefined") {
        console.error(e);
      }
    }
  });

  useEffect(() => {
    try {
      if (!autoConnect) {
        localStorage.removeItem(AUTO_CONNECT_LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(
          AUTO_CONNECT_LOCAL_STORAGE_KEY,
          JSON.stringify(autoConnect)
        );
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (typeof window !== "undefined") {
        console.error(error);
      }
    }
  }, [autoConnect]);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
};
