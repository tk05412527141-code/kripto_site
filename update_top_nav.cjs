const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

const corporatePages = [
    'hakkimizda.html', 'nasil-calisir.html', 'kyc-dogrulama.html',
    'kullanim-kosullari.html', 'dolandiricilik-onleme.html', 'mesafeli-satis.html',
    'acik-riza.html', 'veri-isleme.html', 'sorumluluk-reddi.html', 'gizlilik.html'
];

const inactiveLinkClass = 'text-on-surface/80 hover:text-primary transition-colors';
const activeLinkClass = 'text-primary hover:text-primary-dim transition-all font-bold drop-shadow-[0_0_15px_rgba(189,157,255,0.6)] animate-pulse-glow px-3 py-1 bg-primary/5 rounded-xl';

const inactiveBtnClass = 'text-on-surface/80 hover:text-primary transition-all flex items-center gap-1 group-hover:text-primary py-2 text-sm font-medium';
const activeBtnClass = 'text-primary hover:text-primary-dim transition-all flex items-center gap-1 font-bold drop-shadow-[0_0_15px_rgba(189,157,255,0.6)] py-2 text-sm animate-pulse-glow px-3 bg-primary/5 rounded-xl';

const mobInactiveLink = 'flex flex-col items-center justify-center text-on-surface/60 hover:text-primary transition-all active:scale-90';
const mobActiveLink = 'flex flex-col items-center justify-center text-primary transition-all active:scale-90 animate-pulse-glow';

files.forEach(file => {
    if (!file.endsWith('.html') || file.includes('site.html')) return;

    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Helper to apply states only to links INSIDE nav tags to avoid breaking the brand logo
    const applyNavState = (html, navSelector, href, active, activeClass, inactiveClass) => {
        const navStartIdx = html.indexOf(navSelector);
        if (navStartIdx === -1) return html;
        
        let tagCount = 0;
        let navEndIdx = navStartIdx;
        for (let i = navStartIdx; i < html.length; i++) {
            if (html.substr(i, 4) === '<nav') tagCount++;
            else if (html.substr(i, 5) === '</nav') {
                tagCount--;
                if (tagCount === 0) {
                    navEndIdx = i + 6;
                    break;
                }
            }
        }
        
        let navContent = html.substring(navStartIdx, navEndIdx);
        const regex = new RegExp('<a href="' + href + '"[^>]*>(.*?)</a>', 'g');
        navContent = navContent.replace(regex, `<a href="${href}" class="${active ? activeClass : inactiveClass}">$1</a>`);
        
        return html.substring(0, navStartIdx) + navContent + html.substring(navEndIdx);
    };

    // 1. Process Desktop Nav
    content = applyNavState(content, '<nav class="hidden md:flex', 'index.html', file === 'index.html', activeLinkClass, inactiveLinkClass);
    content = applyNavState(content, '<nav class="hidden md:flex', 'kripto-al.html', file === 'kripto-al.html', activeLinkClass, inactiveLinkClass);
    content = applyNavState(content, '<nav class="hidden md:flex', 'kripto-sat.html', file === 'kripto-sat.html', activeLinkClass, inactiveLinkClass);

    // 2. Process Mobile Nav
    content = applyNavState(content, '<nav class="md:hidden', 'index.html', file === 'index.html', mobActiveLink, mobInactiveLink);
    content = applyNavState(content, '<nav class="md:hidden', 'kripto-al.html', file === 'kripto-al.html', mobActiveLink, mobInactiveLink);
    content = applyNavState(content, '<nav class="md:hidden', 'kripto-sat.html', file === 'kripto-sat.html', mobActiveLink, mobInactiveLink);

    // 3. Process Kurumsal button (Desktop Nav)
    const isCorporate = corporatePages.includes(file);
    const navStartIdx = content.indexOf('<nav class="hidden md:flex');
    if (navStartIdx !== -1) {
        let tagCount = 0;
        let navEndIdx = navStartIdx;
        for (let i = navStartIdx; i < content.length; i++) {
            if (content.substr(i, 4) === '<nav') tagCount++;
            else if (content.substr(i, 5) === '</nav') {
                tagCount--;
                if (tagCount === 0) {
                    navEndIdx = i + 6;
                    break;
                }
            }
        }
        let navContent = content.substring(navStartIdx, navEndIdx);
        navContent = navContent.replace(/<button class="[^"]*">([\s\S]*?)Kurumsal([\s\S]*?)<\/button>/g, 
            `<button class="${isCorporate ? activeBtnClass : inactiveBtnClass}">\n              Kurumsal\n              <span class="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:rotate-180">expand_more</span>\n            </button>`);
        content = content.substring(0, navStartIdx) + navContent + content.substring(navEndIdx);
    }

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log('Finalized nav states in ' + file);
});
