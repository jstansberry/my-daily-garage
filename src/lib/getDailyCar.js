import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bsvbxevkmqltxhicrjem.supabase.co';
// Use Service Role if available for secure server-side ops, else fallback to Anon
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdmJ4ZXZrbXFsdHhoaWNyamVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzk0OTUsImV4cCI6MjA4Mjk1NTQ5NX0.pHO_Difnub7KD5VmTIqNxTvLIf15xFLZm1rxsAk_Os4';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getDailyCar() {
    const today = new Date().toISOString().split('T')[0];

    // 1. Try to fetch from 'driving_blind' table
    try {
        const { data, error } = await supabase
            .from('driving_blind')
            .select(`
                year,
                make:makes(name),
                model:models(name)
            `)
            .eq('date', today)
            .single();

        if (data && !error) {
            return {
                make: data.make?.name || 'Unknown',
                model: data.model?.name || 'Unknown',
                year: data.year
            };
        } else {
            throw new Error('No daily car found for today.');
        }
    } catch (err) {
        console.error("Error fetching from driving_blind table:", err);
        throw err;
    }
}
