// ── CURSOR
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function animRing() {
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.sign-card,.tool-card,.tech-card,.g-img,.day-cell,.tip-card,.testi-card').forEach(el => {
  el.addEventListener('mouseenter',()=>{ cur.classList.add('big'); ring.classList.add('big'); });
  el.addEventListener('mouseleave',()=>{ cur.classList.remove('big'); ring.classList.remove('big'); });
});

// ── NAV SCROLL
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('small', window.scrollY > 60);
});

// ── SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── COUNTER ANIMATION
let countersRun = false;
const heroObs = new IntersectionObserver(e => {
  if(e[0].isIntersecting && !countersRun) {
    countersRun = true;
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = +el.dataset.target;
      let c = 0; const step = target/60;
      const iv = setInterval(() => {
        c = Math.min(c+step, target);
        el.textContent = Math.floor(c);
        if(c>=target) clearInterval(iv);
      }, 25);
    });
  }
},{threshold:.3});
heroObs.observe(document.getElementById('hero'));

// ── SLIDERS
['q1','q2','q3','q4','q5'].forEach(id => {
  const sl = document.getElementById(id);
  const vl = document.getElementById(id+'v');
  sl.addEventListener('input', () => vl.textContent = sl.value);
});

// ── BURNOUT CALCULATOR
document.getElementById('calc-btn').addEventListener('click', () => {
  const total = ['q1','q2','q3','q4','q5'].reduce((s,id) => s + +document.getElementById(id).value, 0);
  const pct = Math.round((total/50)*100);
  const result = document.getElementById('result');
  const circle = document.getElementById('result-circle');
  const label = document.getElementById('result-label');
  const advice = document.getElementById('result-advice');
  result.classList.add('show');
  const deg = Math.round(pct*3.6);
  let color, lvl, text;
  if(pct<40){ color='var(--accent3)'; lvl='🟢 Low Burnout'; text="You're doing well! Keep your healthy habits. Focus on prevention — maintain boundaries and regular recovery rituals."; }
  else if(pct<65){ color='var(--accent2)'; lvl='🟡 Moderate Burnout'; text="Warning signs are present. Start implementing breathing exercises and the habit tracker now. Consider reducing your workload."; }
  else if(pct<80){ color='var(--accent)'; lvl='🟠 High Burnout'; text="You need immediate action. Start 4-7-8 breathing daily, set firm work boundaries, and prioritize 8 hours of sleep every night."; }
  else{ color='#ef4444'; lvl='🔴 Severe Burnout'; text="Critical level. Please speak with a professional. Begin with complete rest this weekend and take a mental health day immediately."; }
  circle.style.background=`conic-gradient(${color} ${deg}deg, rgba(255,255,255,.05) ${deg}deg)`;
  circle.textContent=pct+'%';
  label.textContent=lvl;
  advice.textContent=text;
  result.scrollIntoView({behavior:'smooth',block:'center'});
});

// ── BREATHING
let breathPattern = {inhale:4,hold:7,exhale:8,name:'4-7-8'};
let phaseTimer = null, cycles = 0;

function setPattern(i,h,e,name,btn) {
  breathPattern={inhale:i,hold:h,exhale:e,name};
  document.querySelectorAll('.b-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  document.getElementById('breathePhase').textContent=name+' selected';
}
function startBreathing() { if(!phaseTimer) doPhase('inhale'); }
function doPhase(phase) {
  const ring=document.getElementById('breatheRing');
  const text=document.getElementById('breatheText');
  const phaseEl=document.getElementById('breathePhase');
  const countEl=document.getElementById('breatheCount');
  let duration=0;
  if(phase==='inhale'){duration=breathPattern.inhale;ring.className='breathe-ring inhale';text.textContent='Breathe\nIn';phaseEl.textContent='Inhale';}
  else if(phase==='hold'){duration=breathPattern.hold;ring.className='breathe-ring';text.textContent='Hold';phaseEl.textContent='Hold Breath';}
  else if(phase==='exhale'){duration=breathPattern.exhale;ring.className='breathe-ring exhale';text.textContent='Breathe\nOut';phaseEl.textContent='Exhale';}
  if(duration===0){
    if(phase==='hold') doPhase('exhale');
    else { cycles++; document.getElementById('breatheCycles').textContent='Cycles completed: '+cycles; doPhase('inhale'); }
    return;
  }
  let cd=duration; countEl.textContent=cd;
  phaseTimer=setInterval(()=>{
    cd--;countEl.textContent=cd;
    if(cd<=0){
      clearInterval(phaseTimer);phaseTimer=null;
      if(phase==='inhale') doPhase('hold');
      else if(phase==='hold') doPhase('exhale');
      else{cycles++;document.getElementById('breatheCycles').textContent='Cycles completed: '+cycles;doPhase('inhale');}
    }
  },1000);
}
function stopBreathing() {
  if(phaseTimer){clearInterval(phaseTimer);phaseTimer=null;}
  document.getElementById('breatheRing').className='breathe-ring';
  document.getElementById('breatheText').textContent='Press\nStart';
  document.getElementById('breathePhase').textContent='Choose a pattern below';
  document.getElementById('breatheCount').textContent='—';
}

// ── POMODORO
let pomTimer=null, pomSec=1500, pomRunning=false;
function startPomodoro() {
  const btn=document.getElementById('pomBtn');
  const disp=document.getElementById('pomodoroDisplay');
  if(pomRunning){
    clearInterval(pomTimer);pomTimer=null;pomRunning=false;pomSec=1500;
    disp.textContent='25:00 ready';btn.textContent='▶ Start Pomodoro';
    return;
  }
  pomRunning=true;btn.textContent='■ Stop';
  pomTimer=setInterval(()=>{
    pomSec--;
    const m=Math.floor(pomSec/60),s=pomSec%60;
    disp.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} remaining`;
    if(pomSec<=0){clearInterval(pomTimer);pomTimer=null;pomRunning=false;disp.textContent='✅ Break time!';btn.textContent='▶ Start Pomodoro';pomSec=1500;}
  },1000);
}

// ── TABS
function switchTab(name,btn) {
  document.querySelectorAll('.tips-content').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  if(btn) btn.classList.add('active');
}

// ── MONTH GRID
(function buildMonthGrid() {
  const grid=document.getElementById('monthGrid');
  const today=26;
  for(let i=1;i<=31;i++){
    const cell=document.createElement('div');
    const isDone = i<today && Math.random()>.35;
    cell.className='day-cell'+(isDone?' done':'')+(i===today?' today':'');
    cell.textContent=i;
    cell.addEventListener('click',()=>cell.classList.toggle('done'));
    grid.appendChild(cell);
  }
})();

// ── PROGRESS BARS
const progressObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.querySelectorAll('.progress-fill').forEach(bar => {
        setTimeout(()=>{ bar.style.width=bar.dataset.width+'%'; }, 200);
      });
    }
  });
},{threshold:0.3});
progressObs.observe(document.getElementById('tracker'));

// ── NEWSLETTER
function handleSubscribe(btn) {
  const input=document.getElementById('emailInput');
  if(!input.value||!input.value.includes('@')){input.style.borderColor='var(--accent)';input.focus();return;}
  btn.textContent='✅ Subscribed!';
  btn.style.background='var(--accent3)';
  input.value='';input.style.borderColor='';
  setTimeout(()=>{btn.textContent='Join Free →';btn.style.background='';},3000);
}