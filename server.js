const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT || 10000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Optional: serve db.json or APIs if needed
app.get("/api/deals", (req, res) => {
  res.sendFile(path.join(__dirname, "db.json"));
});

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});
