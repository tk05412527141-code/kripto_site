import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const i=document.getElementById("market-list"),s=document.getElementById("p2p-cards"),u=a=>{const o=parseFloat(a);return o>=1e3?o.toLocaleString("tr-TR",{maximumFractionDigits:0}):o.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})},m=a=>(parseFloat(a)/1e6).toLocaleString("tr-TR",{maximumFractionDigits:1})+"M",g=a=>a?'<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke="#69f6b8" stroke-width="2.5"></path></svg>':'<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke="#ff6e84" stroke-width="2.5"></path></svg>';async function l(){const o="https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&ids=bitcoin,ethereum,tether,binancecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=tr";try{console.log("Fetching aggregate market data from CoinGecko...");const e=await fetch(o);if(!e.ok)throw e.status===429?new Error("Rate limit exceeded"):new Error(`HTTP error! status: ${e.status}`);const t=await e.json(),r={bitcoin:"BTCTRY",ethereum:"ETHTRY",tether:"USDTTRY",binancecoin:"BNBTRY"},n=t.map(c=>({symbol:r[c.id],lastPrice:c.current_price.toString(),priceChangePercent:(c.price_change_percentage_24h||0).toString(),volume:c.total_volume.toString()}));d(n)}catch(e){console.error("CoinGecko API failed, using fallback data:",e.message),d([{symbol:"USDTTRY",lastPrice:"34.25",priceChangePercent:"0.12",volume:"125000000"},{symbol:"BTCTRY",lastPrice:"2250000",priceChangePercent:"-1.5",volume:"45000000"},{symbol:"ETHTRY",lastPrice:"125000",priceChangePercent:"2.3",volume:"32000000"},{symbol:"BNBTRY",lastPrice:"21500",priceChangePercent:"0.5",volume:"12000000"}])}}function d(a){const o=a.map(e=>{const t=parseFloat(e.priceChangePercent)>=0,r=e.symbol.replace("TRY","");let n="";return r==="USDT"?n="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png":r==="BTC"?n="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png":r==="ETH"?n="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png":r==="BNB"&&(n="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png"),{symbol:e.symbol,pair:e.symbol.replace("TRY","/TRY"),baseCoin:r,icon:n,price:u(e.lastPrice),rawPrice:parseFloat(e.lastPrice),changeRaw:parseFloat(e.priceChangePercent),change:(t?"+":"")+parseFloat(e.priceChangePercent).toFixed(2)+"%",volume:m(e.volume),textColorClass:e.priceChangePercent>=0?"text-secondary":"text-error",sparkline:g(t)}});i&&(i.innerHTML=o.map(e=>`
            <div class="bg-surface-container-low p-8 rounded-[2.5rem] flex items-center justify-between hover:bg-surface-container transition-all group cursor-pointer border border-outline-variant/10 hover:border-primary/40 shadow-xl shadow-black/10">
              <div class="flex-1 flex items-center gap-6">
                <div class="w-16 h-16 rounded-3xl bg-surface-container-highest flex items-center justify-center p-3 shadow-inner">
                  <img src="${e.icon}" alt="${e.baseCoin}" class="w-full h-full object-contain drop-shadow-lg" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-on-surface font-headline tracking-tighter">${e.pair}</div>
                  <div class="text-xs text-outline font-medium tracking-widest uppercase opacity-60">Hacim: <span id="vol-${e.symbol}">${e.volume}</span></div>
                </div>
              </div>
              
              <div class="flex-1 hidden lg:flex justify-center px-8 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                <div class="h-12 w-32 relative overflow-hidden" id="spark-${e.symbol}">
                  ${e.sparkline}
                </div>
              </div>
              
              <div class="flex-1 text-right">
                <div class="text-3xl font-bold text-on-surface tabular-nums tracking-tighter transition-colors duration-300" id="mainprice-${e.symbol}" data-price="${e.rawPrice}">₺ ${e.price}</div>
                <div class="text-sm font-black ${e.textColorClass} transition-colors duration-300 tracking-widest" id="mainperc-${e.symbol}">${e.change}</div>
              </div>
            </div>
          `).join("")),o.forEach(e=>{const t=document.getElementById(`p2pprice-${e.symbol}`);if(t){const r=e.rawPrice*1.003,n=r>1e3?r.toLocaleString("tr-TR",{maximumFractionDigits:0}):r.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2});t.textContent="₺ "+n}}),s&&(s.innerHTML=o.map(e=>{const t=e.rawPrice*1.003,r=t>1e3?t.toLocaleString("tr-TR",{maximumFractionDigits:0}):t.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2});return`
                 <div class="glass-card p-6 rounded-2xl border border-outline-variant/10 relative overflow-hidden group hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                    <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
                    
                    <div class="flex justify-between items-center mb-6 relative z-10">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-full bg-[#141f38] p-1 flex items-center justify-center shadow-md border border-white/5">
                            <img src="${e.icon}" alt="${e.baseCoin}" class="w-full h-full object-contain">
                         </div>
                         <span class="font-headline font-bold text-on-surface tracking-tight">${e.baseCoin}</span>
                      </div>
                      <div class="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 text-secondary rounded-md text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
                          <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                          Canlı
                      </div>
                    </div>
                    
                    <div class="mb-5 relative z-10">
                      <div class="text-[10px] text-outline font-medium uppercase tracking-widest mb-1.5">Güncel S. Kuru</div>
                      <div class="text-3xl font-bold font-headline text-on-surface tracking-tighter drop-shadow-sm transition-colors duration-300" id="p2pprice-dynamic-${e.symbol}">₺ ${r}</div>
                    </div>
                    
                    <a href="https://c2c.binance.com/en/advertiserDetail?advertiserNo=s0891cd65af033d108117ef9c2f780042" target="_blank" rel="noopener noreferrer" class="w-full bg-gradient-to-tr from-error-dim/20 to-error-dim/5 hover:from-error-dim/30 hover:to-error-dim/10 text-error border border-error-dim/30 py-3 rounded-full font-bold transition-all text-sm relative z-10 flex items-center justify-center gap-2 active:scale-[0.98] drop-shadow-sm">
                      <span class="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                      ${e.baseCoin} Sat
                    </a>
                 </div>
                `}).join(""))}const p=document.getElementById("main-search");p&&p.addEventListener("input",a=>{const o=a.target.value.toLowerCase().trim();i&&i.querySelectorAll(".bg-surface-container-low").forEach(t=>{const r=t.textContent.toLowerCase();t.style.display=r.includes(o)?"flex":"none"}),s&&s.querySelectorAll(".glass-card").forEach(t=>{const r=t.textContent.toLowerCase();t.style.display=r.includes(o)?"block":"none"})}),l(),setInterval(l,6e4)});
