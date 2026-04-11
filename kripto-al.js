// Tüm Kripto Paraların (Market Cap Top 100) CoinGecko verisi üzerinden listelenmesi
document.addEventListener('DOMContentLoaded', () => {
    const assetsList = document.getElementById('assets-list');
  
    // Keep track of currently open chart
    let currentlyOpenSymbol = null;

    const formatPrice = (price) => {
        const p = parseFloat(price);
        if(p < 0.1) return p.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 5 });
        if(p < 1) return p.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
        return p.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getSparkline = (isPositive) => {
        if(isPositive) {
            return `<svg class="w-full h-full stroke-secondary drop-shadow-[0_0_4px_#69f6b8]" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke-width="2.5"></path></svg>`;
        }
        return `<svg class="w-full h-full stroke-error drop-shadow-[0_0_4px_#ff6e84]" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke-width="2.5"></path></svg>`;
    };

    async function fetchTopAssets() {
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=tr`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        if (assetsList) {
            assetsList.innerHTML = data.map((item, index) => {
              const isPositive = (item.price_change_percentage_24h || 0) >= 0;
              const baseCoin = item.symbol.toUpperCase();
              const iconUrl = item.image;
              const fallbackLogo = './logo.png';
              
              const sparkline = getSparkline(isPositive);
              const textColorClass = isPositive ? 'text-secondary' : 'text-error';
              const sign = isPositive ? '+' : '';
              
              let badgeHtml = '';
              if(index === 0) {
                  badgeHtml = `
                  <span class="bg-[#bd9dff]/10 text-[#bd9dff] text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold flex items-center gap-1 border border-[#bd9dff]/20 shadow-[0_0_8px_rgba(189,157,255,0.3)]">
                    <span class="material-symbols-outlined text-[10px]">star</span>
                    Günün Yıldızı
                  </span>`;
              }

              // TradingView uses BINANCE:SYMBOL+TRY or similar
              // We'll try to use a compatible symbol for the chart
              const chartSymbol = baseCoin + 'TRY';

              return `
                <div class="asset-row-wrapper group flex flex-col bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all overflow-hidden mb-3" data-symbol="${baseCoin}">
                  <div class="flex items-center justify-between p-4 cursor-pointer" onclick="toggleTradingViewChart(this, '${chartSymbol}')">
                    <div class="flex items-center gap-4 flex-1">
                      <div class="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center p-1.5 shadow-inner border border-outline-variant/10">
                        <img src="${iconUrl}" onerror="this.src='${fallbackLogo}'" alt="${baseCoin}" class="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2 mb-0.5">
                           <h4 class="font-headline font-bold text-on-surface leading-none">${baseCoin}</h4>
                           ${badgeHtml}
                        </div>
                        <span class="text-xs text-on-surface-variant tracking-widest font-label uppercase text-primary/60 group-hover:text-primary transition-colors">GRAFİĞİ AÇ / GİZLE</span>
                      </div>
                    </div>
                    <div class="hidden md:block flex-1 text-center px-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="h-8 w-24 relative overflow-hidden mx-auto">
                        ${sparkline}
                      </div>
                    </div>
                    <div class="text-right flex items-center gap-4 justify-end">
                      <div class="tabular-nums tracking-tight">
                        <p class="font-headline font-bold text-on-surface transition-colors duration-300">₺ ${formatPrice(item.current_price)}</p>
                        <p class="text-xs font-bold ${textColorClass} transition-colors duration-300">${sign}${(item.price_change_percentage_24h || 0).toFixed(2)}%</p>
                      </div>
                      <a href="https://c2c.binance.com/en/advertiserDetail?advertiserNo=s0891cd65af033d108117ef9c2f780042" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full text-xs font-bold transition-colors active:scale-95 shadow-[0_0_8px_rgba(189,157,255,0.1)] flex items-center justify-center">Al</a>
                    </div>
                  </div>
                  <div class="chart-container overflow-hidden h-0 transition-all duration-500 bg-[#0c1222]"></div>
                </div>
              `;
            }).join('');
        }
      } catch (error) {
        console.error("CoinGecko data fetch failed:", error);
      }
    }

    window.toggleTradingViewChart = function(element, symbol, forceOpen = false) {
       const wrapper = element.closest('.asset-row-wrapper');
       const chartContainer = wrapper.querySelector('.chart-container');
       const isOpen = chartContainer.style.height !== '' && chartContainer.style.height !== '0px';

       document.querySelectorAll('.chart-container').forEach(c => {
           c.style.height = '0px';
           c.innerHTML = '';
       });

       if (isOpen && !forceOpen) {
           currentlyOpenSymbol = null;
           return;
       }

       currentlyOpenSymbol = symbol;
       chartContainer.style.height = '500px';
       chartContainer.innerHTML = `<div class="tradingview-widget-container h-full w-full border-t border-surface-container-high relative"><div id="tv_${symbol}" class="h-full w-full"></div></div>`;

       new window.TradingView.widget({
          "autosize": true,
          "symbol": "BINANCE:" + symbol,
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "tr",
          "enable_publishing": false,
          "backgroundColor": "#0c1222",
          "gridColor": "rgba(189, 157, 255, 0.05)",
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": false,
          "container_id": "tv_" + symbol
       });
    };

    const tvScript = document.createElement('script');
    tvScript.src = "https://s3.tradingview.com/tv.js";
    document.head.appendChild(tvScript);

    const alSearch = document.getElementById('al-search');
    if (alSearch) {
        alSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const rows = assetsList.querySelectorAll('.asset-row-wrapper');
            rows.forEach(row => {
                const symbol = row.getAttribute('data-symbol').toLowerCase();
                row.style.display = symbol.includes(query) ? 'flex' : 'none';
            });
        });
    }

    // Initial Fetch
    fetchTopAssets();

    // Polling every 60 seconds
    setInterval(fetchTopAssets, 60000);
});
