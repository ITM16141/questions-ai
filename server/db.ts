import { createClient } from "@supabase/supabase-js";

const db = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
);

localStorage.clear();

export default db;