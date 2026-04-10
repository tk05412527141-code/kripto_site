// Live API Data Loading for Virelix Market Prices & P2P
document.addEventListener('DOMContentLoaded', () => {
    const marketList = document.getElementById('market-list');
    const p2pCardsContainer = document.getElementById('p2p-cards');
  
    async function fetchLiveCryptoData() {
      try {
        const symbols = '["USDTTRY","BTCTRY","ETHTRY","BNBTRY"]';
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`);
        const data = await response.json();
        
        const formatPrice = (priceStr) => {
          const p = parseFloat(priceStr);
          return p >= 1000 ? p.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : p.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };
  
        const formatVol = (volStr) => {
          const v = parseFloat(volStr);
          return (v / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M';
        };
  
        // Shared Sparkline logic for green (trend up) vs red (trend down)
        const greenLine = `<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke="#69f6b8" stroke-width="2.5"></path></svg>`;
        const redLine = `<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke="#ff6e84" stroke-width="2.5"></path></svg>`;
  
        const mappedData = data.map(item => {
          const isPositive = parseFloat(item.priceChangePercent) >= 0;
          const baseCoin = item.symbol.replace('TRY', '');
          
          let iconUrl = '';
          if (baseCoin === 'USDT') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png';
          else if (baseCoin === 'BTC') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png';
          else if (baseCoin === 'ETH') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png';
          else if (baseCoin === 'BNB') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png';
  
          return {
            pair: item.symbol.replace('TRY', '/TRY'),
            baseCoin: baseCoin,
            icon: iconUrl,
            price: formatPrice(item.lastPrice),
            rawPrice: parseFloat(item.lastPrice), 
            change: (isPositive ? '+' : '') + parseFloat(item.priceChangePercent).toFixed(2) + '%',
            volume: formatVol(item.volume),
            textColorClass: isPositive ? 'text-secondary' : 'text-error',
            sparkline: isPositive ? greenLine : redLine
          };
        });
  
        // Render Market List with Tailwind Space Theme
        if (marketList) {
          marketList.innerHTML = mappedData.map(item => `
            <div class="bg-surface-container-low p-4 rounded-xl flex items-center justify-between hover:bg-surface-container transition-all group cursor-pointer border-l-2 border-transparent hover:border-primary/40">
              <div class="flex-1 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center p-1.5 shadow-inner">
                  <img src="${item.icon}" alt="${item.baseCoin}" class="w-full h-full object-contain drop-shadow-md" />
                </div>
                <div>
                  <div class="font-bold text-on-surface font-headline tracking-tight">${item.pair}</div>
                  <div class="text-[10px] text-outline font-medium tracking-wide">Vol: ${item.volume}</div>
                </div>
              </div>
              
              <div class="flex-1 hidden md:flex justify-center px-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <div class="h-8 w-20 relative overflow-hidden">
                  ${item.sparkline}
                </div>
              </div>
              
              <div class="flex-1 text-right">
                <div class="font-bold text-on-surface tabular-nums tracking-tight">₺ ${item.price}</div>
                <div class="text-xs font-bold ${item.textColorClass}">${item.change}</div>
              </div>
            </div>
          `).join('');
        }
        
        // Render P2P Cards with Tailwind Neon/Glass vibes
        if (p2pCardsContainer) {
            p2pCardsContainer.innerHTML = mappedData.map(coinData => {
                const rawMarkup = coinData.rawPrice * 1.003;
                const p2pPrice = rawMarkup > 1000 ? rawMarkup.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : rawMarkup.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                return `
                 <div class="glass-card p-6 rounded-2xl border border-outline-variant/10 relative overflow-hidden group hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                    <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
                    
                    <div class="flex justify-between items-center mb-6 relative z-10">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-full bg-[#141f38] p-1 flex items-center justify-center shadow-md border border-white/5">
                            <img src="${coinData.icon}" alt="${coinData.baseCoin}" class="w-full h-full object-contain">
                         </div>
                         <span class="font-headline font-bold text-on-surface tracking-tight">${coinData.baseCoin}</span>
                      </div>
                      <div class="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 text-secondary rounded-md text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
                          <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                          Canlı
                      </div>
                    </div>
                    
                    <div class="mb-5 relative z-10">
                      <div class="text-[10px] text-outline font-medium uppercase tracking-widest mb-1.5">Güncel S. Kuru</div>
                      <div class="text-3xl font-bold font-headline text-on-surface tracking-tighter drop-shadow-sm">₺ ${p2pPrice}</div>
                    </div>
                    
                    <button class="w-full bg-gradient-to-tr from-error-dim/20 to-error-dim/5 hover:from-error-dim/30 hover:to-error-dim/10 text-error border border-error-dim/30 py-3 rounded-full font-bold transition-all text-sm relative z-10 flex items-center justify-center gap-2 active:scale-[0.98] drop-shadow-sm">
                      <span class="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                      ${coinData.baseCoin} Sat
                    </button>
                 </div>
                `;
            }).join('');
        }
      } catch (error) {
        console.error("Error fetching Binance data:", error);
      }
    }
  
    fetchLiveCryptoData();
    setInterval(fetchLiveCryptoData, 30000);
});
