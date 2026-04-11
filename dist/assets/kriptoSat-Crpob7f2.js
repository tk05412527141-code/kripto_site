import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("assets-list"),f=t=>{const e=parseFloat(t);return e<.1?e.toLocaleString("tr-TR",{minimumFractionDigits:4,maximumFractionDigits:5}):e<1?e.toLocaleString("tr-TR",{minimumFractionDigits:3,maximumFractionDigits:4}):e.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2})},u=t=>t?'<svg class="w-full h-full stroke-secondary drop-shadow-[0_0_4px_#69f6b8]" viewBox="0 0 100 40"><path d="M0,30 Q25,10 50,25 T100,5" fill="none" stroke-width="2.5"></path></svg>':'<svg class="w-full h-full stroke-error drop-shadow-[0_0_4px_#ff6e84]" viewBox="0 0 100 40"><path d="M0,10 Q25,35 50,20 T100,35" fill="none" stroke-width="2.5"></path></svg>';async function c(){const t="https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=tr";try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const s=await e.json();n&&(n.innerHTML=s.map((r,o)=>{const i=(r.price_change_percentage_24h||0)>=0,a=r.symbol.toUpperCase(),g=r.image,h="./logo.png",m=u(i),v=i?"text-secondary":"text-error",x=i?"+":"";let p="";o===0&&(p=`
                  <span class="bg-[#bd9dff]/10 text-[#bd9dff] text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold flex items-center gap-1 border border-[#bd9dff]/20 shadow-[0_0_8px_rgba(189,157,255,0.3)]">
                    <span class="material-symbols-outlined text-[10px]">star</span>
                    Günün Yıldızı
                  </span>`);const b=a+"TRY";return`
                <div class="asset-row-wrapper group flex flex-col bg-surface-container-low rounded-xl border border-transparent hover:border-primary/20 transition-all overflow-hidden mb-3" data-symbol="${a}">
                  <div class="flex items-center justify-between p-4 cursor-pointer" onclick="toggleTradingViewChart(this, '${b}')">
                    <div class="flex items-center gap-4 flex-1">
                      <div class="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center p-1.5 shadow-inner border border-outline-variant/10">
                        <img src="${g}" onerror="this.src='${h}'" alt="${a}" class="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div class="flex items-center gap-2 mb-0.5">
                           <h4 class="font-headline font-bold text-on-surface leading-none">${a}</h4>
                           ${p}
                        </div>
                        <span class="text-xs text-on-surface-variant tracking-widest font-label uppercase text-primary/60 group-hover:text-primary transition-colors">GRAFİĞİ AÇ / GİZLE</span>
                      </div>
                    </div>
                    <div class="hidden md:block flex-1 text-center px-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="h-8 w-24 relative overflow-hidden mx-auto">
                        ${m}
                      </div>
                    </div>
                    <div class="text-right flex items-center gap-4 justify-end">
                      <div class="tabular-nums tracking-tight">
                        <p class="font-headline font-bold text-on-surface transition-colors duration-300">₺ ${f(r.current_price)}</p>
                        <p class="text-xs font-bold ${v} transition-colors duration-300">${x}${(r.price_change_percentage_24h||0).toFixed(2)}%</p>
                      </div>
                      <a href="https://c2c.binance.com/en/advertiserDetail?advertiserNo=s0891cd65af033d108117ef9c2f780042" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="bg-error-dim/10 text-error-dim border border-error-dim/30 hover:bg-error-dim/20 text-[11px] uppercase tracking-wider px-4 py-2 rounded-full font-bold transition-colors active:scale-95 shadow-[0_0_8px_rgba(189,157,255,0.1)] flex items-center justify-center">Sat</a>
                    </div>
                  </div>
                  <div class="chart-container overflow-hidden h-0 transition-all duration-500 bg-[#0c1222]"></div>
                </div>
              `}).join(""))}catch(e){console.error("CoinGecko data fetch failed:",e)}}window.toggleTradingViewChart=function(t,e,s=!1){const o=t.closest(".asset-row-wrapper").querySelector(".chart-container"),i=o.style.height!==""&&o.style.height!=="0px";document.querySelectorAll(".chart-container").forEach(a=>{a.style.height="0px",a.innerHTML=""}),!(i&&!s)&&(o.style.height="500px",o.innerHTML=`<div class="tradingview-widget-container h-full w-full border-t border-surface-container-high relative"><div id="tv_${e}" class="h-full w-full"></div></div>`,new window.TradingView.widget({autosize:!0,symbol:"BINANCE:"+e,interval:"D",timezone:"Etc/UTC",theme:"dark",style:"1",locale:"tr",enable_publishing:!1,backgroundColor:"#0c1222",gridColor:"rgba(189, 157, 255, 0.05)",hide_top_toolbar:!1,hide_legend:!1,save_image:!1,container_id:"tv_"+e}))};const l=document.createElement("script");l.src="https://s3.tradingview.com/tv.js",document.head.appendChild(l);const d=document.getElementById("sat-search");d&&d.addEventListener("input",t=>{const e=t.target.value.toLowerCase().trim();n.querySelectorAll(".asset-row-wrapper").forEach(r=>{const o=r.getAttribute("data-symbol").toLowerCase();r.style.display=o.includes(e)?"flex":"none"})}),c(),setInterval(c,6e4)});
