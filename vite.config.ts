import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
  port: 5173,
  strictPort: true,
  },
  plugins: [
    mdx(),
    react({
      include: [
        /\.[tj]sx?$/,
        /\.mdx$/,
      ],
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  ssr: {
    external: ['fsevents'],
  },
}));
