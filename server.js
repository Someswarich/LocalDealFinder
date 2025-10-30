import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, "public"), // serve frontend files
});

server.use(middlewares);

// Mount JSON Server routes at /api
server.use("/api", router);

// Fallback to index.html (for SPA routing)
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
