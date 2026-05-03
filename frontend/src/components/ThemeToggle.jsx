import { RiSunLine, RiMoonLine } from "react-icons/ri";

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title="Toggle theme"
      style={{
        background: "var(--surface-glass)",
        border: "1px solid var(--border)",
        borderRadius: "50%",
        width: 38,
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--gold)",
        fontSize: 18,
        backdropFilter: "blur(10px)",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {isDark ? <RiSunLine /> : <RiMoonLine />}
    </button>
  );
}