import React from "react";
import ReactDOM from "react-dom/client";
// wallet adapter
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// wallets
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
// import { MSafeWalletAdapter } from "msafe-plugin-wallet-adapter";
// import { NightlyWallet } from "@nightlylabs/aptos-wallet-adapter-plugin";
import { OpenBlockWallet } from "@openblockhq/aptos-wallet-adapter";
import { TokenPocketWallet } from "@tp-lab/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { WelldoneWallet } from "@welldone-studio/aptos-wallet-adapter";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// RoomProvider 
import App from "./App";
// Room
import "./index.css";
import { RoomProvider } from "./context/RoomContext";
import { Room } from "./components/BoostifySDK/room";
import { Home } from "./components/BoostifySDK/Home";
// Home

const wallets = [
  new PetraWallet(),
  new PontemWallet(),
  new MartianWallet(),
  new FewchaWallet(),
  new RiseWallet(),
  // new MSafeWalletAdapter(),
  // new NightlyWallet(),
  new OpenBlockWallet(),
  new TokenPocketWallet(),
  new TrustWallet(),
  new WelldoneWallet(),
];

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <RoomProvider>
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.log("Custom error handling", error);
      }}
    >
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </AptosWalletAdapterProvider>
      </RoomProvider>
    </BrowserRouter>
  </React.StrictMode>
);
