const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ankaexchange.com';

const pageMeta = {
    'index.html': {
        title: 'Anka Exchange | Dijital Varlıkların Güvenli Limanı',
        description: 'Anka Exchange ile güvenli ve hızlı kripto para alın, satın. Anlık piyasa verileri, P2P işlemler ve SPK uyumlu güvenilir platform.',
    },
    'kripto-al.html': {
        title: 'Kripto Satın Al | Anka Exchange',
        description: 'Anka Exchange üzerinden güvenle kripto para satın alın. Bitcoin, Ethereum, USDT ve daha fazlası.',
    },
    'kripto-sat.html': {
        title: 'Kripto Sat | Anka Exchange',
        description: 'Kripto varlıklarınızı Anka Exchange üzerinden güvenle satın. Hızlı ve güvenilir P2P işlemler.',
    },
    'hakkimizda.html': {
        title: 'Hakkımızda | Anka Exchange',
        description: 'Anka Exchange hakkında bilgi edinin. Güvenli kripto para işlem platformumuzun misyonu ve vizyonu.',
    },
    'nasil-calisir.html': {
        title: 'Nasıl Çalışır? | Anka Exchange',
        description: 'Anka Exchange nasıl çalışır? Adım adım kripto para alım satım rehberi.',
    },
    'kyc-dogrulama.html': {
        title: 'KYC Doğrulama | Anka Exchange',
        description: 'Anka Exchange KYC doğrulama süreciniz hakkında bilgi alın. Güvenli işlemler için kimlik doğrulama.',
    },
    'kullanim-kosullari.html': {
        title: 'Kullanım Koşulları | Anka Exchange',
        description: 'Anka Exchange kullanım koşulları ve şartları.',
    },
    'dolandiricilik-onleme.html': {
        title: 'Dolandırıcılık Önleme | Anka Exchange',
        description: 'Anka Exchange dolandırıcılık önleme politikaları ve güvenlik önlemleri.',
    },
    'mesafeli-satis.html': {
        title: 'Mesafeli Satış Sözleşmesi | Anka Exchange',
        description: 'Anka Exchange mesafeli satış sözleşmesi bilgileri.',
    },
    'gizlilik.html': {
        title: 'Gizlilik Politikası | Anka Exchange',
        description: 'Anka Exchange gizlilik politikası ve veri koruma ilkeleri.',
    },
    'acik-riza.html': {
        title: 'Açık Rıza Metni | Anka Exchange',
        description: 'Anka Exchange açık rıza metni ve kişisel veri işleme bilgileri.',
    },
    'veri-isleme.html': {
        title: 'Veri İşleme ve İmha | Anka Exchange',
        description: 'Anka Exchange veri işleme ve imha politikası.',
    },
    'sorumluluk-reddi.html': {
        title: 'Sorumluluk Reddi | Anka Exchange',
        description: 'Anka Exchange sorumluluk reddi beyanı.',
    },
    'dogrulama-rehberi.html': {
        title: 'Doğrulama Rehberi | Anka Exchange',
        description: 'Anka Exchange doğrulama rehberi. Hesap doğrulama adımları.',
    },
};

const seoMetaBlock = (page) => {
    const meta = pageMeta[page] || {
        title: 'Anka Exchange | Dijital Varlıkların Güvenli Limanı',
        description: 'Anka Exchange ile güvenli ve hızlı kripto para alın, satın.',
    };
    const pageUrl = page === 'index.html' ? BASE_URL + '/' : BASE_URL + '/' + page;

    return `    <!-- SEO Meta Tags -->
    <meta name="description" content="${meta.description}" />
    <meta name="keywords" content="kripto para, bitcoin, ethereum, usdt, anka exchange, kripto al, kripto sat, p2p, kripto borsa, türkiye kripto" />
    <meta name="author" content="Anka Exchange" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${pageUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${BASE_URL}/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Anka Exchange" />
    <meta property="og:locale" content="tr_TR" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${pageUrl}" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${BASE_URL}/og-image.png" />

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="48x48" href="./favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png" />
    <link rel="manifest" href="./site.webmanifest" />
    <meta name="theme-color" content="#060e20" />
    <meta name="msapplication-TileColor" content="#060e20" />`;
};

const jsonLdScript = `    <!-- Organization Structured Data for Google -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Anka Exchange",
        "alternateName": "Anka Finansal Hizmetler ve Ticaret Limited Şirketi",
        "url": "${BASE_URL}",
        "logo": "${BASE_URL}/logo.png",
        "image": "${BASE_URL}/og-image.png",
        "description": "Dijital Varlıkların Güvenli Limanı - Güvenli ve hızlı kripto para işlem platformu",
        "email": "info@ankaexchange.com",
        "sameAs": [],
        "foundingDate": "2026",
        "areaServed": {
            "@type": "Country",
            "name": "Turkey"
        },
        "knowsAbout": ["Cryptocurrency", "Bitcoin", "Ethereum", "USDT", "P2P Trading"],
        "slogan": "Dijital Varlıkların Güvenli Limanı"
    }
    </script>`;

const htmlFiles = Object.keys(pageMeta);

let updatedCount = 0;

for (const file of htmlFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove old favicon link if exists
    content = content.replace(/\s*<link rel="icon" type="image\/png" href="\.\/logo\.png" \/>\s*/g, '\n');

    // Remove any existing SEO meta block (to avoid duplicates on re-run)
    content = content.replace(/\s*<!-- SEO Meta Tags -->[\s\S]*?<meta name="msapplication-TileColor"[^>]*>/g, '');
    content = content.replace(/\s*<!-- Organization Structured Data for Google -->[\s\S]*?<\/script>/g, '');

    // Find the </head> tag and insert SEO meta before it
    const seo = seoMetaBlock(file);
    content = content.replace('</head>', `\n${seo}\n${jsonLdScript}\n</head>`);

    fs.writeFileSync(filePath, content, 'utf-8');
    updatedCount++;
    console.log(`✅ Updated: ${file}`);
}

console.log(`\n🎉 Done! Updated ${updatedCount} files.`);
