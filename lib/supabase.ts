import { createClient as createSbClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set');
}

export function createClient() {
    return createSbClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

export function createAdminSb() {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY must be set for server-side operations');
    }
    return createSbClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
    });
}

export async function getLearnerId(): Promise<string> {
    const { id } = await getLearner();
    return id;
}

export async function getLearner(): Promise<{ id: string; grade: number }> {
    const sb = createAdminSb();
    const { data, error } = await sb.from('learners').select('id, grade').limit(1).maybeSingle();
    if (error) throw new Error(`db_error: ${error.message}`);
    if (!data) throw new Error('learner_not_found');
    return { id: data.id, grade: data.grade };
}
