const fs = require('fs');
const path = require('path');

const menuHtml = `          <div class="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[280px] pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
            <div class="bg-surface-container-high/95 backdrop-blur-2xl border border-outline-variant/20 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col gap-0.5">
              <a href="hakkimizda.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">info</span>Hakkımızda</a>
              <a href="nasil-calisir.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">rocket_launch</span>Nasıl Çalışır?</a>
              <a href="kyc-dogrulama.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">verified_user</span>KYC Doğrulama</a>
              <div class="h-px bg-outline-variant/10 my-1 mx-2"></div>
              <a href="kullanim-kosullari.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">gavel</span>Kullanım Koşulları</a>
              <a href="dolandiricilik-onleme.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">security</span>Dolandırıcılık Önleme</a>
              <a href="mesafeli-satis.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">history_edu</span>Mesafeli Satış</a>
              <a href="gizlilik.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">shield</span>Gizlilik Politikası</a>
              <a href="acik-riza.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">border_color</span>Açık Rıza Metni</a>
              <a href="veri-isleme.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">database</span>Veri İşleme ve İmha</a>
              <a href="sorumluluk-reddi.html" class="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-[13px] font-medium"><span class="material-symbols-outlined text-[18px]">warning</span>Sorumluluk Reddi</a>
            </div>
          </div>`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Using regex to match the menu blocks from <div class="absolute top-[calc(...) to </div>\n          </div>
    // This requires some precise regex or manual parsing.
    // It's safer to use manual parsing balancing the divs.

    const searchStr = '<div class="absolute top-[calc(100%-8px)]';
    const startIndex = content.indexOf(searchStr);
    if (startIndex === -1) return;

    let dCount = 0;
    let endIndex = startIndex;
    for (let i = startIndex; i < content.length; i++) {
        if (content.substr(i, 4) === '<div') dCount++;
        else if (content.substr(i, 5) === '</div') {
            dCount--;
            if (dCount === 0) {
                endIndex = i + 6;
                break;
            }
        }
    }

    const newContent = content.substring(0, startIndex) + menuHtml + content.substring(endIndex);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
}

const dir = __dirname;
const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.html') && !file.includes('site.html')) {
        processFile(path.join(dir, file));
    }
});
