const fs = require('fs');

const content = `
        <div class="space-y-4">
            <h2 class="text-4xl font-headline font-bold text-on-surface">Mesafeli Dijital Ürün Satış Sözleşmesi</h2>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">Madde 1 - Taraflar ve Kapsam</h3>
            <p>İşbu Sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince, yasal e-ticaret işlemlerini sürdüren Turan Dijital Yazılım ve Ticaret Ltd. Şti. (Satıcı/Tedarikçi) ile dijital ürün teslimi/tedariki talep eden Kullanıcı (Alıcı/Müşteri) arasında akdedilmiştir. Sözleşmenin konusu; fiziki veya kargo ile teslimatı olmayan, tamamen gayrimaddi özellikteki teknolojik yazılımların veya "Dijital Ürünlerin" elektronik yolla satışına ve transferine ilişkindir.</p>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">Madde 2 - Ürünün Temel Nitelikleri ve İfası</h3>
            <p>Platformlar (veya entegre ticari e-pazar yerleri) üzerinden Kullanıcı'nın cüzdanına (adresine) veya üyelik hesabına elektronik olarak gönderilen kod, dijital anahtar yahut algoritmik blokzincir transferleri işbu sözleşmenin yegane mal/hizmet konusudur. İlgili ürün değerleri serbest ve küresel anlık kurlarla arz-talep oranında şirketimizce tespit edilir ve satım anında butona basılarak onay verilen tutar üzerinden Türkiye Cumhuriyeti vergi yükümlülüklerine istinaden faturalandırılır. Malın ifası, kriptografik ağda veya elektronik dijital fihristte "Transfer Tamamlandı / Confirmed" konumuna geçtiği an gerçekleşmiş ve tarafların borcu sona ermiş sayılır.</p>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">Madde 3 - Elektronik Teslimat ve Cayma Hakkı İstisnası (Önemli Hüküm)</h3>
            <div class="p-6 bg-surface-container-low rounded-3xl border border-error/20">
                <p class="text-error-dim">Mesafeli Sözleşmeler Yönetmeliği Madde 15 (ğ) bendi yasal uyarısı uyarınca; "Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin mesafeli sözleşmeler" kapsamında yasama organımızca <strong class="text-error">CAYMA HAKKI İSTİSNASI</strong> tanınmıştır ve <strong class="text-error">CAYMA HAKKI KULLANILAMAZ.</strong> Dijital ticari değer cüzdanınıza veya hesabınıza ulaştığı andan itibaren sipariş "iadesi, cayma talebi veya işlemi geriye doğru sarma eylemi" donanımsal ve yasal olarak kabul edilmemektedir.</p>
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">Madde 4 - Fiyat Hataları ve Platform İptal İnisiyatifi</h3>
            <p>Sistem kaynaklı yavaşlamalar, teknolojik API arızaları veya siber ataklardan kaynaklanan olağanüstü/aşırı zarar verici veya hileli fiyatlanmalara karşı Şirketimiz; henüz ifa (onay/transfer) edilmemiş ilgili elektronik satış akdini (para iadesi sağlamak suretiyle) tek taraflı feshetme ve satışı durdurma yetkisini elinde barındırır.</p>
        </div>

        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">Madde 5 - Fatura Tanzimi ve Vergilendirme</h3>
            <p>İşbu Sözleşme'ye konu olan elektronik transfer/teslimat neticelendiğinde Şirket (Satıcı), Kullanıcının (Alıcının) sisteme sunduğu yasal T.C. Kimlik veya Vergi Kimlik Numarası üzerine "Bilişim Hizmetleri ve Dijital Ürün Satışı" mahiyetinde yasal VUK faturası (e-Fatura / e-Arşiv) düzenler. Tüm alım satım işlemleri şirketin resmi muhasebe kayıtları altındadır. Kullanıcı, faturanın düzenlenebilmesi için kendisine veya şirketine ait bilgileri eksiksiz ve doğru beyan etmekle kanunen mükelleftir.</p>
        </div>
`;

let base = fs.readFileSync('kyc-dogrulama.html', 'utf8');

base = base.replace('<title>KYC Doğrulama | Anka Exchange</title>', '<title>Mesafeli Satış | Anka Exchange</title>');

base = base.replace(/class="active sidebar-link([^"]*)"/g, 'class="sidebar-link$1"');
base = base.replace(/data-file="mesafeli-satis.html" class="sidebar-link/g, 'data-file="mesafeli-satis.html" class="active sidebar-link');

const blockStartMatch = '<div class="flex-1 max-w-4xl space-y-12 text-on-surface-variant leading-relaxed">';
const blockEndMatch = '</main>';
const startIdx = base.indexOf(blockStartMatch);
const endIdx = base.indexOf(blockEndMatch, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newHtml = base.substring(0, startIdx) + blockStartMatch + '\\n' + content + '\\n    </div>\\n' + base.substring(endIdx);
    fs.writeFileSync('mesafeli-satis.html', newHtml, 'utf8');
    console.log("mesafeli-satis.html created");
} else {
    console.log("Could not find blocks");
}
