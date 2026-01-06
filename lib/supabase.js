import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rnivpbqqihdwtunlihnp.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXZwYnFxaWhkd3R1bmxpaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjEzMDksImV4cCI6MjA3NzkzNzMwOX0.5csZgmeQRRPcfrHPUQhmF26K7xy489oi8mCVtbp-v4w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
