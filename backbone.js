const noButtonTexts = [
"ไม่",
"ไม่ 🥺",
"ไม่จริงหรออ 🥺",
"แน่ใจหรอออว่าไม่",
]

const polaroids = [
  {
    image: "1.jpg",
    caption: "รูปแรกที่ถ่ายเธอ"
  },
  {
    image: "dinner.jpg",
    caption: "กินกับเธออะไรก็อร่อย"
  },
  {
    image: "floatty.jpg",
    caption: "รักคนนี้และ"
  },
  {
    image: "flower.jpg",
    caption: "สิ่งสวยๆๆ กับคนสวยๆๆ"
  }
];

const celebrateSteps = [
    "รักพี่ที่สุดแล้วๆๆ",
    "ขอให้มีเธอไปตลอดเลยไหม"
  ];


const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg, ms=2600){
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(()=> toastEl.classList.remove('show'), ms);
}

function showStage(id){
  document.querySelectorAll('.stage').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(id);
  el.classList.add('active');
}

/* ---- intro sequence ---- */
const introText = document.getElementById('introText');
const introLines = ["พี่ข้าวปุ้นนนนนน", "เด็กมีอะไรจะถาม"];
setTimeout(()=>{
  introText.classList.add('fade-out');
  setTimeout(()=>{
    introText.textContent = introLines[1];
    introText.classList.remove('fade-out');
  }, 420);
}, 1700);
setTimeout(()=>{ showStage('stage-question'); }, 3900);


/* ================= NO button dodge logic ================= */
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
let dodgeCount = 0;
let lastDodgeTime = 0;

function activateFixedPosition(){
  if(noBtn.dataset.fixed) return;
  const rect = noBtn.getBoundingClientRect();
  noBtn.style.position = 'fixed';
  noBtn.style.left = rect.left + 'px';
  noBtn.style.top = rect.top + 'px';
  noBtn.style.margin = '0';
  noBtn.dataset.fixed = '1';
}

function dodgeNoButton(){
  activateFixedPosition();
  dodgeCount++;

  const rect = noBtn.getBoundingClientRect();
  const w = rect.width, h = rect.height;
  const margin = 14;
  const topSafe = 70;
  const bottomSafe = 40;
  const maxX = Math.max(margin, window.innerWidth - w - margin);
  const maxY = Math.max(topSafe, window.innerHeight - h - bottomSafe);

  const x = margin + Math.random() * (maxX - margin);
  const y = topSafe + Math.random() * (maxY - topSafe);

  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';

  const scale = Math.max(0.55, 1 - dodgeCount * 0.025);
  const rotate = (Math.random() * 24 - 12).toFixed(1);
  noBtn.style.transition = 'left .28s cubic-bezier(.3,1.4,.5,1), top .28s cubic-bezier(.3,1.4,.5,1), transform .2s ease';
  noBtn.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

  if(Math.random() < 0.55){
    // const texts = CONFIG.noButtonTexts;
    const texts = noButtonTexts;
    noBtn.textContent = texts[Math.floor(Math.random()*texts.length)];
  }
}

noBtn.addEventListener('pointerenter', dodgeNoButton);
noBtn.addEventListener('touchstart', (e)=>{
  e.preventDefault();
  dodgeNoButton();
}, { passive:false });
noBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  e.stopPropagation();
  dodgeNoButton();
});

// proximity dodge for fast mouse movement on desktop
document.addEventListener('mousemove', (e)=>{
  const stageQ = document.getElementById('stage-question');
  if(!stageQ.classList.contains('active')) return;
  const rect = noBtn.getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  const now = Date.now();
  if(dist < 85 && now - lastDodgeTime > 260){
    lastDodgeTime = now;
    dodgeNoButton();
  }
});

window.addEventListener('resize', ()=>{
  if(noBtn.dataset.fixed){
    const rect = noBtn.getBoundingClientRect();
    const maxX = Math.max(10, window.innerWidth - rect.width - 10);
    const maxY = Math.max(10, window.innerHeight - rect.height - 10);
    noBtn.style.left = Math.min(rect.left, maxX) + 'px';
    noBtn.style.top = Math.min(rect.top, maxY) + 'px';
  }
});

/* ================= YES button -> celebration ================= */
const confettiLayer = document.getElementById('confetti-layer');
const confettiEmojis = ['❤️','💖','💕','✨','🎉','💗','🌸'];

function burstConfetti(){
  const count = 46;
  for(let i=0;i<count;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = confettiEmojis[Math.floor(Math.random()*confettiEmojis.length)];
    const startX = 50 + (Math.random()*40-20);
    piece.style.left = startX + 'vw';
    piece.style.top = '55vh';
    piece.style.fontSize = (16 + Math.random()*20) + 'px';
    confettiLayer.appendChild(piece);

    const dx = (Math.random()*2-1) * (window.innerWidth*0.45);
    const dy = -(Math.random()*window.innerHeight*0.7) - 100;
    const rot = (Math.random()*720-360);
    const dur = 1400 + Math.random()*1000;

    piece.animate([
      { transform:'translate(0,0) rotate(0deg) scale(0.6)', opacity:0 },
      { transform:`translate(${dx*0.3}px, ${dy*0.4}px) rotate(${rot*0.4}deg) scale(1)`, opacity:1, offset:.25 },
      { transform:`translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.9)`, opacity:0 }
    ], { duration: dur, easing:'cubic-bezier(.15,.7,.3,1)' });

    setTimeout(()=> piece.remove(), dur+80);
  }
}

const celebrateTitle = document.getElementById('celebrateTitle');
const celebrateLine = document.getElementById('celebrateLine');
const celebrateSweet = document.getElementById('celebrateSweet');
const moreBtn = document.getElementById('moreBtn');

yesBtn.addEventListener('click', ()=>{
  showStage('stage-celebrate');
  burstConfetti();
  setTimeout(burstConfetti, 350);

  celebrateTitle.textContent = celebrateSteps[0];
  celebrateLine.textContent = '';
  celebrateSweet.style.opacity = 0;
  moreBtn.classList.remove('show');

  setTimeout(()=>{ celebrateLine.textContent = celebrateSteps[1]; }, 900);
  setTimeout(()=>{ celebrateSweet.textContent = "มีกันและกันก็เพียงพอแย้ววว"; celebrateSweet.style.opacity = 1; }, 1700);
  setTimeout(()=>{ moreBtn.classList.add('show'); }, 2400);
});

/* ================= "one more thing" reveal ================= */
const extra = document.getElementById('extra');

function buildExtraContent() {
  const polaroidRow = document.getElementById('polaroidRow');
  polaroidRow.innerHTML = '';

  polaroids.forEach((p, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'polaroid';

    wrap.innerHTML = `
      <div class="tape"></div>

      <div class="frame">
        <img src="${p.image}" alt="${p.caption}">
      </div>

      <span class="cap">${p.caption}</span>
    `;

    polaroidRow.appendChild(wrap);
  });

}

buildExtraContent();

moreBtn.addEventListener('click', ()=>{
  extra.classList.add('show');
  moreBtn.style.display = 'none';
  requestAnimationFrame(()=>{
    document.querySelectorAll('.section-block').forEach((el, i)=>{
      setTimeout(()=> el.classList.add('reveal'), i*180);
    });
  });
  setTimeout(()=>{
    extra.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 200);
});


const startDate = new Date("2026-04-01T00:00:00");

function updateCounter() {
  const now = new Date();
  let diff = now - startDate;

  if (diff < 0) diff = 0;

  const seconds = Math.floor(diff / 1000);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  document.getElementById("counterNum").textContent =
    `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${secs} วินาที`;
}

updateCounter();
setInterval(updateCounter, 1000);