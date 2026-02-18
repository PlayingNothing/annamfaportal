/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-line": {
          "0%": { top: "0%" },
          "50%": { top: "calc(100% - 2px)" },
          "100%": { top: "0%" },
        },
        "reticle-spin": {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        "reticle-drift": {
          "0%": { transform: "translate(-50%, -50%) translateX(-18px)" },
          "50%": { transform: "translate(-50%, -50%) translateX(18px)" },
          "100%": { transform: "translate(-50%, -50%) translateX(-18px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        "scan-line": "scan-line 4s ease-in-out infinite",
        "reticle-spin": "reticle-spin 18s linear infinite",
        "reticle-drift": "reticle-drift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
