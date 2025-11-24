import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    target: "esnext", 
  },
  plugins: [tailwindcss()],
  // IMPORTANT: Set base to your repository name with slashes
  base: "/SAE301/", 
});
