import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

function startServer(command, name) {
  const [cmd, ...args] = command.split(" ");
  const process = spawn(cmd, args, {
    stdio: "pipe",
    shell: true,
  });

  process.stdout.on("data", (data) => {
    console.log(`[${name}] ${data}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`[${name}] ${data}`);
  });

  process.on("close", (code) => {
    console.log(`[${name}] process exited with code ${code}`);
  });

  return process;
}

// Start both servers
console.log("Starting development servers...");
const vite = startServer("npm run dev", "vite");
const server = startServer("npm run server", "server");

// Handle process termination
process.on("SIGINT", () => {
  vite.kill();
  server.kill();
  process.exit();
});
