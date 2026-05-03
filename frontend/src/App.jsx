import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { RiSunLine, RiMoonLine } from "react-icons/ri";
import Dashboard from "./pages/Dashboard";
import "./styles/theme.css";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.body.setAttribute("data-theme", next ? "dark" : "");
  }

  return (
    <>
      <Toaster position="top-center" />

      {/* Fixed theme toggle — top right */}
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        title="Toggle theme"
      >
        {isDark ? <RiSunLine /> : <RiMoonLine />}
      </button>

      {/* App header */}
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-logo">DataForge</span>
          <span className="app-tagline">Dynamic Data Visualization</span>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <Dashboard />
      </main>
    </>
  );
}