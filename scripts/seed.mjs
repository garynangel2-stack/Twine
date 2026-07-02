// Resets the Twine demo data. The app auto-seeds on first run, so this simply
// clears the saved store; the next request rebuilds the sample data.
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "twine.json");
if (fs.existsSync(DB_PATH)) {
  fs.rmSync(DB_PATH);
  console.log("✓ Cleared existing data — Twine will reseed on next start.");
} else {
  console.log("No existing data found. Twine will seed on first start.");
}
console.log("  App login:   owner@twine.app / twine123");
console.log("  Admin login: admin@twine.app / admin123");
