const fs = require('fs');

const content = `
        <div class="space-y-4">
            <h2 class="text-4xl font-headline font-bold text-on-surface">Kişisel Veri İşleme ve İmha Politikası</h2>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">1. Veri İşleme Politikasının Amacı</h3>
            <p>Kapsamlı Gizlilik bildirimimizde (Aydınlatma Metni) kamuoyuna duyurulan maddelerin teknik ve algoritmik uygulanışını aydınlatan bu spesifik politika; şirketimize idari ve güvenlik teyidi vesilesiyle ibraz edilen verilerin fiziksel/elektronik olarak hangi şifreleme alt yapılarında idame ettirildiğini ve yasal saklama/kullanım hedefleri eridiğinde ve miadını doldurduğunda ne tür "Geri Dönülemez" imha senaryolarıyla (Deletion/Anonymization) kalıcı bir biçimde yok edildiğini (imha) detaylıca tarif eder.</p>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">2. Teknik Ağ ve Kurumsal İdari Tedbirlerimiz</h3>
            <p>Şirket iç ağı donanım ve yazılım bazlı küresel güvenlik duvarları (Firewall) ile 7/24 izlenir ve korunur. Dış unsurlardan ve internete açık alanlardan gelecek olası yetkisiz sızmalara ve siber korsanlık girişimlerine karşı 256-bit AES endüstri standardı seviyesinde şifrelemesi uygulamaları esastır.</p>
            <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 mt-4 space-y-4">
                <div class="flex gap-4 items-start">
                    <span class="material-symbols-outlined text-primary text-3xl shrink-0 mt-1">admin_panel_settings</span>
                    <div>
                        <h4 class="text-[15px] font-bold text-primary mb-1">Katı Personel Erişimi</h4>
                        <p class="text-sm">Hukuken saklanması zaruri olan Ticari E-Fatura veya adres verilerinize sadece şirketimizde bu konuya vakıf (görev tanımları bağlamında sert izin yetkileri ile sınırlandırılmış) atanmış idari ve mali personel salt erişebilir.</p>
                    </div>
                </div>
                <div class="h-px bg-outline-variant/10 w-full"></div>
                <div class="flex gap-4 items-start">
                    <span class="material-symbols-outlined text-primary text-3xl shrink-0 mt-1">history</span>
                    <div>
                        <h4 class="text-[15px] font-bold text-primary mb-1">Kesin Loglama ve İz Takibi</h4>
                        <p class="text-sm">Kullanıcının siber riskini önlemeye yarayan biyometrik harita veya KYC işlem evrakı dökümlerinize dair erişim kayıtları ise tamamen saniye bazında loglanmış (elektronik iz formunda kayıt altına alınmış) olup, mahkeme kararı yahut yasal bir emniyet/savcılık tahkikatı doğmadıkça yönetim kurulu dahil hiç kimse tarafından keyfi olarak sorgulanamaz ve arşiv dosyaları indirilemez/açılamaz.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">3. Veri İmha Periyodları ve Yok Etme Esasları</h3>
            <p>Kullanıcının sistem doğrulama safhasında Özel Özgür Açık Rızası prensibi ile sağladığı yüksek seviyeli bilgiler (Özellikle Sumsub Canlı Yüz Analiz Biyometrisi), P2P dijital cüzdan e-ticaret pratiklerinde olası dolandırıcılık veya chargeback (ters ibraz) şüphesinin kaybolduğu güvenli ticaret zamanlamasından takriben <strong class="text-primary">30 ila 180 gün sonrasında</strong> periyodik işletilen algoritmik silme (cronjob vb.) betikleri ile sistemden kati ve geri dönülemez (unrecoverable) olarak silinir.</p>
            <div class="p-6 bg-primary/5 rounded-3xl border border-primary/20 text-on-surface">
                <p>Kanunen yok edilmesi cezai yaptırıma sebebiyet veren ve faturaya işlenmiş TCKN yahut müşteri ad-soyad iletişim verisi; ticaret kanunları ile Vergi Usul Kanunu ve TBK hükümlerince mali vergi arşivi (muhasebe) bünyesinde zorunlu olarak takribi <strong class="text-primary">5 yıl durmak zorundadır</strong> (idari zorunluluktur). Biyometrik veya şifreli veriden ayrıştırılarak tamamen izole edilmiş bu düz veri takımları (evrak dosyaları), 5 yıllık adli zamanaşımını sorunsuz bir şekilde doldurduğunda şirket içi Veri İmha Kurulu denetiminde anonim maske ile yahut donanımsal temizleme yöntemleriyle güvenle ve yasal tutanakla yok edilir.</p>
            </div>
        </div>
`;

let base = fs.readFileSync('kyc-dogrulama.html', 'utf8');

base = base.replace('<title>KYC Doğrulama | Anka Exchange</title>', '<title>Veri İşleme ve İmha | Anka Exchange</title>');

base = base.replace(/class="active sidebar-link([^"]*)"/g, 'class="sidebar-link$1"');
base = base.replace(/data-file="veri-isleme.html" class="sidebar-link/g, 'data-file="veri-isleme.html" class="active sidebar-link');

const blockStartMatch = '<div class="flex-1 max-w-4xl space-y-12 text-on-surface-variant leading-relaxed">';
const blockEndMatch = '</main>';
const startIdx = base.indexOf(blockStartMatch);
const endIdx = base.indexOf(blockEndMatch, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newHtml = base.substring(0, startIdx) + blockStartMatch + '\\n' + content + '\\n    </div>\\n' + base.substring(endIdx);
    fs.writeFileSync('veri-isleme.html', newHtml, 'utf8');
    console.log("veri-isleme.html created");
} else {
    console.log("Could not find blocks");
}
