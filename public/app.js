/* ============================================================
   Solana Fall School · Guide 01 — remake
   ============================================================ */
(function () {
  "use strict";

  var KEY = "sfs-guide01-progress";
  var THEME_KEY = "sfs-guide01-theme";
  var TOTAL = 10;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     Theme — three states: system (no attr), light, dark
     --------------------------------------------------------- */
  function readTheme() {
    try { return localStorage.getItem(THEME_KEY) || "system"; } catch (e) { return "system"; }
  }
  function applyTheme(t) {
    if (t === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    var btn = $("#themebtn");
    if (btn) {
      var icon = t === "dark" ? "●" : t === "light" ? "○" : "◐";
      var label = t === "dark" ? "Dark" : t === "light" ? "Light" : "System";
      btn.innerHTML = '<span aria-hidden="true">' + icon + "</span> " + label;
      btn.setAttribute("aria-label", "Theme: " + label + ". Click to change.");
    }
  }
  applyTheme(readTheme());

  /* ---------------------------------------------------------
     Progress
     --------------------------------------------------------- */
  function readProgress() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function writeProgress(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }

  var progress = readProgress();

  function countDone() {
    var n = 0;
    for (var k in progress) if (progress[k]) n++;
    return n;
  }

  function paint() {
    var done = countDone();

    $$(".done-row input").forEach(function (input) {
      var cp = input.getAttribute("data-cp");
      var on = !!progress[cp];
      input.checked = on;
      var section = input.closest("section");
      if (section) section.classList.toggle("is-done", on);
    });

    $$(".spine a").forEach(function (a) {
      var cp = a.getAttribute("data-cp");
      a.classList.toggle("done", cp != null && !!progress[cp]);
    });

    var tally = $("#tally");
    if (tally) tally.textContent = done + " of " + TOTAL + " done";

    var ring = $(".ring .fill");
    if (ring) {
      var C = 119.4;
      ring.style.strokeDashoffset = String(C - (C * done) / TOTAL);
    }
    var pct = $("#ringpct");
    if (pct) pct.textContent = Math.round((done / TOTAL) * 100) + "%";
    var left = $("#ringleft");
    if (left) {
      left.textContent = done === TOTAL ? "all clear" : TOTAL - done + " to go";
    }
  }

  document.addEventListener("change", function (e) {
    var input = e.target;
    if (!input.matches || !input.matches(".done-row input")) return;
    var cp = input.getAttribute("data-cp");
    progress[cp] = input.checked;
    writeProgress(progress);
    paint();
    if (input.checked) {
      var rect = input.getBoundingClientRect();
      confetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      if (countDone() === TOTAL) setTimeout(finale, 380);
    }
  });

  var resetBtn = $("#reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      progress = {};
      writeProgress(progress);
      paint();
    });
  }

  /* ---------------------------------------------------------
     Copy buttons — injected into every code block
     --------------------------------------------------------- */
  function wrapCode() {
    $$("pre").forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains("codeblock")) return;

      var lang = pre.getAttribute("data-lang") || "bash";
      var wrap = document.createElement("div");
      wrap.className = "codeblock";

      var head = document.createElement("div");
      head.className = "code-head";
      head.innerHTML =
        '<span class="dots"><i></i><i></i><i></i></span>' +
        '<span class="code-lang">' + lang + "</span>" +
        '<span class="sp"></span>';

      var btn = document.createElement("button");
      btn.className = "copy";
      btn.type = "button";
      btn.textContent = "Copy";
      head.appendChild(btn);

      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(head);
      wrap.appendChild(pre);

      btn.addEventListener("click", function () {
        var text = pre.innerText;
        var done = function () {
          btn.textContent = "Copied";
          btn.classList.add("ok");
          setTimeout(function () {
            btn.textContent = "Copy";
            btn.classList.remove("ok");
          }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else fallback();

        function fallback() {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  }
  wrapCode();

  /* ---------------------------------------------------------
     Reading progress + back to top
     --------------------------------------------------------- */
  var readbar = $("#readbar");
  var totop = $("#totop");

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (readbar) readbar.style.width = pct + "%";
    if (totop) totop.classList.toggle("show", h.scrollTop > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (totop) {
    totop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Scrollspy
     --------------------------------------------------------- */
  var sections = $$(".doc > section[id]");
  var links = {};
  $$(".spine a").forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    links[id] = a;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0;
        });
        var best = null, bestVal = 0;
        for (var id in visible) {
          if (visible[id] > bestVal) { bestVal = visible[id]; best = id; }
        }
        $$(".spine a").forEach(function (a) { a.classList.remove("active"); });
        if (best && links[best]) links[best].classList.add("active");
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  if ("IntersectionObserver" in window) {
    var rv = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            rv.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );
    $$(".doc > section").forEach(function (s, i) {
      if (i === 0) { s.classList.add("rv", "in"); return; }
      s.classList.add("rv");
      rv.observe(s);
    });
  }

  /* ---------------------------------------------------------
     Command palette
     --------------------------------------------------------- */
  var palIndex = $$(".spine a").map(function (a) {
    return {
      id: a.getAttribute("href").slice(1),
      num: a.querySelector(".node") ? a.querySelector(".node").textContent.trim() : "",
      title: a.querySelector("span:last-child") ? a.querySelector("span:last-child").textContent.trim() : a.textContent.trim(),
      kind: "Checkpoint"
    };
  });

  // add headings as searchable targets
  $$(".doc h3, .doc h4").forEach(function (h, i) {
    if (!h.id) h.id = "h-" + i;
    var sec = h.closest("section");
    palIndex.push({
      id: h.id,
      num: "§",
      title: h.textContent.trim(),
      kind: sec && sec.id ? sec.id.toUpperCase() : "Section"
    });
  });

  var backdrop = null, selIdx = 0, results = [];

  function openPal() {
    if (backdrop) return;
    backdrop = document.createElement("div");
    backdrop.className = "pal-backdrop";
    backdrop.innerHTML =
      '<div class="pal" role="dialog" aria-modal="true" aria-label="Jump to section">' +
      '<input type="text" placeholder="Jump to a checkpoint or heading…" autocomplete="off" spellcheck="false" />' +
      '<div class="pal-list"></div>' +
      '<div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>' +
      "</div>";
    document.body.appendChild(backdrop);

    var input = $("input", backdrop);
    render("");
    input.focus();

    input.addEventListener("input", function () { selIdx = 0; render(input.value); });
    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closePal(); });
    backdrop.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); closePal(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); selIdx = Math.min(selIdx + 1, results.length - 1); paintSel(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); selIdx = Math.max(selIdx - 1, 0); paintSel(); }
      else if (e.key === "Enter") { e.preventDefault(); go(results[selIdx]); }
    });
  }

  function closePal() {
    if (!backdrop) return;
    backdrop.remove();
    backdrop = null;
  }

  function score(item, q) {
    var t = (item.title + " " + item.kind).toLowerCase();
    if (!q) return 1;
    var idx = t.indexOf(q);
    if (idx === 0) return 100;
    if (idx > 0) return 60 - Math.min(idx, 40);
    // subsequence
    var qi = 0;
    for (var i = 0; i < t.length && qi < q.length; i++) if (t[i] === q[qi]) qi++;
    return qi === q.length ? 20 : 0;
  }

  function render(q) {
    q = (q || "").trim().toLowerCase();
    results = palIndex
      .map(function (it) { return { it: it, s: score(it, q) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 40)
      .map(function (r) { return r.it; });

    var list = $(".pal-list", backdrop);
    if (!results.length) {
      list.innerHTML = '<div class="pal-empty">Nothing matches that.</div>';
      return;
    }
    list.innerHTML = results
      .map(function (it, i) {
        return (
          '<div class="pal-item' + (i === selIdx ? " sel" : "") + '" data-i="' + i + '">' +
          '<span class="pnum">' + it.num + "</span>" +
          "<span>" + it.title + "</span>" +
          "<small>" + it.kind + "</small>" +
          "</div>"
        );
      })
      .join("");

    $$(".pal-item", list).forEach(function (el) {
      el.addEventListener("click", function () { go(results[+el.getAttribute("data-i")]); });
      el.addEventListener("mousemove", function () {
        selIdx = +el.getAttribute("data-i");
        paintSel();
      });
    });
  }

  function paintSel() {
    $$(".pal-item", backdrop).forEach(function (el, i) {
      el.classList.toggle("sel", i === selIdx);
      if (i === selIdx && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    });
  }

  function go(item) {
    if (!item) return;
    closePal();
    var el = document.getElementById(item.id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  var palBtn = $("#palbtn");
  if (palBtn) palBtn.addEventListener("click", openPal);

  /* ---------------------------------------------------------
     Keyboard shortcuts
     --------------------------------------------------------- */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;

    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      backdrop ? closePal() : openPal();
      return;
    }
    if (typing) return;

    if (e.key === "/") { e.preventDefault(); openPal(); return; }

    if (e.key === "t" || e.key === "T") {
      var order = ["system", "light", "dark"];
      var cur = readTheme();
      var next = order[(order.indexOf(cur) + 1) % order.length];
      try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
      applyTheme(next);
      return;
    }

    if (e.key === "j" || e.key === "k") {
      e.preventDefault();
      var ids = sections.map(function (s) { return s; });
      var y = window.scrollY + 90;
      var cur2 = 0;
      for (var i = 0; i < ids.length; i++) if (ids[i].offsetTop <= y) cur2 = i;
      var target = e.key === "j" ? Math.min(cur2 + 1, ids.length - 1) : Math.max(cur2 - 1, 0);
      ids[target].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  var themeBtn = $("#themebtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var order = ["system", "light", "dark"];
      var cur = readTheme();
      var next = order[(order.indexOf(cur) + 1) % order.length];
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });
  }

  /* ---------------------------------------------------------
     Lamports <-> SOL converter
     --------------------------------------------------------- */
  var solIn = $("#sol-in"), lamIn = $("#lam-in");
  function fmt(n) {
    if (!isFinite(n)) return "";
    return String(n);
  }
  if (solIn && lamIn) {
    solIn.addEventListener("input", function () {
      var v = parseFloat(solIn.value);
      lamIn.value = isFinite(v) ? fmt(Math.round(v * 1e9)) : "";
    });
    lamIn.addEventListener("input", function () {
      var v = parseFloat(lamIn.value);
      solIn.value = isFinite(v) ? fmt(v / 1e9) : "";
    });
    $$(".chip[data-lam]").forEach(function (c) {
      c.addEventListener("click", function () {
        var lam = c.getAttribute("data-lam");
        lamIn.value = lam;
        solIn.value = fmt(parseFloat(lam) / 1e9);
      });
    });
  }

  /* ---------------------------------------------------------
     Confetti
     --------------------------------------------------------- */
  var cvs = $("#confetti");
  var ctx = cvs ? cvs.getContext("2d") : null;
  var bits = [];
  var raf = null;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function sizeCanvas() {
    if (!cvs) return;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  var COLORS = ["#9945FF", "#14F195", "#7C3AED", "#FFC978", "#7FD5F5"];

  function confetti(x, y, count) {
    if (!ctx || reduced) return;
    count = count || 26;
    for (var i = 0; i < count; i++) {
      bits.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * -9 - 2,
        g: 0.32 + Math.random() * 0.16,
        w: 4 + Math.random() * 5,
        h: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        life: 1
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function finale() {
    var w = window.innerWidth;
    confetti(w * 0.2, window.innerHeight * 0.35, 50);
    setTimeout(function () { confetti(w * 0.5, window.innerHeight * 0.28, 60); }, 130);
    setTimeout(function () { confetti(w * 0.8, window.innerHeight * 0.35, 50); }, 260);
  }

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    for (var i = bits.length - 1; i >= 0; i--) {
      var b = bits[i];
      b.vy += b.g;
      b.x += b.vx;
      b.y += b.vy;
      b.rot += b.vr;
      b.life -= 0.008;
      if (b.y > cvs.height + 40 || b.life <= 0) { bits.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, b.life));
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }
    if (bits.length) raf = requestAnimationFrame(tick);
    else { raf = null; ctx.clearRect(0, 0, cvs.width, cvs.height); }
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  paint();
})();
