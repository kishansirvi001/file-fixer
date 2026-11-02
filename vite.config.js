import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const backendDirectory = fileURLToPath(new URL("./backend", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "filefixer-pdf-tools-api",
      configureServer(server) {
        const python = process.env.PYTHON || "python";
        let stopping = false;
        server.config.logger.info("Starting the FileFixer PDF tools API on http://127.0.0.1:8000");
        const api = spawn(
          python,
          ["-m", "uvicorn", "backend:app", "--host", "127.0.0.1", "--port", "8000"],
          { cwd: backendDirectory, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
        );
        api.once("spawn", () => {
          server.config.logger.info(`PDF tools API process started (PID ${api.pid})`);
        });
        api.stdout.on("data", (chunk) => server.config.logger.info(chunk.toString().trimEnd()));
        api.stderr.on("data", (chunk) => server.config.logger.info(chunk.toString().trimEnd()));
        api.on("error", (error) => {
          server.config.logger.error(`Could not start the FileFixer PDF API: ${error.message}`);
        });
        api.on("exit", (code) => {
          if (!stopping) {
            server.config.logger.error(`The FileFixer PDF API stopped with code ${code}. Check that backend/requirements.txt is installed and that port 8000 is available.`);
          }
        });
        server.httpServer?.once("close", () => {
          stopping = true;
          if (!api.killed) api.kill();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
