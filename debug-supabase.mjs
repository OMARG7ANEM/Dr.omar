import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fgvkrxyxghpdozghvqds.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DGs9uJ4sKyhvmicrFVEN9Q_laixF6W7";

console.log('Initializing Supabase client...');
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    }
});

console.log('Testing connection...');

async function testConnection() {
    try {
        const start = Date.now();
        console.log("Attempting sign in with dummy credentials...");
        const { data, error } = await supabase.auth.signInWithPassword({
            email: "test@test.com",
            password: "testpassword"
        });

        console.log(`Response received in ${Date.now() - start}ms`);
        if (error) {
            console.log("Supabase Error:", error.message);
            console.log("Error object:", error);
        } else {
            console.log("Success:", data);
        }
    } catch (err) {
        console.error("EXCEPTION CAUGHT:", err);
    }
}

testConnection();
