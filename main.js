// Live API Data Loading for Virelix Market Prices & P2P
document.addEventListener('DOMContentLoaded', () => {
    const marketList = document.getElementById('market-list');
    const p2pCardsContainer = document.getElementById('p2p-cards');
    let wsConnection = null;
    const trackedSymbols = ['USDTTRY', 'BTCTRY', 'ETHTRY', 'BNBTRY'];
  
    const formatPrice = (priceStr) => {
      const p = parseFloat(priceStr);
      return p >= 1000 ? p.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : p.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatVol = (volStr) => {
      const v = parseFloat(volStr);
      return (v / 1000000).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M';
    };

    const getSparkline = (isPositive) => {
      if (isPositive) {
         return `<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke="#69f6b8" stroke-width="2.5"></path></svg>`;
      }
      return `<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke="#ff6e84" stroke-width="2.5"></path></svg>`;
    };
  
    async function fetchLiveCryptoData() {
      try {
        const symbols = '["USDTTRY","BTCTRY","ETHTRY","BNBTRY"]';
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`);
        const data = await response.json();
        
        const mappedData = data.map(item => {
          const isPositive = parseFloat(item.priceChangePercent) >= 0;
          const baseCoin = item.symbol.replace('TRY', '');
          
          let iconUrl = '';
          if (baseCoin === 'USDT') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png';
          else if (baseCoin === 'BTC') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png';
          else if (baseCoin === 'ETH') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png';
          else if (baseCoin === 'BNB') iconUrl = 'https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png';
  
          return {
            symbol: item.symbol,
            pair: item.symbol.replace('TRY', '/TRY'),
            baseCoin: baseCoin,
            icon: iconUrl,
            price: formatPrice(item.lastPrice),
            rawPrice: parseFloat(item.lastPrice), 
            changeRaw: parseFloat(item.priceChangePercent), // raw number
            change: (isPositive ? '+' : '') + parseFloat(item.priceChangePercent).toFixed(2) + '%',
            volume: formatVol(item.volume),
            textColorClass: item.priceChangePercent >= 0 ? 'text-secondary' : 'text-error',
            sparkline: getSparkline(isPositive)
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
                  <div class="text-[10px] text-outline font-medium tracking-wide">Vol: <span id="vol-${item.symbol}">${item.volume}</span></div>
                </div>
              </div>
              
              <div class="flex-1 hidden md:flex justify-center px-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <div class="h-8 w-20 relative overflow-hidden" id="spark-${item.symbol}">
                  ${item.sparkline}
                </div>
              </div>
              
              <div class="flex-1 text-right">
                <div class="font-bold text-on-surface tabular-nums tracking-tight transition-colors duration-300" id="mainprice-${item.symbol}" data-price="${item.rawPrice}">₺ ${item.price}</div>
                <div class="text-xs font-bold ${item.textColorClass} transition-colors duration-300" id="mainperc-${item.symbol}">${item.change}</div>
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
                      <div class="text-3xl font-bold font-headline text-on-surface tracking-tighter drop-shadow-sm transition-colors duration-300" id="p2pprice-${coinData.symbol}">₺ ${p2pPrice}</div>
                    </div>
                    
                    <button class="w-full bg-gradient-to-tr from-error-dim/20 to-error-dim/5 hover:from-error-dim/30 hover:to-error-dim/10 text-error border border-error-dim/30 py-3 rounded-full font-bold transition-all text-sm relative z-10 flex items-center justify-center gap-2 active:scale-[0.98] drop-shadow-sm">
                      <span class="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                      ${coinData.baseCoin} Sat
                    </button>
                 </div>
                `;
            }).join('');
        }

        // Connect Websocket instead of setInterval
        initWebSocket();

      } catch (error) {
        console.error("Error fetching Binance data:", error);
      }
    }
  
    function initWebSocket() {
        if(wsConnection) wsConnection.close();
        wsConnection = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        
        wsConnection.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            data.forEach(item => {
                if(trackedSymbols.includes(item.s)) {
                   
                   const newPrice = parseFloat(item.c);
                   const priceChange = parseFloat(item.P);
                   const isPositive = priceChange >= 0;

                   // 1. Update Market List
                   const mainPriceEl = document.getElementById(`mainprice-${item.s}`);
                   if (mainPriceEl) {
                      const oldPriceStr = mainPriceEl.getAttribute('data-price') || "0";
                      const oldPrice = parseFloat(oldPriceStr);
                      mainPriceEl.textContent = '₺ ' + formatPrice(newPrice);
                      mainPriceEl.setAttribute('data-price', newPrice);
                      
                      if (newPrice > oldPrice && oldPrice !== 0) {
                          mainPriceEl.style.color = '#69f6b8'; // secondary
                          setTimeout(() => mainPriceEl.style.color = '', 300);
                      } else if (newPrice < oldPrice && oldPrice !== 0) {
                          mainPriceEl.style.color = '#ff6e84'; // error
                          setTimeout(() => mainPriceEl.style.color = '', 300);
                      }

                      const percEl = document.getElementById(`mainperc-${item.s}`);
                      if (percEl) {
                          percEl.textContent = (isPositive ? '+' : '') + priceChange.toFixed(2) + '%';
                          percEl.className = `text-xs font-bold transition-colors duration-300 ${isPositive ? 'text-secondary' : 'text-error'}`;
                      }

                      const sparkEl = document.getElementById(`spark-${item.s}`);
                      if (sparkEl) {
                          sparkEl.innerHTML = getSparkline(isPositive);
                      }

                      const volEl = document.getElementById(`vol-${item.s}`);
                      if(volEl) {
                          volEl.textContent = formatVol(item.v);
                      }
                   }

                   // 2. Update P2P Card
                   const p2pPriceEl = document.getElementById(`p2pprice-${item.s}`);
                   if (p2pPriceEl) {
                      const rawMarkup = newPrice * 1.003;
                      const p2pPrice = rawMarkup > 1000 ? rawMarkup.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : rawMarkup.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                      p2pPriceEl.textContent = '₺ ' + p2pPrice;
                      
                      // P2P card quick pulse
                      const oldPriceStr = mainPriceEl ? parseFloat(mainPriceEl.getAttribute('data-price') || "0") : 0;
                      if (newPrice > oldPriceStr && oldPriceStr !== 0) {
                          p2pPriceEl.style.color = '#69f6b8';
                          setTimeout(() => p2pPriceEl.style.color = '', 300);
                      } else if (newPrice < oldPriceStr && oldPriceStr !== 0) {
                          p2pPriceEl.style.color = '#ff6e84';
                          setTimeout(() => p2pPriceEl.style.color = '', 300);
                      }
                   }

                }
            });
        };

        wsConnection.onclose = () => {
            setTimeout(initWebSocket, 3000);
        };
    }

    // Search Functionality
    const mainSearch = document.getElementById('main-search');
    if (mainSearch) {
        mainSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Filter Market List
            if (marketList) {
                const rows = marketList.querySelectorAll('.bg-surface-container-low');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? 'flex' : 'none';
                });
            }
            
            // Filter P2P Cards
            if (p2pCardsContainer) {
                const cards = p2pCardsContainer.querySelectorAll('.glass-card');
                cards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(query) ? 'block' : 'none';
                });
            }
        });
    }

    // Call only once
    fetchLiveCryptoData();
});
