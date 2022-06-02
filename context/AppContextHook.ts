import React from "react";
import { providers } from "ethers";

interface AppContext {
  address: string;
  provider: providers.Web3Provider | null;
  balance: string;
  disconnect: any | null;
  connect: any | null;
  chainId: number;
}

export default React.createContext<AppContext | undefined>({
  address: "",
  provider: null,
  balance: "",
  disconnect: null,
  connect: null,
  chainId: 0,
});
