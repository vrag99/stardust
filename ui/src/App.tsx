import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import ProtocolDashboard from "@/pages/protocol-dashboard";
import LiquidityDashboard from "@/pages/liquidity-dashboard";
import ReputationDashboard from "@/pages/reputation-dashboard";
import Dao from "@/pages/dao-interface";

import ProtectedRoute from "@/components/dashboard/protected-route";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { sepolia } from "viem/chains";

const config = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DynamicContextProvider
        settings={{
          environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [
            EthereumWalletConnectors,
            StarknetWalletConnectors,
          ],
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/" element={<ProtectedRoute />}>
                    <Route
                      path="/protocol-dashboard"
                      element={<ProtocolDashboard />}
                    />
                    <Route
                      path="/liquidity-dashboard"
                      element={<LiquidityDashboard />}
                    />
                    <Route
                      path="/reputation-dashboard"
                      element={<ReputationDashboard />}
                    />
                    <Route path="/dao" element={<Dao />} />
                  </Route>
                </Routes>
              </Router>
            </DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </ThemeProvider>
  );
}

export default App;
