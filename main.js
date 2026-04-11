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
      const ids = 'bitcoin,ethereum,tether,binancecoin';
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=tr`;
      
      try {
        console.log("Fetching aggregate market data from CoinGecko...");
        const response = await fetch(url);
        if (!response.ok) {
           if (response.status === 429) throw new Error("Rate limit exceeded");
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const symbolsMap = {
            'bitcoin': 'BTCTRY',
            'ethereum': 'ETHTRY',
            'tether': 'USDTTRY',
            'binancecoin': 'BNBTRY'
        };
        
        const mappedDataForProcess = data.map(item => ({
            symbol: symbolsMap[item.id],
            lastPrice: item.current_price.toString(),
            priceChangePercent: (item.price_change_percentage_24h || 0).toString(),
            volume: item.total_volume.toString()
        }));
        
        processData(mappedDataForProcess);
      } catch (error) {
        console.error("CoinGecko API failed, using fallback data:", error.message);
        const fallbackData = [
            { symbol: "USDTTRY", lastPrice: "34.25", priceChangePercent: "0.12", volume: "125000000" },
            { symbol: "BTCTRY", lastPrice: "2250000", priceChangePercent: "-1.5", volume: "45000000" },
            { symbol: "ETHTRY", lastPrice: "125000", priceChangePercent: "2.3", volume: "32000000" },
            { symbol: "BNBTRY", lastPrice: "21500", priceChangePercent: "0.5", volume: "12000000" }
        ];
        processData(fallbackData);
      }
    }

    function processData(data) {
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
            changeRaw: parseFloat(item.priceChangePercent), 
            change: (isPositive ? '+' : '') + parseFloat(item.priceChangePercent).toFixed(2) + '%',
            volume: formatVol(item.volume),
            textColorClass: item.priceChangePercent >= 0 ? 'text-secondary' : 'text-error',
            sparkline: getSparkline(isPositive)
          };
        });
  
        if (marketList) {
          marketList.innerHTML = mappedData.map(item => `
            <div class="bg-surface-container-low p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 hover:bg-surface-container transition-all group cursor-pointer border border-outline-variant/10 hover:border-primary/40 shadow-xl shadow-black/10">
              <div class="flex-1 flex items-center gap-3 sm:gap-6">
                <div class="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-3xl bg-surface-container-highest flex items-center justify-center p-2 sm:p-3 shadow-inner shrink-0">
                  <img src="${item.icon}" alt="${item.baseCoin}" class="w-full h-full object-contain drop-shadow-lg" />
                </div>
                <div>
                  <div class="text-lg sm:text-2xl font-bold text-on-surface font-headline tracking-tighter">${item.pair}</div>
                  <div class="text-[10px] sm:text-xs text-outline font-medium tracking-widest uppercase opacity-60">Hacim: <span id="vol-${item.symbol}">${item.volume}</span></div>
                </div>
              </div>
              
              <div class="flex-1 hidden lg:flex justify-center px-8 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                <div class="h-12 w-32 relative overflow-hidden" id="spark-${item.symbol}">
                  ${item.sparkline}
                </div>
              </div>
              
              <div class="flex-1 text-left sm:text-right w-full sm:w-auto flex sm:block items-center justify-between">
                <div class="text-xl sm:text-3xl font-bold text-on-surface tabular-nums tracking-tighter transition-colors duration-300" id="mainprice-${item.symbol}" data-price="${item.rawPrice}">₺ ${item.price}</div>
                <div class="text-xs sm:text-sm font-black ${item.textColorClass} transition-colors duration-300 tracking-widest" id="mainperc-${item.symbol}">${item.change}</div>
              </div>
            </div>
          `).join('');
        }
        
        mappedData.forEach(coinData => {
            const p2pPriceEl = document.getElementById(`p2pprice-${coinData.symbol}`);
            if (p2pPriceEl) {
                const rawMarkup = coinData.rawPrice * 1.003;
                const p2pPrice = rawMarkup > 1000 ? rawMarkup.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : rawMarkup.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                p2pPriceEl.textContent = '₺ ' + p2pPrice;
            }
        });

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
                      <div class="text-3xl font-bold font-headline text-on-surface tracking-tighter drop-shadow-sm transition-colors duration-300" id="p2pprice-dynamic-${coinData.symbol}">₺ ${p2pPrice}</div>
                    </div>
                    
                    <a href="https://c2c.binance.com/en/advertiserDetail?advertiserNo=s0891cd65af033d108117ef9c2f780042" target="_blank" rel="noopener noreferrer" class="w-full bg-gradient-to-tr from-error-dim/20 to-error-dim/5 hover:from-error-dim/30 hover:to-error-dim/10 text-error border border-error-dim/30 py-3 rounded-full font-bold transition-all text-sm relative z-10 flex items-center justify-center gap-2 active:scale-[0.98] drop-shadow-sm">
                      <span class="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                      ${coinData.baseCoin} Sat
                    </a>
                 </div>
                `;
            }).join('');
        }

        // No WebSocket for CoinGecko free tier, using polling instead
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
    // Initial Call
    fetchLiveCryptoData();

    // Auto Refresh every 60 seconds (CoinGecko friendly)
    setInterval(fetchLiveCryptoData, 60000);
});
