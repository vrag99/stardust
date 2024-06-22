import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
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
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </Router>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </ThemeProvider>
  );
}

export default App;
