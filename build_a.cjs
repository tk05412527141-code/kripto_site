const fs = require('fs');

const content = `
        <div class="space-y-4">
            <h2 class="text-4xl font-headline font-bold text-on-surface">Biyometrik Veri Açık Rıza Metni</h2>
            <h3 class="text-2xl font-bold text-primary">Müşteri Açık Rıza Beyanı</h3>
            <p class="text-lg">Anka Finansal Hizmetler ve Ticaret Limited Şirketi ("Şirket") tarafından tarafıma sunulan Aydınlatma Metni'ni elektronik kanallar vasıtasıyla eksiksiz biçimde okudum, anladım ve haklarım konusunda bilgilendirildim.</p>
        </div>

        <div class="space-y-4">
            <p>Bu kapsamda; Şirket ile gerçekleştireceğim doğrudan dijital ürün tedariki işlemleri esnasında, özel nitelikli kişisel verim olan yüz haritam, biyometrik verilerim ve optik görüntülerimin 6698 sayılı KVKK Madde 6 uyarınca işlenmesine ve spesifik olarak aşağıdaki "sınırlı amaçlar" dahilinde kullanılmasına hiçbir baskı altında kalmaksızın hür irademle <strong class="text-primary">AÇIK RIZA veriyorum:</strong></p>
        </div>

        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">Verilerin Kullanım Amacı ve Aktarım (Paylaşım) Alanları</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                    <h4 class="text-[15px] font-bold text-primary mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[20px]">security</span> Siber Güvenlik Teyidi</h4>
                    <p class="text-sm">İletilen kimlik belgesi ile işlemi yapan kişinin eşleştirilmesi; sahte hesap kullanımı ve ticari dolandırıcılık (fraud) vakalarının engellenmesi.</p>
                </div>
                <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                    <h4 class="text-[15px] font-bold text-primary mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[20px]">cloud_sync</span> Donanım Sağlayıcı Paylaşımı</h4>
                    <p class="text-sm">Teknik doğrulama hizmetinin sağlanabilmesi için verinin küresel güvenlik standartlarına sahip teknoloji partneri (Sumsub) sistemlerine şifreli aktarımı.</p>
                </div>
                <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                    <h4 class="text-[15px] font-bold text-primary mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[20px]">local_police</span> Adli Bildirim (Paylaşım)</h4>
                    <p class="text-sm">Şüpheli siber vakalarda veya ticari hırsızlık girişimlerinde KVKK ve TCK uyarınca yalnızca resmi kolluk/savcılık makamlarına sunulması.</p>
                </div>
                <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
                    <h4 class="text-[15px] font-bold text-primary mb-3 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[20px]">receipt_long</span> Fatura Tanzimi</h4>
                    <p class="text-sm">Doğrulama aşamasında sunulan yasal kimlik bilgilerinin ticari işleme istinaden E-Fatura / E-Arşiv düzenlenebilmesi amacıyla kullanılması ve yasal mercilerle paylaşılması.</p>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <div class="p-6 bg-error/5 rounded-3xl border border-error/20 text-on-surface">
                <p>Belirtilen bu biyometrik güvenlik ve dolandırıcılığı önleme amaçları dışında (pazarlama, reklam, profilleme, üçüncü ticari firmalara veri satışı vb. hiçbir faaliyet için) <strong>KESİNLİKLE KULLANILMAYACAĞINI</strong>, verinin KVKK süre limitleri çerçevesinde saklanıp ardından sistemden anonimleştirilerek/imha edilerek kalıcı olarak yok edileceğini anlıyorum.</p>
            </div>
        </div>

        <div class="space-y-4">
            <p>Açık rızamı dilediğim zaman yasal kanallarla geriye dönük sonuç doğurmak üzere geri çekebileceğimi (veri iptali) bildiğimi kabul ederim. İşbu rıza beyanını elektronik ortamda işaretlemem aracılığıyla özgürce tahsis ettiğimi onaylıyorum.</p>
        </div>
`;

let base = fs.readFileSync('kyc-dogrulama.html', 'utf8');

base = base.replace('<title>KYC Doğrulama | Anka Exchange</title>', '<title>Açık Rıza Metni | Anka Exchange</title>');

base = base.replace(/class="active sidebar-link([^"]*)"/g, 'class="sidebar-link$1"');
base = base.replace(/data-file="acik-riza.html" class="sidebar-link/g, 'data-file="acik-riza.html" class="active sidebar-link');

const blockStartMatch = '<div class="flex-1 max-w-4xl space-y-12 text-on-surface-variant leading-relaxed">';
const blockEndMatch = '</main>';
const startIdx = base.indexOf(blockStartMatch);
const endIdx = base.indexOf(blockEndMatch, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newHtml = base.substring(0, startIdx) + blockStartMatch + '\\n' + content + '\\n    </div>\\n' + base.substring(endIdx);
    fs.writeFileSync('acik-riza.html', newHtml, 'utf8');
    console.log("acik-riza.html created");
} else {
    console.log("Could not find blocks");
}
