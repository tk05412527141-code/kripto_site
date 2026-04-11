// Tüm Kripto Paraların (Top 50 USDT) Binance Market verisi üzerinden listelenmesi
document.addEventListener('DOMContentLoaded', () => {
    const assetsList = document.getElementById('assets-list');
  
    // Keep track of currently open chart
    let currentlyOpenSymbol = null;
    let wsConnection = null;

    const formatPrice = (priceStr) => {
        const p = parseFloat(priceStr);
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
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr`);
        const data = await response.json();
        
        const usdtPairs = data.filter(item => item.symbol.endsWith('USDT') && !['USDCUSDT', 'FDUSDUSDT', 'TUSDUSDT'].includes(item.symbol));
        usdtPairs.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));
        const top50 = usdtPairs.slice(0, 50);
  
        if (assetsList) {
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

              return `
                <div class="asset-row-wrapper group flex flex-col bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all overflow-hidden mb-3" data-symbol="${item.symbol}">
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
                      <a href="https://www.binance.com/en/qr/dplk3db3ffc43cab42d9b22c7c885ac84202" target="_blank" onclick="event.stopPropagation()" class="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full text-xs font-bold transition-colors active:scale-95 shadow-[0_0_8px_rgba(189,157,255,0.1)] flex items-center justify-center">Al</a>
                    </div>
                  </div>
                  <div class="chart-container overflow-hidden h-0 transition-all duration-500 bg-[#0c1222]"></div>
                </div>
              `;
            }).join('');
        }

        if (currentlyOpenSymbol) {
           const rowToOpen = document.querySelector(`.asset-row-wrapper[data-symbol="${currentlyOpenSymbol}"]`);
           if(rowToOpen) toggleTradingViewChart(rowToOpen.firstElementChild, currentlyOpenSymbol, true);
        }

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
                const priceEl = document.getElementById(`price-${item.s}`);
                if (priceEl) {
                    const newPrice = parseFloat(item.c);
                    const oldPriceStr = priceEl.getAttribute('data-price') || "0";
                    const oldPrice = parseFloat(oldPriceStr);
                    priceEl.textContent = '$' + formatPrice(newPrice);
                    priceEl.setAttribute('data-price', newPrice);
                    if (newPrice > oldPrice && oldPrice !== 0) {
                        priceEl.style.color = '#69f6b8';
                        setTimeout(() => priceEl.style.color = '', 300);
                    } else if (newPrice < oldPrice && oldPrice !== 0) {
                        priceEl.style.color = '#ff6e84';
                        setTimeout(() => priceEl.style.color = '', 300);
                    }
                    const percEl = document.getElementById(`perc-${item.s}`);
                    const sparkEl = document.getElementById(`spark-${item.s}`);
                    if (percEl) {
                        const isPositive = parseFloat(item.P) >= 0;
                        const sign = isPositive ? '+' : '';
                        percEl.textContent = sign + parseFloat(item.P).toFixed(2) + '%';
                        percEl.className = `text-xs font-bold transition-colors duration-300 ${isPositive ? 'text-secondary' : 'text-error'}`;
                        if (sparkEl) sparkEl.innerHTML = getSparkline(isPositive);
                    }
                }
            });
        };
        wsConnection.onclose = () => setTimeout(initWebSocket, 3000);
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

    fetchTopAssets();
});

// ============================================================
// Aktif P2P İlanları — Advertiser Özel Entegrasyon
// ============================================================
(function initP2PListings() {
    const ADVERTISER_NO  = 's0891cd65af033d108117ef9c2f780042';
    const ADVERTISER_URL = `https://c2c.binance.com/en/advertiserDetail?advertiserNo=${ADVERTISER_NO}`;
    const ASSETS         = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'TRX'];

    const iconUrl = coin => `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${coin.toLowerCase()}.png`;

    const formatTRY = price => {
        const p = parseFloat(price);
        if (p >= 1000000) return '₺ ' + p.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
        if (p >= 10000)   return '₺ ' + p.toLocaleString('tr-TR', { maximumFractionDigits: 0 });
        if (p >= 1)       return '₺ ' + p.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return '₺ ' + p.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    };

    const tradeLabel = type => type === 'SELL' ? 'Satın Al' : 'Satış Yap';
    const tradeBtnClass = type => type === 'SELL' ? 'bg-primary text-on-primary-container hover:bg-primary-dim' : 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20';

    async function fetchAdvertiserAds(asset, tradeType) {
        const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Clienttype': 'web' },
            body: JSON.stringify({ page: 1, rows: 10, publisherType: null, asset: asset, fiat: 'TRY', tradeType: tradeType, merchantCheck: false, payTypes: [], advertiserNo: ADVERTISER_NO })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json.data || [];
    }

    function renderEmpty(container) {
        container.innerHTML = `<div class="col-span-full py-20 flex flex-col items-center justify-center gap-5 opacity-60"><div class="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center"><span class="material-symbols-outlined text-3xl text-on-surface-variant">store</span></div><div class="text-center px-4"><p class="font-bold text-on-surface text-base mb-1">Şu an aktif P2P ilanı bulunmuyor</p><p class="text-on-surface-variant text-xs max-w-xs mx-auto text-center">Binance P2P sayfamızdaki "Normal" ve "Çevrimiçi" ilanlar buraya otomatik yansır.</p></div><a href="${ADVERTISER_URL}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-6 py-3 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-sm rounded-full transition-all"><span class="material-symbols-outlined text-sm">open_in_new</span>Tüm İlanları Binance'de Gör</a></div>`;
    }

    function renderError(container, msg) {
        container.innerHTML = `<div class="col-span-full py-16 flex flex-col items-center justify-center gap-4 opacity-70"><span class="material-symbols-outlined text-4xl text-warning">report_problem</span><div class="text-center px-4"><p class="font-bold text-sm text-on-surface mb-1">Bağlantı Sorunu</p><p class="text-[11px] text-on-surface-variant max-w-xs">İlanlar doğrudan Binance'den çekilemedi (CORS). Lütfen Binance sayfamızı ziyaret edin.</p></div><a href="${ADVERTISER_URL}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-xs rounded-full transition-all shadow-lg hover:shadow-primary/20"><span class="material-symbols-outlined text-sm">open_in_new</span>İlanları Binance'de Aç</a></div>`;
    }

    function renderAds(container, ads) {
        if (!ads || ads.length === 0) { renderEmpty(container); return; }
        container.innerHTML = ads.map(item => {
            const info = item.adv || {};
            const asset = info.asset || '?';
            const price = formatTRY(info.price);
            const tradeType  = info.tradeType || 'SELL';
            const priceLabel = tradeType === 'SELL' ? 'Satış Fiyatı' : 'Alış Fiyatı';
            const minAmt  = info.minSingleTransAmount ? formatTRY(info.minSingleTransAmount)  : null;
            const maxAmt  = info.maxSingleTransAmount ? formatTRY(info.maxSingleTransAmount)  : null;
            const limitHtml = (minAmt || maxAmt) ? `<p class="text-[11px] font-medium text-on-surface-variant/80 mt-1">${minAmt || '0'} — ${maxAmt || '∞'}</p>` : '';
            const methods = (info.tradeMethods || []).map(m => `<span class="text-[10px] bg-primary/5 border border-primary/10 text-primary/80 px-2 py-0.5 rounded-md font-medium">${m.tradeMethodShortName || m.tradeMethodName}</span>`).join('');
            return `<div class="p-6 bg-surface-container-low rounded-[2rem] border border-outline-variant/10 hover:border-primary/40 transition-all relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] duration-500 cursor-pointer" onclick="window.open('${ADVERTISER_URL}','_blank','noopener,noreferrer')"><div class="absolute -right-8 -top-8 w-32 h-32 opacity-10 bg-primary rounded-full blur-3xl group-hover:opacity-30 transition-all duration-700 pointer-events-none"></div><div class="flex items-center justify-between mb-5 relative z-10"><div class="flex items-center gap-3"><div class="w-11 h-11 rounded-2xl bg-surface-container-highest flex items-center justify-center p-2 shadow-inner border border-outline-variant/5 group-hover:scale-110 transition-transform duration-500"><img src="${iconUrl(asset)}" alt="${asset}" class="w-full h-full object-contain" onerror="this.src='./logo.png'" /></div><div><span class="font-headline font-bold text-on-surface text-xl">${asset}</span><div class="flex items-center gap-1.5 mt-0.5"><span class="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#69f6b8]"></span><span class="text-[10px] font-extrabold text-secondary uppercase tracking-widest">AKTİF İLAN</span></div></div></div><span class="text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg">TRY</span></div><div class="mb-4 relative z-10 translate-y-0 group-hover:-translate-y-1 transition-transform duration-500"><p class="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold mb-1 opacity-70">${priceLabel}</p><div class="text-3xl font-bold font-headline text-on-surface tracking-tight group-hover:text-primary transition-colors">${price}</div>${limitHtml}</div><div class="flex flex-wrap gap-1.5 mb-5 relative z-10 min-h-[1.5rem]">${methods}</div><div class="mt-4 relative z-10"><button onclick="event.stopPropagation(); window.open('${ADVERTISER_URL}','_blank','noopener,noreferrer')" class="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg group-hover:shadow-primary/20 ${tradeBtnClass(tradeType)}"><span class="material-symbols-outlined text-xl">shopping_cart</span>${tradeLabel(tradeType)}</button></div></div>`;
        }).join('');
    }

    async function loadListings() {
        const container = document.getElementById('p2p-buy-cards');
        if (!container) return;

        let fetchFailed = false;
        let lastError = '';

        try {
            const allAds = [];
            
            // Try fetching SELL ads
            for (const asset of ASSETS) {
                try {
                    const ads = await fetchAdvertiserAds(asset, 'SELL');
                    if (ads && ads.length > 0) allAds.push(...ads);
                } catch (err) {
                    fetchFailed = true;
                    lastError = err.message;
                }
            }
            
            // Fallback to BUY ads if no SELL ads found and no fetch failure yet
            if (allAds.length === 0 && !fetchFailed) {
              for (const asset of ASSETS) {
                try {
                    const ads = await fetchAdvertiserAds(asset, 'BUY');
                    if (ads && ads.length > 0) allAds.push(...ads);
                } catch (err) {
                    fetchFailed = true;
                    lastError = err.message;
                }
              }
            }

            if (fetchFailed && allAds.length === 0) {
                renderError(container, lastError);
            } else {
                renderAds(container, allAds);
            }
        } catch (err) {
            renderError(container, err.message);
        }

        setTimeout(loadListings, 30000);
    }
    loadListings();
})();
