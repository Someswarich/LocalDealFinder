import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ✅ PORT setup (Render provides process.env.PORT)
const PORT = process.env.PORT || 10000;

// ✅ Fix for ESM paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Path to db.json
const dbPath = path.join(__dirname, "db.json");

// ✅ GET deals
app.get("/deals", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    res.json(data.deals || []);
  } catch (err) {
    console.error("Error reading db.json:", err);
    res.status(500).json({ error: "Failed to load deals" });
  }
});

// ✅ POST new deal
app.post("/deals", (req, res) => {
  try {
    const newDeal = req.body;
    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    data.deals = data.deals || [];
    data.deals.push(newDeal);
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    res.status(201).json(newDeal);
  } catch (err) {
    console.error("Error writing to db.json:", err);
    res.status(500).json({ error: "Failed to save deal" });
  }
});

// ✅ Serve db.json (optional for debugging)
app.get("/db", (req, res) => res.sendFile(dbPath));

// ✅ Catch-all route for client-side pages (deals.html, login.html, etc.)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
