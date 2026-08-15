/* ============================================================
   main.js v2 — for Nela ❤️  (built by Zeus)
   ============================================================ */
(() => {
  'use strict';

  /* ---------- tiny helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LS_KEY = 'forNelaState_v2';
  const WA_URL = 'https://wa.me/2349066760078?text=Hey+Zeus+%E2%9D%A4%EF%B8%8F+I+finished+the+website.';
  const IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent || '');

  let toastTimer = null;
  function toast(msg, ms = 2600) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  }
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- sentiment ---------- */
  const HEAVY_WORDS = ['sad','tired','alone','lonely','cry','crying','hurt','pain','scared','afraid','anxious','anxiety','stress','stressed','overwhelmed','broken','lost','empty','worried','worry','depressed','heavy','exhausted','fail','failed','giving','hate','angry','regret','miss','missing','hard','difficult','struggle','struggling','unhappy','numb','hopeless','worthless','weak','trapped','stuck','fine pretending','tired of'];
  const HAPPY_WORDS = ['happy','joy','joyful','great','good','love','loved','excited','blessed','grateful','thankful','proud','peace','peaceful','calm','fine','okay','ok','smile','laugh','fun','amazing','beautiful','wonderful','hope','hopeful','better','best','sunshine','glad','cheerful','bright','win','won','free','strong','safe','content','glow','smiling'];
  function sentimentOf(t) {
    const s = String(t || '').toLowerCase();
    let heavy = 0, happy = 0;
    HEAVY_WORDS.forEach(w => { if (s.includes(w)) heavy++; });
    HAPPY_WORDS.forEach(w => { if (s.includes(w)) happy++; });
    if (heavy > happy) return 'heavy';
    if (happy > heavy) return 'happy';
    return 'neutral';
  }

  /* ---------- reply pools ---------- */
  const POOL_HEAVY = [
    "I'm really glad you told me that. You don't have to carry it alone, okay?",
    "That sounds heavy, and I'm sorry you're going through it. Thank you for trusting me with it.",
    "That took courage to admit. Please be gentle with yourself today — you deserve patience.",
    "I hear you. Whatever it is, you don't have to face it all at once. One small step is enough.",
    "I'm sorry it's been like that. You've made it this far, and that already says a lot about you."
  ];
  const POOL_DEEP = [
    "Thank you for being honest. That means more than you know.",
    "I'm listening — and nothing you said changes how much you matter.",
    "That's valid. Whatever you feel right now is allowed to exist.",
    "I appreciate you sharing that. It isn't small to me.",
    "You don't have to have answers today. Just being honest is enough."
  ];
  const POOL_HAPPY = [
    "I love that! That kind of energy suits you 😊",
    "That's beautiful — hold onto that feeling. You deserve it.",
    "Yes! More of this energy, please ❤️",
    "That made me smile. Keep choosing the things that make you feel this way.",
    "I'm genuinely happy to hear that. May you have many more moments like this."
  ];
  const POOL_FIRE = [
    "Noted. Filed. I'll remember this 😂",
    "Interesting answer… noted, noted.",
    "Respect. Solid choice, honestly.",
    "I'm taking mental notes about you, you know.",
    "Good answer. No notes. Okay, some notes 😂"
  ];
  const POOL_FUN = [
    "Good answer! I'm learning a lot about you already 😄",
    "Love that. Keep going!",
    "Valid. Extremely valid.",
    "Okay, that's going in the 'reasons Nela is great' file.",
    "Noted with care 😌❤️"
  ];

  function buildReply(q, option, sentiment) {
    const opt = (q.options || []).find(o => o.t === option);
    if (opt && opt.reply) return opt.reply;
    if (sentiment === 'heavy') {
      const base = rand(POOL_HEAVY);
      return q.group === 'deep'
        ? base + '\n\n“Bad days are chapters, not the whole story.” — Zeus'
        : base;
    }
    if (q.group === 'deep') return rand(POOL_DEEP);
    if (sentiment === 'happy') return rand(POOL_HAPPY);
    if (q.group === 'fire') return rand(POOL_FIRE);
    return rand(POOL_FUN);
  }

  /* ---------- questions ---------- */
  const FUN = [
    { q: "What's your go-to comfort food?", emoji: true, options: [
      { t: '🍕 Pizza' }, { t: '🍫 Chocolate' }, { t: '🍜 Noodles' }, { t: '🍦 Ice cream' } ] },
    { q: 'Early bird or night owl?', emoji: true, options: [
      { t: '🐦 Early bird' }, { t: '🦉 Night owl' }, { t: '🌗 In between' } ] },
    { q: 'What kind of music hits different for you?', emoji: true, options: [
      { t: '🎵 Afrobeats' }, { t: '🎶 R&B' }, { t: '🎤 Rap' }, { t: '🎹 Something soft' } ] },
    { q: 'A perfect free day looks like…', emoji: true, options: [
      { t: '📱 Scrolling in peace' }, { t: '🎮 Gaming' }, { t: '👭 With the people I love' }, { t: '🛌 Sleeping in' } ] },
    { q: 'Tea or coffee?', emoji: true, options: [
      { t: '☕ Coffee' }, { t: '🍵 Tea' }, { t: "🧋 Both, I'm complicated" }, { t: '🥤 Neither, give me juice' } ] },
    { q: 'What makes you laugh the most?', emoji: true, options: [
      { t: '😂 Memes' }, { t: '🎭 Comedy skits' }, { t: '👯 My people' }, { t: '🐶 Dogs being dogs' } ] },
    { q: 'Sweet or savory?', emoji: true, options: [
      { t: '🍬 Sweet' }, { t: '🥨 Savory' }, { t: '🔥 Both, obviously' } ] },
    { q: 'If you could teleport anywhere right now?', emoji: true, options: [
      { t: '🏝 A beach' }, { t: '🏔 Mountains' }, { t: '🗼 A big city' }, { t: "🌍 Somewhere I've never been" } ] },
    { q: 'How do you feel about surprises?', options: [
      { t: 'Love them 🥰' }, { t: "Love them… if they're for me 😅" }, { t: 'They scare me a little' } ] },
    { q: 'On a scale of 1–10, how ready are you for today?', options: [
      { t: '1–3: we survive' }, { t: '4–6: we manage' }, { t: '7–8: we thrive' }, { t: '9–10: I own this day' } ] }
  ];

  const DEEP = [
    { g: 'deep', q: 'What has been taking up most of your mind lately?', options: [
      { t: 'School / work stuff' }, { t: 'Family things' }, { t: 'My heart — someone I like' }, { t: 'Honestly… everything' } ] },
    { g: 'deep', q: 'When was the last time you felt truly peaceful?', options: [
      { t: 'Recently 😌' }, { t: 'A while ago' }, { t: "Honestly, I can't remember" }, { t: "I'm not sure I ever have" } ] },
    { g: 'deep', q: "What's something you wish people understood about you?", options: [
      { t: "That I'm not always okay" }, { t: "That I really do try my best" }, { t: "That I need a little more patience" }, { t: "That I'm stronger than I look" } ] },
    { g: 'deep', q: "What's one thing you're afraid to tell anyone?", options: [
      { t: "That I'm tired of pretending I'm fine" }, { t: "That I worry I'm not enough" }, { t: "That I just want to be loved properly" }, { t: "I don't know if anyone would get it" } ] },
    { g: 'deep', q: 'When you feel sad, what do you usually do?', options: [
      { t: 'Go quiet and disappear for a while' }, { t: 'Cry it out' }, { t: 'Put on sad music and sit with it' }, { t: "Pretend I'm fine until it passes" } ] },
    { g: 'deep', q: 'What do you think you need most right now?', options: [
      { t: 'Rest' }, { t: 'Someone who actually listens' }, { t: 'A real hug' }, { t: 'To feel seen' } ] },
    { g: 'deep', q: 'Is there a moment you replay in your head a lot?', options: [
      { t: 'A happy memory' }, { t: 'Something I regret' }, { t: 'A conversation that stayed with me' }, { t: "I don't know" } ] },
    { g: 'deep', q: 'Do you feel like people really see you?', options: [
      { t: 'Some do' }, { t: 'Not really' }, { t: 'Only when they need something' }, { t: "I'm not sure anymore" } ] },
    { g: 'deep', q: 'If you could say something to the you from one year ago…', options: [
      { t: "It's going to be okay" }, { t: "You're doing better than you think" }, { t: "I'm proud of you" }, { t: 'Hold on — it gets better' } ] }
  ];

  const FIRE = [
    { g: 'fire', q: 'Dog or cat?', emoji: true, options: [ { t: '🐶 Dog' }, { t: '🐱 Cat' }, { t: '🐾 Both' } ] },
    { g: 'fire', q: 'Beach or mountains?', emoji: true, options: [ { t: '🏝 Beach' }, { t: '⛰️ Mountains' } ] },
    { g: 'fire', q: 'Texting or calling?', emoji: true, options: [ { t: '💬 Text' }, { t: '📞 Call' } ] },
    { g: 'fire', q: 'Sunsets or sunrises?', emoji: true, options: [ { t: '🌅 Sunsets' }, { t: '🌄 Sunrises' } ] },
    { g: 'fire', q: 'Sweet or salty popcorn?', emoji: true, options: [ { t: '🍿 Sweet' }, { t: '🧂 Salty' } ] },
    { g: 'fire', q: 'Shower music or silence?', emoji: true, options: [ { t: '🎶 Music' }, { t: '🤫 Silence' } ] },
    { g: 'fire', q: 'Late-night thoughts or early-morning clarity?', emoji: true, options: [ { t: '🌙 Late night' }, { t: '☀️ Early morning' } ] },
    { g: 'fire', q: 'Random road trip or planned vacation?', emoji: true, options: [ { t: '🛣️ Road trip' }, { t: '🏨 Planned vacation' } ] },
    { g: 'fire', q: 'Trust your gut or overthink first?', emoji: true, options: [ { t: '🔥 Gut' }, { t: '🤔 Overthink' } ] }
  ];

  /* ---------- wish replies ---------- */
  const WISH_HEAVY = [
    "I hear you, and thank you for trusting me with that. Whatever stands in the way right now — I hope it softens soon. You deserve for that wish to come true.",
    "That one hit different. I'm sorry it feels far away right now, but I believe it isn't as far as it feels. Keep that wish close, okay?",
    "Thank you for being this honest. I hope life hears you and gives you exactly what you asked for."
  ];
  const WISH_NEUTRAL = [
    "That's a beautiful thing to want. I really hope life hands it to you — you deserve it.",
    "I love that. Write it somewhere you'll see it. Wishes have a way of growing when you keep looking at them.",
    "That's a good wish — simple and real. I hope it finds you sooner than you expect."
  ];
  const WISH_HAPPY = [
    "Yes! I love that energy. May life give you that and more ❤️",
    "That's the spirit! Keep that wish loud — I want to see it come true.",
    "Beautiful. That kind of wish already has your name on it. I can feel it."
  ];
  function buildWishReply(text) {
    const s = sentimentOf(text);
    if (s === 'heavy') return rand(WISH_HEAVY);
    if (s === 'happy') return rand(WISH_HAPPY);
    return rand(WISH_NEUTRAL);
  }

  /* ---------- state (localStorage) ---------- */
  const DEFAULT_STATE = { progress: 0, answers: {} };
  let state = loadState();
  let quotaWarned = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return { ...DEFAULT_STATE, ...p, answers: { ...(p.answers || {}) } };
      }
    } catch (e) { /* ignore */ }
    return { ...DEFAULT_STATE, answers: {} };
  }
  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
      quotaWarned = false;
    } catch (e) {
      if (!quotaWarned) {
        quotaWarned = true;
        toast('Storage is full — photos stay for this visit only ❤️', 3400);
      }
    }
  }

  /* ---------- quiz engine ---------- */
  function renderQuiz(containerSel, counterSel, list, keyPrefix, gotoIdx) {
    const box = $(containerSel);
    if (!box) return;
    const counter = $(counterSel);
    const total = list.length;
    const answeredCount = () => list.filter((q, i) => state.answers[keyPrefix + i]).length;
    const fin = document.createElement('div');
    fin.className = 'q-done';
    fin.innerHTML = `<button class="btn" id="${keyPrefix}DoneBtn" data-goto="${gotoIdx}" style="display:none">Continue ❤️</button>`;
    box.appendChild(fin);
    const updateCounter = () => {
      const n = answeredCount();
      if (counter) counter.textContent = `${n} of ${total} answered ❤️`;
      fin.style.display = n >= total ? 'block' : 'none';
    };
    list.forEach((q, i) => {
      const card = document.createElement('div');
      card.className = 'q-card';
      card.id = keyPrefix + 'Card' + i;
      const saved = state.answers[keyPrefix + i];
      card.innerHTML =
        `<p class="q-text">${i + 1}. ${esc(q.q)}</p>` +
        `<div class="q-options">${q.options.map(o =>
          `<button class="q-opt${q.emoji ? ' emoji' : ''}${saved === o.t ? ' sel' : ''}" data-opt="${esc(o.t)}">${esc(o.t)}</button>`
        ).join('')}</div>` +
        `<div class="q-response" ${saved ? 'style="display:block"' : ''}>${saved ? esc(buildReply(q, saved, sentimentOf(saved))) : ''}</div>` +
        `<button class="btn q-next${saved ? ' show' : ''}" data-qnext="${i}">Next ❤️</button>`;
      box.appendChild(card);
      card.querySelectorAll('.q-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          const opt = btn.dataset.opt;
          if (state.answers[keyPrefix + i] === opt) return;
          state.answers[keyPrefix + i] = opt;
          saveState();
          card.querySelectorAll('.q-opt').forEach(b => b.classList.toggle('sel', b === btn));
          const resp = card.querySelector('.q-response');
          resp.innerHTML = esc(buildReply(q, opt, sentimentOf(opt)));
          resp.style.display = 'block';
          card.querySelector('.q-next').classList.add('show');
          updateCounter();
          if (sentimentOf(opt) === 'happy') burstConfetti(26);
        });
      });
      card.querySelector('.q-next').addEventListener('click', () => {
        const next = card.nextElementSibling;
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    updateCounter();
  }

  /* ---------- navigation ---------- */
  const SECTIONS = $$('.section');
  const DOTS = $('#progressDots');
  const FILL = $('#progressFill');
  let current = Math.max(0, Math.min(SECTIONS.length - 1, state.progress || 0));

  function buildDots() {
    if (!DOTS) return;
    SECTIONS.forEach((s, i) => {
      const d = document.createElement('span');
      d.className = 'dot';
      d.addEventListener('click', () => goTo(i));
      DOTS.appendChild(d);
    });
  }
  function updateProgress() {
    if (FILL) FILL.style.width = ((current / (SECTIONS.length - 1)) * 100) + '%';
    if (DOTS) $$('.dot', DOTS).forEach((d, i) => d.classList.toggle('on', i <= current));
  }
  function goTo(i) {
    i = Math.max(0, Math.min(SECTIONS.length - 1, i));
    if (i === current && SECTIONS[current] && SECTIONS[current].classList.contains('active')) return;
    const from = SECTIONS[current];
    const to = SECTIONS[i];
    current = i;
    state.progress = i;
    saveState();
    if (from) {
      from.classList.remove('active');
      from.classList.add('out');
      setTimeout(() => from.classList.remove('out'), 520);
    }
    to.querySelectorAll('.stagger > *').forEach((el, k) => el.style.setProperty('--sd', (0.08 * k) + 's'));
    to.classList.add('active');
    updateProgress();
    window.scrollTo(0, 0);
    if (i === SECTIONS.length - 1) setTimeout(() => burstConfetti(130), 650);
  }
  function bindGotos() {
    $$('[data-goto]').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', () => goTo(parseInt(btn.dataset.goto, 10)));
    });
  }

  /* ---------- particles ---------- */
  function buildParticles() {
    const wrap = $('#particles');
    if (!wrap) return;
    const SYMBOLS = ['❤️', '🤍', '💖', '✨', '💜', '⭐'];
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const sym = rand(SYMBOLS);
      p.textContent = (sym === '✨' || sym === '⭐') ? '' : sym;
      p.style.left = (Math.random() * 100) + '%';
      p.style.fontSize = (12 + Math.random() * 18) + 'px';
      p.style.setProperty('--d', (16 + Math.random() * 18) + 's');
      p.style.setProperty('--dl', (Math.random() * 22) + 's');
      p.style.setProperty('--po', (0.05 + Math.random() * 0.14).toFixed(2));
      wrap.appendChild(p);
    }
    for (let i = 0; i < 26; i++) {
      const t = document.createElement('span');
      t.className = 'twinkle';
      t.style.left = (Math.random() * 100) + '%';
      t.style.top = (Math.random() * 100) + '%';
      t.style.setProperty('--d', (2.5 + Math.random() * 4) + 's');
      t.style.setProperty('--dl', (Math.random() * 5) + 's');
      wrap.appendChild(t);
    }
  }

  /* ---------- confetti ---------- */
  const cv = $('#confettiCanvas');
  const ctx = cv ? cv.getContext('2d') : null;
  let pieces = [], confettiOn = false;
  const CONF_COLORS = ['#ff8fc0', '#b78bff', '#ffd9a0', '#ffffff', '#ff5f8f'];
  function sizeCanvas() {
    if (!cv) return;
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  }
  function burstConfetti(n = 80) {
    if (!ctx) return;
    for (let i = 0; i < n; i++) {
      pieces.push({
        x: Math.random() * cv.width,
        y: -20 - Math.random() * cv.height * 0.4,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 2.4,
        vy: 1.6 + Math.random() * 2.4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.22,
        color: rand(CONF_COLORS),
        heart: Math.random() < 0.3
      });
    }
    if (!confettiOn) { confettiOn = true; requestAnimationFrame(confettiLoop); }
  }
  function confettiLoop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    pieces = pieces.filter(p => p.y < cv.height + 40);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.03;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.heart) {
        ctx.font = p.w + 'px serif';
        ctx.fillText('❤️', 0, 0);
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });
    if (pieces.length) requestAnimationFrame(confettiLoop);
    else { confettiOn = false; ctx.clearRect(0, 0, cv.width, cv.height); }
  }

  /* ---------- photo uploads ---------- */
  function compress(img, maxDim, quality) {
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      const r = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * r);
      height = Math.round(height * r);
    }
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    c.getContext('2d').drawImage(img, 0, 0, width, height);
    return c.toDataURL('image/jpeg', quality);
  }
  function wirePhotos(inputId, zoneId, previewId, countId, stateKey, single = false) {
    const input = $('#' + inputId);
    if (!input) return;
    const zone = $('#' + zoneId), preview = $('#' + previewId), count = $('#' + countId);
    const list = () => state.answers[stateKey] || (state.answers[stateKey] = []);
    const render = () => {
      const arr = list();
      preview.innerHTML = '';
      arr.forEach((src, i) => {
        const d = document.createElement('div');
        d.className = 'thumb';
        d.innerHTML = `<img src="${src}" alt="photo ${i + 1}"><button class="rm" aria-label="remove">✕</button>`;
        d.querySelector('.rm').addEventListener('click', () => {
          arr.splice(i, 1);
          saveState();
          render();
        });
        preview.appendChild(d);
      });
      if (count) count.textContent = arr.length
        ? `${arr.length} photo${arr.length > 1 ? 's' : ''} saved on this device ❤️`
        : '';
      if (single) input.value = '';
    };
    const handleFiles = (files) => {
      const arr = list();
      if (!single && arr.length >= 8) { toast('Max 8 dog photos ❤️'); return; }
      if (single && arr.length) arr.length = 0;
      const room = single ? 1 : 8 - arr.length;
      [...files].slice(0, Math.max(0, room)).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = e => {
          const img = new Image();
          img.onload = () => {
            arr.push(compress(img, 760, 0.75));
            saveState();
            render();
            if (!single) toast('Photo added ❤️');
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
      if (single && files.length) toast('Photo ready — tap "Send Photo to Zeus" ❤️');
    };
    input.addEventListener('change', () => handleFiles(input.files));
    if (zone) {
      ['dragover', 'dragenter'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag'); }));
      ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag'); }));
      zone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
    }
    render();
  }

  /* ---------- wish form ---------- */
  function wireWish() {
    const form = $('#wishForm'), text = $('#wishText'), resp = $('#wishResponse'), cont = $('#wishContinue');
    if (!form) return;
    if (state.answers.wish) {
      text.value = state.answers.wish;
      resp.innerHTML = `<span class="reply-kicker">Zeus says…</span>${esc(buildWishReply(state.answers.wish))}`;
      resp.hidden = false;
      cont.hidden = false;
      form.hidden = true;
    }
    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = text.value.trim();
      if (!val) { toast('Write something first — anything ❤️'); return; }
      state.answers.wish = val;
      saveState();
      resp.innerHTML = `<span class="reply-kicker">Zeus says…</span>${esc(buildWishReply(val))}`;
      resp.hidden = false;
      cont.hidden = false;
      form.hidden = true;
      burstConfetti(40);
      resp.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- voice (speechSynthesis) ---------- */
  function wireVoice() {
    const play = $('#voicePlay'), pause = $('#voicePause'), resume = $('#voiceResume'), stop = $('#voiceStop');
    const status = $('#voiceStatus'), fallback = $('#voiceFallback');
    if (!play || !('speechSynthesis' in window)) {
      if (fallback) fallback.hidden = false;
      return;
    }
    const synth = window.speechSynthesis;
    let utter = null;
    const finalText = () => {
      const el = $('#finalText');
      return el ? el.innerText.replace(/\s+/g, ' ').trim() : '';
    };
    const setStatus = s => { if (status) status.textContent = s; };
    const syncButtons = () => {
      const speaking = synth.speaking, paused = synth.paused;
      play.disabled = speaking && !paused;
      stop.disabled = !speaking;
      if (IS_IOS) {
        pause.disabled = true;
        resume.disabled = true;
        if (paused) setStatus("Paused — iOS can't resume, press ▶ Listen again ❤️");
      } else {
        pause.disabled = !speaking || paused;
        resume.disabled = !speaking || !paused;
      }
    };
    play.addEventListener('click', () => {
      synth.cancel();
      const t = finalText();
      if (!t) return;
      utter = new SpeechSynthesisUtterance(t);
      utter.rate = 1;
      utter.pitch = 1.02;
      utter.lang = 'en-US';
      utter.onstart = () => { setStatus('Reading… 🎧'); syncButtons(); };
      utter.onend = () => { setStatus('Done reading. Want me to go again? ❤️'); syncButtons(); };
      utter.onerror = () => { setStatus('Hmm, the voice got interrupted — press ▶ Listen again ❤️'); syncButtons(); };
      synth.speak(utter);
      syncButtons();
    });
    pause.addEventListener('click', () => { synth.pause(); setStatus('Paused ⏸ — press ▶️ Resume'); syncButtons(); });
    resume.addEventListener('click', () => { synth.resume(); setStatus('Continuing… 🎧'); syncButtons(); });
    stop.addEventListener('click', () => { synth.cancel(); setStatus('Stopped ⏹'); syncButtons(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { synth.cancel(); setStatus('Stopped ⏹'); syncButtons(); }
    });
    syncButtons();
  }

  /* ---------- WhatsApp ---------- */
  function wireWa() {
    const btn = $('#waBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      location.href = WA_URL;
      toast('WhatsApp is opening — tap 📎, attach your photo, then send ❤️', 3400);
    });
  }

  /* ---------- restart ---------- */
  function wireRestart() {
    const link = $('#restartLink');
    if (!link) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(0);
      toast('Starting over — your answers are still saved ❤️');
    });
  }

  /* ---------- overlay ---------- */
  function handleOverlay() {
    const ov = $('#welcomeOverlay');
    if (ov) setTimeout(() => ov.remove(), 2400);
  }
  function revealBody() {
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
  }

  /* ---------- boot ---------- */
  function boot() {
    buildDots();
    buildParticles();
    sizeCanvas();
    bindGotos();
    renderQuiz('#funBox', '#funCounter', FUN, 'fun', 4);
    renderQuiz('#deepBox', '#deepCounter', DEEP, 'deep', 7);
    renderQuiz('#fireBox', '#fireCounter', FIRE, 'fire', 9);
    bindGotos(); /* pick up the auto-injected Continue buttons */
    wireWish();
    wirePhotos('dogInput', 'dogZone', 'dogPreview', 'dogCount', 'dogPhotos');
    wirePhotos('selfieInput', 'selfieZone', 'selfiePreview', 'selfieCount', 'selfie', true);
    wireVoice();
    wireWa();
    wireRestart();
    goTo(state.progress || 0);
    window.addEventListener('error', () => revealBody());
  }

  try {
    boot();
  } catch (err) {
    console.error('boot error:', err);
    if (SECTIONS.length && !$$('.section.active').length) SECTIONS[0].classList.add('active');
  } finally {
    handleOverlay();
    revealBody();
  }
})();
/* ============ main.js v2 — END ============ */
