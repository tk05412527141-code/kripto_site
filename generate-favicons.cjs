const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const logoPath = path.join(__dirname, 'logo.png');

async function generateFavicons() {
    // favicon-16x16
    await sharp(logoPath)
        .resize(16, 16)
        .png()
        .toFile(path.join(__dirname, 'favicon-16x16.png'));

    // favicon-32x32
    await sharp(logoPath)
        .resize(32, 32)
        .png()
        .toFile(path.join(__dirname, 'favicon-32x32.png'));

    // favicon-48x48 (Crucial for Google Search Results)
    await sharp(logoPath)
        .resize(48, 48)
        .png()
        .toFile(path.join(__dirname, 'favicon-48x48.png'));

    // favicon-96x96
    await sharp(logoPath)
        .resize(96, 96)
        .png()
        .toFile(path.join(__dirname, 'favicon-96x96.png'));

    // favicon-144x144
    await sharp(logoPath)
        .resize(144, 144)
        .png()
        .toFile(path.join(__dirname, 'favicon-144x144.png'));

    // apple-touch-icon (180x180)
    await sharp(logoPath)
        .resize(180, 180)
        .png()
        .toFile(path.join(__dirname, 'apple-touch-icon.png'));

    // android-chrome-192x192
    await sharp(logoPath)
        .resize(192, 192)
        .png()
        .toFile(path.join(__dirname, 'android-chrome-192x192.png'));

    // android-chrome-512x512
    await sharp(logoPath)
        .resize(512, 512)
        .png()
        .toFile(path.join(__dirname, 'android-chrome-512x512.png'));

    // og-image (1200x630) - social media sharing image with padding
    const ogImage = sharp({
        create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 6, g: 14, b: 32, alpha: 255 }
        }
    });

    const logoResized = await sharp(logoPath)
        .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

    await ogImage
        .composite([{
            input: logoResized,
            top: 115,
            left: 400
        }])
        .png()
        .toFile(path.join(__dirname, 'og-image.png'));

    // Also copy to public folder
    const publicDir = path.join(__dirname, 'public');
    const files = [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon-48x48.png',
        'favicon-96x96.png',
        'favicon-144x144.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'og-image.png',
        'logo.png'
    ];

    for (const file of files) {
        const src = path.join(__dirname, file);
        const dest = path.join(publicDir, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
        }
    }

    console.log('✅ All favicons and OG image generated successfully!');
}

generateFavicons().catch(console.error);
