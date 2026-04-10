// Tüm Kripto Paraların (Top 50 USDT) Binance Market verisi üzerinden listelenmesi
document.addEventListener('DOMContentLoaded', () => {
    const assetsList = document.getElementById('assets-list');
  
    // Keep track of currently open chart
    let currentlyOpenSymbol = null;
    let wsConnection = null;

    const formatPrice = (priceStr) => {
        const p = parseFloat(priceStr);
        if(p < 0.1) return p.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 5 });
        if(p < 1) return p.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
        return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getSparkline = (isPositive) => {
        if(isPositive) {
            return `<svg class="w-full h-full stroke-secondary drop-shadow-[0_0_4px_#69f6b8]" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke-width="2.5"></path></svg>`;
        }
        return `<svg class="w-full h-full stroke-error drop-shadow-[0_0_4px_#ff6e84]" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke-width="2.5"></path></svg>`;
    };

    async function fetchTopAssets() {
      try {
        // Fetch all 24hr tickers from Binance without any specific symbols
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr`);
        const data = await response.json();
        
        const usdtPairs = data.filter(item => item.symbol.endsWith('USDT') && !['USDCUSDT', 'FDUSDUSDT', 'TUSDUSDT'].includes(item.symbol));
        usdtPairs.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));
        const top50 = usdtPairs.slice(0, 50);
  
        assetsList.innerHTML = top50.map((item, index) => {
          const isPositive = parseFloat(item.priceChangePercent) >= 0;
          const baseCoin = item.symbol.replace('USDT', '');
          const iconUrl = `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${baseCoin.toLowerCase()}.png`;
          const fallbackLogo = './logo.png';
          
          const sparkline = getSparkline(isPositive);
          const textColorClass = isPositive ? 'text-secondary' : 'text-error';
          const sign = isPositive ? '+' : '';
          
          let badgeHtml = '';
          if(index === 0) {
              badgeHtml = `
              <span class="bg-[#bd9dff]/10 text-[#bd9dff] text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold flex items-center gap-1 border border-[#bd9dff]/20 shadow-[0_0_8px_rgba(189,157,255,0.3)]">
                <span class="material-symbols-outlined text-[10px]" data-icon="star">star</span>
                Günün Yıldızı
              </span>`;
          }

          // Satır için HTML oluşturma
          return `
            <div class="asset-row-wrapper group flex flex-col bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all overflow-hidden mb-3" data-symbol="${item.symbol}">
              
              <!-- Ana Liste Satırı (Tıklanabilir) -->
              <div class="flex items-center justify-between p-4 cursor-pointer" onclick="toggleTradingViewChart(this, '${item.symbol}')">
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
                  <div class="h-8 w-24 relative overflow-hidden mx-auto" id="spark-${item.symbol}">
                    ${sparkline}
                  </div>
                </div>
                
                <div class="text-right flex items-center gap-4 justify-end">
                  <div class="tabular-nums tracking-tight">
                    <p id="price-${item.symbol}" class="font-headline font-bold text-on-surface transition-colors duration-300" data-price="${item.lastPrice}">$${formatPrice(item.lastPrice)}</p>
                    <p id="perc-${item.symbol}" class="text-xs font-bold ${textColorClass} transition-colors duration-300">${sign}${parseFloat(item.priceChangePercent).toFixed(2)}%</p>
                  </div>
                  <button class="bg-error-dim/10 text-error-dim border border-error-dim/30 hover:bg-error-dim/20 text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-bold transition-colors active:scale-95 shadow-[0_0_8px_rgba(189,157,255,0.1)] pointer-events-none">Sat</button>
                </div>
              </div>

              <!-- Gizli TradingView Grafik Alanı (Accordion) -->
              <div class="chart-container overflow-hidden h-0 transition-all duration-500 bg-[#0c1222]">
                  <!-- TV Widget will be injected here -->
              </div>
            </div>
          `;
        }).join('');

        // Re-open previously opened chart if refreshed
        if (currentlyOpenSymbol) {
           const rowToOpen = document.querySelector(`.asset-row-wrapper[data-symbol="${currentlyOpenSymbol}"]`);
           if(rowToOpen) toggleTradingViewChart(rowToOpen.firstElementChild, currentlyOpenSymbol, true);
        }

        // Initialize WebSocket for live updates
        initWebSocket();

      } catch (error) {
        console.error("Binance varlık datası çekilirken hata oluştu:", error);
      }
    }

    function initWebSocket() {
        if(wsConnection) wsConnection.close();
        wsConnection = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        
        wsConnection.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            data.forEach(item => {
                // item.s (symbol), item.c (last price), item.P (price change percent)
                const priceEl = document.getElementById(`price-${item.s}`);
                if (priceEl) {
                    const newPrice = parseFloat(item.c);
                    const oldPriceStr = priceEl.getAttribute('data-price') || "0";
                    const oldPrice = parseFloat(oldPriceStr);
                    
                    priceEl.textContent = '$' + formatPrice(newPrice);
                    priceEl.setAttribute('data-price', newPrice);
                    
                    // Flash animation for price update
                    if (newPrice > oldPrice && oldPrice !== 0) {
                        priceEl.style.color = '#69f6b8'; // green
                        setTimeout(() => priceEl.style.color = '', 300);
                    } else if (newPrice < oldPrice && oldPrice !== 0) {
                        priceEl.style.color = '#ff6e84'; // red
                        setTimeout(() => priceEl.style.color = '', 300);
                    }

                    const percEl = document.getElementById(`perc-${item.s}`);
                    const sparkEl = document.getElementById(`spark-${item.s}`);
                    if (percEl) {
                        const isPositive = parseFloat(item.P) >= 0;
                        const sign = isPositive ? '+' : '';
                        percEl.textContent = sign + parseFloat(item.P).toFixed(2) + '%';
                        percEl.className = `text-xs font-bold transition-colors duration-300 ${isPositive ? 'text-secondary' : 'text-error'}`;
                        
                        // Update sparkline dynamicly
                        if (sparkEl) {
                           sparkEl.innerHTML = getSparkline(isPositive);
                        }
                    }
                }
            });
        };
        
        wsConnection.onclose = () => {
            setTimeout(initWebSocket, 3000); // Reconnect on drop
        };
    }
  
    // Global TV Chart Toggler
    window.toggleTradingViewChart = function(element, symbol, forceOpen = false) {
       const wrapper = element.closest('.asset-row-wrapper');
       const chartContainer = wrapper.querySelector('.chart-container');
       
       const isOpen = chartContainer.style.height !== '' && chartContainer.style.height !== '0px';

       // Tuşa basıldığında diğer açık grafikleri tamamen kapat 
       document.querySelectorAll('.chart-container').forEach(c => {
           c.style.height = '0px';
           c.innerHTML = '';
       });

       if (isOpen && !forceOpen) {
           // Sadece kapatmak istiyordu
           currentlyOpenSymbol = null;
           return;
       }

       // Grafiği Aç
       currentlyOpenSymbol = symbol;
       chartContainer.style.height = '500px';
       chartContainer.innerHTML = `
        <div class="tradingview-widget-container h-full w-full border-t border-surface-container-high relative">
          <div id="tv_${symbol}" class="h-full w-full"></div>
        </div>`;

       // TV Script Injection
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

    // Include TradingView Library script into document
    const tvScript = document.createElement('script');
    tvScript.src = "https://s3.tradingview.com/tv.js";
    document.head.appendChild(tvScript);

    // Initial fetch only once, no setInterval
    fetchTopAssets();
});
