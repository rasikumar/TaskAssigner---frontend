import path from "path";
import { fileURLToPath } from "url"; // Import for converting `import.meta.url`
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Define `__dirname` equivalent for ESM
const __filename = fileURLToPath(import.meta.url); // Get the current file's path
const __dirname = path.dirname(__filename);       // Get the directory path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Use the `__dirname` equivalent
    },
  },
});
