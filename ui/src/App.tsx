import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
