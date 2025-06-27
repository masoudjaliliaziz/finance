import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ezpnhrgbpzalhvoxzhuv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cG5ocmdicHphbGh2b3h6aHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzM5NTAsImV4cCI6MjA2NjU0OTk1MH0.2wsfEtv7Znocnfww7AkgGrBQ9KyGP7exqcTBwmOnuho";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
