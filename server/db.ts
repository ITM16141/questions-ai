import { createClient } from "@supabase/supabase-js";

const db = createClient(
    process.env.SUBABASE_URL!,
    process.env.SUBABASE_KEY!,
);

export default db;