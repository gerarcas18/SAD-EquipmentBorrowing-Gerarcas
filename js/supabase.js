// Configure with your Supabase Project URL and anon/public key.
// Never place a service_role key or database password in browser code.
const SUPABASE_URL = "https://wikwbyienrpwbfpoiaob.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_A-zUKBrAchg0vrVW087fBg_Nf9zPspQ";

// Initialize the Supabase client for the application.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
