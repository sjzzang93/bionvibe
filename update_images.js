const fs = require('fs');
const path = require('path');

const appsDataPath = path.join(__dirname, 'data/apps.json');
const appsData = require(appsDataPath);

const newImages = {
    'mbti-zodiac-compat': 'https://images.unsplash.com/photo-1634902640226-5b4d68d0033a?w=800&auto=format&fit=crop', // Zodiac
    'sociopath-test': 'https://images.unsplash.com/photo-1596200216669-e70a3c75152a?w=800&auto=format&fit=crop', // Dark/Psychology
    'age-gap-calculator': 'https://images.unsplash.com/photo-1516575972614-162794bbfc2e?w=800&auto=format&fit=crop', // Couple
    'analysis-handwriting': 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop', // Handwriting
    'name-rarity': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop', // Face
    'emotion-diary': 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800&auto=format&fit=crop', // Notebook/Diary
    'emotion-color-diary': 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&auto=format&fit=crop', // Colors
    'study-cursor-prompts': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop', // Coding
    // Extra updates to ensure variety if needed (using IDs from search)
    'cursor-prompt-study': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop' // Mapping alternate key just in case
};

// Using the IDs found (I used placeholders above, let me swap for real IDs found)
// Zodiac: 7Y8LBqEY9JU -> https://images.unsplash.com/photo-1634902640226-5b4d68d0033a (Actually need to resolve ID to URL if possible or use ID directly)
// Unsplash IDs are not directly the URL path. 
// Wait, the URLs I extracted from Unsplash site are `https://unsplash.com/photos/ID`. 
// The `images.unsplash.com` format uses a DIFFERENT ID usually? 
// No, often `photo-ID` works? 
// Actually, `https://unsplash.com/photos/bAOfUNjdgtM` -> The image src usually has `bAOfUNjdgtM` in it?
// Let's check existing apps.json
// Existing: `https://images.unsplash.com/photo-1518531933037-91b2f5f229cc`
// The ID `1518531933037-91b2f5f229cc` looks like timestamp + random.
// The IDs I scraped are short codes like `bAOfUNjdgtM`.
// `images.unsplash.com` supports `/photo-ID` where ID is the long version?
// Or does it support short codes?
// Users often use `https://images.unsplash.com/photo-1634902640226-5b4d68d0033a` (Long ID).
// The short IDs from `unsplash.com/photos/XYZ` might NOT work directly with `images.unsplash.com/photo-XYZ`?
// Let's test one short ID.

// I will try to use the `source.unsplash.com/ID` format which DOES support short IDs?
// No, `source.unsplash.com` is deprecated.
// Functioning Unsplash image URLs usually look like `https://images.unsplash.com/photo-15...?`
// The `search` results gave me links to the *page* `unsplash.com/photos/ID`.
// On that page, the *actual* image source will have the long ID.
// My scraping didn't get the *long* ID, it got the short page ID.
// This is a risk.
// However, `images.unsplash.com` often redirects `photo-SHORTID`?
// Let's check.
// I can't check without a browser.
// But I can try to use `generate_image`? No.

// Alternative: I will use the `search_web` result descriptions which sometimes had long URLs? No.
// I will just use the short ID and hope `https://images.unsplash.com/photo-[SHORT_ID]` works? 
// It often doesn't.
// BUT, I can use `https://unsplash.com/photos/[SHORT_ID]/download` which redirects to the full image.
// Can I use that as the src? 
// Next.js `Image` component needs a configured domain. `images.unsplash.com` is configured. `unsplash.com` might not be.
// I should use `images.unsplash.com`.

// I will use a different strategy.
// The `search_web` for "unsplash photo [keyword]" often returns `images.unsplash.com` links in the snippet?
// In my previous steps, I didn't see many.
// Wait, I can try to hit `https://api.unsplash.com`? No key.

// Let's assume the user wants *duplicates removed*.
// If I can't guarantee valid new URLs, I should use *existing* distinct URLs from `apps.json`?
// Reuse implies duplicates.
// I really need valid Unsplash URLs.
// I will try to use `search_web` to find "list of Unsplash image URLs" or a specific blog post.
// "50 free unsplash images for developers", etc.
// Or I can use a library of reliable images I know? I don't have one.

// Let's try one more search: "Unsplash image URL for zodiac"
// Or "public unsplash image urls list".
// Or... I can just use placeholder images from a reliable service like `picsum.photos`?
// The user said "use relevant photos". Picsum is random.
// But `picsum.photos/seed/[seed]/800/600` is deterministic.
// Is it relevant? No.

// I must find real images.
// I will try to visit the *download* URL of one of the scraped IDs `https://unsplash.com/photos/bAOfUNjdgtM/download` using `curl -I` (head request) to see the redirect URL?
// The redirect URL should be on `images.unsplash.com`?
// Yes! `unsplash.com/photos/ID/download` redirects to the CDN link.
// I can use `curl` to resolve the redirects.
// I have `curl` in `run_command`.

// Strategy Refined:
// 1. Resolve redirect for `https://unsplash.com/photos/[SHORT_ID]/download` to get the `images.unsplash.com` URL.
// 2. Use that URL in `apps.json`.
// 3. IDs to resolve:
// Zodiac: `bAOfUNjdgtM`
// Psychology: `DoqtEEn8SOo`
// Couple: `w5hhoYM_JsU`
// Handwriting: `lmMqyUmbNvI`
// Face: `3402kvtHhOo`
// Coding: `dYEuFB8KQJk`
// Finance: `IT6aov1ScW0`
// Diary: `z1d-LP8sjuI` (Psychology/Notebook)

// I will verify this with one curl first.
const { execSync } = require('child_process');

function resolveUrl(shortId) {
    try {
        // Use curl to follow redirect and print effective URL
        // -L follows, -s silent, -o /dev/null ignores body, -w %{url_effective} prints URL
        const cmd = `curl -Ls -o /dev/null -w %{url_effective} "https://unsplash.com/photos/${shortId}/download"`;
        return execSync(cmd).toString().trim();
    } catch (e) {
        console.error(`Failed to resolve ${shortId}: ${e.message}`);
        return null;
    }
}

const map = {
    'mbti-zodiac-compat': 'bAOfUNjdgtM',
    'sociopath-test': 'DoqtEEn8SOo',
    'age-gap-calculator': 'w5hhoYM_JsU',
    'analysis-handwriting': 'lmMqyUmbNvI',
    'name-rarity': '3402kvtHhOo',
    'emotion-diary': 'z1d-LP8sjuI',
    'emotion-color-diary': 'uGP_6CAD-14', // Another notebook/color
    'study-cursor-prompts': 'dYEuFB8KQJk',
    'psychopath-test': 'zi5vRoAP3WY'
};

let changed = 0;

Object.keys(map).forEach(slug => {
    const shortId = map[slug];
    console.log(`Resolving ${slug} -> ${shortId}...`);
    const longUrl = resolveUrl(shortId);
    if (longUrl && longUrl.includes('images.unsplash.com')) {
        // Clean params to be consistent
        // usually has ?ixid=...
        // We can keep them or minimize. Best to keep them to ensure access.
        const appIndex = appsData.apps.findIndex(a => a.slug === slug);
        if (appIndex !== -1) {
            appsData.apps[appIndex].image = longUrl + '&w=800&auto=format&fit=crop';
            changed++;
            console.log(`Updated ${slug}`);
        }
    } else {
        console.error(`Invalid resolved URL for ${slug}: ${longUrl}`);
    }
});

if (changed > 0) {
    fs.writeFileSync(appsDataPath, JSON.stringify(appsData, null, 2));
    console.log(`Successfully updated ${changed} apps.`);
} else {
    console.log('No apps updated.');
}
