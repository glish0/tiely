
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
 {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
 }
)

export const ensureFreshSession = async () => {
 const {
  data: { session },
  error,
 } = await supabase.auth.getSession()

 if (error) {
  throw new Error(error.message)
 }

 if (!session) {
  throw new Error("Votre session a expiré. Veuillez vous reconnecter.")
 }

 const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
 const shouldRefresh = expiresAt && expiresAt - Date.now() < 60_000

 if (!shouldRefresh) {
  return session
 }

 const {
  data: { session: refreshedSession },
  error: refreshError,
 } = await supabase.auth.refreshSession()

 if (refreshError) {
  throw new Error(refreshError.message)
 }

 if (!refreshedSession) {
  throw new Error("Votre session a expiré. Veuillez vous reconnecter.")
 }

 return refreshedSession
}
