document.addEventListener('DOMContentLoaded', () => {
    const htmlTag = document.documentElement;
    // Check local storage or default to dark
    const savedTheme = localStorage.getItem('theme');
    
    // Uygulama varsayılan olarak karanlıktır, kayırlı 'light' varsa aydınlığa geçir
    if (savedTheme === 'light') {
        htmlTag.classList.remove('dark');
    } else {
        htmlTag.classList.add('dark');
        localStorage.setItem('theme', 'dark'); // initialize
    }

    // İkon güncelleyici yardımcı fonksiyon
    const updateIcons = (isDark) => {
        document.querySelectorAll('.theme-toggle-btn .material-symbols-outlined').forEach(span => {
            span.textContent = isDark ? 'light_mode' : 'dark_mode';
        });
    };
    
    updateIcons(htmlTag.classList.contains('dark'));

    // Attach click events to all buttons with class 'theme-toggle-btn'
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            htmlTag.classList.toggle('dark');
            const isDark = htmlTag.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            updateIcons(isDark);
            
            // TradingView Widget yüklüyse ve açıksa temayı dinamik olarak yenile
            if(window.currentlyOpenSymbol && window.toggleTradingViewChart) {
                 const rowToOpen = document.querySelector(`.asset-row-wrapper[data-symbol="${window.currentlyOpenSymbol}"]`);
                 if(rowToOpen) {
                     window.toggleTradingViewChart(rowToOpen.firstElementChild, window.currentlyOpenSymbol, true);
                 }
            }
        });
    });
});
