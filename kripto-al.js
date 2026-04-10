// Tüm Kripto Paraların (Top 50 USDT) Binance Market verisi üzerinden listelenmesi
document.addEventListener('DOMContentLoaded', () => {
    const assetsList = document.getElementById('assets-list');
  
    async function fetchTopAssets() {
      try {
        // Fetch all 24hr tickers from Binance without any specific symbols
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr`);
        const data = await response.json();
        
        // Filter out non-USDT pairs and stable coins (e.g., FDUSDUSDT, USDCUSDT) if possible
        // We'll primarily focus on general USDT pairs and sort by Quote Volume descending
        const usdtPairs = data.filter(item => item.symbol.endsWith('USDT') && !['USDCUSDT', 'FDUSDUSDT', 'TUSDUSDT'].includes(item.symbol));
        
        // Sort by quoteVolume (most traded first) and slice top 50
        usdtPairs.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));
        const top50 = usdtPairs.slice(0, 50);

        const formatPrice = (priceStr) => {
            const p = parseFloat(priceStr);
            if(p < 0.1) return p.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 5 });
            if(p < 1) return p.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 });
            return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };
  
        // Generic Shared Sparkline logic to mimic visual flow
        const greenLine = `<svg class="w-full h-full stroke-secondary drop-shadow-[0_0_4px_#69f6b8]" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke-width="2.5"></path></svg>`;
        const redLine = `<svg class="w-full h-full stroke-error drop-shadow-[0_0_4px_#ff6e84]" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke-width="2.5"></path></svg>`;
  
        assetsList.innerHTML = top50.map((item, index) => {
          const isPositive = parseFloat(item.priceChangePercent) >= 0;
          const baseCoin = item.symbol.replace('USDT', '');
          const iconUrl = `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${baseCoin.toLowerCase()}.png`;
          const fallbackLogo = './logo.png';
          
          const sparkline = isPositive ? greenLine : redLine;
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
            <div class="group flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container transition-all cursor-pointer border border-transparent hover:border-primary/20">
              <div class="flex items-center gap-4 flex-1">
                <div class="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center p-1.5 shadow-inner border border-outline-variant/10">
                  <img src="${iconUrl}" onerror="this.src='${fallbackLogo}'" alt="${baseCoin}" class="w-full h-full object-contain" />
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-0.5">
                    <h4 class="font-headline font-bold text-on-surface leading-none">${baseCoin}</h4>
                    ${badgeHtml}
                  </div>
                  <span class="text-xs text-on-surface-variant tracking-widest font-label uppercase">${baseCoin}</span>
                </div>
              </div>
              
              <div class="hidden md:block flex-1 text-center px-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <div class="h-8 w-24 relative overflow-hidden mx-auto">
                  ${sparkline}
                </div>
              </div>
              
              <div class="text-right flex items-center gap-4 justify-end">
                <div class="tabular-nums tracking-tight">
                  <p class="font-headline font-bold text-on-surface">$${formatPrice(item.lastPrice)}</p>
                  <p class="text-xs font-bold ${textColorClass}">${sign}${parseFloat(item.priceChangePercent).toFixed(2)}%</p>
                </div>
                <button class="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full text-xs font-bold transition-colors active:scale-95 shadow-[0_0_8px_rgba(189,157,255,0.1)]">Al</button>
              </div>
            </div>
          `;
        }).join('');
      } catch (error) {
        console.error("Binance varlık datası çekilirken hata oluştu:", error);
        assetsList.innerHTML = `<div class="p-6 text-center text-error border border-error/20 rounded-xl bg-error/5">Piyasa verileri alınamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.</div>`;
      }
    }
  
    // Initial fetch
    fetchTopAssets();
    
    // Refresh every 30 seconds to keep market data live entirely
    setInterval(fetchTopAssets, 30000);
});
