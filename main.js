/* ============================================================
   main.js v5 — for Nela ❤️
   FIXED: "That's my answer ❤️" button now works in every case
   (type=submit, type=button, inside or outside the form).
   Every feature is isolated in its own try/catch so one
   failure can never break the rest of the site.
   ============================================================ */
(()=>{
'use strict';

/* ---------- tiny helpers ---------- */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const LS_KEY='forNelaState_v2';
const WA_URL='https://wa.me/2349066760078?text=Hey+Zeus+%E2%9D%A4%EF%B8%8F+I+finished+the+website.';
const IS_IOS=/iP(hone|ad|od)/.test(navigator.userAgent||'');

let toastTimer=null;
function toast(msg,ms=2600){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),ms);}
const rand=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* run a boot step in its own bubble — one failure never kills the rest */
const safe=(label,fn)=>{try{fn();}catch(err){console.error('['+label+'] failed:',err);}};

/* ---------- sentiment ---------- */
const HEAVY_WORDS=['sad','tired','alone','lonely','cry','crying','hurt','pain','scared','afraid','anxious','anxiety','stress','stressed','overwhelmed','broken','lost','empty','worried','worry','depressed','heavy','exhausted','fail','failed','giving','hate','angry','regret','miss','missing','hard','difficult','struggle','struggling','unhappy','numb','hopeless','worthless','weak','trapped','stuck','fine pretending','tired of'];
const HAPPY_WORDS=['happy','joy','joyful','great','good','love','loved','excited','blessed','grateful','thankful','proud','peace','peaceful','calm','fine','okay','ok','smile','laugh','fun','amazing','beautiful','wonderful','hope','hopeful','better','best','sunshine','glad','cheerful','bright','win','won','free','strong','safe','content','glow','shine','smiling','lovely','awesome','relieved','warm','soft','lucky','blessing','gift','favorite'];

/* ---------- state ---------- */
let state={progress:0,answers:{fun:[],deep:[],fire:[],wish:'',dogPhotos:[],selfie:null}};
function loadState(){
  try{
    const raw=localStorage.getItem(LS_KEY);
    if(raw){
      const s=JSON.parse(raw);
      state={...state,...s,answers:{...state.answers,...(s.answers||{})}};
    }
  }catch(e){/* storage unavailable — site still works */}
}
function saveState(){
  try{
    localStorage.setItem(LS_KEY,JSON.stringify(state));
  }catch(e){
    toast('Progress can\'t be saved on this browser (storage full) — answers still work ❤️');
  }
}

/* ---------- sections ---------- */
const SECTIONS=$$('.section');

/* ---------- quiz questions ---------- */
const FUN=[
  {q:"What's your favorite thing to do when you're bored?",a:["Scrolling & vibing 📱","Listening to music 🎧","Sleeping 😴","Spending time with the people I love ❤️"]},
  {q:"Coffee or tea — and how do you take it?",a:["Coffee, extra sweet ☕","Tea, always 🍵","Both, depends on the day 😌","Honestly? Water 💧"]},
  {q:"What's a movie or show you can watch a hundred times?",a:["A rom-com 🎬","Anime 🌸","Something funny 😂","I rewatch everything"]},
  {q:"Morning person or night owl?",a:["Morning person 🌅","Night owl 🌙","I'm both — painfully 🥱","Depends on my mood"]},
  {q:"What's the last song you had on repeat?",a:["Something emotional 🎶","Afrobeats, obviously 🕺","A song that reminds me of someone ❤️","I don't even know anymore"]},
  {q:"Beach day or cozy rainy day?",a:["Beach day 🌊","Rainy day with blankets 🧸","Both sound perfect right now","I'm a city person 🏙️"]},
  {q:"What food could you eat every single day?",a:["Rice, obviously 🍚","Pasta 🍝","Jollof — don't even ask 🍛","Something sweet 🍰"]},
  {q:"Window seat or aisle seat?",a:["Window — I need the view 🪟","Aisle — I need the legroom 🦵","Any seat, just get me there 🚌","I don't fly, I stay home ✈️"]},
  {q:"What's something small that always makes your day better?",a:["A good message from someone ❤️","Food 🍟","Music 🎧","Sleep 😴"]},
  {q:"If you could teleport anywhere right now, where would you go?",a:["Somewhere with a beach 🌴","Home 🏡","A whole new country ✈️","Somewhere quiet 🌌"]}
];
const DEEP=[
  {q:"What do you do when you're not feeling okay?",a:["I keep it to myself 🤐","I talk to someone I trust 🤍","I sleep it off 😔","I distract myself with anything 📱"]},
  {q:"What's something you wish people understood about you?",a:["That I'm softer than I look 🤍","That I need time alone sometimes 🌙","That I'm trying my best ❤️","That I care more than I show"]},
  {q:"What's a memory you'd relive if you could?",a:["A childhood memory 🧸","A day with someone I love ❤️","A moment I was really happy 😊","Honestly, I don't know yet"]},
  {q:"What's been heavy on your mind lately?",a:["The future 🌫️","Someone I care about ❤️","School / work 📚","Myself, honestly"]},
  {q:"What does a 'good day' look like for you?",a:["No stress, good food 😌","Laughing with people I love 😂","Accomplishing something ✅","Just peace. Quiet peace. 🤍"]},
  {q:"Who's someone you can always be yourself around?",a:["My best friend 👯","My family 👨‍👩‍👧","Someone I'm still getting to know 👀","Myself, honestly 🪞"]},
  {q:"What's a dream you're scared to say out loud?",a:["Something big — like really big 🌍","Traveling the world ✈️","Doing something creative 🎨","That someone special notices me 👀"]},
  {q:"What makes you feel most at peace?",a:["Nighttime, when it's quiet 🌙","Music 🎧","Being around the right people 🤍","Being alone 🕊️"]},
  {q:"What's something you're proud of that you don't talk about?",a:["How far I've come ❤️","The way I handle things 😌","The people I've kept close 🤍","Still being here 🌹"]}
];
const FIRE=[
  {q:"Best compliment you've ever received?",a:["'You make people feel safe' 🤍","'You're funny' 😂","'You're beautiful' ❤️","I never get compliments 🙈"]},
  {q:"What's your go-to comfort food?",a:["Something warm and homemade 🍲","Snacks. All the snacks 🍿","Ice cream 🍨","Rice. Always rice 🍚"]},
  {q:"Cats or dogs? (We know the answer 🐶)",a:["DOGS. Obviously 🐶","Cats 🐱","Both, I can't choose","They're all babies 🥺"]},
  {q:"First thing you do in the morning?",a:["Check my phone 📱","Sleep 5 more minutes 😴","Pray 🙏","Stare at the ceiling 🛏️"]},
  {q:"What's a skill you wish you had?",a:["Singing 🎤","Cooking 👩‍🍳","Being patient 😌","Reading minds 🧠"]},
  {q:"Best way to spend a lazy Sunday?",a:["In bed, all day 🛏️","With people I love ❤️","Watching something good 📺","Eating and napping 😴"]},
  {q:"What always makes you laugh?",a:["My own jokes 😂","Funny videos 📱","My friends 🤣","Nothing. I'm serious. 😤"]},
  {q:"One thing on your bucket list?",a:["Sky-diving 🪂","Traveling to my dream country ✈️","Meeting someone I look up to 🌟","Being truly happy ❤️"]},
  {q:"Last question — what's your sign?",a:["Leo 🦁","Something else — I don't remember ♈","I don't believe in that 🌌","Guess 👀"]}
];

/* ---------- confetti canvas ---------- */
let confetti=[],rafId=null;
function sizeCanvas(){
  const c=$('#confettiCanvas');
  if(!c)return;
  const dpr=window.devicePixelRatio||1;
  c.width=window.innerWidth*dpr;
  c.height=window.innerHeight*dpr;
  c.style.width=window.innerWidth+'px';
  c.style.height=window.innerHeight+'px';
}
function burstConfetti(n){
  const c=$('#confettiCanvas');
  if(!c)return;
  const ctx=c.getContext('2d');
  if(!ctx)return;
  const colors=['#ff6b9d','#ffd166','#a78bfa','#64dfdf','#ff9f68','#f72585','#ffffff'];
  confetti=Array.from({length:n||60},()=>({
    x:Math.random()*c.width,
    y:-20-Math.random()*c.height*0.3,
    w:6+Math.random()*8,
    h:8+Math.random()*10,
    vx:(Math.random()-0.5)*2,
    vy:1.5+Math.random()*2.5,
    rot:Math.random()*Math.PI*2,
    vr:(Math.random()-0.5)*0.2,
    color:rand(colors),
    life:180+Math.random()*120
  }));
  if(!rafId)stepConfetti();
}
function stepConfetti(){
  const c=$('#confettiCanvas');
  if(!c)return;
  const ctx=c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  confetti=confetti.filter(p=>p.life>0);
  confetti.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life--;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle=p.color;
    ctx.globalAlpha=Math.max(0,Math.min(1,p.life/60));
    ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    ctx.restore();
  });
  if(confetti.length){
    rafId=requestAnimationFrame(stepConfetti);
  }else{
    rafId=null;
    ctx.clearRect(0,0,c.width,c.height);
  }
}

/* ---------- particles ---------- */
function buildParticles(){
  const wrap=$('#particles');
  if(!wrap)return;
  wrap.innerHTML='';
  const icons=['❤','✦','✧','♡','♥','·','*'];
  const n=Math.min(24,Math.max(8,Math.floor(window.innerWidth/70)));
  for(let i=0;i<n;i++){
    const p=document.createElement('span');
    p.className='particle';
    p.textContent=rand(icons);
    p.style.left=(Math.random()*100)+'%';
    p.style.animationDelay=(Math.random()*14)+'s';
    p.style.animationDuration=(12+Math.random()*16)+'s';
    p.style.fontSize=(11+Math.random()*15)+'px';
    p.style.opacity=(0.12+Math.random()*0.35).toFixed(2);
    wrap.appendChild(p);
  }
}

/* ---------- progress dots ---------- */
function buildDots(){
  const wrap=$('#progressDots');
  if(!wrap)return;
  wrap.innerHTML='';
  SECTIONS.forEach((s,i)=>{
    const d=document.createElement('button');
    d.type='button';
    d.className='dot';
    const t=s.dataset.title||'section '+(i+1);
    d.title=t;
    d.setAttribute('aria-label','Go to '+t);
    d.addEventListener('click',()=>goTo(i));
    wrap.appendChild(d);
  });
  updateProgress();
}
function updateProgress(){
  const fill=$('#progressFill');
  if(fill)fill.style.width=((state.progress+1)/SECTIONS.length*100)+'%';
  $$('#progressDots .dot').forEach((d,j)=>d.classList.toggle('on',j<=state.progress));
}

/* ---------- navigation ---------- */
function goTo(i){
  i=Math.max(0,Math.min(i,SECTIONS.length-1));
  if(!SECTIONS[i])return;
  state.progress=i;
  saveState();
  SECTIONS.forEach((s,j)=>s.classList.toggle('active',j===i));
  updateProgress();
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ---------- delegated Continue binding (works for every button, static or injected) ---------- */
function bindGotos(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-goto]');
    if(!b)return;
    e.preventDefault();
    const n=parseInt(b.dataset.goto,10);
    if(!isNaN(n))goTo(n);
  });
}

/* ---------- quizzes ---------- */
function renderQuiz(boxSel,counterSel,questions,key,next,skip){
  const box=$(boxSel),counter=$(counterSel);
  if(!box)return;
  const answers=state.answers[key]||[];
  state.answers[key]=answers;
  const total=questions.length;
  const done=answers.length>=total;
  if(counter)counter.textContent=done?('All '+total+' answered — thank you ❤️'):('Question '+Math.min(answers.length+1,total)+' of '+total);
  box.innerHTML='';
  if(done){
    const sec=box.closest('.section');
    const hasGoto=sec&&sec.querySelector('[data-goto]');
    const d=document.createElement('div');
    d.className='quiz-done';
    d.textContent='All answered — thank you for sharing ❤️';
    box.appendChild(d);
    if(!hasGoto&&next!=null&&SECTIONS[next]){
      const b=document.createElement('button');
      b.type='button';
      b.className='btn';
      b.dataset.goto=String(next);
      b.textContent='Continue ❤️';
      box.appendChild(b);
    }
    return;
  }
  const q=questions[answers.length];
  if(!q)return;
  const qEl=document.createElement('div');
  qEl.className='quiz-q';
  const qp=document.createElement('p');
  qp.className='quiz-question';
  qp.textContent=q.q;
  qEl.appendChild(qp);
  const wrap=document.createElement('div');
  wrap.className='quiz-opts';
  (q.a||[]).forEach(opt=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='chip opt';
    b.textContent=opt;
    b.addEventListener('click',()=>{
      answers[answers.length]=opt;
      saveState();
      [...wrap.children].forEach(c=>c.classList.remove('picked'));
      b.classList.add('picked');
      if(answers.length>=total)toast('That\'s the last one — you\'re amazing ❤️');
      setTimeout(()=>renderQuiz(boxSel,counterSel,questions,key,next,skip),220);
    });
    wrap.appendChild(b);
  });
  if(skip){
    const sk=document.createElement('button');
    sk.type='button';
    sk.className='chip opt skip';
    sk.textContent='Skip this one →';
    sk.addEventListener('click',()=>{
      answers[answers.length]='';
      saveState();
      setTimeout(()=>renderQuiz(boxSel,counterSel,questions,key,next,skip),120);
    });
    wrap.appendChild(sk);
  }
  qEl.appendChild(wrap);
  box.appendChild(qEl);
}

/* ---------- photo uploads ---------- */
function compress(img,maxW,quality){
  const w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
  const scale=Math.min(1,(maxW||760)/w);
  const cw=Math.round(w*scale),ch=Math.round(h*scale);
  const canvas=document.createElement('canvas');
  canvas.width=cw;canvas.height=ch;
  canvas.getContext('2d').drawImage(img,0,0,cw,ch);
  return canvas.toDataURL('image/jpeg',quality||0.75);
}
function wirePhotos(inputId,zoneId,previewId,countId,key,single){
  const input=$('#'+inputId),zone=$('#'+zoneId),preview=$('#'+previewId),count=$('#'+countId);
  if(!input)return;
  const list=()=>{state.answers[key]=state.answers[key]||[];return state.answers[key];};
  const render=()=>{
    const arr=list();
    if(preview)preview.innerHTML='';
    arr.forEach((src,i)=>{
      const d=document.createElement('div');
      d.className='preview-item';
      d.innerHTML='<img src="'+src+'" alt="photo '+(i+1)+'"><button class="rm" aria-label="remove">✕</button>';
      d.querySelector('.rm').addEventListener('click',()=>{
        arr.splice(i,1);
        saveState();
        render();
      });
      preview.appendChild(d);
    });
    if(count)count.textContent=arr.length?(arr.length+' photo'+(arr.length>1?'s':'')+' saved on this device ❤️'):'';
    if(single)input.value='';
  };
  const handleFiles=(files)=>{
    const arr=list();
    if(!single&&arr.length>=8){toast('Max 8 dog photos ❤️');return;}
    if(single&&arr.length)arr.length=0;
    const room=single?1:8-arr.length;
    [...files].slice(0,Math.max(0,room)).forEach(file=>{
      if(!file.type.startsWith('image/'))return;
      const reader=new FileReader();
      reader.onload=e=>{
        const img=new Image();
        img.onload=()=>{
          arr.push(compress(img,760,0.75));
          saveState();
          render();
          if(!single)toast('Photo added ❤️');
        };
        img.src=e.target.result;
      };
      reader.readAsDataURL(file);
    });
    if(single&&files.length)toast('Photo ready — tap "Send Photo to Zeus" ❤️');
  };
  input.addEventListener('change',()=>handleFiles(input.files));
  if(zone){
    ['dragover','dragenter'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('drag');}));
    ['dragleave','drop'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('drag');}));
    zone.addEventListener('drop',e=>handleFiles(e.dataTransfer.files));
  }
  render();
}

/* ============================================================
   THE "That's my answer ❤️" BUTTON FIX.
   v4 only listened for the form's submit event — if the button
   is type="button", or sits outside the <form>, clicks did
   nothing. v5 binds EVERY button inside the wish section, so
   it works no matter how the HTML is structured.
   ============================================================ */
function buildWishReply(text){
  const t=String(text||'').toLowerCase();
  const heavy=HEAVY_WORDS.some(w=>t.includes(w));
  const happy=HAPPY_WORDS.some(w=>t.includes(w));
  if(heavy)return rand([
    "I hear you. That takes courage to write down, and I'm glad you shared it. I'm here — always. ❤️",
    "Thank you for trusting me with that. You don't have to carry it alone. I've got your back. 🤍",
    "That sounds heavy, and you're still here — that says everything about your strength. One day at a time, okay? I'm here."
  ]);
  if(happy)return rand([
    "I love that for you. Genuinely. Hold onto that feeling — you deserve it. ❤️",
    "That made me smile. Keep chasing that — you deserve every bit of it. 🤍",
    "Beautiful answer. I hope this year gives you more of exactly that."
  ]);
  return rand([
    "That's a beautiful answer — thank you for being honest. I'm rooting for you, always. ❤️",
    "Noted, Nela. And whatever it is, I hope it finds its way to you. You deserve it. 🤍",
    "I love that. Whatever it is, I hope life is gentle with you while you get there. ❤️"
  ]);
}
function wireWish(){
  const text=$('#wishText');
  if(!text)return;                                  // no textarea → nothing to do
  const form=$('#wishForm'),resp=$('#wishResponse'),cont=$('#wishContinue');
  const sec=text.closest('.section');
  let busy=false;
  const submit=()=>{
    if(busy)return;                                 // guard against double-fire
    const val=text.value.trim();
    if(!val){toast('Write something first — anything ❤️');text.focus();return;}
    busy=true;
    state.answers.wish=val;
    saveState();
    if(resp){
      resp.innerHTML='<span class="reply-kicker">Zeus says…</span>'+esc(buildWishReply(val));
      resp.hidden=false;
    }
    if(cont)cont.hidden=false;
    if(form)form.hidden=true;
    burstConfetti(40);
    if(resp)resp.scrollIntoView({behavior:'smooth',block:'center'});
  };
  /* 1) normal form submit (button type=submit / Enter key) */
  if(form)form.addEventListener('submit',e=>{e.preventDefault();submit();});
  /* 2) direct clicks on ANY button in this section (covers type="button" and buttons outside the form) */
  if(sec)sec.querySelectorAll('button').forEach(b=>{
    if(b.id==='wishContinue')return;                // Continue is handled by data-goto
    if(b.hasAttribute('data-goto'))return;
    b.addEventListener('click',e=>{e.preventDefault();submit();});
  });
  /* 3) restore a previously saved answer */
  if(state.answers.wish){
    text.value=state.answers.wish;
    if(resp){
      resp.innerHTML='<span class="reply-kicker">Zeus says…</span>'+esc(buildWishReply(state.answers.wish));
      resp.hidden=false;
    }
    if(cont)cont.hidden=false;
    if(form)form.hidden=true;
  }
}

/* ---------- voice (speechSynthesis) ---------- */
function wireVoice(){
  const play=$('#voicePlay'),pause=$('#voicePause'),resume=$('#voiceResume'),stop=$('#voiceStop');
  const status=$('#voiceStatus'),fallback=$('#voiceFallback');
  if(!play||!('speechSynthesis'in window)){
    if(fallback)fallback.hidden=false;
    return;
  }
  const synth=window.speechSynthesis;
  let utter=null;
  const finalText=()=>{
    const el=$('#finalText');
    return el?el.innerText.replace(/\s+/g,' ').trim():'';
  };
  const setStatus=s=>{if(status)status.textContent=s;};
  const syncButtons=()=>{
    const speaking=synth.speaking,paused=synth.paused;
    play.disabled=speaking&&!paused;
    stop.disabled=!speaking;
    if(IS_IOS){
      pause.disabled=true;
      resume.disabled=true;
      if(paused)setStatus("Paused — iOS can't resume, press ▶ Listen again ❤️");
    }else{
      pause.disabled=!speaking||paused;
      resume.disabled=!speaking||!paused;
    }
  };
  play.addEventListener('click',()=>{
    synth.cancel();
    const t=finalText();
    if(!t)return;
    utter=new SpeechSynthesisUtterance(t);
    utter.rate=1;
    utter.pitch=1.02;
    utter.lang='en-US';
    utter.onstart=()=>{setStatus('Reading… 🎧');syncButtons();};
    utter.onend=()=>{setStatus('Done reading. Want me to go again? ❤️');syncButtons();};
    utter.onerror=()=>{setStatus('Hmm, the voice got interrupted — press ▶ Listen again ❤️');syncButtons();};
    synth.speak(utter);
    syncButtons();
  });
  pause.addEventListener('click',()=>{synth.pause();setStatus('Paused ⏸ — press ▶️ Resume');syncButtons();});
  resume.addEventListener('click',()=>{synth.resume();setStatus('Continuing… 🎧');syncButtons();});
  stop.addEventListener('click',()=>{synth.cancel();setStatus('Stopped ⏹');syncButtons();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){synth.cancel();setStatus('Stopped ⏹');syncButtons();}
  });
  syncButtons();
}

/* ---------- WhatsApp ---------- */
function wireWa(){
  const btn=$('#waBtn');
  if(!btn)return;
  btn.addEventListener('click',()=>{
    location.href=WA_URL;
    toast('WhatsApp is opening — tap 📎, attach your photo, then send ❤️',3400);
  });
}

/* ---------- restart ---------- */
function wireRestart(){
  const link=$('#restartLink');
  if(!link)return;
  link.addEventListener('click',e=>{
    e.preventDefault();
    goTo(0);
    toast('Starting over — your answers are still saved ❤️');
  });
}

/* ---------- overlay ---------- */
function handleOverlay(){
  const ov=$('#welcomeOverlay');
  if(ov)setTimeout(()=>ov.remove(),2400);
}
function revealBody(){
  document.body.style.opacity='1';
  document.body.style.visibility='visible';
}

/* ---------- safety styles (only for elements JS creates) ---------- */
function injectSafetyStyles(){
  const id='v4-safety-styles';
  if($('#'+id))return;
  const st=document.createElement('style');
  st.id=id;
  st.textContent=''+
  '.particle{position:fixed;bottom:-12vh;pointer-events:none;z-index:0;animation:particleUp linear infinite;}'+
  '@keyframes particleUp{0%{transform:translateY(0) rotate(0deg);opacity:0;}10%{opacity:.8;}100%{transform:translateY(-118vh) rotate(340deg);opacity:0;}}'+
  '.quiz-q{animation:fadeUp .35s ease both;}'+
  '@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}'+
  '.quiz-opts{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;}'+
  '.quiz-opts .opt{border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:inherit;padding:12px 16px;border-radius:999px;font:inherit;cursor:pointer;transition:.2s;text-align:left;}'+
  '.quiz-opts .opt:hover{background:rgba(255,255,255,.14);transform:translateY(-2px);}'+
  '.quiz-opts .opt.picked{background:#ff6b9d;border-color:#ff6b9d;color:#fff;}'+
  '.quiz-opts .opt.skip{opacity:.65;font-style:italic;}'+
  '.quiz-done{opacity:.85;font-style:italic;}'+
  '#progressDots .dot{width:9px;height:9px;border-radius:50%;border:0;background:rgba(255,255,255,.25);padding:0;margin:0 3px;cursor:pointer;transition:.25s;}'+
  '#progressDots .dot.on{background:#ff6b9d;transform:scale(1.25);}'+
  '[data-goto]{cursor:pointer;}';
  document.head.appendChild(st);
}

/* ---------- boot (every step isolated so nothing can break the rest) ---------- */
function boot(){
  safe('loadState',loadState);
  safe('dots',buildDots);
  safe('particles',buildParticles);
  safe('canvas',sizeCanvas);
  safe('styles',injectSafetyStyles);
  safe('gotos',bindGotos);
  safe('quiz-fun',()=>renderQuiz('#funBox','#funCounter',FUN,'fun',4));
  safe('quiz-deep',()=>renderQuiz('#deepBox','#deepCounter',DEEP,'deep',7,true));
  safe('quiz-fire',()=>renderQuiz('#fireBox','#fireCounter',FIRE,'fire',9));
  safe('wish',wireWish);
  safe('photos-dog',()=>wirePhotos('dogInput','dogZone','dogPreview','dogCount','dogPhotos'));
  safe('photos-selfie',()=>wirePhotos('selfieInput','selfieZone','selfiePreview','selfieCount','selfie',true));
  safe('voice',wireVoice);
  safe('whatsapp',wireWa);
  safe('restart',wireRestart);
  safe('goto',()=>goTo(state.progress||0));
  window.addEventListener('resize',sizeCanvas);
  window.addEventListener('error',()=>revealBody());
}
try{
  boot();
}catch(err){
  console.error('boot error:',err);
  if(SECTIONS.length&&!$$('.section.active').length)SECTIONS[0].classList.add('active');
}finally{
  handleOverlay();
  revealBody();
}
})();
/* ============ main.js v5 — END ============ */
