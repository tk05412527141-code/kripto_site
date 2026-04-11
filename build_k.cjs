const fs = require('fs');
const content = `
        <div class="space-y-4">
            <h2 class="text-4xl font-headline font-bold text-on-surface">Platform Kullanım Koşulları ve OTC Çerçeve Sözleşmesi</h2>
            <h3 class="text-2xl font-bold text-primary">Bağlayıcı Hukuki Sözleşme</h3>
            <p class="text-lg">Bu metin, Turan Dijital Yazılım ve Ticaret Ltd. Şti. (bundan böyle "Şirket") ile işlem yapan kişiler ("Kullanıcı") arasındaki yasal "OTC (Over-The-Counter) Çerçeve Satış Sözleşmesi"dir. Taraflar, platformla herhangi bir etkileşime girdiklerinde aşağıda yer alan Sermaye Piyasası, Türk Ceza Kanunu ve Veri Koruma düzenlemelerine ilişkin risk analizlerini ve hukuki beyanları tereddütsüz kabul etmiş sayılır.</p>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">1. Faaliyetin Tanımı ve Hukuki Statü</h3>
            <p>Turan Dijital Yazılım ve Ticaret Limited Şirketi (bundan böyle "Şirket"), kendi mülkiyetinde ve envanterinde bulunan dijital ürünleri, bilişim varlıklarını ve yazılım kodlarını doğrudan nihai kullanıcıya (Bilateral/Birebir) satan bir e-ticaret kuruluşudur.</p>
            <div class="p-4 rounded-xl bg-error/10 border border-error/20 text-error-dim">
                <strong>KRİTİK BEYAN:</strong> Şirket, kullanıcılar arasında bir işlem organizasyonu kurmaz, alıcı ve satıcıyı eşleştirmez ve süreklilik arz eden üçüncü taraf işlemlerine aracılık etmez. Tüm ticaret doğrudan Şirket ile Kullanıcı arasında gerçekleşir.
            </div>
            <p>Kullanıcı, Şirketin faaliyet modelinin 6362 sayılı Sermaye Piyasası Kanunu (SPK) regülasyonlarına tabi bir "Kripto Varlık Platformu (Borsa)" statüsünde olmadığını bilmekte ve kabul etmektedir. Zira Şirket;</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>Emanet (Custody) Hizmeti Sağlamaz:</strong> Kullanıcıların fonları veya dijital varlıkları sistemde/platformda tutulmaz.</li>
                <li><strong>Emir Defteri (Orderbook) İşletmez:</strong> Kullanıcıları kendi aralarında eşleştirmez. İşlemler daima Kullanıcı ile Şirket arasında "ikili (bilateral) ticari işlem" olarak tasarlanmıştır.</li>
                <li><strong>Aracılık Faaliyeti Yoktur:</strong> Şirket, süreklilik arz eden üçüncü taraf işlemlerine kesinlikle aracılık etmez.</li>
                <li><strong>Al-Sat Organizasyonu Kurmaz:</strong> Yalnızca kendi öz sermayesi, kurumsal bilançosu ve şirket envanterinden peşin ödemeli dijital ürün teslimatı veya ticari alımı gerçekleştirir.</li>
            </ul>
            <p>Bu hukuki model altında, sunulan hizmet saf bir pazar yeri OTC (Tezgâh Altı) işleminden ibarettir.</p>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">2. Üyelik ve Kimlik Doğrulama (Fraud Önleme)</h3>
            <p>Platformda sunulan dijital ürünlerden faydalanabilmek için Kullanıcı'nın, Şirket tarafından belirlenen siber güvenlik ve kimlik doğrulama prosedürlerini tamamlaması zorunludur. Bu prosedürler; çalıntı ödeme araçlarının kullanımını engellemek (Anti-Fraud) ve siparişi verenin gerçek kişi olduğunu teyit etmek amacıyla işletilmektedir.</p>
            <p>Şirket, yüksek riskli dijital ticaretteki ödeme güvenliğini temin etmek zorunluluğu nedeniyle global KYC kuruluşu olan Sumsub üzerinden kimlik doğrulama gerçekleştirmektedir. Bu doğrulama operasyonunda:</p>
            <ul class="list-disc pl-5 space-y-2">
                <li><strong>KVKK Statüsü:</strong> Şirket tam teşekküllü "Veri Sorumlusu", altyapıyı sağlayan Sumsub ise "Veri İşleyen" konumundadır. Süreç, kapsamlı Aydınlatma Metnimiz ve Kullanıcının verdiği "Açık Rıza" uyarınca tam denetimle işletilir.</li>
                <li><strong>Sorumluluk Çerçevesi ve KYC Sınırı:</strong> KYC işlemi yalnızca ödeme ve işlem (siber) güvenliği amaçlıdır; şirket tarafından hiçbir şekilde finansal analiz, mali profil çıkarma veya müşteri sınıflandırması yapılmaz. KYC verileri yalnızca şahsi kimlik ispatı yapmak ve olası bir idari/adli vakada yasal kanıt oluşturmak içindir.</li>
            </ul>
        </div>

        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">3. Türk Ceza Kanunu (TCK 158 ve TCK 282) Kapsamında İbraz ve Garantiler</h3>
            <p>Kullanıcı, şirketin dijital doğasına yönelik eylemlerinden şahsen hukuki ve cezai olarak sorumludur ve aşağıdaki kritik maddeleri kayıtsız şartsız taahhüt eder:</p>
            
            <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10">
                <h4 class="text-lg font-bold text-primary mb-3">A. Suçtan Kaynaklanan Malvarlığını Aklama (TCK Madde 282)</h4>
                <p>Şirketimize transfer edilen tüm nakdi veya kriptografik fonların kaynağı tamamen meşru ticari / şahsi kazanımlardır. Platformun veya ilanların, illegal kökenli (bahis, uyuşturucu ticareti, haksız kazanç, terör finansmanı vb.) servetin aklanması maksadıyla bir "arayüz" olarak kullanılması kati surette yasaktır.</p>
            </div>
            
            <div class="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10">
                <h4 class="text-lg font-bold text-primary mb-3">B. Bilişim Sistemleri Vasıtasıyla Dolandırıcılık (TCK Madde 158/1-f)</h4>
                <p>Kullanıcı, alışveriş esnasında kullandığı kredi kartı veya banka hesabının %100 kendi mülkiyetinde / yasal yetkisinde olduğunu ispatlamak zorundadır. Üçüncü şahıslara ait banka hesaplarının izinsiz kullanımından doğan şüpheli (fraud) işlemlerde:</p>
                <div class="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 text-on-surface">
                    <strong>Yasal Delil Karinesi:</strong> Şirket, platform üzerinden gerçekleştirilen işlemlerde elde ettiği cihaz tespiti (IP), zaman damgası ve Sumsub KYC (kimlik-biyometrik) doğrulama kanıtlarını, olası bir adli ihtilafta hukuki süreçlerde doğrudan yasal delil olarak kullanabilir ve yetkili kolluk/savcılık makamlarına mağdur sıfatıyla sunacaktır.
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">4. İşlem Limitleri, Şüpheli Aktivite ve Fesih Hakları</h3>
            <p>Şirket, standart ticaret hukuku prensipleri ve e-ticaret risk yönetimi gereğince; platformlarına/ilanlarına yönelen olağandışı ödemelerde aşağıdaki tedbirleri tek taraflı olarak uygulayabilir:</p>
            <ul class="list-disc pl-5 space-y-2 text-on-surface-variant">
                <li>Şirket; belirli ticari limitler üzerindeki taleplerde, işlemin teyidi için ek güvenlik belgeleri talep etme yahut siber riskler bağlamında işlemi tamamen reddetme hakkına sahiptir.</li>
                <li>Şirket, yasal kaynağı belirsiz şüpheli tutarları geldiği yasal kaynağa iade etme veya adli süreçler sonuçlanana dek ticari işlemi dondurma yetkisini elinde tutar.</li>
            </ul>
        </div>

        <div class="space-y-4">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">5. Fiyatlandırma ve Elektronik Faturalandırma Süreci</h3>
            <p>Platformda veya pazar yerinde yayımlanan kurlar/fiyatlar, dijital ürünün anlık piyasa değeridir. Şirketimiz bir aracı kurum veya menkul kıymet brokeri olmadığı için, işleme dayalı bir "aracılık/komisyon faturası" <strong>KESMEZ</strong>.</p>
            <p>Taraflar arasındaki bu satın alım veya tedarik, tamamen ticari bir "Bilişim, Yazılım Teknolojileri ve Dijital Ürün Satışı" mukavelesidir. Vergi Usul Kanunu (VUK) hükümleri ve Gelir İdaresi (GİB) yönergeleri uyarınca; Şirket bu elektronik e-ticaret işlemine (kârına yahut bedeline) karşılık, alıcının onaylı KYC safhasındaki yasal TCKN/VKN bilgilerine tam tutarlı "e-Arşiv / e-Fatura" tanzim etmektedir. Tüm işlemler kurumsal mali kayıt altında gerçekleştirilir.</p>
        </div>

        <div class="space-y-6">
            <h3 class="text-2xl font-bold text-on-surface border-b border-outline-variant/10 pb-4">6. Uyuşmazlık Çözümü</h3>
            <p>İşbu OTC çerçeve sözleşmesinden veya bireysel satış siparişlerinden doğan tüm hukuki itilaflarda İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri kesin yetkili kılınmıştır. Kullanıcı, elektronik ortamda verdiği onay sebebiyle doğacak asil cezai müeyyidelerin şahsi muhatabıdır.</p>
            
            <div class="p-6 rounded-3xl bg-surface-container border border-outline-variant/20">
                <h4 class="text-lg font-bold text-primary mb-2">Yasal Yükümlülük Teyidi</h4>
                <p>Şirket, sadece faturalı, yasalara saygılı ve ispatlanabilir ticaret yapmayı benimser. KYC biyometrik kontrol aşamasını başlatıp platformla temas kuran herkes; eylemlerinden doğan maddi tazminat ve suç yükümlülüklerine (TCK) bizzat katlanacağını net olarak peşinen onaylamıştır.</p>
            </div>
        </div>
`;

let base = fs.readFileSync('kyc-dogrulama.html', 'utf8');

// replace title
base = base.replace('<title>KYC Doğrulama | Anka Exchange</title>', '<title>Kullanım Koşulları | Anka Exchange</title>');

// fix active sidebar links
base = base.replace('data-file="kyc-dogrulama.html" class="active sidebar-link', 'data-file="kyc-dogrulama.html" class="sidebar-link');
base = base.replace('data-file="kullanim-kosullari.html" class="sidebar-link', 'data-file="kullanim-kosullari.html" class="active sidebar-link');

// The active class fix above might need adjusting if it was "active sidebar-link flex items-center..." compared to just "sidebar-link flex items-center..."
// Using a better approach:
base = base.replace(/class="active sidebar-link /g, 'class="sidebar-link ');
base = base.replace(/data-file="kullanim-kosullari.html" class="sidebar-link/g, 'data-file="kullanim-kosullari.html" class="active sidebar-link');

// Remove extra spaces if any
base = base.replace(/class="sidebar-link([^"]*)(\s+)active/g, 'class="active sidebar-link$1');

const blockStartMatch = '<div class="flex-1 max-w-4xl space-y-12 text-on-surface-variant leading-relaxed">';
const blockEndMatch = '</main>';
const startIdx = base.indexOf(blockStartMatch);
const endIdx = base.indexOf(blockEndMatch, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newHtml = base.substring(0, startIdx) + blockStartMatch + '\\n' + content + '\\n    </div>\\n' + base.substring(endIdx);
    fs.writeFileSync('kullanim-kosullari.html', newHtml, 'utf8');
    console.log("kullanim-kosullari.html created");
} else {
    console.log("Could not find blocks");
}
