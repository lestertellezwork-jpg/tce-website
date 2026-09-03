// TCE v5 "Ledger" — quiet by design.
// Menu toggle, subtle reveals, counters, services strip, mobile call bar.
const TCECALM = () => {
  try { if (localStorage.getItem('tceCalm') === '1') return true; } catch (e) {}
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
try { if (localStorage.getItem('tceCalm') === '1') document.documentElement.classList.add('calm'); } catch (e) {}

document.addEventListener('DOMContentLoaded', () => {
  const fine = window.matchMedia('(pointer: fine)').matches;

  // ---- INTRO: the mark assembles from flying steel, then the curtain lifts ----
  (() => { try {
    const calmI = TCECALM();
    if (calmI || sessionStorage.getItem('tceIntro')) return;
    sessionStorage.setItem('tceIntro', '1');
    document.documentElement.classList.add('intro-hold');
    const ov = document.createElement('div');
    ov.className = 'intro';
    ov.innerHTML =
      '<div class="intro-cross x"></div><div class="intro-cross y"></div>' +
      '<div class="intro-center">' +
        '<svg class="intro-mark" viewBox="0 0 100 100" aria-hidden="true">' +
          '<polygon class="ip ip1" points="50,4 50,33 4,47 4,18" fill="#ffffff"/>' +
          '<polygon class="ip ip2" points="50,4 96,18 96,47 50,33" fill="#a9c7f7"/>' +
          '<polygon class="ip ip3" points="31,44 50,39 50,96 31,91" fill="#ffffff"/>' +
          '<polygon class="ip ip4" points="50,39 69,44 69,91 50,96" fill="#a9c7f7"/>' +
        '</svg>' +
        '<div class="intro-flash"></div>' +
        '<div class="intro-word">TRILLAS CONSULTING ENGINEERS</div>' +
        '<div class="intro-line"></div>' +
        '<div class="intro-sub">STRUCTURAL &middot; MEP &middot; FORENSICS &middot; PRODUCT R+D</div>' +
      '</div>' +
      '<div class="intro-skip">Click anywhere to skip</div>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    const finish = () => {
      if (ov.classList.contains('done')) return;
      ov.classList.add('done');
      document.documentElement.classList.remove('intro-hold');
      document.body.style.overflow = '';
      setTimeout(() => ov.remove(), 900);
    };
    setTimeout(finish, 2350);
    ov.addEventListener('click', finish);
    document.addEventListener('keydown', finish, { once: true });
  } catch (e) { console.warn('intro:', e); document.documentElement.classList.remove('intro-hold'); } })();


  // Topbar shadow
  const bar = document.querySelector('.topbar');
  const onScroll = () => { if (bar) bar.classList.toggle('scrolled', window.scrollY > 20); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll progress bar
  const prog = document.createElement('div');
  prog.className = 'scroll-progress';
  document.body.appendChild(prog);
  const setProg = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    prog.style.transform = 'scaleX(' + (max > 0 ? (h.scrollTop / max) : 0) + ')';
  };
  window.addEventListener('scroll', setProg, { passive: true });
  setProg();

  // Back to top
  const toTop = document.createElement('button');
  toTop.className = 'to-top'; toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="5,15 12,8 19,15"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });

  // Graphite pencil trail
  if (fine && !TCECALM()) {
    const tc = document.createElement('canvas');
    tc.className = 'pencil-trail';
    document.body.appendChild(tc);
    const tctx = tc.getContext('2d');
    const tDPR = Math.min(window.devicePixelRatio || 1, 2);
    const tsize = () => {
      tc.width = innerWidth * tDPR; tc.height = innerHeight * tDPR;
      tctx.setTransform(tDPR, 0, 0, tDPR, 0, 0);
      tctx.lineCap = 'round'; tctx.lineJoin = 'round';
    };
    tsize();
    window.addEventListener('resize', tsize);
    let trail = [];
    window.addEventListener('pointermove', e => {
      trail.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (trail.length > 60) trail.shift();
    }, { passive: true });
    (function trailLoop() {
      const now = performance.now();
      trail = trail.filter(p => now - p.t < 850);
      tctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1], b = trail[i];
        if (now - b.t > 850 || Math.hypot(b.x - a.x, b.y - a.y) > 130) continue;
        const life = 1 - (now - b.t) / 850;
        tctx.strokeStyle = 'rgba(124,140,192,' + (0.34 * life).toFixed(3) + ')';
        tctx.lineWidth = 1.6 * life + .3;
        tctx.beginPath(); tctx.moveTo(a.x, a.y); tctx.lineTo(b.x, b.y); tctx.stroke();
      }
      requestAnimationFrame(trailLoop);
    })();
  }



  // Active nav link
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.top-nav a').forEach(a => {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });

  // Menu
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  document.querySelectorAll('.mega-links a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('menu-open'); });

  // Reveals — a single quiet fade
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  document.querySelectorAll('.steps, .paths, .ed-row, .next-steps').forEach(el => io.observe(el));

  // Firm: leader card follows the cursor in 3D
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.leader').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'perspective(1100px) rotateY(' + (x * 3.5).toFixed(2) + 'deg) rotateX(' + (-y * 2.5).toFixed(2) + 'deg)';
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Scroll-driven statement: words ink themselves in as you scroll
  const stmt = document.querySelector('.statement');
  if (stmt) {
    const wrapWords = el => {
      Array.from(el.childNodes).forEach(node => {
        if (node.nodeType === 3) {
          const frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const sp = document.createElement('span');
            sp.className = 'w'; sp.textContent = part;
            frag.appendChild(sp);
          });
          el.replaceChild(frag, node);
        } else if (node.nodeType === 1) wrapWords(node);
      });
    };
    wrapWords(stmt);
    const words = Array.from(stmt.querySelectorAll('.w'));
    let ticking = false;
    const paint = () => {
      ticking = false;
      const r = stmt.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .82 - r.top) / (r.height + vh * .38)));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  }

  // Section headings: lines rise out of a mask
  document.querySelectorAll('.strip-head h2').forEach(h => {
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i)
      .map(l => '<span class="lm"><span class="ln">' + l + '</span></span>').join('');
    io.observe(h);
  });

  // CTA cursor glow
  document.querySelectorAll('.cta-v2').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Counters
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, t = parseInt(el.dataset.count, 10), suf = el.dataset.suffix || '';
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / 1100, 1);
      el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }), { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  // Orbital services carousel — cards ride a globe ring
  const orbit = document.querySelector('.orbit');
  if (orbit) {
    const cards = Array.from(orbit.querySelectorAll('.svc'));
    const n = cards.length;
    const dots = Array.from(document.querySelectorAll('.orbit-dots button'));
    const calmOrbit = TCECALM();
    let cur = 0, down = false, hov = false, moved = false, sx = 0, scur = 0;

    const norm = a => { let d = ((a % n) + n) % n; if (d > n / 2) d -= n; return d; };

    const render = () => {
      const w = orbit.clientWidth;
      const small = window.innerWidth < 760;
      const RX = small ? w * .46 : Math.min(500, w * .37);
      const RZ = small ? 240 : 420;
      cards.forEach((c, i) => {
        const a = norm(i - cur);
        const rad = a * (Math.PI * 2 / n);
        const cos = Math.cos(rad);
        const x = Math.sin(rad) * RX;
        const z = cos * RZ - RZ;
        const front = Math.abs(a) < .5;
        c.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,0,' + z.toFixed(1) + 'px) rotateY(' + (-a * 16).toFixed(1) + 'deg)';
        c.style.opacity = Math.max(.14, (cos * .55 + .45)).toFixed(2);
        c.style.filter = front ? 'none' : 'blur(' + ((1 - cos) * .8).toFixed(2) + 'px)';
        c.style.zIndex = String(100 + Math.round(cos * 50));
        c.classList.toggle('is-front', front);
        c.setAttribute('aria-hidden', front ? 'false' : 'true');
        c.tabIndex = front ? 0 : -1;
      });
      const on = ((Math.round(cur) % n) + n) % n;
      dots.forEach((d, i) => d.classList.toggle('on', i === on));
    };

    const go = t => { cur = t; render(); };

    document.querySelector('.strip-nav .prev')?.addEventListener('click', () => go(Math.round(cur) - 1));
    document.querySelector('.strip-nav .next')?.addEventListener('click', () => go(Math.round(cur) + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => go(cur + norm(i - cur))));

    // Clicking a side card spins it to the front instead of navigating
    cards.forEach((c, i) => c.addEventListener('click', e => {
      if (moved) return;
      if (Math.abs(norm(i - cur)) >= .5) { e.preventDefault(); go(cur + norm(i - cur)); }
    }));

    // Drag (or swipe) to spin the globe
    orbit.addEventListener('pointerdown', e => {
      down = true; moved = false; sx = e.clientX; scur = cur;
      orbit.classList.add('spinning');
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      if (moved) { cur = scur - dx / 260; render(); }
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      orbit.classList.remove('spinning');
      cur = Math.round(cur); render();
    });
    orbit.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    orbit.addEventListener('pointerenter', () => { hov = true; });
    orbit.addEventListener('pointerleave', () => { hov = false; });

    // Gentle auto-rotation, pauses on hover/drag
    if (!calmOrbit) {
      setInterval(() => {
        if (!hov && !down && document.visibilityState === 'visible') go(Math.round(cur) + 1);
      }, 6000);
    }

    window.addEventListener('resize', render);
    render();
  }

  // Licensure map tooltip
  const usmap = document.querySelector('.usmap');
  const tip = document.querySelector('.usmap-tip');
  if (usmap && tip) {
    const wrap = usmap.closest('.usmap-wrap');
    const show = (path, x, y) => {
      const name = path.dataset.name;
      const lic = path.classList.contains('lic');
      tip.innerHTML = '<strong>' + name + '</strong><small>' +
        (lic ? (path.dataset.no ? path.dataset.no + (path.dataset.since ? ' \u00b7 Licensed since ' + path.dataset.since : '')
                                 : 'Eric F. Trillas, PE \u2014 licensed')
             : 'Not yet licensed \u2014 ask about reciprocity') + '</small>';
      const r = wrap.getBoundingClientRect();
      tip.style.left = (x - r.left) + 'px';
      tip.style.top = (y - r.top) + 'px';
      tip.hidden = false;
    };
    usmap.addEventListener('pointermove', e => {
      const path = e.target.closest('path');
      if (path) show(path, e.clientX, e.clientY); else tip.hidden = true;
    });
    usmap.addEventListener('pointerleave', () => { tip.hidden = true; });
    usmap.addEventListener('click', e => {
      const path = e.target.closest('path');
      if (path) show(path, e.clientX, e.clientY);
    });
  }


  // Portfolio: expanding slat gallery
  const works = document.querySelector('.works');
  if (works && window.matchMedia('(min-width: 901px)').matches) {
    works.classList.add('accordion');
    const cards = Array.from(works.querySelectorAll('.work'));
    cards.forEach((c, i) => {
      const label = document.createElement('span');
      label.className = 'slat-label';
      label.textContent = (c.querySelector('h3') || {}).textContent || '';
      label.dataset.n = '0' + (i + 1);
      c.appendChild(label);
      const on = () => cards.forEach(x => x.classList.toggle('on', x === c));
      c.addEventListener('pointerenter', on);
      c.addEventListener('focusin', on);
    });
    cards[0].classList.add('on');
  }

  // Careers: mission-briefing console
  const consoleEl = document.querySelector('.console');
  if (consoleEl) {
    const items = Array.from(consoleEl.querySelectorAll('.con-item'));
    const jobs = Array.from(consoleEl.querySelectorAll('.con-job'));
    items.forEach(btn => btn.addEventListener('click', () => {
      items.forEach(b => b.classList.toggle('active', b === btn));
      jobs.forEach(j => j.classList.toggle('active', j.id === btn.dataset.job));
    }));
    jobs.forEach(job => {
      const tabs = Array.from(job.querySelectorAll('.con-tab'));
      const panes = Array.from(job.querySelectorAll('.con-pane'));
      tabs.forEach(t => t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.toggle('active', x === t));
        panes.forEach(p => p.classList.toggle('active', p.dataset.pane === t.dataset.tab));
      }));
    });
  }

  // Licensure map: scroll-driven 3D tilt, hover z-order, radar pings
  const mapPanel = document.querySelector('.map-panel');
  if (mapPanel) {
    const svg = mapPanel.querySelector('.usmap');
    const hqG = svg.querySelector('.hq');
    const calmMap = TCECALM();

    if (!calmMap && window.innerWidth >= 760) {
      let mt = false;
      const tilt = () => {
        mt = false;
        const r = mapPanel.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        svg.style.transform = 'rotateX(' + (21 - p * 15).toFixed(2) + 'deg)';
      };
      window.addEventListener('scroll', () => { if (!mt) { mt = true; requestAnimationFrame(tilt); } }, { passive: true });
      tilt();
    }

    // Wave-in: licensed states light up outward from Miami when the map scrolls into view
    const HQX = 1076, HQY = 566;
    const licPaths = Array.from(svg.querySelectorAll('path.lic'));
    const dist = p => { const b = p.getBBox(); return Math.hypot(b.x + b.width / 2 - HQX, b.y + b.height / 2 - HQY); };
    licPaths.sort((a, b) => dist(a) - dist(b));
    new IntersectionObserver((es, io2) => es.forEach(e => {
      if (!e.isIntersecting) return;
      io2.unobserve(mapPanel);
      licPaths.forEach((p, i) => {
        p.style.transitionDelay = (i * 55) + 'ms';
        requestAnimationFrame(() => p.classList.add('lit'));
        setTimeout(() => { p.style.transitionDelay = '0ms'; }, i * 55 + 700);
      });
    }), { threshold: .35 }).observe(mapPanel);

    svg.querySelectorAll('path').forEach(path => {
      path.addEventListener('pointerenter', () => {
        // bring hovered state above its neighbors (beacon stays on top)
        svg.insertBefore(path, hqG);
        if (!calmMap && path.classList.contains('lic')) {
          const b = path.getBBox();
          const ping = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          ping.setAttribute('cx', b.x + b.width / 2);
          ping.setAttribute('cy', b.y + b.height / 2);
          ping.setAttribute('r', Math.max(6, Math.min(b.width, b.height) / 5));
          ping.setAttribute('class', 'ping');
          svg.insertBefore(ping, hqG);
          ping.addEventListener('animationend', () => ping.remove());
        }
      });
    });
  }

  // Sci-fi hero background: particle network + city skyline + effects
  const calm = TCECALM();
  document.querySelectorAll('.hero-v2, .page-hero-v2, .cta-v2').forEach(hero => {
    try {
    const cv = document.createElement('canvas');
    cv.className = 'hero-canvas';
    hero.prepend(cv);
    const ctx = cv.getContext('2d');
    let W, H, N = 60, pts = [], bldgs = [], streams = [], mx = -9999, my = -9999, t = 0, sy = 0;
    let clouds = [], flyers = [], shooters = [];
    let nextPlane = 6 + Math.random() * 14, nextHeli = 14 + Math.random() * 20,
        nextFlock = 4 + Math.random() * 10, nextShoot = 8 + Math.random() * 18;
    window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
    const isSmall = window.innerWidth < 760;
    const DPR = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);
    const LINK = isSmall ? 100 : 170;

    const size = () => {
      // Let CSS stretch the canvas over the hero, then measure the canvas itself.
      cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:1;pointer-events:none;';
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const seed = () => {
      N = Math.max(40, Math.min(isSmall ? 90 : 220, Math.round(W * H / (isSmall ? 24000 : 11000))));
      pts = Array.from({ length: N }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.6 + .8
      }));
      bldgs = [];
      streams = [];
      clouds = Array.from({ length: isSmall ? 3 : 5 }, () => ({
        x: Math.random() * W, y: H * (.06 + Math.random() * .3),
        s: .7 + Math.random() * 1.6, v: .12 + Math.random() * .2, o: .5 + Math.random() * .5
      }));
      flyers = []; shooters = [];
      for (const layer of [0, 1]) {
        let x = -30;
        while (x < W + 30) {
          const bw = 34 + Math.random() * 70;
          const maxH = Math.min(H * (layer ? .40 : .28), layer ? 440 : 320);
          const bh = maxH * (.35 + Math.random() * .65);
          const b = { x, w: bw, h: bh, layer, ant: Math.random() < .3, glass: layer === 1 && Math.random() < .4, gx: Math.random(), win: [] };
          if (layer === 1) {
            const cols = Math.max(2, Math.floor(bw / 13));
            const rows = Math.max(2, Math.floor(bh / 16));
            for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
              if (Math.random() < .4) b.win.push({
                x: x + 6 + c * (bw - 10) / cols, y: r * (bh - 12) / rows + 8,
                ph: Math.random() * 6.28, sp: .2 + Math.random() * .8
              });
            }
          }
          bldgs.push(b);
          x += bw + 2 + Math.random() * 12;
        }
      }
    };

    const spawnStream = () => {
      const tall = bldgs.filter(b => b.layer === 1 && b.h > H * .16);
      if (!tall.length) return;
      const b = tall[Math.floor(Math.random() * tall.length)];
      streams.push({ x: b.x + b.w / 2, y: H - b.h, v: .8 + Math.random() * 1.2, life: 1 });
    };

    const draw = () => {
      t += .016;
      ctx.clearRect(0, 0, W, H);

      // ---- day/night synced to the visitor's real local time ----
      // (add ?demo to the URL to watch a fast 90-second full cycle instead)
      let cyc, day;
      if (/[?#]demo/.test(location.href)) {
        cyc = (t % 90) / 90;
        day = (Math.sin(cyc * 6.2832 - 1.5708) + 1) / 2;
      } else {
        const nowD = new Date();
        cyc = (nowD.getHours() + nowD.getMinutes() / 60 + nowD.getSeconds() / 3600) / 24;
        day = (1 - Math.cos(cyc * 6.2832)) / 2;   // 0 = midnight, 1 = noon, dusk/dawn at 6
      }
      const L = (a, b) => Math.round(a + (b - a) * day);

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, 'rgb(' + L(16, 62) + ',' + L(22, 93) + ',' + L(58, 165) + ')');
      sky.addColorStop(.55, 'rgb(' + L(24, 90) + ',' + L(33, 128) + ',' + L(80, 194) + ')');
      sky.addColorStop(1, 'rgb(' + L(19, 122) + ',' + L(26, 160) + ',' + L(64, 216) + ')');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

      // golden hour: orange / yellow / pink wash at sunrise & sunset
      const tw = Math.pow(1 - Math.abs(2 * day - 1), 1.15);  // wider, longer golden hour
      const warm = tw * (cyc > .5 ? 1 : .75);                // sunset glows harder than dawn
      if (warm > .01) {
        const gh = ctx.createLinearGradient(0, 0, 0, H);
        gh.addColorStop(0, 'rgba(118,70,190,' + (.22 * warm).toFixed(3) + ')');
        gh.addColorStop(.4, 'rgba(248,105,160,' + (.38 * warm).toFixed(3) + ')');
        gh.addColorStop(.72, 'rgba(255,130,70,' + (.50 * warm).toFixed(3) + ')');
        gh.addColorStop(1, 'rgba(255,196,90,' + (.60 * warm).toFixed(3) + ')');
        ctx.fillStyle = gh; ctx.fillRect(0, 0, W, H);
        // hot glow pooling around the sun's side of the horizon
        const hg = ctx.createRadialGradient(W * .18, H * .92, 40, W * .18, H * .92, W * .55);
        hg.addColorStop(0, 'rgba(255,170,80,' + (.34 * warm).toFixed(3) + ')');
        hg.addColorStop(.5, 'rgba(255,120,120,' + (.14 * warm).toFixed(3) + ')');
        hg.addColorStop(1, 'rgba(255,120,120,0)');
        ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H);
      }

      // moon (night) and sun (day) trade places
      const mr = Math.max(12, Math.min(26, H * .028));
      if (day < .98) {
        ctx.globalAlpha = 1 - day;
        const mxp = W * .84, myp = H * .15;
        const halo = ctx.createRadialGradient(mxp, myp, mr * .4, mxp, myp, mr * 4.4);
        halo.addColorStop(0, 'rgba(190,212,255,.30)');
        halo.addColorStop(1, 'rgba(190,212,255,0)');
        ctx.fillStyle = halo;
        ctx.fillRect(mxp - mr * 4.4, myp - mr * 4.4, mr * 8.8, mr * 8.8);
        ctx.fillStyle = 'rgba(228,238,255,.95)';
        ctx.beginPath(); ctx.arc(mxp, myp, mr, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(19,26,64,.30)';
        ctx.beginPath(); ctx.arc(mxp - mr * .38, myp - mr * .28, mr * .8, 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (day > .02) {
        ctx.globalAlpha = day;
        const sxp = W * .18, syp = H * (.17 + (1 - day) * .34), sr = mr * (1.15 + tw * 1.1);
        const sg = Math.round(250 - 65 * tw), sb = Math.round(230 - 125 * tw);
        const sun = ctx.createRadialGradient(sxp, syp, sr * .4, sxp, syp, sr * 5.2);
        sun.addColorStop(0, 'rgba(255,' + sg + ',' + sb + ',' + (.5 + tw * .35).toFixed(2) + ')');
        sun.addColorStop(1, 'rgba(255,' + sg + ',' + sb + ',0)');
        ctx.fillStyle = sun;
        ctx.fillRect(sxp - sr * 5.2, syp - sr * 5.2, sr * 10.4, sr * 10.4);
        ctx.fillStyle = 'rgba(255,' + Math.round(252 - 62 * tw) + ',' + Math.round(240 - 128 * tw) + ',.98)';
        ctx.beginPath(); ctx.arc(sxp, syp, sr, 0, 7); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // drifting clouds (visible mostly in daylight, warm-lit at golden hour)
      for (const c of clouds) {
        c.x += c.v; if (c.x - 180 * c.s > W) c.x = -200 * c.s;
        const ca = (.04 + .30 * day) * c.o;
        ctx.fillStyle = 'rgba(' + (255) + ',' + Math.round(255 - 45 * warm) + ',' + Math.round(255 - 90 * warm) + ',' + ca.toFixed(3) + ')';
        for (const [ox, oy, r] of [[0, 0, 34], [30, -10, 26], [62, 2, 30], [30, 8, 24]]) {
          ctx.beginPath(); ctx.arc(c.x + ox * c.s, c.y + oy * c.s, r * c.s, 0, 7); ctx.fill();
        }
      }

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
        const dm = Math.hypot(p.x - mx, p.y - my);
        if (dm < 140 && dm > 0) { p.x += (p.x - mx) / dm * .6; p.y += (p.y - my) / dm * .6; }
      }
      ctx.globalAlpha = 1 - day * .72;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = 'rgba(125,159,216,' + (0.32 * (1 - d / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      const pDrift = Math.min(sy, H) * .04;
      for (const p of pts) {
        ctx.fillStyle = 'rgba(170,198,245,.9)';
        ctx.beginPath(); ctx.arc(p.x, p.y + pDrift, p.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!calm) {
        if (Math.random() < .035 && streams.length < 9) spawnStream();
        for (const st of streams) {
          st.y -= st.v; st.life -= .004;
          const g = ctx.createLinearGradient(st.x, st.y, st.x, st.y + 60);
          g.addColorStop(0, 'rgba(169,199,247,' + (0.5 * st.life * (1 - day)).toFixed(3) + ')');
          g.addColorStop(1, 'rgba(169,199,247,0)');
          ctx.fillStyle = g;
          ctx.fillRect(st.x - .8, st.y, 1.6, 60);
        }
        streams = streams.filter(st => st.life > 0 && st.y > -70);
      }

      // ---- air traffic & wildlife ----
      if (!calm) {
        nextPlane -= .016; nextHeli -= .016; nextFlock -= .016; nextShoot -= .016;
        if (nextPlane <= 0 && flyers.filter(f => f.k === 'plane').length < 2) {
          const dir = Math.random() < .5 ? 1 : -1;
          flyers.push({ k: 'plane', x: dir > 0 ? -80 : W + 80, y: H * (.08 + Math.random() * .22), vx: dir * (1.1 + Math.random() * .7) });
          nextPlane = 14 + Math.random() * 22;
        }
        if (nextHeli <= 0 && !isSmall && !flyers.some(f => f.k === 'heli')) {
          const dir = Math.random() < .5 ? 1 : -1;
          flyers.push({ k: 'heli', x: dir > 0 ? -60 : W + 60, y: H * (.22 + Math.random() * .25), vx: dir * (.5 + Math.random() * .3), ph: Math.random() * 7 });
          nextHeli = 26 + Math.random() * 30;
        }
        if (nextFlock <= 0 && day > .3 && !isSmall && flyers.filter(f => f.k === 'flock').length < 2) {
          const dir = Math.random() < .5 ? 1 : -1;
          const members = Array.from({ length: 5 + Math.floor(Math.random() * 5) }, (_, i) => ({
            ox: -i * 14 * dir + (Math.random() - .5) * 8, oy: Math.abs(i) * 7 + (Math.random() - .5) * 6, ph: Math.random() * 7
          }));
          flyers.push({ k: 'flock', x: dir > 0 ? -120 : W + 120, y: H * (.15 + Math.random() * .3), vx: dir * (.8 + Math.random() * .4), m: members });
          nextFlock = 16 + Math.random() * 20;
        }
        if (nextShoot <= 0 && day < .18) {
          shooters.push({ x: W * (.2 + Math.random() * .6), y: H * (.05 + Math.random() * .2), vx: 6 + Math.random() * 4, vy: 2.5 + Math.random() * 2, life: 1 });
          nextShoot = 10 + Math.random() * 22;
        }
      }
      for (const f of flyers) {
        f.x += f.vx;
        const night = 1 - day;
        if (f.k === 'plane') {
          const d = Math.sign(f.vx);
          // daytime contrail
          if (day > .25) {
            const ct = ctx.createLinearGradient(f.x - d * 14, f.y, f.x - d * 150, f.y);
            ct.addColorStop(0, 'rgba(255,255,255,' + (.30 * day).toFixed(3) + ')');
            ct.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.strokeStyle = ct; ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.moveTo(f.x - d * 14, f.y); ctx.lineTo(f.x - d * 150, f.y); ctx.stroke();
          }
          ctx.fillStyle = day > .5 ? 'rgba(25,33,70,.85)' : 'rgba(205,220,250,.8)';
          ctx.beginPath();
          ctx.moveTo(f.x + d * 13, f.y);
          ctx.lineTo(f.x - d * 9, f.y - 3); ctx.lineTo(f.x - d * 4, f.y);
          ctx.lineTo(f.x - d * 12, f.y + 5); ctx.lineTo(f.x - d * 7, f.y + .5);
          ctx.closePath(); ctx.fill();
          if (night > .3 && Math.sin(t * 9) > .2) {
            ctx.fillStyle = 'rgba(255,255,255,.95)';
            ctx.fillRect(f.x - 1, f.y - 1, 2, 2);
            ctx.fillStyle = 'rgba(255,95,95,.9)';
            ctx.fillRect(f.x - d * 11, f.y + 3, 2, 2);
          }
        } else if (f.k === 'heli') {
          const d = Math.sign(f.vx);
          const bob = Math.sin(t * 2 + f.ph) * 3;
          const y = f.y + bob;
          ctx.fillStyle = day > .5 ? 'rgba(25,33,70,.85)' : 'rgba(200,216,248,.75)';
          ctx.beginPath(); ctx.ellipse(f.x, y, 9, 4.5, 0, 0, 7); ctx.fill();
          ctx.fillRect(f.x - d * 9, y - 1.2, -d * 12, 2.4);
          ctx.fillRect(f.x - d * 21, y - 5, 1.8, 6);
          // spinning rotor
          const rl = 14 * Math.abs(Math.sin(t * 14 + f.ph)) + 4;
          ctx.strokeStyle = day > .5 ? 'rgba(25,33,70,.7)' : 'rgba(210,225,250,.7)';
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(f.x - rl, y - 6); ctx.lineTo(f.x + rl, y - 6); ctx.stroke();
          if (night > .3 && Math.sin(t * 6 + f.ph) > 0) {
            ctx.fillStyle = 'rgba(255,95,95,.9)';
            ctx.beginPath(); ctx.arc(f.x, y - 8, 1.6, 0, 7); ctx.fill();
          }
        } else if (f.k === 'flock') {
          ctx.strokeStyle = 'rgba(22,30,66,' + (.30 + .5 * day).toFixed(2) + ')';
          ctx.lineWidth = 1.6;
          for (const b of f.m) {
            const flap = Math.sin(t * 7 + b.ph) * 3.4;
            const bx = f.x + b.ox, by = f.y + b.oy + Math.sin(t * 1.3 + b.ph) * 2;
            ctx.beginPath();
            ctx.moveTo(bx - 5, by);
            ctx.quadraticCurveTo(bx - 2.5, by - flap, bx, by);
            ctx.quadraticCurveTo(bx + 2.5, by - flap, bx + 5, by);
            ctx.stroke();
          }
        }
      }
      flyers = flyers.filter(f => f.x > -240 && f.x < W + 240);
      for (const st2 of shooters) {
        st2.x += st2.vx; st2.y += st2.vy; st2.life -= .022;
        const tg = ctx.createLinearGradient(st2.x, st2.y, st2.x - st2.vx * 9, st2.y - st2.vy * 9);
        tg.addColorStop(0, 'rgba(235,243,255,' + (.9 * st2.life * (1 - day)).toFixed(3) + ')');
        tg.addColorStop(1, 'rgba(235,243,255,0)');
        ctx.strokeStyle = tg; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(st2.x, st2.y); ctx.lineTo(st2.x - st2.vx * 9, st2.y - st2.vy * 9); ctx.stroke();
      }
      shooters = shooters.filter(st2 => st2.life > 0);

      const pOff = Math.min(sy, H);           // parallax offsets
      const off0 = pOff * .22, off1 = pOff * .09;

      // city-light haze rising from the horizon
      const haze = ctx.createLinearGradient(0, H - 180, 0, H);
      haze.addColorStop(0, 'rgba(' + L(80, 225) + ',' + L(115, 238) + ',' + L(205, 255) + ',0)');
      haze.addColorStop(1, 'rgba(' + L(80, 225) + ',' + L(115, 238) + ',' + L(205, 255) + ',' + (0.15 + day * .22).toFixed(2) + ')');
      ctx.fillStyle = haze;
      ctx.fillRect(0, H - 180, W, 180);

      const BACK = 'rgba(' + L(48, 118) + ',' + L(64, 142) + ',' + L(130, 198) + ',.78)';
      const FRONT = 'rgb(' + L(11, 40) + ',' + L(17, 56) + ',' + L(48, 116) + ')';
      for (const b of bldgs) if (b.layer === 0) {
        ctx.fillStyle = BACK;
        ctx.fillRect(b.x, H - b.h + off0, b.w, b.h);
        ctx.fillStyle = 'rgba(140,165,225,.18)';
        ctx.fillRect(b.x, H - b.h + off0, b.w, 1.4);
        if (b.ant) { ctx.fillStyle = BACK; ctx.fillRect(b.x + b.w / 2 - 1, H - b.h - 14 + off0, 2, 14); }
      }
      for (const b of bldgs) if (b.layer === 1) {
        ctx.fillStyle = FRONT;
        ctx.fillRect(b.x, H - b.h + off1, b.w, b.h);
        // glossy rooftop cap + moonlit edge
        ctx.fillStyle = 'rgba(' + Math.round(150 + 105 * warm) + ',' + Math.round(178 - 30 * warm) + ',' + Math.round(235 - 145 * warm) + ',' + (0.32 + warm * .40).toFixed(2) + ')';
        ctx.fillRect(b.x, H - b.h + off1, b.w, 1.7);
        ctx.fillStyle = 'rgba(120,150,220,.10)';
        ctx.fillRect(b.x, H - b.h + off1, 1.6, b.h);
        // glass curtain reflection on some towers
        if (b.glass) {
          const gx = b.x + b.w * b.gx * .55;
          const gw = b.w * .3;
          const gg = ctx.createLinearGradient(gx, H - b.h + off1, gx + gw, H);
          gg.addColorStop(0, 'rgba(170,200,250,.12)');
          gg.addColorStop(.55, 'rgba(170,200,250,.04)');
          gg.addColorStop(1, 'rgba(170,200,250,0)');
          ctx.fillStyle = gg;
          ctx.fillRect(gx, H - b.h + off1, gw, b.h);
        }
        ctx.fillStyle = FRONT;
        if (b.ant) {
          ctx.fillRect(b.x + b.w / 2 - 1, H - b.h - 22 + off1, 2, 22);
          const blink = (Math.sin(t * 2 + b.x) + 1) / 2;
          ctx.fillStyle = 'rgba(169,199,247,' + (0.25 + 0.6 * blink).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(b.x + b.w / 2, H - b.h - 24 + off1, 2, 0, 7); ctx.fill();
          ctx.fillStyle = FRONT;
        }
      }
      for (const b of bldgs) if (b.layer === 1) {
        for (const wn of b.win) {
          const tw = (Math.sin(t * wn.sp + wn.ph) + 1) / 2;
          ctx.fillStyle = 'rgba(170,198,245,' + ((0.12 + 0.42 * tw) * (1 - day * .8)).toFixed(3) + ')';
          ctx.fillRect(wn.x, H - b.h + wn.y + off1, 3, 4.5);
        }
      }
    };

    size(); seed(); draw();
    if (!calm) {
      let raf;
      const loop = () => { draw(); raf = requestAnimationFrame(loop); };
      loop();
      const vis = new IntersectionObserver(es => {
        es.forEach(e => {
          if (e.isIntersecting) { cancelAnimationFrame(raf); loop(); }
          else cancelAnimationFrame(raf);
        });
      });
      vis.observe(hero);
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      });
      hero.addEventListener('pointerleave', () => { mx = -9999; my = -9999; });
    }
    window.addEventListener('resize', () => { size(); seed(); if (calm) draw(); });
    window.addEventListener('load', () => { size(); seed(); if (calm) draw(); });
    if (window.ResizeObserver) {
      let lw = 0, lh = 0;
      new ResizeObserver(() => {
        const r = hero.getBoundingClientRect();
        if (Math.abs(r.width - lw) > 1 || Math.abs(r.height - lh) > 1) {
          lw = r.width; lh = r.height;
          size(); seed(); if (calm) draw();
        }
      }).observe(hero);
    }
    } catch (err) { console.warn('hero canvas:', err); }
  });

  // Show the hero reel once real footage exists
  const reel = document.querySelector('.hero-reel');
  if (reel) reel.addEventListener('loadeddata', () => reel.closest('.video-note-v2').classList.add('has-video'));

  // Sketch-on headline: letters outline in, then ink themselves
  if (!calm) {
    document.querySelectorAll('.giant, .giant-sm').forEach(h => {
      let idx = 0;
      const split = el => {
        Array.from(el.childNodes).forEach(node => {
          if (node.nodeType === 3) {
            const frag = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach(part => {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              const word = document.createElement('span');
              word.className = 'skw';
              for (const ch of part) {
                const sp = document.createElement('span');
                sp.className = 'sk'; sp.textContent = ch;
                sp.style.setProperty('--i', idx++);
                word.appendChild(sp);
              }
              frag.appendChild(word);
            });
            el.replaceChild(frag, node);
          } else if (node.nodeType === 1 && node.tagName !== 'BR') split(node);
        });
      };
      split(h);
    });
  }

  // Magnetic CTAs + click ripple
  if (fine && !calm) {
    document.querySelectorAll('.pill').forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.translate = (dx * .16).toFixed(1) + 'px ' + (dy * .3).toFixed(1) + 'px';
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
      btn.addEventListener('click', e => {
        const r = btn.getBoundingClientRect();
        const rip = document.createElement('span');
        rip.className = 'ripple';
        const size = Math.max(r.width, r.height) * 2.2;
        rip.style.width = rip.style.height = size + 'px';
        rip.style.left = (e.clientX - r.left - size / 2) + 'px';
        rip.style.top = (e.clientY - r.top - size / 2) + 'px';
        btn.appendChild(rip);
        rip.addEventListener('animationend', () => rip.remove());
      });
    });
  }

  // Modern chevron icons for every arrow button
  const chev = pts => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="' + pts + '"/></svg>';
  document.querySelectorAll('.strip-nav .prev').forEach(b => { b.innerHTML = chev('14,5 7,12 14,19'); });
  document.querySelectorAll('.strip-nav .next').forEach(b => { b.innerHTML = chev('10,5 17,12 10,19'); });
  document.querySelectorAll('.job-chevron').forEach(el => { el.innerHTML = chev('6,9 12,15 18,9'); });

  // Footer: structures being built - cranes, growing floors, welding sparks
  document.querySelectorAll('.footer-v2').forEach(ft => { try {
    const cv = document.createElement('canvas');
    cv.className = 'builder-canvas';
    cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:1;pointer-events:none;';
    ft.prepend(cv);
    const ctx = cv.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1.5 : 2);
    let W, H, t = 0, sites = [], stars = [], sparks = [];
    const size = () => {
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    const seed = () => {
      stars = Array.from({ length: Math.round(W / (W < 600 ? 40 : 26)) }, () => ({
        x: Math.random() * W, y: Math.random() * H * .45, ph: Math.random() * 7, sp: .3 + Math.random()
      }));
      sites = []; sparks = [];
      const n = W < 600 ? 1 : Math.max(2, Math.round(W / 480));
      for (let i = 0; i < n; i++) {
        const w = 120 + Math.random() * 110;
        const x = (i + .5) * (W / n) - w / 2 + (Math.random() - .5) * 50;
        const floorH = 16 + Math.random() * 6;
        const maxF = Math.max(6, Math.floor((H * .60) / floorH));
        sites.push({
          x, w, floorH, maxF,
          prog: 2 + Math.random() * maxF * .6,
          spd: .004 + Math.random() * .004,
          side: Math.random() < .5 ? -1 : 1,
          jib: 90 + Math.random() * 70,
          ph: Math.random() * 7
        });
      }
    };
    const draw = () => {
      t += .016;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0d1332'); g.addColorStop(1, '#18204d');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (const st of stars) {
        const twk = (Math.sin(t * st.sp + st.ph) + 1) / 2;
        ctx.fillStyle = 'rgba(170,198,245,' + (.08 + .35 * twk).toFixed(3) + ')';
        ctx.fillRect(st.x, st.y, 1.6, 1.6);
      }
      const gnd = H - 10;
      ctx.fillStyle = 'rgba(8,12,32,.95)'; ctx.fillRect(0, gnd, W, H - gnd);
      ctx.fillStyle = 'rgba(169,199,247,.25)'; ctx.fillRect(0, gnd, W, 1.2);

      for (const s2 of sites) {
        s2.prog += s2.spd;
        if (s2.prog > s2.maxF + 5) s2.prog = 2;      // top out, then a new tower breaks ground
        const built = Math.min(Math.floor(s2.prog), s2.maxF);
        const frac = Math.min(s2.prog - built, 1);
        const topY = gnd - built * s2.floorH;
        const cols = 4;
        // columns
        ctx.strokeStyle = 'rgba(120,150,220,.45)'; ctx.lineWidth = 1.4;
        for (let c = 0; c <= cols; c++) {
          const cx = s2.x + c * (s2.w / cols);
          ctx.beginPath(); ctx.moveTo(cx, gnd); ctx.lineTo(cx, topY); ctx.stroke();
        }
        // finished slabs
        for (let fl = 1; fl <= built; fl++) {
          const y = gnd - fl * s2.floorH;
          ctx.fillStyle = 'rgba(21,29,66,.95)'; ctx.fillRect(s2.x - 4, y, s2.w + 8, 3.4);
          ctx.fillStyle = 'rgba(169,199,247,.16)'; ctx.fillRect(s2.x - 4, y, s2.w + 8, 1);
        }
        // floor under construction rises as open framing
        if (built < s2.maxF && frac > 0) {
          const y1 = topY - s2.floorH * frac;
          ctx.strokeStyle = 'rgba(169,199,247,.6)'; ctx.lineWidth = 1.2;
          for (let c = 0; c <= cols; c++) {
            const cx = s2.x + c * (s2.w / cols);
            ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, y1); ctx.stroke();
          }
          if (Math.random() < .04) sparks.push({ x: s2.x + Math.random() * s2.w, y: y1 + Math.random() * 6, life: 1 });
        }
        // lit windows on completed floors
        ctx.fillStyle = 'rgba(170,198,245,.28)';
        for (let fl = 1; fl < built; fl++) {
          const y = gnd - fl * s2.floorH + 5;
          for (let c = 0; c < cols; c++) {
            if (((fl * 13 + c * 7 + Math.floor(s2.x)) % 9) < 3) ctx.fillRect(s2.x + c * (s2.w / cols) + 6, y, 4, 5);
          }
        }
        // tower crane
        const mastX = s2.x + (s2.side < 0 ? -26 : s2.w + 26);
        const mastTop = Math.min(topY, gnd - 60) - 70;
        const dir = s2.side < 0 ? -1 : 1;
        ctx.strokeStyle = 'rgba(140,168,235,.85)'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mastX - 3, gnd); ctx.lineTo(mastX - 3, mastTop);
        ctx.moveTo(mastX + 3, gnd); ctx.lineTo(mastX + 3, mastTop);
        ctx.stroke();
        ctx.lineWidth = 1;
        for (let y = gnd - 8; y > mastTop; y -= 12) {
          ctx.beginPath(); ctx.moveTo(mastX - 3, y); ctx.lineTo(mastX + 3, y - 6); ctx.stroke();
        }
        const jibEnd = mastX - dir * s2.jib, cwEnd = mastX + dir * 34;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mastX, mastTop); ctx.lineTo(jibEnd, mastTop);
        ctx.moveTo(mastX, mastTop); ctx.lineTo(cwEnd, mastTop);
        ctx.moveTo(mastX, mastTop - 16); ctx.lineTo(jibEnd, mastTop);
        ctx.moveTo(mastX, mastTop - 16); ctx.lineTo(cwEnd, mastTop);
        ctx.moveTo(mastX, mastTop - 16); ctx.lineTo(mastX, mastTop);
        ctx.stroke();
        ctx.fillStyle = 'rgba(120,150,220,.9)'; ctx.fillRect(cwEnd - 5, mastTop, 10, 7);
        // trolley, cable, hook carrying a beam
        const trX = mastX - dir * (s2.jib * .35 + s2.jib * .3 * Math.sin(t * .5 + s2.ph));
        const hookY = mastTop + 26 + ((topY - 34) - (mastTop + 26)) * (0.5 + 0.5 * Math.sin(t * .35 + s2.ph * 2));
        ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(200,216,248,.75)';
        ctx.beginPath(); ctx.moveTo(trX, mastTop); ctx.lineTo(trX, hookY); ctx.stroke();
        ctx.fillStyle = 'rgba(169,199,247,.9)'; ctx.fillRect(trX - 1.5, hookY, 3, 5);
        ctx.fillStyle = 'rgba(56,102,204,.95)'; ctx.fillRect(trX - 14, hookY + 5, 28, 4);
        // beacon
        const bl = (Math.sin(t * 3 + s2.ph) + 1) / 2;
        ctx.fillStyle = 'rgba(255,95,95,' + (0.25 + 0.65 * bl).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(mastX, mastTop - 18, 2.2, 0, 7); ctx.fill();
      }
      // welding sparks
      for (const sp of sparks) {
        sp.life -= .05;
        ctx.strokeStyle = 'rgba(255,235,180,' + (sp.life * .9).toFixed(3) + ')';
        ctx.lineWidth = 1;
        for (const a of [0, 1, 2, 3]) {
          const r = 2.5 + (1 - sp.life) * 5, ang = a * 1.57 + sp.life * 4;
          ctx.beginPath(); ctx.moveTo(sp.x, sp.y);
          ctx.lineTo(sp.x + r * Math.cos(ang), sp.y + r * Math.sin(ang)); ctx.stroke();
        }
      }
      sparks = sparks.filter(sp => sp.life > 0);
    };
    size(); seed(); draw();
    const calmF = TCECALM();
    if (!calmF) {
      let raf;
      const loop = () => { draw(); raf = requestAnimationFrame(loop); };
      loop();
      new IntersectionObserver(es => es.forEach(e => {
        cancelAnimationFrame(raf);
        if (e.isIntersecting) loop();
      })).observe(ft);
    }
    window.addEventListener('resize', () => { size(); seed(); if (calmF) draw(); });
    if (window.ResizeObserver) new ResizeObserver(() => { size(); seed(); if (calmF) draw(); }).observe(ft);
  } catch (e) { console.warn('footer builder:', e); } });

  // Every content section becomes a numbered design sheet
  const sheetEls = Array.from(document.querySelectorAll('section')).filter(el =>
    !el.classList.contains('hero-v2') && !el.classList.contains('page-hero-v2') && !el.closest('footer'));
  const shTotal = String(sheetEls.length).padStart(2, '0');
  sheetEls.forEach((sec, i) => {
    sec.classList.add('sheet');
    const tag = document.createElement('div');
    tag.className = 'sheet-tag';
    tag.innerHTML = '<span>TCE &mdash; DESIGN SET &middot; REV A</span><b>SHT ' + String(i + 1).padStart(2, '0') + ' / ' + shTotal + '</b>';
    sec.appendChild(tag);
    const cr = document.createElement('i');
    cr.className = 'sheet-corners';
    sec.appendChild(cr);
  });

  // Sections fold like cards as they enter and leave the viewport
  if (window.innerWidth >= 760 && !TCECALM()) {
    const folds = Array.from(document.querySelectorAll(
      'section:not(.hero-v2):not(.page-hero-v2), .stats-v2'
    )).filter(el => !el.closest('footer'));
    let fTick = false;
    const foldPaint = () => {
      fTick = false;
      const vh = window.innerHeight;
      for (const el of folds) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) { el.style.transform = ''; el.style.opacity = ''; continue; }
        if (r.top > vh * .52) {
          const q = Math.min(1, (r.top - vh * .52) / (vh * .48));
          el.style.transformOrigin = 'top center';
          el.style.transform = 'perspective(1200px) rotateX(' + (q * 8).toFixed(2) + 'deg) translateY(' + (q * 48).toFixed(1) + 'px) scale(' + (1 - q * .05).toFixed(3) + ')';
          el.style.opacity = (1 - q * .55).toFixed(3);
        } else if (r.bottom < vh * .40) {
          const q = Math.min(1, (vh * .40 - r.bottom) / (vh * .40));
          el.style.transformOrigin = 'bottom center';
          el.style.transform = 'perspective(1200px) rotateX(' + (-q * 9).toFixed(2) + 'deg) scale(' + (1 + q * .05).toFixed(3) + ')';
          el.style.opacity = (1 - q * .55).toFixed(3);
        } else {
          el.style.transform = '';
          el.style.opacity = '';
        }
      }
    };
    window.addEventListener('scroll', () => { if (!fTick) { fTick = true; requestAnimationFrame(foldPaint); } }, { passive: true });
    foldPaint();
  }

  // Returning-visitor lane (existing clients see a welcome-back track)
  try {
    const returning = !!localStorage.getItem('tceSeen');
    localStorage.setItem('tceSeen', '1');
    if (returning) {
      const chip = document.getElementById('launchChip');
      if (chip) chip.querySelector('span').innerHTML = 'Welcome back \u2014 TCE has upgraded. Here\u2019s what\u2019s new';
      document.documentElement.classList.add('returning');
    }
  } catch (e) {}


  // Scroll-depth proposal nudge (once per session, not on contact page)
  if (window.innerWidth >= 760 && !/contact\.html$/.test(location.pathname) && !sessionStorage.getItem('tceNudge')) {
    const nd = document.createElement('aside');
    nd.className = 'nudge';
    nd.innerHTML =
      '<button class="nudge-x" aria-label="Dismiss">&times;</button>' +
      (document.documentElement.classList.contains('returning')
        ? '<strong>Welcome back \u2014 need Eric on something?</strong>'
        : '<strong>Have a project or claim like this?</strong>') +
      '<p>Free scoping conversation &mdash; you&rsquo;ll hear back within one business day.</p>' +
      '<div class="nudge-btns"><a href="contact.html#form" class="pill solid">Get My Proposal</a>' +
      '<a href="book-call.html" class="pill">Book a Call</a></div>';
    document.body.appendChild(nd);
    nd.querySelector('.nudge-x').addEventListener('click', () => {
      nd.classList.remove('on');
      setTimeout(() => nd.remove(), 500);
    });
    const nudgeWatch = () => {
      const h = document.documentElement;
      const depth = (h.scrollTop + h.clientHeight) / h.scrollHeight;
      if (depth > .7) {
        nd.classList.add('on');
        sessionStorage.setItem('tceNudge', '1');
        window.removeEventListener('scroll', nudgeWatch);
      }
    };
    window.addEventListener('scroll', nudgeWatch, { passive: true });
  }

  // Bottom conversion banner (desktop, once per session)
  if (window.innerWidth >= 760 && !sessionStorage.getItem('tceBanner')) {
    const bb = document.createElement('div');
    bb.className = 'bottom-banner';
    bb.innerHTML =
      '<span class="bb-txt"><i class="bb-dot"></i>Free scoping conversation &middot; response within one business day</span>' +
      '<a class="bb-link" href="contact.html#form">Get My Proposal <span class="arrow">&rarr;</span></a>' +
      '<a class="bb-link" href="book-call.html">Book a 15-min Call</a>' +
      '<a class="bb-link bb-tel" href="tel:7865425474">786-542-5474</a>' +
      '<button class="bb-x" aria-label="Dismiss">&times;</button>';
    document.body.appendChild(bb);
    document.body.classList.add('has-banner');
    bb.querySelector('.bb-x').addEventListener('click', () => {
      sessionStorage.setItem('tceBanner', '1');
      bb.remove();
      document.body.classList.remove('has-banner');
    });
  }

  // Outlined marquee band above the footer
  const ftEl = document.querySelector('.footer-v2');
  if (ftEl) {
    const mq = document.createElement('div');
    mq.className = 'marquee';
    const txt = 'STRUCTURAL DESIGN &nbsp;&middot;&nbsp; MEP SYSTEMS &nbsp;&middot;&nbsp; FORENSIC EVALUATIONS &nbsp;&middot;&nbsp; PRODUCT R+D &nbsp;&middot;&nbsp; MIAMI LAKES &rarr; NATIONWIDE &nbsp;&middot;&nbsp; ';
    mq.innerHTML = '<div class="mq-track"><span>' + txt + txt + '</span><span>' + txt + txt + '</span></div>';
    ftEl.parentNode.insertBefore(mq, ftEl);
  }

  // Animated forensic inspector patrols the licensure map
  (() => {
    const panel = document.querySelector('.map-panel');
    if (!panel || window.innerWidth < 760 || TCECALM()) return;
    const wc = document.createElement('canvas');
    wc.style.cssText = 'position:absolute;left:0;right:0;bottom:44px;width:100%;height:190px;z-index:2;pointer-events:none;';
    panel.appendChild(wc);
    const wx = wc.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W2 = 0, H2 = 190;
    const S = 1.9;   // inspector scale
    const size2 = () => {
      W2 = wc.getBoundingClientRect().width;
      wc.width = Math.round(W2 * DPR); wc.height = H2 * DPR;
      wx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    size2();
    window.addEventListener('resize', size2);

    const NAVY = '#1C2557', ACC = '#3866cc';
    let gx = 60, dir = 1, t2 = 0, mode = 'walk', modeT = 0, nextStop = 5 + Math.random() * 6;

    const drawGuy = () => {
      wx.clearRect(0, 0, W2, H2);
      const gY = H2 - 14;
      wx.save();
      wx.translate(gx, gY);
      wx.scale(S, S);
      wx.translate(-gx, -gY);
      // ground shadow
      wx.fillStyle = 'rgba(16,24,60,.12)';
      wx.beginPath(); wx.ellipse(gx, gY + 4, 16, 3.4, 0, 0, 7); wx.fill();

      const kneel = mode === 'inspect' ? Math.min(1, modeT / .5) : (mode === 'rise' ? 1 - Math.min(1, modeT / .5) : 0);
      const walkP = mode === 'walk' ? t2 * 9 : 0;
      const bob = mode === 'walk' ? Math.sin(walkP * 2) * 1.2 : kneel * 8;
      const hipY = gY - 22 + bob, hipX = gx;
      const shX = hipX, shY = hipY - 14 + kneel * 3;
      const headY = shY - 8;

      wx.strokeStyle = NAVY; wx.lineWidth = 3.4; wx.lineCap = 'round';
      // legs
      for (const ph of [0, Math.PI]) {
        const sw = mode === 'walk' ? Math.sin(walkP + ph) * .55 : (ph ? .9 * kneel : .2 * kneel);
        const kx = hipX + Math.sin(sw) * 10 * dir, ky = hipY + Math.cos(sw) * 10;
        const fx = kx + Math.sin(sw * .5 + .5 * (mode === 'walk' ? 1 : 2)) * 9 * dir, fy = Math.min(gY, ky + Math.cos(sw * .4) * 10);
        wx.beginPath(); wx.moveTo(hipX, hipY); wx.lineTo(kx, ky); wx.lineTo(fx, fy); wx.stroke();
      }
      // torso
      wx.beginPath(); wx.moveTo(hipX, hipY); wx.lineTo(shX, shY); wx.stroke();
      // safety vest stripe
      wx.strokeStyle = ACC; wx.lineWidth = 1.6;
      wx.beginPath(); wx.moveTo(hipX - dir * 1, hipY - 4); wx.lineTo(shX - dir * 1, shY + 3); wx.stroke();
      // arms
      wx.strokeStyle = NAVY; wx.lineWidth = 3;
      if (mode === 'inspect' || mode === 'rise') {
        // one arm extends a flashlight
        const aim = -0.35 + Math.sin(t2 * 1.6) * .35;
        const hx = shX + Math.cos(aim) * 15 * dir, hy = shY + 4 + Math.sin(aim) * 8;
        wx.beginPath(); wx.moveTo(shX, shY + 2); wx.lineTo(hx, hy); wx.stroke();
        // flashlight beam
        if (mode === 'inspect' && modeT > .5) {
          const bl = 60;
          wx.fillStyle = 'rgba(169,199,247,.16)';
          wx.beginPath();
          wx.moveTo(hx, hy);
          wx.lineTo(hx + Math.cos(aim - .16) * bl * dir, hy + Math.sin(aim - .16) * bl + 14);
          wx.lineTo(hx + Math.cos(aim + .16) * bl * dir, hy + Math.sin(aim + .16) * bl + 26);
          wx.closePath(); wx.fill();
        }
        // other arm on knee
        wx.beginPath(); wx.moveTo(shX, shY + 2); wx.lineTo(shX - dir * 6, shY + 12); wx.stroke();
      } else {
        for (const ph of [0, Math.PI]) {
          const sw = Math.sin(walkP + ph) * .45;
          const ex = shX - Math.sin(sw) * 8 * dir, ey = shY + 4 + Math.cos(sw) * 3;
          wx.beginPath(); wx.moveTo(shX, shY + 2); wx.lineTo(ex, ey + 8); wx.stroke();
        }
        // clipboard in leading hand
        wx.fillStyle = '#fff'; wx.strokeStyle = NAVY; wx.lineWidth = 1.4;
        const cbx = shX + dir * 9, cby = shY + 10;
        wx.fillRect(cbx - 4, cby, 8, 11); wx.strokeRect(cbx - 4, cby, 8, 11);
        wx.strokeStyle = ACC; wx.lineWidth = 1;
        wx.beginPath(); wx.moveTo(cbx - 2, cby + 3); wx.lineTo(cbx + 2, cby + 3);
        wx.moveTo(cbx - 2, cby + 6); wx.lineTo(cbx + 2, cby + 6); wx.stroke();
      }
      // head + hard hat
      wx.fillStyle = NAVY;
      wx.beginPath(); wx.arc(shX, headY, 4.6, 0, 7); wx.fill();
      wx.fillStyle = ACC;
      wx.beginPath(); wx.arc(shX, headY - 2.4, 5.4, Math.PI, 0); wx.fill();
      wx.fillRect(shX - 7, headY - 2.6, 14, 2);
      wx.restore();
    };

    let raf2, running = false;
    const loop2 = () => {
      t2 += .016; modeT += .016;
      if (mode === 'walk') {
        gx += dir * .75;
        if (gx > W2 - 90) dir = -1;
        if (gx < 90) dir = 1;
        if (modeT > nextStop) { mode = 'inspect'; modeT = 0; }
      } else if (mode === 'inspect' && modeT > 3) { mode = 'rise'; modeT = 0; }
      else if (mode === 'rise' && modeT > .5) { mode = 'walk'; modeT = 0; nextStop = 6 + Math.random() * 7; }
      drawGuy();
      raf2 = requestAnimationFrame(loop2);
    };
    new IntersectionObserver(es => es.forEach(e => {
      cancelAnimationFrame(raf2); running = e.isIntersecting;
      if (running) loop2();
    })).observe(panel);
  })();

  // Surveyor measures each design sheet as it scrolls in
  if (window.innerWidth >= 760 && !TCECALM()) {
    const svySVG =
      '<svg viewBox="0 0 64 60" aria-hidden="true">' +
        '<g stroke="#1C2557" stroke-width="2.4" stroke-linecap="round" fill="none">' +
          '<path d="M24 20 L12 52 M24 20 L36 52 M24 20 L24 54"/>' +
          '<path d="M46 30 L46 44 M46 44 L41 54 M46 44 L51 54 M46 34 L39 40 M46 34 L52 30"/>' +
        '</g>' +
        '<rect x="17" y="12" width="14" height="9" rx="1.5" fill="#3866cc"/>' +
        '<circle cx="46" cy="24" r="4.4" fill="#1C2557"/>' +
        '<path d="M41 21.4 a5.4 5.4 0 0 1 10 0 Z" fill="#3866cc"/>' +
      '</svg>';
    document.querySelectorAll('section.sheet').forEach(sec => {
      const svy = document.createElement('div');
      svy.className = 'surveyor';
      svy.innerHTML = svySVG;
      const laser = document.createElement('i');
      laser.className = 'sheet-laser';
      const dim = document.createElement('em');
      dim.className = 'sheet-dim';
      dim.textContent = 'DIM CHECK \u2713';
      sec.appendChild(svy); sec.appendChild(laser); sec.appendChild(dim);
      new IntersectionObserver((es, io3) => es.forEach(e => {
        if (!e.isIntersecting) return;
        io3.unobserve(sec);
        sec.classList.add('measured');
      }), { threshold: .3 }).observe(sec);
    });
  }

  // Attribution: first-touch source captured into every form (service/persona/state are fields)
  try {
    const qs = new URLSearchParams(location.search);
    const utm = ['utm_source','utm_medium','utm_campaign'].map(k => qs.get(k)).filter(Boolean).join(' / ');
    if (!sessionStorage.getItem('tceSrc')) {
      const ref = document.referrer && !document.referrer.includes(location.hostname) ? document.referrer : '';
      const first = (utm || ref || 'direct') + ' \u2192 ' + (location.pathname.split('/').pop() || 'index.html');
      sessionStorage.setItem('tceSrc', first);
    }
    document.querySelectorAll('input[name="source"]').forEach(i => { i.value = sessionStorage.getItem('tceSrc'); });
  } catch (e) {}

  // After a successful send, FormSubmit returns visitors to our thanks page
  document.querySelectorAll('input[name="_next"]').forEach(i => {
    i.value = new URL('thanks.html', location.href).href;
  });

  // Local preview: forms can't send from a file on disk, so simulate the thank-you
  if (location.protocol === 'file:') {
    document.querySelectorAll('form[action*="formsubmit"]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      f.innerHTML = '<h3>Thank you!</h3><p style="color:var(--muted);margin-top:10px">Received. On the live site this submission is emailed to the firm.</p><p style="color:var(--gray);font-size:12px;margin-top:8px"><em>(Local preview &mdash; sending activates once deployed on Netlify.)</em></p>';
    }));
  }

  // Motion preference toggle (persisted)
  document.querySelectorAll('.footer-v2 .wrap').forEach(w => {
    const t = document.createElement('button');
    t.className = 'motion-toggle'; t.type = 'button';
    const on = document.documentElement.classList.contains('calm');
    t.innerHTML = on ? '&#9655; Turn animations on' : '&#9633; Reduce motion &amp; effects';
    t.addEventListener('click', () => {
      try {
        const now = localStorage.getItem('tceCalm') === '1';
        localStorage.setItem('tceCalm', now ? '0' : '1');
      } catch (e) {}
      location.reload();
    });
    w.appendChild(t);
  });

  // Sticky mobile call bar
  const cb = document.createElement('div');
  cb.className = 'call-bar';
  cb.innerHTML = '<a href="tel:7865425474" class="pill">Call Now</a><a href="contact.html#form" class="pill solid">Get My Proposal</a>';
  document.body.appendChild(cb);
});
