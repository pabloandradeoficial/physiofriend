import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

console.log('[PF:supabase] URL:', supabaseUrl)
console.log('[PF:supabase] KEY (primeiros 20 chars):', supabaseAnonKey.slice(0, 20))

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
