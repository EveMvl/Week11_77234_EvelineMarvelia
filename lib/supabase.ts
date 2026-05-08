import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eluawnjfjciufxubmyoz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdWF3bmpmamNpdWZ4dWJteW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzczOTksImV4cCI6MjA5MzgxMzM5OX0.oSXqv7XVv3C6cMN1wThzyFOmIWGtUMx2N6OuWlXghoo';

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

