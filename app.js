const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const os = $('#os');
const homeScreen = $('#homeScreen');
const lockScreen = $('#lockScreen');
const appWindow = $('#appWindow');
const appTitle = $('#appTitle');
const appContent = $('#appContent');
const toast = $('#toast');
let code = '';
let audioContext;

const apps = [
  ['chambers','36 Chambers','卅'], ['vault','Iron Vault','◆'], ['notes','Scrolls','▤'], ['files','Files','▰'],
  ['camera','Camera','◉'], ['map','Shaolin Map','⌖'], ['weather','Weather','☁'], ['settings','Settings','⚙']
];

function boot(){
  setTimeout(() => { $('#boot').classList.add('done'); os.classList.remove('hidden'); }, 1450);
  setTimeout(() => $('#boot').remove(), 2200);
}

function updateClock(){
  const d = new Date();
  const t = d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
  $('#statusTime').textContent = t;
  $('#lockTime').textContent = t;
  $('#lockDate').textContent = d.toLocaleDateString([], {weekday:'long',month:'long',day:'numeric'}).toUpperCase();
}

function buildGrid(){
  $('#appGrid').innerHTML = apps.map(([id,name,glyph]) => `
    <button class="app-icon" data-app="${id}"><span class="icon ${id}">${glyph}</span><em>${name}</em></button>`).join('');
}

function buildKeypad(){
  const keys = ['1','2','3','4','5','6','7','8','9','⌫','0'];
  $('#keypad').innerHTML = keys.map(k => `<button data-key="${k}">${k}</button>`).join('');
}

function showToast(message){
  toast.textContent = message; toast.classList.remove('hidden');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(()=>toast.classList.add('hidden'), 2200);
}

function openPasscode(){ $('#passcodeSheet').classList.remove('hidden'); code=''; updateDots(); }
function updateDots(){ $$('#passDots i').forEach((dot,i)=>dot.classList.toggle('filled',i<code.length)); }
function submitCode(){
  if(code === '3636'){
    $('#passcodeSheet').classList.add('hidden'); lockScreen.classList.add('hidden'); homeScreen.classList.remove('hidden');
    localStorage.setItem('36os-unlocked','true'); showToast('Welcome to the 36 Chambers');
  } else { navigator.vibrate?.([80,40,80]); showToast('Wrong chamber code'); code=''; updateDots(); }
}

function toggleWeed(){
  const active = os.classList.toggle('weed-mode');
  $('#weedButton').setAttribute('aria-pressed', String(active));
  $('#chamberTitle').textContent = active ? 'Purple Haze Active' : 'Shaolin Secure';
  $('#chamberSubtitle').textContent = active ? 'Bullet time · blurred vision · slow interface' : 'No trackers detected · Local mode';
  localStorage.setItem('36os-weed', String(active));
  navigator.vibrate?.(active ? [25,40,25] : 25);
  tone(active ? 110 : 220, active ? .7 : .2);
  showToast(active ? 'WEED MODE: time got heavy' : 'Back to regular time');
}

function tone(freq=220, duration=.2){
  try{
    audioContext ||= new (window.AudioContext||window.webkitAudioContext)();
    const o=audioContext.createOscillator(), g=audioContext.createGain();
    o.frequency.value=freq; o.type='sine'; g.gain.setValueAtTime(.045,audioContext.currentTime); g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);
    o.connect(g).connect(audioContext.destination); o.start(); o.stop(audioContext.currentTime+duration);
  }catch{}
}

const views = {
  chambers(){ return `<div class="card"><small style="color:var(--gold);letter-spacing:.2em">THE MANUAL</small><h2>36 Chambers OS</h2><p>An original tribute interface built around raw 1990s martial-arts cinema, dusty vinyl, gold accents and privacy-first controls.</p></div>
    ${['Protect Ya Neck — Security','C.R.E.A.M. — Money discipline','Method — Creative tools','Da Mystery — Private vault','Wu-Tang: 7th Chamber — System status'].map((x,i)=>`<div class="row"><span><b>${i+1}. ${x}</b><br><small>${['Enabled','Local only','Ready','Locked','Stable'][i]}</small></span><span>${i===3?'🔒':'›'}</span></div>`).join('')}` },
  vault(){ return `<div class="card"><h2>Iron Vault</h2><p>Demo encrypted-vault interface. In a production app, secrets must use the iOS Keychain or Web Crypto with a user-held key—not localStorage.</p></div><div class="card"><div class="row"><span><b>Private Scrolls</b><br><small>3 items</small></span><span>🔒</span></div><div class="row"><span><b>Hidden Photos</b><br><small>Face ID required</small></span><span>🔒</span></div><div class="row"><span><b>Recovery Key</b><br><small>Offline</small></span><span>••••</span></div></div><button class="primary" onclick="showToast('Demo vault locked')">LOCK THE VAULT</button>` },
  notes(){ return `<textarea id="noteInput" class="new-note" placeholder="Write a new scroll..."></textarea><button id="saveNote" class="primary" style="margin:12px 0 18px">SAVE SCROLL</button><div id="notesList"></div>` },
  files(){ return `<div class="card"><h3>On My Chamber</h3><div class="row"><span>Beats</span><small>24 files</small></div><div class="row"><span>Sketches</span><small>11 files</small></div><div class="row"><span>Encrypted</span><small>4 files</small></div></div><div class="card"><h3>Storage</h3><p>18.6 GB of 36 GB used</p><progress value="18.6" max="36" style="width:100%"></progress></div>` },
  camera(){ return `<div class="card" style="height:55vh;display:grid;place-content:center;text-align:center;background:radial-gradient(circle,#333,#080808)"><div style="font-size:70px">◉</div><h3>Camera Chamber</h3><p>Browser camera access is available only over HTTPS or localhost.</p><button id="cameraStart" class="primary">REQUEST CAMERA</button><video id="cameraFeed" autoplay playsinline style="width:100%;border-radius:18px;margin-top:14px"></video></div>` },
  map(){ return `<div class="card" style="height:62vh;position:relative;overflow:hidden;background:linear-gradient(30deg,#203225,#596d46)"><div style="position:absolute;inset:0;background:repeating-linear-gradient(35deg,transparent 0 35px,rgba(255,255,255,.17) 36px 39px)"></div><div style="position:absolute;left:53%;top:42%;font-size:38px">⌖</div><div style="position:absolute;bottom:15px;left:15px"><b>SHAOLIN DISTRICT</b><br><small>Location kept on device</small></div></div>` },
  weather(){ return `<div class="card" style="text-align:center"><div style="font-size:72px">☁</div><h2>21°</h2><p>Cloudy in the Chambers</p><small>Demo weather · connect a weather API for live data</small></div><div class="row"><span>Now</span><b>21°</b></div><div class="row"><span>6 PM</span><b>20°</b></div><div class="row"><span>9 PM</span><b>18°</b></div>` },
  settings(){ return `<div class="card"><h3>Appearance</h3><div class="wallpapers">${['chambers','gold','purple','concrete'].map(w=>`<button class="wallpaper-choice ${os.dataset.wallpaper===w?'selected':''}" data-wall="${w}" style="background:${wallPreview(w)}">${w}</button>`).join('')}</div></div>
    <div class="card"><div class="row"><span><b>App Lock</b><br><small>Require chamber code</small></span><button class="switch on" data-toggle></button></div><div class="row"><span><b>Tracker Shield</b><br><small>Block known trackers</small></span><button class="switch on" data-toggle></button></div><div class="row"><span><b>Gangsta Haptics</b><br><small>Heavy taps</small></span><button class="switch" data-toggle></button></div></div><button id="relock" class="primary danger">LOCK DEVICE</button>` },
  phone(){ return `<div class="card"><h2>Phone</h2><p>Native calling cannot be initiated as a full dialer from a PWA, but tel: links work.</p><a href="tel:411" class="primary" style="display:inline-block;text-decoration:none">CALL 411</a></div>` },
  messages(){ return `<div class="card"><h3>RZA</h3><p>The sword is the mind. Keep building.</p></div><div class="card"><h3>GZA</h3><p>Words are data. Sharpen both.</p></div><div class="card"><h3>ODB</h3><p>System says: no father to the style.</p></div>` },
  browser(){ return `<div class="browser-shell"><form id="browserForm" class="browser-bar"><input id="browserAddress" inputmode="url" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="Search or enter website"><button type="submit">GO</button></form><div class="browser-actions"><button id="previewPage" class="secondary">PREVIEW</button><button id="browserBack" class="secondary">BACK TO CHAMBER</button></div><div id="browserView" class="browser-view"><div class="browser-placeholder"><b>36 Browser</b><p><strong>GO</strong> opens the real page in Safari. <strong>PREVIEW</strong> embeds the page here only when that website allows it.</p><div class="browser-bookmarks"><button data-site="https://duckduckgo.com">SEARCH</button><button data-site="https://wikipedia.org">WIKIPEDIA</button><button data-site="https://github.com">GITHUB</button></div></div></div></div>` },
  music(){ return `<div id="player" class="now-playing"><div class="record"></div><h2>Enter the 36 Chambers</h2><p>Original demo ambience — no copyrighted audio included.</p><button id="playMusic" class="primary">PLAY DUST LOOP</button></div>${['Bring Da Ruckus','Shame on a…','Clan in da Front','Protect Ya Neck'].map((t,i)=>`<div class="track"><div class="album-art">36</div><span><b>${t}</b><br><small>Track ${i+1}</small></span><button data-demo-tone="${110+i*35}">▶</button></div>`).join('')}` }
};
function wallPreview(w){ return ({chambers:'linear-gradient(145deg,#090909,#4a155e)',gold:'linear-gradient(145deg,#e2b936,#111)',purple:'linear-gradient(145deg,#ad52ef,#17051f)',concrete:'linear-gradient(145deg,#555,#111)'})[w]; }

function openApp(id){
  appTitle.textContent = ({chambers:'36 Chambers',vault:'Iron Vault',notes:'Scrolls',browser:'36 Browser',music:'Music'})[id] || id[0].toUpperCase()+id.slice(1);
  appContent.innerHTML = (views[id]||(()=>'<p>App unavailable.</p>'))();
  appWindow.classList.remove('hidden'); homeScreen.classList.add('hidden'); bindApp(id);
}
function closeApp(){ appWindow.classList.add('hidden'); homeScreen.classList.remove('hidden'); appContent.innerHTML=''; }

function bindApp(id){
  if(id==='notes'){
    renderNotes(); $('#saveNote').onclick=()=>{const v=$('#noteInput').value.trim();if(!v)return;const notes=JSON.parse(localStorage.getItem('36os-notes')||'[]');notes.unshift({title:'New Scroll',body:v,date:Date.now()});localStorage.setItem('36os-notes',JSON.stringify(notes));$('#noteInput').value='';renderNotes();tone(330,.18)};
  }
  if(id==='settings'){
    $$('[data-wall]').forEach(b=>b.onclick=()=>{os.dataset.wallpaper=b.dataset.wall;localStorage.setItem('36os-wall',b.dataset.wall);$$('[data-wall]').forEach(x=>x.classList.toggle('selected',x===b));});
    $$('[data-toggle]').forEach(b=>b.onclick=()=>b.classList.toggle('on'));
    $('#relock').onclick=()=>{closeApp();homeScreen.classList.add('hidden');lockScreen.classList.remove('hidden');localStorage.removeItem('36os-unlocked')};
  }
  if(id==='browser'){
    const input=$('#browserAddress');
    const resolveAddress=()=>{
      const raw=input.value.trim();
      if(!raw) return 'https://duckduckgo.com/';
      const looksLikeUrl=/^(https?:\/\/|localhost(?::\d+)?(?:\/|$)|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:[\/:?#]|$))/i.test(raw);
      const url=looksLikeUrl ? (/^https?:\/\//i.test(raw)?raw:`https://${raw}`) : `https://duckduckgo.com/?q=${encodeURIComponent(raw)}`;
      input.value=url;
      return url;
    };
    const openRealPage=()=>{
      const url=resolveAddress();
      const opened=window.open(url,'_blank');
      if(opened) opened.opener=null;
      else window.location.assign(url);
    };
    const previewPage=()=>{
      const url=resolveAddress();
      $('#browserView').innerHTML=`<iframe title="Website preview" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" referrerpolicy="strict-origin-when-cross-origin" src="${url.replace(/"/g,'&quot;')}"></iframe><div class="preview-warning">Blank or refused? That site blocks embedding. Tap GO to open it normally.</div>`;
    };
    $('#browserForm').onsubmit=e=>{e.preventDefault();openRealPage()};
    $('#previewPage').onclick=previewPage;
    $('#browserBack').onclick=closeApp;
    $$('[data-site]',appContent).forEach(button=>button.onclick=()=>{input.value=button.dataset.site;openRealPage()});
  }
  if(id==='music'){
    $('#playMusic').onclick=()=>{$('#player').classList.toggle('playing');tone(82,1.8)}; $$('[data-demo-tone]').forEach(b=>b.onclick=()=>tone(Number(b.dataset.demoTone),.55));
  }
  if(id==='camera'){
    $('#cameraStart').onclick=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'},audio:false});$('#cameraFeed').srcObject=s;}catch{showToast('Camera permission unavailable')}};
  }
}
function renderNotes(){
  const notes=JSON.parse(localStorage.getItem('36os-notes')||'[]');
  $('#notesList').innerHTML=notes.length?notes.map(n=>`<article class="note-card"><strong>${escapeHtml(n.title)}</strong><p>${escapeHtml(n.body)}</p></article>`).join(''):'<p style="color:#999">No scrolls yet.</p>';
}
function escapeHtml(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]))}

function registerSW(){ if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{}); }

document.addEventListener('click', e=>{
  const app=e.target.closest('[data-app]'); if(app) openApp(app.dataset.app);
  const key=e.target.closest('[data-key]'); if(key){const k=key.dataset.key;if(k==='⌫')code=code.slice(0,-1);else if(code.length<4)code+=k;updateDots();tone(170+code.length*35,.05);if(code.length===4)setTimeout(submitCode,150)}
});
$('#unlockButton').onclick=openPasscode; $('#cancelPasscode').onclick=()=>$('#passcodeSheet').classList.add('hidden'); $('#closeApp').onclick=closeApp;
$('#weedButton').onclick=toggleWeed;
$('#statusTime').onclick=()=>$('#controlCenter').classList.toggle('hidden'); $('#closeControl').onclick=()=>$('#controlCenter').classList.add('hidden');
$('#lockControl').onclick=()=>{homeScreen.classList.add('hidden');appWindow.classList.add('hidden');lockScreen.classList.remove('hidden');$('#controlCenter').classList.add('hidden')};
$('#focusControl').onclick=e=>e.currentTarget.classList.toggle('active');
$('#brightness').oninput=e=>os.style.setProperty('--brightness',e.target.value/100);
$('#haze').oninput=e=>$('#purpleHaze').style.opacity=os.classList.contains('weed-mode')?e.target.value/100:0;

os.dataset.wallpaper=localStorage.getItem('36os-wall')||'chambers';
if(localStorage.getItem('36os-weed')==='true') os.classList.add('weed-mode');
if(localStorage.getItem('36os-unlocked')==='true'){lockScreen.classList.add('hidden');homeScreen.classList.remove('hidden')}
buildGrid();buildKeypad();updateClock();setInterval(updateClock,1000);boot();registerSW();
