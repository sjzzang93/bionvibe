
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import sharp from 'sharp';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

interface App {
    id: string;
    name: string;
    slug: string;
    image: string;
}

interface AppsData {
    apps: App[];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase environment variables missing');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET_NAME = 'app-images';

async function uploadImages() {
    const appsJsonPath = path.join(process.cwd(), 'data', 'apps.json');
    const data: AppsData = JSON.parse(fs.readFileSync(appsJsonPath, 'utf-8'));
    let updatedCount = 0;
    let errors = 0;

    console.log(`Starting processing for ${data.apps.length} apps...`);

    for (const app of data.apps) {
        // Only process local images
        if (app.image && app.image.startsWith('/images/cards/')) {
            const localFilePath = path.join(process.cwd(), 'public', app.image);
            const fileName = path.basename(app.image);
            const storagePath = `${fileName}`; // Using simple filename, or could use `${app.id}-${fileName}`

            if (!fs.existsSync(localFilePath)) {
                console.warn(`⚠️ Local file not found for ${app.name}: ${localFilePath}`);
                continue;
            }

            console.log(`Uploading ${fileName} for ${app.name}...`);

            try {
                const fileBuffer = fs.readFileSync(localFilePath);

                // Optional: Optimize with sharp if needed, but these are already generated 3D images
                // Let's just upload directly for now to preserve quality/format

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(storagePath, fileBuffer, {
                        contentType: 'image/png', // Assuming they are all PNGs based on previous generation
                        upsert: true
                    });

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(storagePath);

                // Update JSON
                app.image = publicUrl;
                updatedCount++;
                console.log(`✅ Uploaded! New URL: ${publicUrl}`);

            } catch (err: any) {
                console.error(`❌ Failed to upload ${app.name}:`, err.message);
                errors++;
            }
        }
    }

    // Save updated apps.json
    if (updatedCount > 0) {
        fs.writeFileSync(appsJsonPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`\n🎉 Successfully updated ${updatedCount} images in apps.json!`);
    } else {
        console.log('\nNo local images found to upload or all uploads failed.');
    }

    if (errors > 0) {
        console.log(`⚠️ Encountered ${errors} errors during the process.`);
    }
}

uploadImages().catch(console.error);
