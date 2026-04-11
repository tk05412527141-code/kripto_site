const fs = require('fs');

const content = `
        <div class="space-y-4">
            <h2 class="text-4xl font-headline font-bold text-on-surface">Dolandırıcılık Önleme ve Güvenlik Politikası</h2>
            <h3 class="text-2xl font-bold text-primary">Siber Güvenlik Standartları</h3>
            <p class="text-lg">Turan Dijital Yazılım ve Ticaret Ltd. Şti. (bundan böyle "Şirket"), ticari faaliyetlerini siber risklerden arındırılmış güvenli bir zeminde yürütür. Bu politika; her türlü sahtecilik (fraud), başkasına ait kaynaklarla ticaret ve siber hırsızlık vakalarının engellenmesi amacıyla teknik güvenlik protokollerini kapsar.</p>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">1. Amaç ve Kapsam</h3>
            <p>Şirketimiz, dijital ürün tedariki sürecinde hem kendi ticari güvenliğini hem de dürüst kullanıcıların güvenliğini gözetmektedir. İşbu politika; siparişlerin yalnızca yasal sahipleri tarafından verildiğini teyit etmek ve siber suç odaklarının platformu istismar etmesini önlemek amacıyla oluşturulmuştur.</p>
            <div class="p-4 rounded-xl bg-error/10 border border-error/20 text-error-dim">
                <strong class="text-error">Aracılık Sınırı:</strong> Şirketimiz kullanıcılar arasında bir işlem organizasyonu kurmaz ve üçüncü taraf ticari geçişlerine aracılık etmez. Yapılan her işlem doğrudan Şirket envanterinden kullanıcıya yönelik ikili bir ticari akittir.
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">2. Ticari Onay ve Güvenlik Filtreleri</h3>
            <p>Bilişim altyapımız üzerinden bize ulaşan her ticari talep, siber risk analizinden geçmektedir. Kullanıcı işlemleri; güvenlik skoruna göre aşağıdaki filtrelerden geçebilir:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                    <h4 class="text-lg font-bold text-primary mb-2 flex items-center gap-2"><span class="material-symbols-outlined text-primary">check_circle</span> Genel Güvenlik Onayı</h4>
                    <p class="text-sm">Standart kullanıcı doğrulaması ile isim ve IBAN verisi uyuşan doğrudan işlemler.</p>
                </div>
                <div class="p-6 bg-surface-container-low rounded-3xl border border-error/20 hover:border-error/50 transition-colors">
                    <h4 class="text-lg font-bold text-error mb-2 flex items-center gap-2"><span class="material-symbols-outlined text-error">gpp_maybe</span> Yüksek Güvenlik Teyidi</h4>
                    <p class="text-sm">Şüpheli cihaz/lokasyon kullanımı veya olağandışı ticari hacimlerde, Şirket ek kimlik teyidi (OCR/Canlılık testi) talep etme hakkını saklı tutar.</p>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">3. Sahtecilikle Mücadele Kontrolleri</h3>
            <p>Ticareti suistimal etmeye yönelik (fraud) girişimleri durdurmak adına:</p>
            <ul class="list-disc pl-5 space-y-2 text-on-surface-variant">
                <li>Kullanılan kimlik belgelerinin geçerlilik ve gerçeklik kontrolü,</li>
                <li>İşlemi anlık yapan kişinin belge sahibiyle eşleşme durumu (biyometrik teyit),</li>
                <li>Ödemenin yapıldığı kaynak ile teslimat isminin uyuşma durumu teknik olarak denetlenir.</li>
            </ul>
        </div>

        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">4. Şüpheli Durumlar ve Adli Bildirim</h3>
            <p>Şirketimiz; bilişim suçlarının, kart hırsızlığının ve her türlü dolandırıcılığın karşısındadır. Bir e-ticaret firması olarak; mülkiyetimizdeki dijital ürünlerin haksız yöntemlerle edinilmeye çalışılması halinde ticari işlemi anında durdurma, bedeli iade etme veya şüphe kuvvetli ise mağdur sıfatıyla resmi makamlara bildirim yapma hakkımızı kullanırız.</p>
        </div>
`;

let base = fs.readFileSync('kyc-dogrulama.html', 'utf8');

base = base.replace('<title>KYC Doğrulama | Anka Exchange</title>', '<title>Dolandırıcılık Önleme | Anka Exchange</title>');

base = base.replace(/class="active sidebar-link([^"]*)"/g, 'class="sidebar-link$1"');
base = base.replace(/data-file="dolandiricilik-onleme.html" class="sidebar-link/g, 'data-file="dolandiricilik-onleme.html" class="active sidebar-link');

const blockStartMatch = '<div class="flex-1 max-w-4xl space-y-12 text-on-surface-variant leading-relaxed">';
const blockEndMatch = '</main>';
const startIdx = base.indexOf(blockStartMatch);
const endIdx = base.indexOf(blockEndMatch, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newHtml = base.substring(0, startIdx) + blockStartMatch + '\\n' + content + '\\n    </div>\\n' + base.substring(endIdx);
    fs.writeFileSync('dolandiricilik-onleme.html', newHtml, 'utf8');
    console.log("dolandiricilik-onleme.html created");
} else {
    console.log("Could not find blocks");
}
