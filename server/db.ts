import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const db = new Database(path.join(dataDir, "history.db"));

db.exec(`
    CREATE TABLE IF NOT EXISTS history (
       id TEXT PRIMARY KEY,
       userId TEXT,
       difficulty TEXT,
       includeMathThree INTEGER,
       problem TEXT,
       solution TEXT,
       timestamp INTEGER,
       tags TEXT,
       pinned INTEGER,
       public INTEGER,
       views INTEGER
    )
`);

try {
    db.prepare("SELECT views FROM history LIMIT 1").get();
} catch {
    db.exec("ALTER TABLE history ADD COLUMN views INTEGER DEFAULT 0");
}


export default db;