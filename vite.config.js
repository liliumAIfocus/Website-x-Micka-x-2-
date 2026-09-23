import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Port 5176 : permet de lancer ce site en même temps que mg-works (5173)
// et le template design 2 (5174).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
  },
});
