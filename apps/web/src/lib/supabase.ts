import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ffczwnrdcduklwebrnrf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3p3bnJkY2R1a2x3ZWJybnJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyNzU3MDYsImV4cCI6MjAzODg1MTcwNn0.PLACEHOLDER_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
