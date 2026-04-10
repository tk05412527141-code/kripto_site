import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const v=document.getElementById("assets-list");let l=null,c=null;const f=s=>{const t=parseFloat(s);return t<.1?t.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:5}):t<1?t.toLocaleString("en-US",{minimumFractionDigits:3,maximumFractionDigits:4}):t.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})},g=s=>s?'<svg class="w-full h-full stroke-secondary drop-shadow-[0_0_4px_#69f6b8]" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke-width="2.5"></path></svg>':'<svg class="w-full h-full stroke-error drop-shadow-[0_0_4px_#ff6e84]" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke-width="2.5"></path></svg>';async function x(){try{const r=(await(await fetch("https://api.binance.com/api/v3/ticker/24hr")).json()).filter(e=>e.symbol.endsWith("USDT")&&!["USDCUSDT","FDUSDUSDT","TUSDUSDT"].includes(e.symbol));r.sort((e,i)=>parseFloat(i.quoteVolume)-parseFloat(e.quoteVolume));const o=r.slice(0,50);if(v.innerHTML=o.map((e,i)=>{const n=parseFloat(e.priceChangePercent)>=0,a=e.symbol.replace("USDT",""),p=`https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${a.toLowerCase()}.png`,d="./logo.png",u=g(n),w=n?"text-secondary":"text-error",y=n?"+":"";let b="";return i===0&&(b=`
              <span class="bg-[#bd9dff]/10 text-[#bd9dff] text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold flex items-center gap-1 border border-[#bd9dff]/20 shadow-[0_0_8px_rgba(189,157,255,0.3)]">
                <span class="material-symbols-outlined text-[10px]" data-icon="star">star</span>
                Günün Yıldızı
              </span>`),`
            <div class="asset-row-wrapper group flex flex-col bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all overflow-hidden mb-3" data-symbol="${e.symbol}">
              
              <!-- Ana Liste Satırı (Tıklanabilir) -->
              <div class="flex items-center justify-between p-4 cursor-pointer" onclick="toggleTradingViewChart(this, '${e.symbol}')">
                <div class="flex items-center gap-4 flex-1">
                  <div class="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center p-1.5 shadow-inner border border-outline-variant/10">
                    <img src="${p}" onerror="this.src='${d}'" alt="${a}" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2 mb-0.5">
                       <h4 class="font-headline font-bold text-on-surface leading-none">${a}</h4>
                       ${b}
                    </div>
                    <span class="text-xs text-on-surface-variant tracking-widest font-label uppercase text-primary/60 group-hover:text-primary transition-colors">GRAFİĞİ AÇ / GİZLE</span>
                  </div>
                </div>
                
                <div class="hidden md:block flex-1 text-center px-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="h-8 w-24 relative overflow-hidden mx-auto" id="spark-${e.symbol}">
                    ${u}
                  </div>
                </div>
                
                <div class="text-right flex items-center gap-4 justify-end">
                  <div class="tabular-nums tracking-tight">
                    <p id="price-${e.symbol}" class="font-headline font-bold text-on-surface transition-colors duration-300" data-price="${e.lastPrice}">$${f(e.lastPrice)}</p>
                    <p id="perc-${e.symbol}" class="text-xs font-bold ${w} transition-colors duration-300">${y}${parseFloat(e.priceChangePercent).toFixed(2)}%</p>
                  </div>
                  <button class="bg-error-dim/10 text-error-dim border border-error-dim/30 hover:bg-error-dim/20 text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-bold transition-colors active:scale-95 shadow-[0_0_8px_rgba(189,157,255,0.1)] pointer-events-none">Sat</button>
                </div>
              </div>

              <!-- Gizli TradingView Grafik Alanı (Accordion) -->
              <div class="chart-container overflow-hidden h-0 transition-all duration-500 bg-[#0c1222]">
                  <!-- TV Widget will be injected here -->
              </div>
            </div>
          `}).join(""),l){const e=document.querySelector(`.asset-row-wrapper[data-symbol="${l}"]`);e&&toggleTradingViewChart(e.firstElementChild,l,!0)}h()}catch(s){console.error("Binance varlık datası çekilirken hata oluştu:",s)}}function h(){c&&c.close(),c=new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr"),c.onmessage=s=>{JSON.parse(s.data).forEach(r=>{const o=document.getElementById(`price-${r.s}`);if(o){const e=parseFloat(r.c),i=o.getAttribute("data-price")||"0",n=parseFloat(i);o.textContent="$"+f(e),o.setAttribute("data-price",e),e>n&&n!==0?(o.style.color="#69f6b8",setTimeout(()=>o.style.color="",300)):e<n&&n!==0&&(o.style.color="#ff6e84",setTimeout(()=>o.style.color="",300));const a=document.getElementById(`perc-${r.s}`),p=document.getElementById(`spark-${r.s}`);if(a){const d=parseFloat(r.P)>=0,u=d?"+":"";a.textContent=u+parseFloat(r.P).toFixed(2)+"%",a.className=`text-xs font-bold transition-colors duration-300 ${d?"text-secondary":"text-error"}`,p&&(p.innerHTML=g(d))}}})},c.onclose=()=>{setTimeout(h,3e3)}}window.toggleTradingViewChart=function(s,t,r=!1){const e=s.closest(".asset-row-wrapper").querySelector(".chart-container"),i=e.style.height!==""&&e.style.height!=="0px";if(document.querySelectorAll(".chart-container").forEach(n=>{n.style.height="0px",n.innerHTML=""}),i&&!r){l=null;return}l=t,e.style.height="500px",e.innerHTML=`
        <div class="tradingview-widget-container h-full w-full border-t border-surface-container-high relative">
          <div id="tv_${t}" class="h-full w-full"></div>
        </div>`,new window.TradingView.widget({autosize:!0,symbol:"BINANCE:"+t,interval:"D",timezone:"Etc/UTC",theme:"dark",style:"1",locale:"tr",enable_publishing:!1,backgroundColor:"#0c1222",gridColor:"rgba(189, 157, 255, 0.05)",hide_top_toolbar:!1,hide_legend:!1,save_image:!1,container_id:"tv_"+t})};const m=document.createElement("script");m.src="https://s3.tradingview.com/tv.js",document.head.appendChild(m),x()});
