const fs = require('fs');
const path = require('path');

// Extract the complete blocks from index.html (source of truth)
const indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

function extractBlock(html, startSearch, tagType) {
    const startIndex = html.indexOf(startSearch);
    if (startIndex === -1) return null;
    
    let tagCount = 0;
    let endIndex = startIndex;
    for (let i = startIndex; i < html.length; i++) {
        if (html.substr(i, tagType.length + 1) === '<' + tagType) tagCount++;
        else if (html.substr(i, tagType.length + 2) === '</' + tagType) {
            tagCount--;
            if (tagCount === 0) {
                endIndex = i + tagType.length + 3;
                break;
            }
        }
    }
    return html.substring(startIndex, endIndex);
}

const fullHeaderHtml = extractBlock(indexContent, '<header', 'header');
const fullFooterHtml = extractBlock(indexContent, '<footer', 'footer');
const fullMobileNavHtml = extractBlock(indexContent, '<nav class="md:hidden', 'nav');
const fullDesktopNavHtml = extractBlock(indexContent, '<nav class="hidden md:flex', 'nav');

// Base Sidebar HTML
const baseSidebarHtml = `    <aside class="w-full md:w-64 shrink-0 space-y-8">
        <div class="bg-surface-container-low rounded-3xl p-2 border border-outline-variant/10">
            <h3 class="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">Kurumsal Menü</h3>
            <div class="space-y-1">
                <a href="hakkimizda.html" data-file="hakkimizda.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium hover:bg-primary/10 transition-all text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">info</span>Hakkımızda</a>
                <a href="nasil-calisir.html" data-file="nasil-calisir.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium hover:bg-primary/10 transition-all text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">rocket_launch</span>Nasıl Çalışır?</a>
                <a href="kyc-dogrulama.html" data-file="kyc-dogrulama.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium hover:bg-primary/10 transition-all text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">verified_user</span>KYC Doğrulama</a>
                <a href="kullanim-kosullari.html" data-file="kullanim-kosullari.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">gavel</span>Kullanım Koşulları</a>
                <a href="dolandiricilik-onleme.html" data-file="dolandiricilik-onleme.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">security</span>Dolandırıcılık Önleme</a>
                <a href="mesafeli-satis.html" data-file="mesafeli-satis.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">history_edu</span>Mesafeli Satış</a>
                <a href="acik-riza.html" data-file="acik-riza.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">border_color</span>Açık Rıza Metni</a>
                <a href="veri-isleme.html" data-file="veri-isleme.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">database</span>Veri İşleme ve İmha</a>
                <a href="sorumluluk-reddi.html" data-file="sorumluluk-reddi.html" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium text-on-surface-variant group"><span class="material-symbols-outlined text-xl opacity-60 group-hover:opacity-100">warning</span>Sorumluluk Reddi</a>
            </div>
        </div>
    </aside>`;

function setSidebarActive(fileName) {
    let html = baseSidebarHtml;
    const regex = new RegExp('<a href="' + fileName + '"[^>]*class="([^"]*)"', 'g');
    html = html.replace(regex, (match, classes) => {
        let newClasses = classes.replace('hover:bg-primary/10', '').replace('text-on-surface-variant', '');
        newClasses = 'active ' + newClasses.trim();
        return match.replace(classes, newClasses);
    });
    return html;
}

const dir = __dirname;
const files = fs.readdirSync(dir);
files.forEach(file => {
    if (!file.endsWith('.html') || file.includes('site.html')) return;

    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let hasChanges = false;

    // 1. Sync Header
    const headerStartIdx = content.indexOf('<header');
    if (headerStartIdx !== -1 && fullHeaderHtml) {
        const existingHeader = extractBlock(content, '<header', 'header');
        if (existingHeader && existingHeader !== fullHeaderHtml) {
            content = content.replace(existingHeader, fullHeaderHtml);
            hasChanges = true;
        }
    }

    // 2. Sync Footer
    const footerStartIdx = content.indexOf('<footer');
    if (footerStartIdx !== -1 && fullFooterHtml) {
        const existingFooter = extractBlock(content, '<footer', 'footer');
        if (existingFooter && existingFooter !== fullFooterHtml) {
            content = content.replace(existingFooter, fullFooterHtml);
            hasChanges = true;
        }
    }

    // 3. Sync Mobile Nav
    const mobNavStartIdx = content.indexOf('<nav class="md:hidden');
    if (mobNavStartIdx !== -1 && fullMobileNavHtml) {
        const existingMobNav = extractBlock(content, '<nav class="md:hidden', 'nav');
        if (existingMobNav && existingMobNav !== fullMobileNavHtml) {
            content = content.replace(existingMobNav, fullMobileNavHtml);
            hasChanges = true;
        } else if (!existingMobNav) {
            // If it doesn't exist, try to insert before </body>
            content = content.replace('</body>', fullMobileNavHtml + '\n</body>');
            hasChanges = true;
        }
    }

    // 4. Sync Sidebar
    const sideStartIndex = content.indexOf('<aside class="w-full md:w-64');
    if (sideStartIndex !== -1) {
        const existingSidebar = extractBlock(content, '<aside class="w-full md:w-64', 'aside');
        const newSidebar = setSidebarActive(file);
        if (existingSidebar && existingSidebar !== newSidebar) {
            content = content.replace(existingSidebar, newSidebar);
            hasChanges = true;
        }
    }

    if (hasChanges) {
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log(`Synchronized all blocks in ${file}`);
    }
});
