import { createClient } from '@supabase/supabase-js'

// 환경변수에 섞일 수 있는 비ASCII/공백/제어문자 제거 (헤더 생성 오류 방지)
function sanitizeEnv(value) {
  if (value == null) return ''
  return String(value)
    .trim()
    .replace(/[^\x21-\x7E]/g, '')
}

const supabaseUrl = sanitizeEnv(import.meta.env.VITE_SUPABASE_URL)
const supabaseAnonKey = sanitizeEnv(import.meta.env.VITE_SUPABASE_ANON_KEY)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] 환경 변수가 없습니다. .env 파일에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 설정한 뒤 dev 서버를 재시작하세요.'
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
