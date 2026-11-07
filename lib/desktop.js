import gameMedia from "./game-media.json";

export function startDesktop() {
const timers = new Set();
const listeners = [];
let frame = 0;
const setInterval = (callback, delay) => { const id = window.setInterval(callback, delay); timers.add(id); return id; };
const clearInterval = (id) => { window.clearInterval(id); timers.delete(id); };
const addEventListener = (type, callback) => { window.addEventListener(type, callback); listeners.push(() => window.removeEventListener(type, callback)); };
const requestAnimationFrame = (callback) => { frame = window.requestAnimationFrame(callback); };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

var IMG={av:"/images/av.jpg",icon:"/images/icon.jpg",s1:"/images/s1.jpg",s2:"/images/s2.jpg"};
var AVH=IMG.av?'<img src="'+IMG.av+'" alt="Can">':'<span style="font-size:60px">🧑‍🎨</span>';var LI='https://www.linkedin.com/in/can-durmaz-85a84b213/';var AS="https://www.artstation.com/cndrmz";
var tg=function(a){return a.map(function(x){return '<span class="tg">'+x+'</span>'}).join('')};
var A=[
{k:'nw',n:'Neon Wings',img:IMG.icon,b:'LAUNCH'},
{k:'ab',n:'Player 1',img:IMG.av,g:'linear-gradient(135deg,#ffd23f,#ff8a3d)'},
{k:'ex',n:'Quest Log',e:'🏆',g:'linear-gradient(135deg,#7a3cff,#3a1c9e)'},
{k:'sk',n:'Terminal',e:'⌨️',g:'linear-gradient(135deg,#1c1c2b,#05050a)'},
{k:'ed',n:'Eğitim',e:'🗿',g:'linear-gradient(135deg,#3dff8f,#12a35c)'},
{k:'cv',n:'CV.pdf',e:'📄',g:'linear-gradient(135deg,#ff5c6a,#b81d3a)'},
{k:'ct',n:'Messages',e:'💬',g:'linear-gradient(135deg,#3dff8f,#16b86a)'},
{k:'as',n:'ArtStation',e:'🎨',g:'linear-gradient(135deg,#2de2ff,#1666ff)',href:AS}
];
var C={
nw:'<div class="phone"><div class="dh"><div class="notch"></div></div><button class="x" data-x>✕</button><div class="in"><div class="h"><img src="'+IMG.icon+'" alt="Neon Wings"><div><h2>Neon Wings</h2><small>Casual</small><br><a class="get" href="'+AS+'" target="_blank" rel="noopener">ÇALIŞMALAR</a></div></div><div class="st"><div><b>Launch</b><span>durum</span></div><div><b>3M+</b><span>indirme</span></div><div><b>iOS·Android</b><span>platform</span></div></div><div class="sh"><img src="'+IMG.s1+'" alt=""><img src="'+IMG.s2+'" alt=""></div><h3>Hakkında</h3><p>Yeteneklerini seç, en güçlü uçağı kur ve boss’ları yen!</p><h3>Benim rolüm</h3><p>Konsept aşamasından launch’a kadar tüm görsel üretimi tek artist olarak yürüttüm.</p>'+tg(['3D Artist','Mobil','Neon stil'])+'</div></div>',
ab:['player1.sav','<div class="pl"><div class="av">'+AVH+'</div><div><small class="px pk">PLAYER 1</small><h2>Can Durmaz</h2><div class="rl">3D Game Artist</div><a class="ob" href="mailto:durmaz7.can@gmail.com">Mail</a><a class="ob" href="'+LI+'" target="_blank" rel="noopener">LinkedIn</a><a class="ob" href="'+AS+'" target="_blank" rel="noopener">ArtStation</a></div></div><div class="gr3"><div class="ib"><small>ŞU AN</small>Omicron Game</div><div class="ib"><small>SEKTÖRDE</small><em>2021</em>’den beri</div><div class="ib"><small>PLATFORM</small>Mobil</div><div class="ib"><small>UZMANLIK</small>Karakter, Prop &amp; Çevre 3D</div><div class="ib"><small>MOTOR</small>Unity</div><div class="ib"><small>DİLLER</small>TR · EN</div></div><h4 class="px pk">TEMEL YETENEKLER</h4><div class="gr3"><div class="sk3"><small>3D MODELLEME</small>Blender · ZBrush · Marmoset</div><div class="sk3"><small>TEXTURING</small>Substance Painter · Photoshop</div><div class="sk3"><small>OPTİMİZASYON</small>Low Poly · LOD · Texture Atlas</div></div>','big'],
ex:['questlog.exe','<div class="q now"><div class="ck">!</div><div class="qb"><div class="qh"><h3>Omicron Game</h3><div class="r">2021 – ŞİMDİ<br>DEVAM EDİYOR</div></div><div class="rl">3D Game Artist</div><div class="pb"><i></i></div><ul><li>200+ prototip ve onlarca farklı türde mobil oyunda görev aldım.</li><li>Mobil uyumlu, texture kısıtlarına uygun karakter, prop ve çevre assetleri ürettim ve optimize ettim.</li><li>Git/GitHub ile asset teslimi ve versiyon kontrolü.</li><li>AI araçlarını (Tripo AI, Scenario, ChatGPT, Claude) pipeline’ıma entegre ettim, kaliteyi kendim denetledim.</li></ul></div></div><div class="q"><div class="ck">✓</div><div class="qb"><div class="qh"><h3>Neon Wings</h3><div class="r">LAUNCH<br>TAMAMLANDI</div></div><div class="rl">iOS / Android · 3M+ indirme</div><ul><li>Konsept aşamasından launch’a tüm görsel üretimi tek artist olarak yürüttüm.</li></ul></div></div><div class="q"><div class="ck">✓</div><div class="qb"><div class="qh"><h3>Marmara Üniversitesi</h3><div class="r">2017 – 2024<br>TAMAMLANDI</div></div><div class="rl">Güzel Sanatlar Fakültesi · Heykel</div><ul><li>Kompozisyon, form, oran ve anatomi eğitimi.</li><li>Heykelden gelen hacim ve siluet hakimiyetini 3D karakter ve prop tasarımına aktardım.</li></ul></div></div>','big'],
sk:['terminal.exe','<div class="tm"><p>$ whoami<br>&gt; can — 3d game artist, istanbul</p><p>$ skills --list<br>&gt; blender · zbrush · marmoset · substance painter/designer · photoshop · illustrator · 3dcoat · unity · low poly · lod · texture atlas · tripo ai · scenario · chatgpt · git · trello · notion · slack</p><p>$ ./snake.exe</p><canvas id="snk" width="280" height="280"></canvas><div id="sc" class="px"></div><div class="pad"><span></span><button data-d="0,-1">▲</button><span></span><button data-d="-1,0">◀</button><button data-d="0,1">▼</button><button data-d="1,0">▶</button></div></div>','term'],
ed:['eğitim.exe','<h3>Marmara Üniversitesi</h3><small>Güzel Sanatlar Fakültesi · Heykel · 2017 – 2024</small><p>Kompozisyon, form, oran ve anatomi eğitimi. Geleneksel heykelden gelen hacim ve siluet hakimiyetini 3D karakter ve prop tasarımına aktarıyorum.</p>'],
cv:['CV.pdf','<h3>Can Durmaz</h3><p>3D Game Artist · Omicron Game · 2021 – Halen</p><p>CV dosyası henüz eklenmedi. Güncel CV için <a class="btn" href="mailto:durmaz7.can@gmail.com?subject=CV%20Talebi">İletişime geç</a>.</p>'],
ct:'<div class="phone"><div class="dh"><div class="notch"></div></div><button class="x" data-x>✕</button><div class="chat"><div class="ch">'+(IMG.av?'<img src="'+IMG.av+'" alt="">':'')+'<div><b>Can</b><small>● çevrimiçi</small></div></div><div class="ms"><div class="bb" style="animation-delay:.2s">Selam, ben Can.</div><div class="bb" style="animation-delay:.9s">İstanbul’da mobil oyunlar için çalışan bir 3D game artistim.</div><div class="bb" style="animation-delay:1.6s">Ne lazım?</div></div><div class="cf"><a href="mailto:durmaz7.can@gmail.com">Email</a><a href="'+LI+'" target="_blank" rel="noopener">LinkedIn</a><a href="'+AS+'" target="_blank" rel="noopener">ArtStation</a></div></div></div>'
};
var GM=[{"n": "Tower Around", "i": "TA", "h": 200, "c": "Action", "d": "Kulünü savun, silahlarını yükselt ve düşman dalgalarını alt et! Kule otomatik saldırırken kahramanı sen yönetip coin topluyorsun.", "u": "https://apps.apple.com/fi/app/tower-around/id6702024766"}, {"n": "Heroes of Kingdom", "i": "HK", "h": 35, "c": "Action", "d": "Omicron Game’in mobil aksiyon oyunu.", "u": "https://apps.apple.com/az/app/heroes-of-kingdom/id6758779042"}, {"n": "Loop War: PvP Battle", "i": "LW", "h": 290, "c": "Strategy", "d": "Omicron Game’in mobil PvP strateji oyunu.", "u": "https://apps.apple.com/az/app/loop-war-pvp-battle/id6757853090"}, {"n": "Maze Guardian", "i": "MG", "h": 150, "c": "Game", "d": "Omicron Game’in mobil oyunu.", "u": "https://apps.apple.com/fi/app/maze-guardian/id6636485821"}, {"n": "Digging Defense", "i": "DD", "h": 25, "c": "Game", "d": "Omicron Game’in mobil savunma oyunu.", "u": "https://apps.apple.com/az/app/digging-defense/id6741581983"}, {"n": "Sand Guardian", "i": "SG", "h": 45, "c": "Game", "d": "Omicron Game’in mobil oyunu.", "u": "https://apps.apple.com/az/app/sand-guardian/id6680191380"}, {"n": "Bolts of Defense", "i": "BD", "h": 180, "c": "Game", "d": "Omicron Game’in mobil savunma oyunu.", "u": "https://apps.apple.com/az/app/bolts-of-defense/id6680191613"}, {"n": "Stronghold Clash", "i": "SC", "h": 5, "c": "Game", "d": "Omicron Game’in mobil oyunu.", "u": "https://apps.apple.com/az/app/stronghold-clash/id6596768009"}, {"n": "Supermarket Saga", "i": "SS", "h": 120, "c": "Simulation", "d": "Kendi süpermarketini yönet!", "u": "https://apps.apple.com/az/app/supermarket-saga/id6736826507"}, {"n": "Bowling Star 3D", "i": "BS", "h": 260, "c": "Sports", "d": "Omicron Game’in 3D bowling oyunu.", "u": "https://apps.apple.com/az/app/bowling-star-3d/id6738116882"}, {"n": "Dungeon Slingers", "i": "DS", "h": 320, "c": "Action", "d": "Zindanlarda savaş ve temizle!", "u": "https://apps.apple.com/az/app/dungeon-slingers/id6744703959"}, {"n": "Last Call: Extraction", "i": "LC", "h": 350, "c": "Action", "d": "Omicron Game’in mobil aksiyon oyunu.", "u": "https://apps.apple.com/az/app/last-call-extraction/id6795866033"}, {"n": "Spinner Royale", "i": "SR", "h": 60, "c": "Adventure", "d": "Omicron Game’in mobil macera oyunu.", "u": "https://apps.apple.com/az/app/spinner-royale/id6761763113"}];
var gr=function(h){return 'linear-gradient(135deg,hsl('+h+',90%,62%),hsl('+(h+40)+',80%,36%))'};
GM.forEach(function(g,j){
g.k='g'+j;
const media=gameMedia[g.u.match(/id(\d+)/)[1]];
g.img=media.icon.src;
const screenshots='<div class="sh" aria-label="'+g.n+' ekran görüntüleri">'+media.screenshots.map((shot,index)=>'<img src="'+shot.src+'" width="'+shot.width+'" height="'+shot.height+'" loading="lazy" decoding="async" alt="'+g.n+' — oyun ekranı '+(index+1)+'">').join('')+'</div>';
C[g.k]='<div class="phone"><div class="dh"><div class="notch"></div></div><button class="x" data-x>✕</button><div class="in"><div class="h"><img src="'+g.img+'" width="64" height="64" alt="'+g.n+' ikonu"><div><h2>'+g.n+'</h2><small>'+g.c+'</small><br><a class="get" href="'+g.u+'" target="_blank" rel="noopener">APP STORE</a></div></div><div class="st"><div><b>iOS</b><span>platform</span></div><div><b>Omicron</b><span>yayıncı</span></div><div><b>3D Artist</b><span>rolüm</span></div></div>'+screenshots+'<h3>Hakkında</h3><p>'+g.d+'</p><h3>Benim rolüm</h3><p>Ekip içinde 3D artist olarak görev aldım.</p></div></div>'});
var ORD=[A[0]].concat(GM.map(function(g){return {k:g.k,n:g.n.replace('Loop War: PvP Battle','Loop War').replace('Last Call: Extraction','Last Call'),i:g.i,h:g.h,img:g.img}}));
var dock=document.getElementById('dock');['ab','ex','ct','cv','sk','as'].forEach(function(k,ix){var a=A.filter(function(x){return x.k==k})[0],b=document.createElement('button');b.className='dk';b.setAttribute('aria-label',a.n);b.title=a.n;b.dataset.k=k;b.style.setProperty('--n',ix);b.innerHTML='<span>'+a.n+'</span><i style="background:'+a.g+'">'+(a.img?'<img src="'+a.img+'" alt="">':a.e)+'</i>';b.dataset.key=a.k;b.onclick=function(){if(a.href){window.open(a.href,'_blank','noopener');return}show(k)};dock.appendChild(b)});
var ic=document.getElementById('ic'),wins=document.getElementById('wins'),z=30,N=0;
ORD.forEach(function(a,j){var b=document.createElement('button');b.className='a';b.setAttribute('aria-label',a.n);b.style.animationDelay=(j*.04)+'s';
var st=a.g?' style="background:'+a.g+'"':(a.h!=null?' style="background:'+gr(a.h)+'"':'');
b.innerHTML=(a.b?'<u>'+a.b+'</u>':'')+'<i'+(a.h!=null?' class="g"':'')+st+'>'+(a.img?'<img src="'+a.img+'" alt="">':(a.i||a.e))+'</i>'+a.n;
b.dataset.key=a.k;b.onclick=function(){if(a.href){window.open(a.href,'_blank','noopener');return}show(a.k)};ic.appendChild(b)});
function show(k){var o=document.getElementById('w-'+k);if(o){o.style.zIndex=++z;return}
var c=C[k],d=document.createElement('div');d.id='w-'+k;d.className='fw';d.setAttribute('role','dialog');d.setAttribute('aria-label', (A.find(a=>a.k===k)||GM.find(a=>a.k===k)||{}).n||k);
d.innerHTML=typeof c=='string'?c:'<div class="w '+(c[2]||'')+'"><div class="t px dh"><span>'+c[0]+'</span><button data-x>✕</button></div><div class="in">'+c[1]+'</div></div>';
var wd=Math.min(innerWidth*.94,Array.isArray(c)&&c[2]?600:420);var dk=document.querySelector('.dk[data-k="'+k+'"]');if(dk)dk.classList.add('on');d.style.left=(innerWidth>700?Math.min(innerWidth-wd-20,430+(N%5)*36):Math.max(8,(innerWidth-wd)/2))+'px';d.style.top=(innerWidth>700?52+(N%5)*30:56)+'px';N++;d.style.zIndex=++z;
wins.appendChild(d);clampWindow(d);if(k=='sk')initSnake(d);
d.onpointerdown=function(){d.style.zIndex=++z};
const close=d.querySelector('[data-x]');close.setAttribute('aria-label','Pencereyi kapat');close.onclick=function(){if(d._cleanup)d._cleanup();d.remove();if(dk){dk.classList.remove('on');dk.focus()}else{ic.querySelector('[data-key="'+k+'"]')?.focus()}};close.focus();
var h=d.querySelector('.dh');
h.onpointerdown=function(e){if(e.target.closest('[data-x]')||innerWidth<=700)return;var dx=e.clientX-d.offsetLeft,dy=e.clientY-d.offsetTop;h.setPointerCapture(e.pointerId);
h.onpointermove=function(m){d.style.left=Math.min(innerWidth-d.offsetWidth-8,Math.max(8,m.clientX-dx))+'px';d.style.top=Math.min(Math.max(46,innerHeight-d.offsetHeight-108),Math.max(46,m.clientY-dy))+'px'};
h.onpointerup=h.onpointercancel=function(){h.onpointermove=null}}}
function clampWindow(d){
 const mobile=innerWidth<=700;
 d.style.left=(mobile?Math.max(8,(innerWidth-d.offsetWidth)/2):Math.max(8,Math.min(parseFloat(d.style.left)||8,innerWidth-d.offsetWidth-8)))+'px';
 d.style.top=(mobile?50:Math.max(46,Math.min(parseFloat(d.style.top)||52,Math.max(46,innerHeight-d.offsetHeight-110))))+'px';
}
function lay(){ic.style.setProperty('--r',Math.max(1,Math.floor((innerHeight-52-150)/130)));wins.querySelectorAll('.fw').forEach(clampWindow)}
lay();addEventListener('resize',lay);
addEventListener('keydown',function(e){
 const windows=Array.from(wins.children).sort((a,b)=>+b.style.zIndex-+a.style.zIndex), top=windows[0];
 if(!top)return;
 if(e.key==='Escape'){e.preventDefault();top.querySelector('[data-x]').click()}
 if(e.key==='Tab'){
 const items=Array.from(top.querySelectorAll('button,a[href],canvas[tabindex]'));
 const index=items.indexOf(document.activeElement);
 if(e.shiftKey && index<=0){e.preventDefault();items.at(-1)?.focus()}
 else if(!e.shiftKey && (index===items.length-1||index===-1)){e.preventDefault();items[0]?.focus()}
 }
});
function tk(){document.getElementById('clk').textContent=new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Istanbul'})+' İSTANBUL'}tk();setInterval(tk,20000);

function initSnake(d){var cv=d.querySelector('#snk'),c=cv.getContext('2d'),N=20,S=14,s,dir=[1,0],nd=dir,f,sc=0,hs=0,alive=false,iv;
function food(){do{f=[rnd(0,N),rnd(0,N)]}while(s.some(function(p){return p[0]==f[0]&&p[1]==f[1]}))}
function upd(){d.querySelector('#sc').textContent='SCORE '+sc+'  BEST '+hs}
function dr(m){c.fillStyle='#07140c';c.fillRect(0,0,280,280);c.fillStyle='#3dff8f';s.forEach(function(p){c.fillRect(p[0]*S+1,p[1]*S+1,S-2,S-2)});c.strokeStyle='#3dff8f';c.lineWidth=2;c.strokeRect(f[0]*S+4,f[1]*S+4,S-8,S-8);if(m){c.fillStyle='#07140ccc';c.fillRect(20,100,240,70);c.fillStyle='#3dff8f';c.textAlign='center';c.font='11px "Press Start 2P",monospace';c.fillText(m[0],140,128);c.fillText(m[1],140,152)}}
function reset(){s=[[10,10],[9,10],[8,10]];dir=[1,0];nd=dir;sc=0;food();alive=true;upd()}
function turn(x,y){if(!alive)reset();if(dir[0]+x==0&&dir[1]+y==0)return;nd=[x,y]}
function kd(e){if(!document.body.contains(d)){document.removeEventListener('keydown',kd);return}if(+d.style.zIndex!==Math.max(...Array.from(wins.children).map(w=>+w.style.zIndex)))return;
var m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]}[e.key];
if(m){e.preventDefault();turn(m[0],m[1])}else if(e.key==' '){e.preventDefault();if(!alive)reset()}}
function tick(){if(!document.body.contains(d)){d._cleanup();return}if(!alive)return;dir=nd;var h=[s[0][0]+dir[0],s[0][1]+dir[1]];
if(h[0]<0||h[1]<0||h[0]>=N||h[1]>=N||s.some(function(p){return p[0]==h[0]&&p[1]==h[1]})){alive=false;dr(['GAME OVER','TEKRAR: BOSLUK / DOKUN']);return}
s.unshift(h);if(h[0]==f[0]&&h[1]==f[1]){sc++;hs=Math.max(hs,sc);food();upd()}else s.pop();dr()}
s=[[10,10],[9,10],[8,10]];food();upd();dr(['SNAKE','OK TUSLARI / WASD']);
document.addEventListener('keydown',kd);d._cleanup=function(){clearInterval(iv);document.removeEventListener('keydown',kd)};cv.onclick=function(){if(!alive)reset()};
d.querySelectorAll('[data-d]').forEach(function(b){b.onclick=function(){var v=b.dataset.d.split(',');turn(+v[0],+v[1])}});
iv=setInterval(tick,115)}
/* pixel city */
var cv=document.getElementById('sky'),g=cv.getContext('2d'),P=6,SW,SH,UH,L=[],st=[],last=0;
function rnd(a,b){return a+Math.floor(Math.random()*(b-a))}
function build(){SW=cv.width=innerWidth;SH=cv.height=innerHeight;UH=SH/P;var UW=SW/P;st=[];for(var i=0;i<70;i++)st.push([rnd(0,SW),rnd(0,SH*.55),Math.random()*6]);
var cfg=[{c:'#1c1148',s:.5,mn:.3,mx:.6,w:[16,30],p:0},{c:'#140b38',s:1.1,mn:.25,mx:.62,w:[14,26],p:.1},{c:'#0a0522',s:2.2,mn:.2,mx:.58,w:[12,22],p:.14}];
L=cfg.map(function(f){var b=[],x=0,tot=UW+40;while(x<tot){var w=rnd(f.w[0],f.w[1]),h=Math.floor(rnd(UH*f.mn,UH*f.mx)),wn=[];if(f.p)for(var yy=4;yy<h-4;yy+=5)for(var xx=2;xx<w-2;xx+=4)if(Math.random()<f.p)wn.push([xx,yy,Math.random()<.5?'#ffd23f':'#2de2ff',Math.random()<.5,rnd(0,9000)]);b.push({x:x,w:w,h:h,wn:wn});x+=w+rnd(0,4)}
return {f:f,b:b,tot:x,o:0}})}
function draw(t){var dt=Math.min(t-last,50);last=t;var gd=g.createLinearGradient(0,0,0,SH);gd.addColorStop(0,'#05030f');gd.addColorStop(.6,'#2a0f55');gd.addColorStop(1,'#6a1b6b');g.fillStyle=gd;g.fillRect(0,0,SW,SH);
st.forEach(function(s){g.fillStyle=(Math.sin(t/900+s[2])>0)?'#fff':'#fff5';g.fillRect(s[0],s[1],3,3)});
L.forEach(function(l){l.o=(l.o+l.f.s*dt/1000)%l.tot;l.b.forEach(function(b){[0,l.tot].forEach(function(d){var x=Math.round((b.x-l.o+d)*P);if(x>SW||x+b.w*P<0)return;g.fillStyle=l.f.c;g.fillRect(x,SH-b.h*P,b.w*P,b.h*P);b.wn.forEach(function(w){if(t>w[4]){w[3]=!w[3];w[4]=t+rnd(2000,12000)}if(w[3]){g.fillStyle=w[2];g.fillRect(x+w[0]*P,SH-(b.h-w[1])*P,P,2*P)}})})})});
if(!reducedMotion.matches)requestAnimationFrame(draw)}
build();addEventListener('resize',build);requestAnimationFrame(draw);

return () => {
 wins.querySelectorAll('.fw').forEach(d=>d._cleanup?.());
 timers.forEach(id=>window.clearInterval(id));
 listeners.forEach(remove=>remove());
 window.cancelAnimationFrame(frame);
 ic.replaceChildren();dock.replaceChildren();wins.replaceChildren();
};
}
