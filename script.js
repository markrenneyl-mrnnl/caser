const $ = (id) => document.getElementById(id);

const menuToggle = $("menuToggle");
const navLinks = $("navLinks");
const themeToggle = $("themeToggle");
const animationToggle = $("animationToggle");
const animationPanel = $("animationPanel");
const particlesToggle = $("particlesToggle");
const scrollToggle = $("scrollToggle");
const speedControl = $("speedControl");
const backgroundEffects = $("backgroundEffects");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.textContent = dark ? "☀" : "☾";
  localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
});

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀";
}

animationToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  animationPanel.classList.toggle("open");
  animationToggle.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (!animationPanel.contains(event.target) && event.target !== animationToggle) {
    animationPanel.classList.remove("open");
    animationToggle.classList.remove("active");
  }
});

function createParticles() {
  backgroundEffects.innerHTML = "";
  for (let i = 0; i < 24; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * -12}s`;
    particle.style.animationDuration = `${8 + Math.random() * 9}s`;
    particle.style.width = `${3 + Math.random() * 5}px`;
    particle.style.height = particle.style.width;
    backgroundEffects.appendChild(particle);
  }
}
createParticles();

particlesToggle.addEventListener("change", () => {
  backgroundEffects.style.display = particlesToggle.checked ? "block" : "none";
});

scrollToggle.addEventListener("change", () => {
  document.body.classList.toggle("animations-off", !scrollToggle.checked);
  if (scrollToggle.checked) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.remove("visible"));
    observeReveals();
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }
});

speedControl.addEventListener("input", () => {
  document.documentElement.style.setProperty("--speed", speedControl.value);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

function observeReveals() {
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}
observeReveals();

$("year").textContent = new Date().getFullYear();

$("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("name").value.trim();
  $("formNote").textContent = `Thanks, ${name}! This demo form works on the page, but it does not send email yet.`;
  event.target.reset();
});


/* --- Responsive moving background interaction --- */
(() => {
  const bg = document.getElementById("backgroundEffects");
  if (!bg) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let raf = null;

  const updateTarget = (clientX, clientY) => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    targetX = (clientX / w - 0.5) * 2;
    targetY = (clientY / h - 0.5) * 2;
  };

  const animate = () => {
    currentX += (targetX - currentX) * 0.055;
    currentY += (targetY - currentY) * 0.055;

    bg.style.setProperty("--mx", currentX.toFixed(3));
    bg.style.setProperty("--my", currentY.toFixed(3));

    raf = requestAnimationFrame(animate);
  };

  window.addEventListener("pointermove", (event) => {
    updateTarget(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (event) => {
    if (event.touches && event.touches[0]) {
      updateTarget(event.touches[0].clientX, event.touches[0].clientY);
    }
  }, { passive: true });

  window.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  }, { passive: true });

  window.addEventListener("resize", () => {
    targetX = 0;
    targetY = 0;
  }, { passive: true });

  animate();
})();


/* --- Loading screen --- */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  setTimeout(() => {
    if (loader) loader.classList.add("hide");
    document.body.classList.remove("loading");
  }, 1050);
});

/* --- Click-to-type resume --- */
(() => {
  const button = document.getElementById("resumeButton");
  const terminal = document.getElementById("resumeTerminal");
  const output = document.getElementById("resumeTyping");
  if (!button || !terminal || !output) return;

  const resumeText = `KYLIE GWEN CASER
BS INFORMATION TECHNOLOGY

PROFILE
Information Technology student interested in web development,
software projects, networking, and practical technology solutions.

EDUCATION
• BS Information Technology
  King's College of the Philippines–Bambang, Inc.

EXPERIENCE & LEADERSHIP
• Student Officer — ICSO Department
• Treasurer — Main Department Organization
• Secretary — Indigenous Group Organization
• Student Officer — Dupax del Sur National High School

SKILLS
• HTML, CSS & JavaScript
• Responsive Web Design & UI Layout
• Java & MySQL
• Canva, Microsoft Word & PowerPoint
• Basic Networking & Server Concepts

INTERESTS
Technology • Travel • Sports • Games • Learning

GOAL
Build useful, simple, and user-friendly technology solutions.`;
  let timer;
  let opened = false;

  button.addEventListener("click", () => {
    terminal.classList.toggle("open");
    opened = terminal.classList.contains("open");
    button.setAttribute("aria-expanded", String(opened));
    button.innerHTML = opened ? 'Hide Resume <span>↑</span>' : 'View Resume <span>→</span>';
    clearInterval(timer);
    if (!opened) return;

    output.textContent = "";
    let i = 0;
    timer = setInterval(() => {
      output.textContent += resumeText.charAt(i++);
      if (i >= resumeText.length) clearInterval(timer);
    }, 14);
  });
})();

/* --- Gentle cursor movement on profile pictures --- */
(() => {
  const frames = document.querySelectorAll(".main-photo, .about-photo");
  frames.forEach(frame => {
    const image = frame.querySelector("img");
    if (!image) return;
    frame.addEventListener("pointermove", e => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      image.style.transform = `perspective(700px) scale(1.05) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });
    frame.addEventListener("pointerleave", () => { image.style.transform = ""; });
  });
})();

/* --- Professional effects --- */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = $("scrollProgress"), header = document.querySelector(".header"), toTop = $("toTop");
  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    header.classList.toggle("scrolled", scrollY > 10);
    toTop.classList.toggle("show", scrollY > 500);
    let cur = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s; });
    links.forEach(a => a.classList.toggle("active", cur && a.getAttribute("href") === "#" + cur.id));
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  const glow = $("cursorGlow");
  addEventListener("pointermove", e => { glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; glow.classList.add("on"); }, { passive: true });
  document.addEventListener("pointerleave", () => glow.classList.remove("on"));

  // Rotating typewriter roles
  const roleEl = $("roleTyped");
  if (roleEl && !reduce) {
    const roles = ["BSIT Student", "Aspiring IT Professional", "Web Developer", "Problem Solver"];
    let r = 0, c = 0, del = false;
    const tick = () => {
      const word = roles[r];
      roleEl.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 85);
    };
    setTimeout(tick, 1500);
  }

  // Count-up stats
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = +el.dataset.count;
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return; o.disconnect();
      let n = 0; const t = setInterval(() => { el.textContent = ++n; if (n >= target) clearInterval(t); }, 220);
    }).observe(el);
  });

  // 3D tilt + spotlight on cards
  if (!reduce) document.querySelectorAll(".skill-card,.project-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const b = card.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      card.style.setProperty("--gx", x + "px"); card.style.setProperty("--gy", y + "px");
      card.style.setProperty("--ry", ((x / b.width - .5) * 8).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((.5 - y / b.height) * 8).toFixed(2) + "deg");
      card.classList.add("tilting");
    });
    card.addEventListener("pointerleave", () => card.classList.remove("tilting"));
  });

  // Button ripple
  document.querySelectorAll(".btn").forEach(btn => btn.addEventListener("click", e => {
    const b = btn.getBoundingClientRect(), s = Math.max(b.width, b.height), r = document.createElement("span");
    r.className = "ripple"; r.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - b.left - s / 2}px;top:${e.clientY - b.top - s / 2}px`;
    btn.appendChild(r); setTimeout(() => r.remove(), 600);
  }));
})();

/* --- Theme picker --- */
(() => {
  const btn = $("themePicker"), panel = $("themePanel"), swatches = document.querySelectorAll(".swatch");
  const apply = name => {
    if (name === "ocean") document.body.removeAttribute("data-theme"); else document.body.setAttribute("data-theme", name);
    swatches.forEach(s => s.classList.toggle("active", s.dataset.theme === name));
    try { localStorage.setItem("portfolio-color", name); } catch (e) {}
  };
  let saved = "ocean"; try { saved = localStorage.getItem("portfolio-color") || "ocean"; } catch (e) {}
  apply(saved);
  btn.addEventListener("click", e => {
    e.stopPropagation();
    animationPanel.classList.remove("open"); animationToggle.classList.remove("active");
    panel.classList.toggle("open"); btn.classList.toggle("active");
  });
  animationToggle.addEventListener("click", () => { panel.classList.remove("open"); btn.classList.remove("active"); });
  swatches.forEach(s => s.addEventListener("click", () => apply(s.dataset.theme)));
  document.addEventListener("click", e => {
    if (!panel.contains(e.target) && e.target !== btn) { panel.classList.remove("open"); btn.classList.remove("active"); }
  });
})();

/* --- Background color settings --- */
(() => {
  const dots = document.querySelectorAll(".bg-dot"), custom = $("customBg"), reset = $("bgReset");
  const body = document.body, vars = ["--bg", "--surface", "--surface-2"];
  const lum = hex => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const syncIcon = () => { themeToggle.textContent = body.classList.contains("dark") ? "☀" : "☾"; };
  const mark = hex => dots.forEach(d => d.classList.toggle("active", !!hex && d.dataset.bg.toLowerCase() === hex.toLowerCase()));
  const apply = (hex, save = true) => {
    const dark = lum(hex) < .35;
    body.classList.toggle("dark", dark); syncIcon();
    body.style.setProperty("--bg", hex);
    body.style.setProperty("--surface", dark ? `color-mix(in srgb,${hex} 88%,#fff)` : `color-mix(in srgb,${hex} 55%,#fff)`);
    body.style.setProperty("--surface-2", dark ? `color-mix(in srgb,${hex} 82%,#fff)` : `color-mix(in srgb,${hex} 90%,#000)`);
    custom.value = hex; mark(hex);
    if (save) try { localStorage.setItem("portfolio-bg", hex); } catch (e) {}
  };
  const clear = () => {
    vars.forEach(v => body.style.removeProperty(v)); mark(null);
    let t = null; try { localStorage.removeItem("portfolio-bg"); t = localStorage.getItem("portfolio-theme"); } catch (e) {}
    body.classList.toggle("dark", t === "dark"); syncIcon();
  };
  dots.forEach(d => d.addEventListener("click", () => apply(d.dataset.bg)));
  custom.addEventListener("input", () => apply(custom.value));
  reset.addEventListener("click", clear);
  themeToggle.addEventListener("click", () => { if (body.style.getPropertyValue("--bg")) clear(); });
  let saved = null; try { saved = localStorage.getItem("portfolio-bg"); } catch (e) {}
  if (saved && /^#[0-9a-f]{6}$/i.test(saved)) apply(saved, false);
})();

/* --- AI assistant --- */
(() => {
  const AI_ENDPOINT = "chat.php";   // optional real-AI backend (see README). Falls back to built-in answers.
  const fab = $("chatFab"), panel = $("chatPanel"), body = $("chatBody"), input = $("chatInput");
  const kb = [
    { k: ["hi", "hello", "hey", "good morning", "good afternoon"], a: "Hi there! 👋 I'm Kylie's AI assistant. Ask me about her skills, projects, education, or how to get in touch." },
    { k: ["who", "about", "introduce", "yourself", "kylie", "tell me about"], a: "Kylie Gwen Caser is a BS Information Technology student and aspiring IT professional. She enjoys building simple, useful, and responsive digital experiences, and is focused on web and software development." },
    { k: ["education", "school", "college", "study", "course", "degree", "university", "bsit"], a: "Kylie is taking a BS in Information Technology at King's College of the Philippines–Bambang, Inc. Earlier, she was a student officer at Dupax del Sur National High School." },
    { k: ["skill", "skills", "technology", "technologies", "tools", "language", "languages", "programming", "stack", "good at"], a: "Kylie's skills include:\n• HTML, CSS & JavaScript\n• Responsive web design & UI layout\n• Java & MySQL\n• Canva, Microsoft Word & PowerPoint\n• Basic networking & server concepts" },
    { k: ["project", "projects", "portfolio", "built", "made", "work"], a: "Here are Kylie's featured projects:\n• Grocery Store POS — Java, MySQL desktop app\n• IoT Smart Parking — Arduino-based system with sensors\n• Responsive Portfolio — this website, built with HTML, CSS & JavaScript\n\nAsk me about any of them for details!" },
    { k: ["pos", "grocery", "store", "point of sale"], a: "The Grocery Store POS is a standalone point-of-sale concept for managing products, sales, users, and basic payment transactions. It's built with Java and MySQL as a desktop app." },
    { k: ["parking", "iot", "arduino", "sensor", "sensors"], a: "The IoT Smart Parking project is an Arduino-based system using ultrasonic sensors, an LCD display, LEDs, a buzzer, and servo barriers to manage parking." },
    { k: ["experience", "leadership", "officer", "treasurer", "secretary", "organization", "role", "roles"], a: "Kylie's leadership experience:\n• Student Officer — ICSO Department\n• Treasurer — Main Department Organization\n• Secretary — Indigenous Group Organization\n• Student Officer — Dupax del Sur National High School" },
    { k: ["interest", "interests", "hobby", "hobbies", "enjoy", "free time", "fun"], a: "Kylie enjoys technology, travel, sports, games, and learning new things." },
    { k: ["goal", "future", "plan", "plans", "dream", "aspire", "career"], a: "Her goal is to build useful, simple, and user-friendly technology solutions as an IT professional." },
    { k: ["contact", "email", "reach", "hire", "message", "collaborate", "collaboration", "talk", "connect"], a: "You can reach Kylie using the contact form at the bottom of this page. I can take you there — just click \"Contact\" in the menu, or ask me to scroll!" },
    { k: ["resume", "cv", "curriculum"], a: "You can view Kylie's resume in the Projects section — click the \"View Resume\" button and it will type out automatically." },
    { k: ["available", "availability", "open to"], a: "Kylie is available for learning and collaboration opportunities. Feel free to send a message through the contact form." },
    { k: ["thank", "thanks"], a: "You're welcome! 😊 Let me know if you'd like to know anything else." },
    { k: ["scroll", "take me", "go to"], a: "Sure! Scrolling to the contact section now ⬇", go: "#contact" }
  ];
  const fallback = "I only know what's on this portfolio, so I can't answer that one. Try asking about Kylie's skills, projects, education, or leadership — or send her a message using the contact form.";
  const history = [];
  let busy = false;

  const add = (text, who) => { const m = document.createElement("div"); m.className = "msg " + who; m.textContent = text; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; };
  const typeOut = (el, text) => new Promise(res => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = text; return res(); }
    let i = 0; const t = setInterval(() => { el.textContent = text.slice(0, i += 2); body.scrollTop = body.scrollHeight; if (i >= text.length) { clearInterval(t); res(); } }, 14);
  });
  const localAnswer = q => {
    const s = " " + q.toLowerCase().replace(/[^a-z0-9' ]/g, " ") + " ";
    let best = null, score = 0;
    kb.forEach(e => { const n = e.k.filter(w => s.includes(" " + w + " ") || (w.includes(" ") && s.includes(w))).length; if (n > score) { score = n; best = e; } });
    return best ? best : { a: fallback };
  };
  const askAI = async q => {
    const r = await fetch(AI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q, history: history.slice(-6) }) });
    if (!r.ok) throw new Error("ai unavailable");
    const d = await r.json(); if (!d.reply) throw new Error("empty");
    return d.reply;
  };
  const send = async text => {
    const q = (text || input.value).trim(); if (!q || busy) return;
    busy = true; input.value = ""; add(q, "user"); $("chatChips").style.display = "none";
    const dots = document.createElement("div"); dots.className = "msg bot typing"; dots.innerHTML = "<i></i><i></i><i></i>"; body.appendChild(dots); body.scrollTop = body.scrollHeight;
    let reply, go;
    try { reply = await askAI(q); }
    catch (e) { const l = localAnswer(q); reply = l.a; go = l.go; await new Promise(r => setTimeout(r, 600)); }
    dots.remove(); const m = add("", "bot"); await typeOut(m, reply);
    history.push({ role: "user", content: q }, { role: "assistant", content: reply });
    if (go) setTimeout(() => { panel.classList.remove("open"); (window.bookGo && window.bookGo(go)) || document.querySelector(go).scrollIntoView({ behavior: "smooth" }); }, 700);
    busy = false; input.focus();
  };
  const toggle = open => {
    panel.classList.toggle("open", open); panel.setAttribute("aria-hidden", String(!open)); fab.setAttribute("aria-expanded", String(open));
    if (open) { if (!body.children.length) add("Hi! 👋 I'm Kylie's AI assistant. Ask me anything about her skills, projects, or experience.", "bot"); setTimeout(() => input.focus(), 250); }
  };
  fab.addEventListener("click", () => toggle(!panel.classList.contains("open")));
  $("chatClose").addEventListener("click", () => toggle(false));
  $("chatSend").addEventListener("click", () => send());
  input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  $("chatChips").querySelectorAll("button").forEach(b => b.addEventListener("click", () => send(b.textContent)));
})();

/* --- Book layout --- */
(() => {
  const body = document.body, secs = [...document.querySelectorAll("main > section")], n = secs.length;
  let cur = 0, book = false;
  const ui = document.createElement("div"); ui.className = "book-nav";
  ui.innerHTML = '<button class="bk-arrow" id="bkPrev" aria-label="Previous page">‹</button><div class="book-dots"></div><span id="bkLabel"></span><button class="bk-arrow" id="bkNext" aria-label="Next page">›</button>';
  const cover = document.createElement("div"); cover.className = "book-cover";
  cover.innerHTML = '<div class="cover-inner"><span class="cover-emblem">✦</span><small>A PERSONAL PORTFOLIO</small><h2>Kylie Gwen Caser</h2><span class="cover-line"></span><p>BS Information Technology</p><button class="cover-btn" type="button">Open the book →</button></div>';
  body.append(ui, cover);
  const dotsWrap = ui.querySelector(".book-dots"), label = $("bkLabel");
  const name = s => s.id.charAt(0).toUpperCase() + s.id.slice(1);
  secs.forEach((s, i) => { const d = document.createElement("button"); d.setAttribute("aria-label", "Go to " + name(s)); d.title = name(s); d.addEventListener("click", () => go(i)); dotsWrap.appendChild(d); });
  const render = () => {
    secs.forEach((s, i) => { s.classList.toggle("page-past", i < cur); s.classList.toggle("page-active", i === cur); s.classList.toggle("page-future", i > cur); });
    dotsWrap.querySelectorAll("button").forEach((d, i) => d.classList.toggle("active", i === cur));
    label.textContent = `Page ${cur + 1} of ${n} · ${name(secs[cur])}`;
    $("bkPrev").disabled = cur === 0; $("bkNext").disabled = cur === n - 1;
    document.querySelectorAll(".nav-links a[href^='#']").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + secs[cur].id));
  };
  const go = i => { if (!book || i < 0 || i >= n || i === cur) return; secs[i].scrollTop = 0; cur = i; render(); };
  window.bookGo = sel => { if (!book) return false; const i = secs.findIndex(s => "#" + s.id === sel); if (i > -1) go(i); return i > -1; };
  $("bkPrev").addEventListener("click", () => go(cur - 1)); $("bkNext").addEventListener("click", () => go(cur + 1));
  document.addEventListener("click", e => {
    if (!book) return; const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const i = secs.findIndex(s => "#" + s.id === a.getAttribute("href")); if (i > -1) { e.preventDefault(); go(i); }
  });
  document.addEventListener("keydown", e => {
    if (!book || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") go(cur + 1); if (e.key === "ArrowLeft") go(cur - 1);
  });
  let sx = 0, sy = 0; const main = document.querySelector("main");
  main.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  main.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 70 && Math.abs(dy) < 50) go(cur + (dx < 0 ? 1 : -1)); }, { passive: true });
  cover.querySelector(".cover-btn").addEventListener("click", () => {
    cover.classList.add("open"); try { sessionStorage.setItem("bookOpened", "1"); } catch (e) {}
    setTimeout(() => cover.classList.add("gone"), 1200);
  });
  const buttons = document.querySelectorAll("[data-layout]");
  const setMode = m => {
    book = m === "book"; body.classList.toggle("book", book);
    buttons.forEach(b => b.classList.toggle("active", b.dataset.layout === m));
    try { localStorage.setItem("portfolio-layout", m); } catch (e) {}
    if (book) {
      scrollTo(0, 0); render();
      let seen = false; try { seen = !!sessionStorage.getItem("bookOpened"); } catch (e) {}
      cover.classList.toggle("open", seen); cover.classList.toggle("gone", seen);
    } else secs.forEach(s => s.classList.remove("page-past", "page-active", "page-future"));
  };
  buttons.forEach(b => b.addEventListener("click", () => setMode(b.dataset.layout)));
  let saved = "book"; try { saved = localStorage.getItem("portfolio-layout") || "book"; } catch (e) {}
  setMode(saved);
})();
