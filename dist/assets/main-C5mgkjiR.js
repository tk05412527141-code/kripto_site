import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */document.addEventListener("DOMContentLoaded",()=>{const u=document.getElementById("market-list"),m=document.getElementById("p2p-cards");let d=null;const x=["USDTTRY","BTCTRY","ETHTRY","BNBTRY"],f=o=>{const c=parseFloat(o);return c>=1e3?c.toLocaleString("tr-TR",{maximumFractionDigits:0}):c.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})},g=o=>(parseFloat(o)/1e6).toLocaleString("tr-TR",{maximumFractionDigits:1})+"M",v=o=>o?'<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke="#69f6b8" stroke-width="2.5"></path></svg>':'<svg class="w-full h-full" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke="#ff6e84" stroke-width="2.5"></path></svg>';async function w(){try{const n=(await(await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["USDTTRY","BTCTRY","ETHTRY","BNBTRY"]')).json()).map(t=>{const i=parseFloat(t.priceChangePercent)>=0,e=t.symbol.replace("TRY","");let r="";return e==="USDT"?r="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/usdt.png":e==="BTC"?r="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/btc.png":e==="ETH"?r="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/eth.png":e==="BNB"&&(r="https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/bnb.png"),{symbol:t.symbol,pair:t.symbol.replace("TRY","/TRY"),baseCoin:e,icon:r,price:f(t.lastPrice),rawPrice:parseFloat(t.lastPrice),changeRaw:parseFloat(t.priceChangePercent),change:(i?"+":"")+parseFloat(t.priceChangePercent).toFixed(2)+"%",volume:g(t.volume),textColorClass:t.priceChangePercent>=0?"text-secondary":"text-error",sparkline:v(i)}});u&&(u.innerHTML=n.map(t=>`
            <div class="bg-surface-container-low p-4 rounded-xl flex items-center justify-between hover:bg-surface-container transition-all group cursor-pointer border-l-2 border-transparent hover:border-primary/40">
              <div class="flex-1 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center p-1.5 shadow-inner">
                  <img src="${t.icon}" alt="${t.baseCoin}" class="w-full h-full object-contain drop-shadow-md" />
                </div>
                <div>
                  <div class="font-bold text-on-surface font-headline tracking-tight">${t.pair}</div>
                  <div class="text-[10px] text-outline font-medium tracking-wide">Vol: <span id="vol-${t.symbol}">${t.volume}</span></div>
                </div>
              </div>
              
              <div class="flex-1 hidden md:flex justify-center px-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <div class="h-8 w-20 relative overflow-hidden" id="spark-${t.symbol}">
                  ${t.sparkline}
                </div>
              </div>
              
              <div class="flex-1 text-right">
                <div class="font-bold text-on-surface tabular-nums tracking-tight transition-colors duration-300" id="mainprice-${t.symbol}" data-price="${t.rawPrice}">₺ ${t.price}</div>
                <div class="text-xs font-bold ${t.textColorClass} transition-colors duration-300" id="mainperc-${t.symbol}">${t.change}</div>
              </div>
            </div>
          `).join("")),m&&(m.innerHTML=n.map(t=>{const i=t.rawPrice*1.003,e=i>1e3?i.toLocaleString("tr-TR",{maximumFractionDigits:0}):i.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2});return`
                 <div class="glass-card p-6 rounded-2xl border border-outline-variant/10 relative overflow-hidden group hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                    <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
                    
                    <div class="flex justify-between items-center mb-6 relative z-10">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-full bg-[#141f38] p-1 flex items-center justify-center shadow-md border border-white/5">
                            <img src="${t.icon}" alt="${t.baseCoin}" class="w-full h-full object-contain">
                         </div>
                         <span class="font-headline font-bold text-on-surface tracking-tight">${t.baseCoin}</span>
                      </div>
                      <div class="flex items-center gap-1.5 px-2 py-1 bg-secondary/10 text-secondary rounded-md text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
                          <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                          Canlı
                      </div>
                    </div>
                    
                    <div class="mb-5 relative z-10">
                      <div class="text-[10px] text-outline font-medium uppercase tracking-widest mb-1.5">Güncel S. Kuru</div>
                      <div class="text-3xl font-bold font-headline text-on-surface tracking-tighter drop-shadow-sm transition-colors duration-300" id="p2pprice-${t.symbol}">₺ ${e}</div>
                    </div>
                    
                    <button class="w-full bg-gradient-to-tr from-error-dim/20 to-error-dim/5 hover:from-error-dim/30 hover:to-error-dim/10 text-error border border-error-dim/30 py-3 rounded-full font-bold transition-all text-sm relative z-10 flex items-center justify-center gap-2 active:scale-[0.98] drop-shadow-sm">
                      <span class="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                      ${t.baseCoin} Sat
                    </button>
                 </div>
                `}).join("")),b()}catch(o){console.error("Error fetching Binance data:",o)}}function b(){d&&d.close(),d=new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr"),d.onmessage=o=>{JSON.parse(o.data).forEach(s=>{if(x.includes(s.s)){const n=parseFloat(s.c),t=parseFloat(s.P),i=t>=0,e=document.getElementById(`mainprice-${s.s}`);if(e){const p=e.getAttribute("data-price")||"0",l=parseFloat(p);e.textContent="₺ "+f(n),e.setAttribute("data-price",n),n>l&&l!==0?(e.style.color="#69f6b8",setTimeout(()=>e.style.color="",300)):n<l&&l!==0&&(e.style.color="#ff6e84",setTimeout(()=>e.style.color="",300));const a=document.getElementById(`mainperc-${s.s}`);a&&(a.textContent=(i?"+":"")+t.toFixed(2)+"%",a.className=`text-xs font-bold transition-colors duration-300 ${i?"text-secondary":"text-error"}`);const h=document.getElementById(`spark-${s.s}`);h&&(h.innerHTML=v(i));const y=document.getElementById(`vol-${s.s}`);y&&(y.textContent=g(s.v))}const r=document.getElementById(`p2pprice-${s.s}`);if(r){const p=n*1.003,l=p>1e3?p.toLocaleString("tr-TR",{maximumFractionDigits:0}):p.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2});r.textContent="₺ "+l;const a=e?parseFloat(e.getAttribute("data-price")||"0"):0;n>a&&a!==0?(r.style.color="#69f6b8",setTimeout(()=>r.style.color="",300)):n<a&&a!==0&&(r.style.color="#ff6e84",setTimeout(()=>r.style.color="",300))}}})},d.onclose=()=>{setTimeout(b,3e3)}}w()});
