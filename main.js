/* ============================================================
   main.js — for Nela ❤️  (Part 1)
   Vanilla JavaScript. No dependencies. Works offline.
   ============================================================ */
'use strict';

/* ---------- tiny helpers ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ---------- local state (answers stay on her device) ---------- */
const STATE_KEY = 'forNelaState_v1';

const defaultState = {
  current: 0,
  dogPhotos: [],
  selfie: null,
  answers: {},
  funIndex: 0,
  deepIndex: 0,
  fireIndex: 0,
  wishDone: false,
  completed: false
};

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (e) {
    return { ...defaultState };
  }
}

let state = loadState();
let storageWarned = false;

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    if (!storageWarned) {
      storageWarned = true;
      showToast('Storage is full, so I\'m keeping things in memory for now ❤️');
    }
  }
}

/* ---------- toast ---------- */
let toastTimer = null;
function showToast(msg) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3400);
}

/* ---------- injected CSS (section exit + inline quote) ---------- */
(function injectStyle() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: none; }
      to   { opacity: 0; transform: translateY(-8px) scale(0.98); }
    }
    .quote-inline {
      margin: 14px 0 0;
      font-family: 'Caveat', cursive;
      font-size: 1.35rem;
      line-height: 1.4;
      color: #ffd9a0;
      text-align: center;
    }
  `;
  document.head.appendChild(s);
})();

/* ============================================================
   NAVIGATION — the journey
   ============================================================ */
const sections = $$('.section');
const TOTAL = sections.length;
let current = 0;
let animating = false;

function buildDots() {
  const wrap = $('#progressDots');
  wrap.innerHTML = '';
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'dot';
    wrap.appendChild(d);
  }
}

function updateProgress() {
  $('#progressFill').style.width = (current / (TOTAL - 1)) * 100 + '%';
  $$('.progress-dots .dot').forEach((d, i) => d.classList.toggle('on', i <= current));
}

function goTo(n) {
  if (n < 0 || n >= TOTAL || animating || n === current) return;
  animating = true;
  const from = sections[current];
  const to = sections[n];

  from.classList.add('out');
  from.style.animation = 'fadeOut 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) forwards';

  setTimeout(() => {
    from.classList.remove('active', 'out');
    from.style.animation = '';
    to.classList.add('active');

    const stag = to.querySelector('.stagger');
    if (stag) {
      stag.classList.remove('replay');
      void stag.offsetWidth; // restart entrance transitions
      stag.classList.add('replay');
    }

    window.scrollTo(0, 0);
    current = n;
    state.current = n;
    if (current === TOTAL - 1) state.completed = true;
    saveState();
    updateProgress();
    setParticleIntensity(particleLevel(n));
    triggerSectionFX(n);
    animating = false;
  }, 470);
}

function bindGotoButtons() {
  $$('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => goTo(+btn.dataset.goto));
  });
}

function initRestart() {
  $('#restartLink').addEventListener('click', () => {
    goTo(0);
    showToast('Starting over — your answers are still saved ❤️');
  });
}

function initStaggerDelays() {
  $$('.stagger').forEach(group => {
    [...group.children].forEach((el, i) => {
      el.style.setProperty('--sd', Math.min(i * 0.09, 1.1) + 's');
    });
  });
}

function particleLevel(n) {
  return [1, 2, 1, 2, 3, 2, 2, 2, 2, 3][n] || 1;
}

function triggerSectionFX(n) {
  if (n === 1) confettiBurst(120); // birthday 🎉
  if (n === 9) confettiBurst(60);  // final message
}

function setParticleIntensity(level) {
  document.body.dataset.particles = level;
}

/* ============================================================
   FLOATING PARTICLES + STATIC TWINKLES
   ============================================================ */
const PARTICLE_EMOJI = ['❤️', '🩷', '✨', '💫', '⭐', '🌸', '💜'];
let particleTimer = null;

function startParticles() {
  if (particleTimer) return;
  particleTimer = setInterval(() => {
    const level = +(document.body.dataset.particles || 0);
    if (level <= 0) return;
    const count = level === 3 ? 2 : 1;
    for (let i = 0; i < count; i++) spawnParticle();
  }, 1100);
}

function spawnParticle() {
  const wrap = $('#particles');
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = pick(PARTICLE_EMOJI);
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (14 + Math.random() * 20) + 'px';
  el.style.setProperty('--d', (16 + Math.random() * 16) + 's');
  el.style.setProperty('--dl', (Math.random() * 8) + 's');
  el.style.setProperty('--po', (0.05 + Math.random() * 0.12).toFixed(2));
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 36000);
}

function spawnStaticTwinkles() {
  const wrap = $('#particles');
  for (let i = 0; i < 26; i++) {
    const el = document.createElement('div');
    el.className = 'twinkle';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = Math.random() * 100 + 'vh';
    el.style.setProperty('--d', (3 + Math.random() * 4) + 's');
    el.style.setProperty('--dl', (Math.random() * 5) + 's');
    wrap.appendChild(el);
  }
}

/* ============================================================
   CONFETTI (canvas)
   ============================================================ */
const canvas = $('#confettiCanvas');
const ctx = canvas.getContext('2d');
let confetti = [];
let confettiRunning = false;

function sizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', sizeCanvas);
sizeCanvas();

function confettiBurst(n = 100) {
  const colors = ['#ff8fc0', '#b78bff', '#ffd9a0', '#ffffff', '#ff6fa5', '#d9b8ff'];
  for (let i = 0; i < n; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 5 + Math.random() * 7,
      h: 8 + Math.random() * 8,
      c: pick(colors),
      vx: -1.2 + Math.random() * 2.4,
      vy: 1.5 + Math.random() * 2.4,
      rot: Math.random() * Math.PI * 2,
      vr: -0.12 + Math.random() * 0.24,
      heart: Math.random() < 0.25
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(confettiTick);
  }
}

function confettiTick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti = confetti.filter(p => p.y < canvas.height + 40);
  for (const p of confetti) {
    p.x += p.vx + Math.sin(p.y * 0.01) * 0.6;
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    if (p.heart) {
      ctx.font = p.w + 'px serif';
      ctx.fillText('❤️', -p.w / 2, p.w / 2);
    } else {
      ctx.globalAlpha = 0.9;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  if (confetti.length) requestAnimationFrame(confettiTick);
  else confettiRunning = false;
}

/* ============================================================
   QUESTION DATA
   ============================================================ */
const FUN_QUESTIONS = [
  {
    id: 'f_bored', q: 'What\'s your favorite thing to do when you\'re bored?', type: 'choice',
    options: [
      { t: 'Scrolling mindlessly 📱', r: 'A professional, I see 📱😂' },
      { t: 'Sleeping 😴', r: 'Sleeping is a personality trait at this point 😂❤️' },
      { t: 'Listening to music 🎧', r: 'Music fixes most things, honestly 🎧❤️' },
      { t: 'Drawing or writing ✍️', r: 'Okay, creative Nela. I respect that ✍️' },
      { t: 'Going outside 🌤️', r: 'Fresh air? Good for the soul 🌤️' },
      { t: 'Snacking 🍫', r: 'Snack queen behavior. I love that 🍫😂' }
    ]
  },
  {
    id: 'f_food', q: 'What\'s your favorite food?', type: 'choice',
    options: [
      { t: 'Anything with rice 🍚', r: 'Rice never disappoints. Smart choice 🍚❤️' },
      { t: 'Pizza 🍕', r: 'Pizza is a personality type and I respect it 🍕' },
      { t: 'Sweets or chocolate 🍩', r: 'Sweet tooth detected. Very understandable 🍩❤️' },
      { t: 'Jollof anything 🍛', r: 'Jollof?! Okay, you have taste 🍛😂' },
      { t: 'Soups 🍲', r: 'Soups are underrated, honestly 🍲❤️' },
      { t: 'I\'m a snack person 🍟', r: 'Snacks count as a meal if you believe in yourself 🍟😂' }
    ]
  },
  {
    id: 'f_place', q: 'What\'s one place you\'d love to visit?', type: 'choice',
    options: [
      { t: 'The beach 🏖️', r: 'Beach Nela. I can see it 🏖️❤️' },
      { t: 'Paris 🇫🇷', r: 'Paris? I hope you get there someday 🇫🇷' },
      { t: 'Tokyo 🇯🇵', r: 'Tokyo would suit you, I think 🇯🇵' },
      { t: 'Somewhere quiet in nature 🌲', r: 'Quiet and green. That sounds peaceful 🌲' },
      { t: 'Korea 🇰🇷', r: 'Korea! Okay, I see you 🇰🇷' },
      { t: 'Everywhere. All of it 🌍', r: 'A whole world tour. I hope you see all of it 🌍' }
    ]
  },
  {
    id: 'f_pets', q: 'Dogs or cats?', type: 'emoji',
    options: [
      { t: '🐶', r: 'Obviously. We already knew 🐶❤️' },
      { t: '🐱', r: 'A cat person?! With all that dog love? Multi-talented 😂' },
      { t: 'Both 🥹', r: 'Both is the only correct answer, honestly 😂❤️' }
    ]
  },
  { id: 'f_song', q: 'What\'s your favorite song right now?', type: 'text', placeholder: 'Song name (or artist)…' },
  {
    id: 'f_comfy', q: 'What kind of person makes you feel comfortable?', type: 'choice',
    options: [
      { t: 'Someone who actually listens 👂', r: 'That\'s a really thoughtful answer. Everyone deserves to be heard like that ❤️' },
      { t: 'Someone who makes me laugh 😂', r: 'Okayyy, I like that answer 😂❤️' },
      { t: 'Someone calm and patient 🕊️', r: 'Calm people are underrated. I hope you have someone like that ❤️' },
      { t: 'Someone who doesn\'t judge me 🤍', r: 'That one matters a lot. You deserve that, you know 🤍' },
      { t: 'Someone who checks on me 💭', r: 'A real one. Someone who checks on you without being asked 💭❤️' }
    ]
  },
  { id: 'f_smile', q: 'What\'s something that can instantly make you smile?', type: 'text', placeholder: 'Tell me…' },
  { id: 'f_try', q: 'What\'s something you\'ve always wanted to try?', type: 'text', placeholder: 'Anything counts…' },
  { id: 'f_day', q: 'If you could have one perfect day, what would it look like?', type: 'text', placeholder: 'Describe it…' },
  { id: 'f_secret', q: 'What is something people don\'t know about you?', type: 'text', placeholder: 'Your secret is safe here 🤫' }
];

const DEEP_QUESTIONS = [
  { id: 'd_notokay', q: 'What do you do when you\'re not feeling okay?', placeholder: 'Whatever it is…', canSkip: true },
  { id: 'd_talk', q: 'Who do you usually talk to when life gets difficult?', placeholder: 'It\'s okay if the answer is "no one"…', canSkip: true },
  { id: 'd_understood', q: 'What is something you wish people understood about you?', placeholder: 'Say it…', canSkip: true },
  { id: 'd_past', q: 'What is one thing you wish you could change about your past?', placeholder: 'Only if you want to…', canSkip: true },
  { id: 'd_safe', q: 'What makes you feel safe around someone?', placeholder: 'Think about it…', canSkip: true },
  { id: 'd_lose', q: 'What\'s something you\'re scared of losing?', placeholder: 'Be honest…', canSkip: true },
  { id: 'd_hope', q: 'What\'s something you secretly hope happens someday?', placeholder: 'Secret hopes are allowed…', canSkip: true },
  { id: 'd_happylast', q: 'When was the last time you genuinely felt happy?', placeholder: 'It\'s okay if you have to think…', canSkip: true },
  { id: 'd_badday', q: 'What do you wish someone would tell you when you\'re having a bad day?', placeholder: 'I\'m listening…', canSkip: true }
];

const FIRE_QUESTIONS = [
  {
    id: 'r_ff', q: 'Before FF, what did you usually do for fun?', type: 'choice',
    options: [
      { t: 'Gaming 🎮', r: 'Gamer Nela before FF. It all makes sense now 🎮😂' },
      { t: 'Sleeping 😴', r: 'Consistent. I respect the dedication 😴😂' },
      { t: 'Going out 🚶', r: 'Out and about. Sounds fun 🚶' },
      { t: 'Reading 📖', r: 'A reader?! Okay, that\'s interesting 📖❤️' },
      { t: 'Drawing 🎨', r: 'Creative Nela, I see you 🎨' },
      { t: 'Mischief 😈', r: 'Mischief?? I\'m gonna need details 😈😂' }
    ]
  },
  {
    id: 'r_morning', q: 'Morning or night?', type: 'emoji',
    options: [
      { t: '🌅 Morning', r: 'A morning person… noted. I\'ll pretend that\'s normal 😂' },
      { t: '🌙 Night', r: 'Night crew. Same, honestly 🌙' }
    ]
  },
  {
    id: 'r_call', q: 'Call or text?', type: 'choice',
    options: [
      { t: 'Call 📞', r: 'A caller. Bold. I respect it 📞' },
      { t: 'Text 💬', r: 'Text queen. Safe choice 💬' },
      { t: 'Voice notes 🎙️', r: 'Voice notes are elite. We love someone with range 🎙️😂' }
    ]
  },
  {
    id: 'r_sweet', q: 'Sweet or spicy?', type: 'emoji',
    options: [
      { t: '🍭 Sweet', r: 'Sweet tooth, soft heart 🍭❤️' },
      { t: '🌶️ Spicy', r: 'Spicy. I should\'ve known 🌶️😂' }
    ]
  },
  {
    id: 'r_beach', q: 'Beach or cinema?', type: 'choice',
    options: [
      { t: '🏖️ Beach', r: 'Beach it is. Sun, sand, peace 🏖️' },
      { t: '🎬 Cinema', r: 'Cinema. Noted — that\'s date material 🎬😂' }
    ]
  },
  {
    id: 'r_home', q: 'Stay home or go outside?', type: 'choice',
    options: [
      { t: '🏠 Home', r: 'Home is a mood, honestly 🏠' },
      { t: '🌤️ Outside', r: 'Outdoor Nela 🌤️' },
      { t: 'Depends on the day 😂', r: 'Same. Depends on the day, the vibe, the weather 😂' }
    ]
  },
  { id: 'r_obsession', q: 'What\'s your biggest random obsession?', type: 'text', placeholder: 'Spill it…' },
  { id: 'r_hours', q: 'What\'s one thing you could talk about for hours?', type: 'text', placeholder: 'Anything at all…' },
  { id: 'r_memory', q: 'What\'s your favorite memory?', type: 'text', placeholder: 'Tell me about it…' }
];

/* ============================================================
   RESPONSE ENGINE — caring, never judging, never diagnosing
   ============================================================ */
const HAPPY_POOL = [
  'Okayyy, I like that answer 😂❤️',
  'That\'s such a you answer. I love that ❤️',
  'See? This is why talking to you is fun 😄',
  'Okay that one made me smile. Keep that energy ❤️'
];

const NEUTRAL_POOL = [
  'Thank you for sharing that with me ❤️',
  'Noted. Filed away in my "things about Nela" folder 📁😄',
  'That\'s a good answer. I like knowing that about you ❤️',
  'Honestly? I\'d love to hear more about that someday ❤️'
];

const HEAVY_CORE = [
  'Hey. Thank you for being honest with this little page. You don\'t have to carry everything alone — take things one moment at a time. You matter, even on the days when you don\'t feel like you do ❤️',
  'Hey… don\'t let that answer make you feel alone. You deserve better days too, and I believe they\'re coming ❤️',
  'I\'m really glad you wrote that. I won\'t pretend to know exactly how you feel, but I want you to know you\'re not invisible, and you don\'t have to handle everything by yourself ❤️'
];

function analyzeText(t) {
  const heavyWords = [
    'sad', 'cry', 'crying', 'depress', 'lonely', 'alone', 'empty', 'hurt', 'pain',
    'tired', 'exhaust', 'stress', 'anxious', 'anxiety', 'scared', 'afraid', 'worried',
    'lost', 'stuck', 'hopeless', 'give up', 'end it', 'die', 'hate myself', 'worthless',
    'useless', 'numb', 'broken', 'unhappy', 'down', 'terrible', 'awful', 'worst',
    'no one', 'nobody', 'ignore', 'invisible', 'can\'t remember', 'long time'
  ];
  const happyWords = [
    'happy', 'good', 'great', 'love', 'enjoy', 'fun', 'smile', 'laugh', 'excited',
    'awesome', 'amazing', 'nice', 'beautiful', 'peace', 'calm', 'warm', 'blessed',
    'grateful', 'fine', 'okay', 'better', 'hopeful', 'friends', 'family', 'music', 'sun'
  ];
  let heavy = 0, happy = 0;
  for (const w of heavyWords) if (t.includes(w)) heavy++;
  for (const w of happyWords) if (t.includes(w)) happy++;
  return { heavy: heavy > happy, happy: happy > heavy };
}

function heavyReply(group) {
  const core = pick(HEAVY_CORE);
  if (group === 'deep') {
    return core + '<p class="quote-inline">"Bad days are chapters, not the whole story."</p>';
  }
  return core;
}

function deepNeutral(item, t) {
  switch (item.id) {
    case 'd_talk':
      if (/(nobody|no one|alone|myself)/.test(t)) {
        return '<p>I\'m really glad you wrote that honestly. I hope you know you don\'t have to go through things silently — there are people who would listen, including me ❤️</p>';
      }
      return '<p>That\'s good — having someone to talk to matters more than people realize. I\'m glad you have that ❤️</p>';
    case 'd_happylast':
      if (/(can't remember|cannot remember|long time|don't know|not sure|years|months)/.test(t)) {
        return '<p>Hey. If it\'s been a while, that\'s okay to admit. I hope something small reminds you what it feels like — soon, and often ❤️</p>';
      }
      return '<p>That\'s a good memory to keep. I hope more days like that are coming your way ❤️</p>';
    case 'd_past':
      return '<p>Thank you for trusting me with that. I hope your future gives you better things to look back on ❤️</p>';
    case 'd_hope':
      return '<p>That\'s a good one to hold onto. I hope someday it stops being a secret and becomes real ❤️</p>';
    case 'd_safe':
      return '<p>Feeling safe around someone is rare — I hope you find more of that ❤️</p>';
    case 'd_lose':
      return '<p>That tells me what you truly value. I hope you never have to lose it ❤️</p>';
    case 'd_understood':
      return '<p>I hear that. People usually only see the surface — I hope you get people who look deeper ❤️</p>';
    case 'd_notokay':
      return '<p>Thanks for being honest. Whatever you do, I hope you also remember you\'re not supposed to handle everything alone ❤️</p>';
    case 'd_badday':
      return '<p>That\'s a really kind thing to want to hear. I hope someone tells you exactly that — and if not, let this be it: you\'re doing better than you think, and you\'re not alone ❤️</p>';
    default:
      return pick(NEUTRAL_POOL);
  }
}

function funTextReply(item, t) {
  switch (item.id) {
    case 'f_song':
      if (/(happy|love|dance|good|vibe|favorite|best|energy|calm|peace)/.test(t)) return pick(HAPPY_POOL);
      return '<p>I\'ll have to listen to it and give you my verdict 🎧😌</p>';
    case 'f_smile':
      if (/(happy|love|dog|friend|family|music|food|sun|smile|laugh)/.test(t)) {
        return '<p>That\'s so simple and so real. I hope it happens every day ❤️</p>';
      }
      return '<p>Noted. I\'ll file that under "ways to make Nela smile" 😄❤️</p>';
    case 'f_try':
      if (/(hope|wish|dream|someday|one day|finally|start|learn|travel|see|go|become)/.test(t)) {
        return '<p>Then I really hope life gives you the chance to try it — seriously ❤️</p>';
      }
      return '<p>Okay, now I\'m curious. When you do try it, you have to tell me how it goes 😄</p>';
    case 'f_day':
      return '<p>That sounds like a day worth having. I hope you get exactly that, and even better ❤️</p>';
    case 'f_secret':
      return '<p>Noted. Your secret is safe with this website 🤫❤️</p>';
    default:
      return pick(NEUTRAL_POOL);
  }
}

function pickFireReply(item, t) {
  switch (item.id) {
    case 'r_obsession':
      if (/(ff|game|food|sleep|tiktok|anime|music|book|phone)/.test(t)) {
        return '<p>Okay that\'s a real one 😂 I respect the dedication ❤️</p>';
      }
      return '<p>Interesting… I\'m gonna need you to explain that in detail someday 😄</p>';
    case 'r_hours':
      if (t.length < 4) return '<p>That\'s it? I expected a whole essay 😂</p>';
      return '<p>I\'d actually love to hear that someday. Consider yourself on the list 😄❤️</p>';
    case 'r_memory':
      return '<p>That\'s a sweet one to hold onto. I hope you make more memories exactly like it ❤️</p>';
    default:
      return pick(['😂 Okay, that tracks.', 'Noted, noted 😄', 'I like that answer ❤️', 'Wait — I need more details on that one 😂']);
  }
}

function buildReply(item, answerText) {
  const t = answerText.toLowerCase();

  if (item.type !== 'text') {
    const opt = item.options.find(o => o.t === answerText);
    if (opt && opt.r) return '<p>' + opt.r + '</p>';
  }

  const mood = analyzeText(t);
  if (mood.heavy) return heavyReply(item.group);
  if (mood.happy && item.group !== 'deep') return pick(HAPPY_POOL);
  if (item.group === 'deep') return deepNeutral(item, t);
  if (item.group === 'fire') return pickFireReply(item, t);
  return funTextReply(item, t);
}

/* ============================================================
   QUIZ RENDERER — one question at a time, journey-style
   ============================================================ */
function renderQuestionBox(boxId, list, stateKey, onDone, counterId) {
  const box = $(boxId);
  if (!box) return;
  box.innerHTML = '';
  const idx = state[stateKey];
  const counter = $(counterId);
  if (counter) counter.textContent = 'Question ' + Math.min(idx + 1, list.length) + ' of ' + list.length;

  if (idx >= list.length) {
    const done = document.createElement('div');
    done.className = 'q-done';
    done.innerHTML = '<p class="lead">That\'s every question — thank you for playing along 😄❤️</p>';
    box.appendChild(done);
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Continue ❤️';
    btn.addEventListener('click', onDone);
    box.appendChild(btn);
    return;
  }

  const item = list[idx];
  const card = document.createElement('div');
  card.className = 'q-card';
  box.appendChild(card);

  const qText = document.createElement('p');
  qText.className = 'q-text';
  qText.textContent = item.q;
  card.appendChild(qText);

  if (item.sub) {
    const sub = document.createElement('p');
    sub.className = 'q-sub';
    sub.textContent = item.sub;
    card.appendChild(sub);
  }

  const optsWrap = document.createElement('div');
  optsWrap.className = 'q-options';
  card.appendChild(optsWrap);

  const resp = document.createElement('div');
  resp.className = 'q-response';
  card.appendChild(resp);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn q-next';
  nextBtn.textContent = 'Next ❤️';
  nextBtn.addEventListener('click', () => {
    state[stateKey] = idx + 1;
    saveState();
    renderQuestionBox(boxId, list, stateKey, onDone, counterId);
  });
  card.appendChild(nextBtn);

  const skipLink = document.createElement('button');
  skipLink.className = 'link-btn';
  skipLink.textContent = 'skip the rest →';
  skipLink.addEventListener('click', onDone);
  card.appendChild(skipLink);

  const finish = (answerText) => {
    if (item.id) state.answers[item.id] = answerText;
    saveState();
    resp.innerHTML = buildReply(item, answerText);
    resp.classList.add('show');
    nextBtn.classList.add('show');
    resp.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  if (item.type === 'text') {
    const input = document.createElement('input');
    input.className = 'q-input';
    input.type = 'text';
    input.placeholder = item.placeholder || 'Type here…';
    input.setAttribute('aria-label', item.q);
    const submit = document.createElement('button');
    submit.className = 'btn btn-ghost';
    submit.textContent = 'That\'s my answer ❤️';
    submit.addEventListener('click', () => {
      const v = input.value.trim();
      if (!v) { showToast('Even one word is an answer — write anything ❤️'); return; }
      finish(v);
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit.click(); });
    card.append(input, submit);
    if (item.canSkip) {
      const skipOne = document.createElement('button');
      skipOne.className = 'link-btn';
      skipOne.textContent = 'skip this one';
      skipOne.addEventListener('click', () => {
        state.answers[item.id] = '(skipped)';
        state[stateKey] = idx + 1;
        saveState();
        renderQuestionBox(boxId, list, stateKey, onDone, counterId);
      });
      card.appendChild(skipOne);
    }
  } else {
    item.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'q-opt' + (item.type === 'emoji' ? ' emoji' : '');
      b.textContent = opt.t;
      b.addEventListener('click', () => {
        $$('.q-opt', card).forEach(x => x.classList.remove('sel'));
        b.classList.add('sel');
        setTimeout(() => finish(opt.t), 320);
      });
      optsWrap.appendChild(b);
    });
  }
}

/* ============================================================
   Part 1 END — continue with Part 2 below (same file)
   ============================================================ */
/* ============================================================
   main.js — for Nela ❤️  (Part 2)
   Photos · Wish · Voice · WhatsApp · Boot
   ============================================================ */

/* ---------- image helper (resized locally, never uploaded) ---------- */
function fileToDataUrl(file, maxDim = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- PAGE 3: dog photos ---------- */
function initDogUpload() {
  const input = $('#dogInput');
  const zone = $('#dogZone');

  // NOTE: the <label for="dogInput"> already opens the picker — no extra click handler needed.

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag');
    handleDogFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', () => {
    handleDogFiles(input.files);
    input.value = '';
  });
}

async function handleDogFiles(files) {
  const list = [...files].filter(f => f.type.startsWith('image/')).slice(0, 8);
  for (const f of list) {
    if (state.dogPhotos.length >= 8) {
      showToast('That\'s plenty of dogs 😂🐶');
      break;
    }
    try {
      state.dogPhotos.push(await fileToDataUrl(f));
    } catch (e) { /* skip unreadable file */ }
  }
  renderDogPreviews();
  saveState();
}

function renderDogPreviews() {
  const grid = $('#dogPreview');
  grid.innerHTML = '';
  state.dogPhotos.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'thumb';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'A dog photo Nela chose 🐶';
    const rm = document.createElement('button');
    rm.className = 'rm';
    rm.textContent = '✕';
    rm.setAttribute('aria-label', 'Remove photo');
    rm.addEventListener('click', () => {
      state.dogPhotos.splice(i, 1);
      renderDogPreviews();
      saveState();
    });
    div.append(img, rm);
    grid.appendChild(div);
  });
  const count = $('#dogCount');
  count.textContent = state.dogPhotos.length
    ? (state.dogPhotos.length === 1
        ? '1 photo added — it stays on your phone, only a preview shows here 🐶'
        : state.dogPhotos.length + ' photos added — they stay on your phone, only previews show here 🐶')
    : '';
}

/* ---------- PAGE 10: selfie photo ---------- */
function initSelfieUpload() {
  const input = $('#selfieInput');
  input.addEventListener('change', async () => {
    const f = input.files[0];
    input.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    try {
      state.selfie = await fileToDataUrl(f);
      renderSelfie();
      saveState();
    } catch (e) {
      showToast('Couldn\'t read that photo — try another one ❤️');
    }
  });
}

function renderSelfie() {
  const grid = $('#selfiePreview');
  grid.innerHTML = '';
  $('#selfieCount').textContent = '';
  if (!state.selfie) return;
  const div = document.createElement('div');
  div.className = 'thumb';
  const img = document.createElement('img');
  img.src = state.selfie;
  img.alt = 'Nela\'s photo ❤️';
  const rm = document.createElement('button');
  rm.className = 'rm';
  rm.textContent = '✕';
  rm.setAttribute('aria-label', 'Remove photo');
  rm.addEventListener('click', () => {
    state.selfie = null;
    renderSelfie();
    saveState();
  });
  div.append(img, rm);
  grid.appendChild(div);
  $('#selfieCount').textContent = 'Beautiful choice. This stays on your phone — nothing is uploaded anywhere ❤️';
}

/* ---------- PAGE 10: WhatsApp (honest, no fake uploads) ---------- */
function initWhatsApp() {
  $('#waBtn').addEventListener('click', () => {
    const msg = 'Hey Zeus ❤️ I finished the website.';
    const url = 'https://wa.me/2349066760078?text=' + encodeURIComponent(msg);
    const w = window.open(url, '_blank');
    if (!w) location.href = url;
    if (state.selfie) {
      showToast('WhatsApp opened — attach your photo there with 📎 and send it ❤️');
    } else {
      showToast('WhatsApp opened — you can still send the message (and attach a photo from there) ❤️');
    }
  });
}

/* ---------- PAGE 6: the wish ---------- */
function initWish() {
  const form = $('#wishForm');
  const box = $('#wishResponse');
  const cont = $('#wishContinue');
  const text = $('#wishText');

  const skipLink = document.createElement('button');
  skipLink.className = 'link-btn';
  skipLink.textContent = 'skip this one for now';
  form.appendChild(skipLink);

  if (state.wishDone && state.answers.wish) {
    form.hidden = true;
    box.hidden = false;
    box.innerHTML = state.answers.wish === '(skipped)'
      ? '<p>No problem at all — I\'ll just hope for you instead ❤️</p>'
      : renderWishResponse(state.answers.wish);
    cont.hidden = false;
  }

  $('#wishSubmit').addEventListener('click', () => {
    const v = text.value.trim();
    if (!v) { showToast('Even one word counts — write anything ❤️'); return; }
    state.answers.wish = v;
    state.wishDone = true;
    saveState();
    form.hidden = true;
    box.hidden = false;
    box.innerHTML = renderWishResponse(v);
    cont.hidden = false;
    confettiBurst(40);
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  skipLink.addEventListener('click', () => {
    state.answers.wish = '(skipped)';
    state.wishDone = true;
    saveState();
    form.hidden = true;
    box.hidden = false;
    box.innerHTML = '<p>No problem at all — I\'ll just hope for you instead ❤️</p>';
    cont.hidden = false;
  });
}

/* ---------- wish response: hopeful vs difficult ---------- */
function renderWishResponse(v) {
  const t = v.toLowerCase();
  const hopeful = ['hope', 'happy', 'peace', 'love', 'travel', 'visit', 'learn', 'start',
    'want to be', 'finally', 'better', 'career', 'job', 'family', 'friends', 'music',
    'dance', 'sing', 'smile', 'laugh', 'success', 'win', 'house', 'car', 'own', 'become',
    'someday', 'one day', 'calm', 'rest', 'free', 'strong', 'confident'];
  const difficult = ['sad', 'cry', 'lonely', 'alone', 'tired', 'hurt', 'pain', 'break',
    'broken', 'scared', 'afraid', 'lost', 'stuck', 'stop', 'give up', 'hate', 'hard',
    'struggle', 'hopeless', 'empty', 'overwhelm', 'anxious', 'stress', 'worse'];

  let score = 0;
  for (const w of hopeful) if (t.includes(w)) score++;
  for (const w of difficult) if (t.includes(w)) score--;

  if (score > 0) {
    return '<p>Then I really hope life gives you the chance to experience that. Write it down somewhere you\'ll see it often — it deserves to stay alive ❤️</p>';
  }
  if (score < 0) {
    return '<p>Whatever happens, I hope you never stop believing that your story can still change. This isn\'t the ending — it\'s just the part where it gets written differently ❤️</p>';
  }
  return '<p>Thank you for writing that down. I hope life listens — and even if it takes time, I hope you never stop wanting it for yourself ❤️</p>';
}

/* ============================================================
   VOICE — Web Speech API (no external service needed)
   ============================================================ */
const speechSupported = 'speechSynthesis' in window;
let speaking = false;
let paused = false;
let voices = [];

function loadVoices() {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
if (speechSupported) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function pickVoice() {
  const v = voices.filter(x => /en/i.test(x.lang));
  if (!v.length) return null;
  return v.find(x => /female|google uk english female|samantha|serena|zira/i.test(x.name)) || v[0];
}

function buildSpeechText() {
  const p = [];
  $$('#finalText p').forEach(el => {
    const t = el.textContent.trim();
    if (t) p.push(t);
  });
  p.push('One last thing. Can you send me a photo of yourself? Only if you want to.');
  p.push('Thank you for going through all of this. Whatever kind of day you are having, I hope tomorrow gives you another reason to smile.');
  return p.join(' ');
}

function stopVoice() {
  if (!speechSupported) return;
  window.speechSynthesis.cancel();
  speaking = false;
  paused = false;
  $('#voicePlay').disabled = false;
  $('#voicePause').disabled = true;
  $('#voiceResume').disabled = true;
  $('#voiceStop').disabled = true;
  $('#voiceStatus').textContent = '';
}

function initVoice() {
  const play = $('#voicePlay');
  const pauseBtn = $('#voicePause');
  const resumeBtn = $('#voiceResume');
  const stopBtn = $('#voiceStop');
  const status = $('#voiceStatus');
  const fallback = $('#voiceFallback');

  if (!speechSupported) {
    fallback.hidden = false;
    play.disabled = true;
    return;
  }

  const updateButtons = () => {
    play.disabled = speaking;
    pauseBtn.disabled = !speaking || paused;
    resumeBtn.disabled = !speaking || !paused;
    stopBtn.disabled = !speaking;
  };

  play.addEventListener('click', () => {
    const u = new SpeechSynthesisUtterance(buildSpeechText());
    u.voice = pickVoice();
    u.rate = 0.96;
    u.pitch = 1.02;
    u.volume = 1;
    u.onstart = () => {
      speaking = true; paused = false;
      status.textContent = '🔊 Playing…';
      updateButtons();
    };
    u.onend = () => {
      speaking = false; paused = false;
      status.textContent = 'Finished ❤️';
      updateButtons();
    };
    u.onerror = () => {
      speaking = false; paused = false;
      status.textContent = 'Playback stopped. You can try again anytime ❤️';
      updateButtons();
    };
    window.speechSynthesis.speak(u);
    speaking = true;
    updateButtons();
  });

  pauseBtn.addEventListener('click', () => {
    if (!speaking) return;
    window.speechSynthesis.pause();
    paused = true;
    status.textContent = '⏸ Paused. Press Resume when you\'re ready.';
    updateButtons();
  });

  resumeBtn.addEventListener('click', () => {
    if (!speaking || !paused) return;
    window.speechSynthesis.resume();
    paused = false;
    status.textContent = '🔊 Playing…';
    updateButtons();
  });

  stopBtn.addEventListener('click', stopVoice);
}

/* ============================================================
   BOOT — restore saved state, wire everything up
   ============================================================ */
function renderAllPersisted() {
  renderDogPreviews();
  renderSelfie();
}

function bindContinueButtons() {
  $$('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => goTo(+btn.dataset.goto));
  });
}

function initQuizSections() {
  renderQuestionBox('#funBox', FUN_QUESTIONS, 'funIndex', () => goTo(4), '#funCounter');
  renderQuestionBox('#deepBox', DEEP_QUESTIONS, 'deepIndex', () => goTo(7), '#deepCounter');
  renderQuestionBox('#fireBox', FIRE_QUESTIONS, 'fireIndex', () => goTo(9), '#fireCounter');
}

function boot() {
  buildDots();
  updateProgress();
  initStaggerDelays();
  startParticles();
  spawnStaticTwinkles();

  bindContinueButtons();
  initRestart();
  initDogUpload();
  initSelfieUpload();
  initWhatsApp();
  initWish();
  initVoice();
  initQuizSections();
  renderAllPersisted();

  document.body.dataset.particles = particleLevel(current);

  // Resume where she left off (only if not on the very first screen)
  if (state.current > 0) {
    goTo(state.current);
  } else {
    sections[0].classList.add('active');
  }

  // Remove splash, fade the page in
  setTimeout(() => {
    $('#welcomeOverlay').remove();
    document.body.style.opacity = '1';
  }, 1900);
}

/* ---------- launch ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 1s ease 1.2s';
  boot();
});

/* ============================================================
   main.js — END. ❤️
   ============================================================ */
