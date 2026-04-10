/**
 * Anka Exchange - Interactive 3D Plexus Background
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
    
    // Parçacık listesi
    let particles = [];
    const particleCount = 70; // Sayfadaki nokta sayısı
    const connectionDistance = 120; // Noktalar arası çizgi oluşma mesafesi
    const mouseConnectionDistance = 180; // Fare ile noktalar arası ilişki
    
    // Fare pozisyonunu takip et
    let mouse = {
        x: undefined,
        y: undefined
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Tema Değişimlerini İzlemek İçin
    let primaryColorRgb = '189, 157, 255'; 
    let secondaryColorRgb = '105, 246, 184';
    
    function updateColors() {
        const rootStyles = getComputedStyle(document.documentElement);
        // RGB değerlerini CSS variables'dan çek (%100 temizleyerek)
        const pColor = rootStyles.getPropertyValue('--color-primary').replace(/[^\d,\s]/g, '').trim().split(/\s+/).join(',');
        const sColor = rootStyles.getPropertyValue('--color-secondary').replace(/[^\d,\s]/g, '').trim().split(/\s+/).join(',');
        
        if (pColor && pColor.length > 5) primaryColorRgb = pColor;
        if (sColor && sColor.length > 5) secondaryColorRgb = sColor;
    }

    // MutationObserver ile temanın dark/light geçişlerini anında yakala
    const observer = new MutationObserver(() => {
        updateColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Ekran boyutunu güncelle
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        updateColors();
    }
    
    window.addEventListener('resize', resize);
    
    // Parçacık Sınıfı
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 0.5;
            // Bazı noktalar mor (%70), bazıları yeşil (%30)
            this.type = Math.random() > 0.3 ? 'primary' : 'secondary';
        }

        update() {
            // Fare etkileşimi: Fareden nazikçe kaçma effekti
            if (mouse.x !== undefined && mouse.y !== undefined) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseConnectionDistance / 2) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseConnectionDistance / 2 - distance) / (mouseConnectionDistance / 2);
                    
                    this.vx -= forceDirectionX * force * 0.05;
                    this.vy -= forceDirectionY * force * 0.05;
                }
            }

            // Normal hareket ve sürtünme limiti
            this.x += this.vx;
            this.y += this.vy;
            
            // Hız limiti uygulama
            const maxSpeed = 1.5;
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed > maxSpeed) {
                this.vx = (this.vx / currentSpeed) * maxSpeed;
                this.vy = (this.vy / currentSpeed) * maxSpeed;
            }

            // Kenarlara çarpınca geri dön
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const colorRgb = this.type === 'primary' ? primaryColorRgb : secondaryColorRgb;
            ctx.fillStyle = `rgba(${colorRgb}, 0.5)`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        
        // Temaya göre arkaplanı hafif şeffaf bırak ki iz efekti kalsın
        ctx.clearRect(0, 0, width, height);

        // Çizgileri çiz
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Parçacıklar arası bağlar
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    // Rengi ağırlıklı olan noktaya göre belirle
                    const rgb = particles[i].type === 'primary' ? primaryColorRgb : secondaryColorRgb;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${rgb}, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
            
            // Fare ile parçacıklar arası bağlar
            if (mouse.x !== undefined && mouse.y !== undefined) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseConnectionDistance) {
                    const opacity = 1 - (distance / mouseConnectionDistance);
                    const rgb = particles[i].type === 'primary' ? primaryColorRgb : secondaryColorRgb;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${rgb}, ${opacity * 0.4})`; // Fare bağlarında daha belirgin parlaklık
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Sayfa kenarına mouse gidince takibi bırak
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    // Gecikmeli başlatarak değişkenlerin set olmasını bekle
    setTimeout(animate, 100);
});
