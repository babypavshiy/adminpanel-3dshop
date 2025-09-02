import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bnwzfmrqhmiygfofrnsj.supabase.co"; // возьми из Supabase Project Settings
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud3pmbXJxaG1peWdmb2ZybnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzUxNDgsImV4cCI6MjA3MTExMTE0OH0.iMjJ9DewesOaU9B-7SuxnTBZZ5TFuPVCkGIaJV5wIwY"; // тоже из Supabase -> API Keys

export const supabase = createClient(supabaseUrl, supabaseAnonKey);