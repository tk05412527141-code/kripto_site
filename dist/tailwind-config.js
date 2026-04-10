const darkColors = {
    "tertiary-dim": "#17a8ec",
    "secondary-fixed-dim": "#58e7ab",
    "on-surface": "#dee5ff",
    "surface-container": "#0f1930",
    "on-surface-variant": "#a3aac4",
    "on-error-container": "#ffb2b9",
    "error-container": "#a70138",
    "tertiary": "#61c2ff",
    "on-secondary-container": "#e1ffec",
    "surface": "#060e20",
    "surface-container-highest": "#192540",
    "surface-tint": "#bd9dff",
    "error": "#ff6e84",
    "primary-fixed": "#b28cff",
    "surface-container-low": "#091328",
    "on-secondary-fixed-variant": "#006544",
    "inverse-primary": "#742fe5",
    "on-tertiary-fixed": "#001a29",
    "outline-variant": "#40485d",
    "surface-container-lowest": "#000000",
    "inverse-on-surface": "#4d556b",
    "on-secondary": "#005a3c",
    "primary-container": "#b28cff",
    "secondary-fixed": "#69f6b8",
    "on-tertiary-container": "#003047",
    "surface-bright": "#1f2b49",
    "surface-variant": "#192540",
    "primary-dim": "#8a4cfc",
    "secondary-container": "#006c49",
    "tertiary-fixed-dim": "#25adf1",
    "primary-fixed-dim": "#a67aff",
    "on-primary-fixed-variant": "#390083",
    "on-primary": "#3c0089",
    "surface-container-high": "#141f38",
    "background": "#060e20",
    "secondary-dim": "#58e7ab",
    "outline": "#6d758c",
    "on-secondary-fixed": "#00452d",
    "on-background": "#dee5ff",
    "on-tertiary-fixed-variant": "#003d5a",
    "primary": "#bd9dff",
    "on-error": "#490013",
    "surface-dim": "#060e20",
    "error-dim": "#d73357",
    "on-primary-fixed": "#000000",
    "inverse-surface": "#faf8ff",
    "tertiary-fixed": "#40bbff",
    "on-tertiary": "#003b56",
    "tertiary-container": "#34b5fa",
    "secondary": "#69f6b8",
    "on-primary-container": "#2e006c"
};

const lightColors = {
    // Apple esthik tarzı çok açık (off-white) gri tonları ve uyumlu açık tema
    "surface": "#ffffff",
    "background": "#f3f4f6", 
    "surface-container-low": "#f9fafb",
    "surface-container": "#f3f4f6",
    "surface-container-high": "#e5e7eb",
    "surface-container-highest": "#d1d5db",
    "surface-container-lowest": "#ffffff",
    "surface-bright": "#ffffff",
    "surface-dim": "#e5e7eb",
    "surface-variant": "#e5e7eb",
    
    "on-surface": "#0f172a", // Çok koyu gri/Siyahımsı text
    "on-background": "#0f172a",
    "on-surface-variant": "#475569", // Yumuşatılmış metin
    
    "outline": "#94a3b8",
    "outline-variant": "#cbd5e1",

    "primary": "#7a28cb", // Güçlü kraliyet moru (Light temada contrast için)
    "primary-dim": "#5c1b9b",
    "primary-container": "#e9d5ff",
    "on-primary-container": "#3b0764",

    "secondary": "#059669", // Koyulaştırılmış zümrüt yeşili (okunabilirlik için)
    "secondary-dim": "#047857",
    
    "error": "#dc2626",
    "error-dim": "#991b1b",
};

// Açık temada tanımlanmamış renkleri default olarak karanlıktan devral
const finalLightColors = { ...darkColors, ...lightColors };

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if(hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const bigint = parseInt(hex, 16);
    return `${(bigint >> 16) & 255} ${(bigint >> 8) & 255} ${bigint & 255}`;
}

let rootVars = ':root {\n';
for (const [key, val] of Object.entries(finalLightColors)) {
    rootVars += `  --color-${key}: ${hexToRgb(val)};\n`;
}
rootVars += '}\n\nhtml.dark {\n';
for (const [key, val] of Object.entries(darkColors)) {
    rootVars += `  --color-${key}: ${hexToRgb(val)};\n`;
}
rootVars += '}\n';

// Tailiwind DOM renderlanmadan önce root variablelarını stille basıyoruz
const styleEl = document.createElement('style');
styleEl.innerHTML = rootVars;
document.head.appendChild(styleEl);

const tailwindColors = {};
for (const key of Object.keys(darkColors)) {
    tailwindColors[key] = `rgb(var(--color-${key}) / <alpha-value>)`;
}

// Global Tailwind object
window.tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: tailwindColors,
            borderRadius: {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "full": "0.75rem"
            },
            fontFamily: {
                "headline": ["Space Grotesk"],
                "body": ["Inter"],
                "label": ["Inter"]
            }
        }
    }
};
