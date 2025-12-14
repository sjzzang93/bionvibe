
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase environment variables missing');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET_NAME = 'app-images';
const FILE_NAME = 'hero-christmas-3d.png';
const LOCAL_PATH = path.join(process.cwd(), 'public', FILE_NAME);

async function uploadChristmasHeroImage() {
    if (!fs.existsSync(LOCAL_PATH)) {
        console.error(`❌ File not found: ${LOCAL_PATH}`);
        return;
    }

    console.log(`Uploading ${FILE_NAME}...`);
    const fileBuffer = fs.readFileSync(LOCAL_PATH);

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(FILE_NAME, fileBuffer, {
            contentType: 'image/png',
            upsert: true
        });

    if (error) {
        console.error('❌ Upload failed:', error.message);
        return;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(FILE_NAME);

    console.log(`✅ Uploaded Christmas Hero Image! URL: ${publicUrl}`);
}

uploadChristmasHeroImage().catch(console.error);
