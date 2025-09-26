import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "data", "history.db"));

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
    pinned INTEGER
  )
`);

export default db;