import { supabase } from './supabase';

export async function checkUserRole() {
    try {
        // 1. Get the current user session from SecureStore
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { user: null, role: null, error: "Not logged in" };
        }

        // 2. Fetch their role from the profiles table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return { user, role: 'FUR_PARENT', error: "Profile not found, defaulting to Fur Parent" };
        }

        return { user, role: profile.role, error: null };

    } catch (err) {
        return { user: null, role: null, error: "An unexpected error occurred" };
    }
}