/**
 * Anka Exchange - Floating Candlestick Matrix Background
 */

document.addEventListener('DOMContentLoaded', () => {
    // Canvas'ı oluştur ve body'nin en arkasına sabitle
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none'; // Tıklamaları engellememesi için
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Mum parçacıkları listesi
    let candles = [];
    const candleCount = window.innerWidth > 768 ? 120 : 60; // Mobilde daha az mum (Performans için)
    
    // Fare pozisyonu
    let mouse = { x: undefined, y: undefined };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Renk Temaları
    let colors = {
        bull: '105, 246, 184', // Green (Secondary)
        bear: '255, 110, 132'  // Red (Error)
    };
    
    function updateColors() {
        const rootStyles = getComputedStyle(document.documentElement);
        // RGB Stringlerini CSS değişkenlerinden parçalayarak çıkar
        const cGreen = rootStyles.getPropertyValue('--color-secondary').replace(/[^\d,\s]/g, '').trim().split(/\s+/).join(',');
        const cRed = rootStyles.getPropertyValue('--color-error').replace(/[^\d,\s]/g, '').trim().split(/\s+/).join(',');
        
        if (cGreen && cGreen.length > 5) colors.bull = cGreen;
        if (cRed && cRed.length > 5) colors.bear = cRed;
    }

    // Temanın anlık değişmesine adapte ol
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        updateColors();
    }
    
    window.addEventListener('resize', resize);
    
    // Mum (Candlestick) Sınıfı
    class Candlestick {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            // Z-Depth parralax etkisi (0.2 en arkada küçük, 1.0 en önde büyük ve hızlı)
            this.z = Math.random() * 0.8 + 0.2; 
            this.w = this.z * 8 + 1; // 1px ile 9px kalınlığında gövde
            
            // Yükseklik rastgele (Z'ye göre scale edilmiş)
            this.h = (Math.random() * 40 + 10) * this.z; 
            
            // Çizgi (Wick) Gövdeden daha uzun olmalı
            this.wickLength = this.h + (Math.random() * 50 + 15) * this.z;
            this.wickOffset = Math.random() * (this.wickLength - this.h) * 0.7; // Fitil ile gövde hizalaması
            
            this.x = Math.random() * width;
            // İlk açılışta ekrana dağınık yerleştir, sonrasında sadece alttan çıksın
            this.y = initial ? Math.random() * (height + 200) - 100 : height + 50; 
            
            // Hız: Piyasayı temsil ettiği için yukarıya doğru uçan koinler (Moon effect)
            this.vy = -(Math.random() * 0.9 + 0.2) * this.z; 
            this.vx = 0; // Yatay hız (Fare ile etkilenecek)
            
            // %50 olasılıkla Yeşil(Yükseliş) veya Kırmızı(Düşüş)
            this.type = Math.random() > 0.5 ? 'bull' : 'bear'; 
            
            // Arkadakiler çok daha silik, öndekiler daha belirgin
            this.opacity = this.z * 0.45; 
        }

        update() {
            // Fare etkileşimi: Finans piyasasındaki dalgalanmayı manipüle etmek
            let forceX = 0;
            if (mouse.x !== undefined && mouse.y !== undefined) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - (this.y + this.wickLength / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Fare yakınındaysa yatay hafif ivme (Rüzgar/Dalgalanma etkisi)
                if (distance < 150) {
                    forceX = (dx / distance) * -0.2 * this.z; 
                }
            }

            // Hızı güncelle ve sınırlandır
            this.vx += (forceX - this.vx) * 0.05; // Yavaşça normalleşme
            this.x += this.vx;
            this.y += this.vy;
            
            // En tepeye ulaştığında ve tamamen ekrandan çıkınca aşağıdan tekrar başlat
            if (this.y + this.wickLength < -50) {
                this.reset(false);
            }
            
            // Ekranın sağına/soluna kayarsa karşıdan geri çıkar
            if (this.x > width + 20) this.x = -20;
            if (this.x < -20) this.x = width + 20;
        }

        draw() {
            const rgb = this.type === 'bull' ? colors.bull : colors.bear;
            const cx = this.x + this.w / 2;
            
            // Fitil (Wick) Çizimi - Daha ince
            ctx.beginPath();
            ctx.moveTo(cx, this.y);
            ctx.lineTo(cx, this.y + this.wickLength);
            ctx.strokeStyle = `rgba(${rgb}, ${this.opacity * 0.7})`;
            // Derinliğe göre fitil kalınlığı
            ctx.lineWidth = Math.max(1, this.w * 0.15);
            ctx.stroke();
            
            // Mum Gövdesi (Body) Çizimi
            ctx.fillStyle = `rgba(${rgb}, ${this.opacity})`;
            ctx.fillRect(this.x, this.y + this.wickOffset, this.w, this.h);
        }
    }

    function init() {
        resize();
        candles = [];
        for (let i = 0; i < candleCount; i++) {
            candles.push(new Candlestick());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        
        // Ekranı temizle (Şeffaflıkla silerek Motion Blur/İz bırakma efekti yarat)
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < candles.length; i++) {
            candles[i].update();
            candles[i].draw();
        }
    }

    init();
    setTimeout(animate, 100);
});
