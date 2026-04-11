const fs = require('fs');

const content = `
        <div class="space-y-4">
            <h2 class="text-4xl font-headline font-bold text-on-surface">Genel Sorumluluk Reddi (Disclaimer)</h2>
            <div class="p-3 rounded-xl bg-error/10 border border-error/20 inline-block mt-2">
                 <h3 class="text-sm font-bold text-error tracking-wider">YATIRIM VE FİNANSAL DANIŞMANLIK UYARISI DEĞİLDİR</h3>
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">1. Finansal Yönlendirme Gerçekleştirilmemesi</h3>
            <p>Anka Finansal Hizmetler ve Ticaret Limited Şirketi web platformunda, mobil görünümlerinde, entegre dahil olduğu pazar yerlerinde (Binance P2P dahil vb.) veya operasyonel iletişim kanallarında (destek ekipleri ve chatbotlar) yayımlanması muhtemel hiçbir kur tahmini, piyasa analizi, veri duyurusu, ticari yorum veya fiyatlama grafiği; Sermaye Piyasası Kanunu mevzuatı kapsamında Sermaye Piyasası Aracı, Portföy Yönetimi ve Yatırım Danışmanlığı hizmeti niteliğine asla sahip değildir.</p>
            <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 mt-2">
                <p>Şirketimiz sizi zenginleştirmeyi vadetmez, size sadece e-ticaret sözleşmesi dairesinde "anlık ve peşin" dijital ürün tedariki gerçekleştirir. Tedarik işlemi bitirildikten sonrasında elinizde dijital biçimde özgür iradenizle tuttuğunuz varlığın muhtemel değer kazanıp kaybetmesi hususunu tetkik etmek ve analiz etmek tamamen kendi şahsınıza ve kişisel bütçe araştırmanıza aittir.</p>
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">2. Ürünlerin Aşırı Volatilite Karinesi</h3>
            <p>Ticareti arz edilen dijital menkul ve blokzincir destekli bilişim şifresi ürünleri; doğası gereği merkezi borsa tahtalarına muhtaç, küresel çapta dalgalanan, herhangi bir devletin veya ulusal merkez bankasının mülki regülasyon garantisinde bulunmayan varlıklardır. Aşırı fiyat dengesizlikleri (volatilite) barındırır. Kısa, orta veya uzun vadelerde bu ürünleri elinde nakit olarak bekleten kimsenin yatırdığı tutarın bir kısmının veya bütünü ile tamamının kaybedilmesi gibi keskin ekosistem riskleri bu pazarda ticaret yapan herkesin rızasıyla katlandığı bariz bir fenomendir.</p>
        </div>

        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">3. Üçüncü Taraf Şebeke Kesintileri ve Sorumsuzluk</h3>
            <p>Yerel internet erişim engellemeleri, global şahsi donanım cüzdan yazılımları, blok zincir bazlı ağ tıkanıklıkları, node veya madenci komisyon krizleri, global siber sızmalar/saldırılar veya sunucu/servis sağlayıcı (Cloudflare, AWS vb.) kesinti/gecikmelerinden kaynaklı olarak doğabilecek potansiyel ve farazi para kazanma hasarlarından yahut ticaret kaçirma fırsatlarından ötürü şirketimizin "bedeli iade etme" taahhüdü bulunmaz. İlgili müstakil altyapıların yaşattığı söz konusu "force majeure" (mücbir sebep ve arızi durum) gecikmelerinde tüm siber kanuniyetler tam anlamıyla şirketimiz adına koruma altındadır.</p>
        </div>
`;

let base = fs.readFileSync('kyc-dogrulama.html', 'utf8');

base = base.replace('<title>KYC Doğrulama | Anka Exchange</title>', '<title>Sorumluluk Reddi | Anka Exchange</title>');

base = base.replace(/class="active sidebar-link([^"]*)"/g, 'class="sidebar-link$1"');
base = base.replace(/data-file="sorumluluk-reddi.html" class="sidebar-link/g, 'data-file="sorumluluk-reddi.html" class="active sidebar-link');

const blockStartMatch = '<div class="flex-1 max-w-4xl space-y-12 text-on-surface-variant leading-relaxed">';
const blockEndMatch = '</main>';
const startIdx = base.indexOf(blockStartMatch);
const endIdx = base.indexOf(blockEndMatch, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newHtml = base.substring(0, startIdx) + blockStartMatch + '\\n' + content + '\\n    </div>\\n' + base.substring(endIdx);
    fs.writeFileSync('sorumluluk-reddi.html', newHtml, 'utf8');
    console.log("sorumluluk-reddi.html created");
} else {
    console.log("Could not find blocks");
}
