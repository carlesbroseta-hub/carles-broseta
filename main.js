/* =====================================================
   Compás — main.js · v=20260624
   IIFE pattern — no ES modules
   ===================================================== */

(function () {
  "use strict";

  /* ── Helpers ─────────────────────────────────────── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn("[Compás:" + name + "]", e); }
  }

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  const DATA = window.__COMPAS__ || {};
  const PAGE = document.body.dataset.page || "";

  /* ── Reveal on scroll ──────────────────────────────── */
  function initReveals() {
    const els = qsa(".reveal");
    if (!els.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.03, rootMargin: "0px 0px -2% 0px" });

    els.forEach(function (el) { io.observe(el); });

    /* 6-second safety net */
    setTimeout(function () {
      els.forEach(function (el) {
        if (!el.classList.contains("is-visible")) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ── Sidebar active state ──────────────────────────── */
  function initSidebar() {
    var links = qsa(".sidebar-link");
    var currentPath = location.pathname.split("/").pop() || "index.html";

    links.forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop();
      if (href && href === currentPath) {
        link.classList.add("active");
      }
    });
  }

  /* ── Progress bars animated fill ──────────────────── */
  function initProgressBars() {
    var bars = qsa(".progress-bar-fill");
    if (!bars.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var pct = e.target.dataset.pct || "0";
          e.target.style.width = pct + "%";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    bars.forEach(function (bar) { io.observe(bar); });
  }

  /* ── Stat count-up ─────────────────────────────────── */
  function initCountUp() {
    var nums = qsa("[data-count-to]");
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var target = parseFloat(e.target.dataset.countTo);
        var el = e.target;
        var start = 0;
        var duration = 1200;
        var startTime = null;
        var isDecimal = String(target).indexOf(".") > -1;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3);
          var val = start + (target - start) * ease;
          el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.2 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ── Activity Chart (SVG) ──────────────────────────── */
  function initActivityChart() {
    var container = qs(".activity-chart-wrap");
    if (!container || !DATA.activity) return;

    var activity = DATA.activity;
    var colors = DATA.activityColors || [];
    var MAX_H = 80;

    /* find max total hours to scale */
    var maxTotal = 0;
    activity.forEach(function (d) {
      var total = d.hours.reduce(function (a, b) { return a + b; }, 0);
      if (total > maxTotal) maxTotal = total;
    });

    container.innerHTML = "";

    activity.forEach(function (dayData, idx) {
      var col = document.createElement("div");
      col.className = "act-bar-col" + (idx === activity.length - 1 ? " active" : "");

      var total = dayData.hours.reduce(function (a, b) { return a + b; }, 0);

      /* stacks */
      dayData.hours.forEach(function (h, ci) {
        if (h <= 0) return;
        var bar = document.createElement("div");
        bar.className = "act-bar-stack";
        bar.style.background = colors[ci] || "#7c3aed";
        bar.style.borderRadius = "6px";
        var targetH = Math.round((h / (maxTotal || 1)) * MAX_H);
        bar.style.height = "0px";
        bar.style.transition = "height 0.7s cubic-bezier(0.22,1,0.36,1) " + (0.1 * ci) + "s";
        col.appendChild(bar);
        setTimeout(function () { bar.style.height = targetH + "px"; }, 200 + idx * 80);
      });

      var lbl = document.createElement("div");
      lbl.className = "act-bar-label";
      lbl.textContent = dayData.day;
      col.appendChild(lbl);

      container.appendChild(col);
    });
  }

  /* ── Filter Tabs ───────────────────────────────────── */
  function initFilterTabs() {
    var tabs = qsa(".filter-tab");
    var cards = qsa(".project-card");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");

        var filter = tab.dataset.filter;

        cards.forEach(function (card) {
          var tri = card.dataset.trimester;
          var show = filter === "todos" || tri === filter;
          card.style.transition = "opacity 0.25s, transform 0.25s";
          if (show) {
            card.style.opacity = "1";
            card.style.transform = "";
            card.style.pointerEvents = "";
          } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            card.style.pointerEvents = "none";
          }
        });
      });
    });
  }

  /* ── 3D Card tilt + mouse parallax (new lx-* login) ─ */
  function init3DCards() {
    var cards = qsa(".lx-card");
    var scene = qs("#lx-scene");
    if (!cards.length) return;

    /* Per-card hover tilt */
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transition = "transform 0.08s ease, box-shadow 0.4s";
        card.style.transform =
          "perspective(800px) rotateY(" + (x * 28) + "deg) rotateX(" + (-y * 28) + "deg) scale(1.06) translateZ(20px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform 0.7s var(--ease-out), box-shadow 0.4s";
        card.style.transform = "";
      });
    });

    /* Global mouse parallax on the scene */
    if (scene) {
      var depths = cards.map(function (c) { return parseFloat(c.dataset.depth || 0.05); });
      var cx = window.innerWidth / 2;
      var cy = window.innerHeight / 2;
      var targetX = 0, targetY = 0, curX = 0, curY = 0;

      document.addEventListener("mousemove", function (e) {
        targetX = (e.clientX - cx) * 0.5;
        targetY = (e.clientY - cy) * 0.5;
      });

      (function loop() {
        curX += (targetX - curX) * 0.06;
        curY += (targetY - curY) * 0.06;
        cards.forEach(function (card, i) {
          if (card.matches(":hover")) return;
          var d = depths[i];
          card.style.transform =
            "perspective(900px) translateX(" + (curX * d) + "px) translateY(" + (curY * d) + "px)";
          card.style.transition = "box-shadow 0.4s";
        });
        requestAnimationFrame(loop);
      })();
    }
  }

  /* ── Floating particles (kept for backwards compat) ── */
  function initParticles() {
    var wrap = qs(".lv-particles");
    if (!wrap) return;
    for (var i = 0; i < 12; i++) {
      (function (idx) {
        var p = document.createElement("div");
        p.className = "lv-particle";
        var size = 40 + Math.random() * 80;
        p.style.cssText =
          "width:" + size + "px;height:" + size + "px;" +
          "left:" + (Math.random() * 90) + "%;" +
          "top:" + (Math.random() * 90) + "%;" +
          "animation-delay:" + (Math.random() * 8) + "s;" +
          "animation-duration:" + (10 + Math.random() * 8) + "s;";
        wrap.appendChild(p);
      })(i);
    }
  }

  /* ── Login Page — two-phase (hero → form) ─────────── */
  function initLogin() {

    /* ── Phase transition ──────────────────────────────── */
    var phaseTriggered = false;

    function goToForm() {
      if (phaseTriggered) return;
      phaseTriggered = true;
      document.body.dataset.phase = "form";
      var panel = qs("#cx-form-panel");
      if (panel) panel.setAttribute("aria-hidden", "false");
      var hero = qs("#cx-hero");
      if (hero) hero.setAttribute("aria-hidden", "true");
      /* Focus first input after transition */
      setTimeout(function () {
        var first = qs("#email");
        if (first) first.focus();
      }, 700);
    }

    function goToHero() {
      phaseTriggered = false;
      document.body.dataset.phase = "hero";
      var panel = qs("#cx-form-panel");
      if (panel) panel.setAttribute("aria-hidden", "true");
      var hero = qs("#cx-hero");
      if (hero) hero.setAttribute("aria-hidden", "false");
    }

    /* Enter button */
    var enterBtn = qs("#cx-enter-btn");
    if (enterBtn) enterBtn.addEventListener("click", goToForm);

    /* Back button */
    var backBtn = qs("#cx-back-btn");
    if (backBtn) backBtn.addEventListener("click", goToHero);

    /* Scroll down → form */
    var scrollHandler = function (e) {
      if (document.body.dataset.phase !== "hero") return;
      if (e.deltaY > 0) { goToForm(); window.removeEventListener("wheel", scrollHandler); }
    };
    window.addEventListener("wheel", scrollHandler, { passive: true });

    /* Touch swipe up → form */
    var touchStartY = 0;
    window.addEventListener("touchstart", function (e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener("touchend", function (e) {
      if (document.body.dataset.phase !== "hero") return;
      var diff = touchStartY - e.changedTouches[0].clientY;
      if (diff > 40) goToForm();
    }, { passive: true });

    /* Enter key → form (only on hero phase) */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && document.body.dataset.phase === "hero") {
        e.preventDefault();
        goToForm();
      }
      if (e.key === "Escape" && document.body.dataset.phase === "form") {
        goToHero();
      }
    });

    /* ── Password visibility toggle ───────────────────── */
    var eye = qs(".form-input-eye");
    var passInput = qs("#password");
    if (eye && passInput) {
      eye.addEventListener("click", function () {
        var isText = passInput.type === "text";
        passInput.type = isText ? "password" : "text";
        eye.innerHTML = isText
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      });
    }

    /* ── Login form submit ────────────────────────────── */
    function getSelectedCourse() { return "1ESO"; }

    var form = qs("#login-form");
    var errorEl = qs(".login-error");
    var submitBtn = qs(".cx-btn-submit");

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var email = (qs("#email", form) || {}).value || "";
        var pass  = (qs("#password", form) || {}).value || "";

        if (!email || !pass) {
          if (errorEl) { errorEl.textContent = "Por favor, introduce tu correo y contraseña."; errorEl.classList.add("visible"); }
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (errorEl) { errorEl.textContent = "Introduce un correo electrónico válido."; errorEl.classList.add("visible"); }
          return;
        }

        if (errorEl) errorEl.classList.remove("visible");
        if (submitBtn) { submitBtn.classList.add("loading"); submitBtn.innerHTML = '<div class="spinner"></div>'; }

        var namePart = email.split("@")[0].split(".")[0];
        var demoName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        sessionStorage.setItem("compas_user", JSON.stringify({ name: demoName, email: email, course: getSelectedCourse() }));
        setTimeout(function () { window.location.href = "dashboard.html"; }, 1200);
      });
    }

    /* ── Demo button ─────────────────────────────────── */
    var demoBtn = qs(".btn-demo");
    if (demoBtn) {
      demoBtn.addEventListener("click", function () {
        var base = { name:"Ana García", email:"demo@alumno.edu.es", course:"3ESO" };
        sessionStorage.setItem("compas_user", JSON.stringify(base));
        demoBtn.innerHTML = '<div class="spinner" style="border-color:rgba(210,165,55,0.3);border-top-color:#D4A012"></div> Entrando...';
        demoBtn.style.pointerEvents = "none";
        setTimeout(function () { window.location.href = "dashboard.html"; }, 900);
      });
    }
  }

  /* ── Dashboard Page ────────────────────────────────── */
  function initDashboard() {
    /* Greeting */
    var greetingEl = qs(".user-greeting-name");
    var stored = sessionStorage.getItem("compas_user");
    var user = stored ? JSON.parse(stored) : (DATA.user || {});
    if (greetingEl && user.name) {
      var firstName = (user.name || "").split(" ")[0];
      greetingEl.textContent = firstName;
    }

    /* Date */
    var dateEl = qs(".page-date");
    if (dateEl) {
      var now = new Date();
      var opts = { weekday:"long", year:"numeric", month:"long", day:"numeric" };
      dateEl.textContent = now.toLocaleDateString("es-ES", opts);
      dateEl.textContent = dateEl.textContent.charAt(0).toUpperCase() + dateEl.textContent.slice(1);
    }

    /* Right panel user info */
    var rnameEl = qs(".user-name");
    var rclassEl = qs(".user-class");
    if (rnameEl && user.name) rnameEl.textContent = user.name;

    /* Course label */
    var userCourse = user.course || null;
    var courseData = (DATA.courses || []).find(function (c) { return c.id === userCourse; });
    var courseLabel = courseData ? courseData.label : (userCourse || "ESO");

    if (rclassEl) rclassEl.textContent = courseLabel + " · Clase A";

    /* Course chip in section title */
    var courseChipEl = qs("#course-chip");
    if (courseChipEl) courseChipEl.textContent = courseLabel;

    /* Real stats from this course's projects */
    var courseProjects = (DATA.projects || []).filter(function (p) {
      return !userCourse || p.course === userCourse;
    });
    var pendingTasksCount = 0;
    courseProjects.forEach(function (p) { pendingTasksCount += (p.tasksTotal - p.tasksDone); });
    var activeProjectsCount = courseProjects.filter(function (p) { return p.tasksDone < p.tasksTotal; }).length;

    var pendingNumEl  = qs("[data-stat='pending-tasks']");
    var activeNumEl   = qs("[data-stat='active-projects']");
    if (pendingNumEl) { pendingNumEl.setAttribute("data-count-to", pendingTasksCount); pendingNumEl.textContent = pendingTasksCount; }
    if (activeNumEl)  { activeNumEl.setAttribute("data-count-to", activeProjectsCount); activeNumEl.textContent = activeProjectsCount; }

    /* Streak / hours */
    var u = DATA.user || {};
    var streakEl = qs("[data-stat='streak']");
    var hoursEl = qs("[data-stat='hours']");
    if (streakEl) streakEl.setAttribute("data-count-to", u.streak || 12);
    if (hoursEl)  hoursEl.setAttribute("data-count-to", u.hoursWeek || 4.5);

    /* Render project cards */
    safe(renderProjectCards, "renderProjectCards");

    /* Render my-projects in right panel */
    safe(renderMyProjects, "renderMyProjects");

    /* Activity chart */
    safe(initActivityChart, "initActivityChart");

    /* Filters */
    safe(initFilterTabs, "initFilterTabs");

    /* Count ups */
    safe(initCountUp, "initCountUp");

    /* Progress bars */
    safe(initProgressBars, "initProgressBars");

    /* Reveals */
    safe(initReveals, "initReveals");

    /* Sidebar */
    safe(initSidebar, "initSidebar");

    /* Glow spotlight — project cards */
    document.addEventListener("pointermove", function (e) {
      qsa(".project-card[data-glow]").forEach(function (card) {
        card.style.setProperty("--x", e.clientX.toFixed(2));
        card.style.setProperty("--xp", (e.clientX / window.innerWidth).toFixed(2));
        card.style.setProperty("--y", e.clientY.toFixed(2));
      });
    }, { passive: true });
  }

  function renderProjectCards() {
    var grid = qs(".projects-grid");
    if (!grid || !DATA.projects) return;
    if (grid.children.length > 0) return;

    var stored = sessionStorage.getItem("compas_user");
    var user = stored ? JSON.parse(stored) : (DATA.user || {});
    var userCourse = user.course || null;

    var projects = userCourse
      ? DATA.projects.filter(function (p) { return p.course === userCourse; })
      : DATA.projects;

    var fragment = document.createDocumentFragment();
    var trimLabels = { 1:"1er Trim.", 2:"2º Trim.", 3:"3er Trim." };

    projects.forEach(function (proj) {
      var pct = proj.tasksTotal > 0 ? Math.round((proj.tasksDone / proj.tasksTotal) * 100) : 0;
      var trimKey = "t" + (proj.trimester || 1);

      var card = document.createElement("a");
      card.className = "project-card reveal";
      card.setAttribute("data-glow", "");
      card.href = "proyecto.html?id=" + proj.id;
      card.dataset.category = proj.category;
      card.dataset.trimester = trimKey;
      card.style.setProperty("--cat-color", proj.catColor);
      card.style.setProperty("--cat-bg", proj.catBg);
      card.style.setProperty("--cat-shadow", proj.catShadow);

      var badgeHtml = proj.badge
        ? '<span style="font-size:0.7rem;font-weight:800;color:#f59e0b;background:#fffbeb;padding:2px 8px;border-radius:100px;">' + proj.badge + '</span>'
        : '';

      card.innerHTML =
        '<div class="card-top">' +
          '<span class="cat-badge" style="background:' + proj.catBg + ';color:' + proj.catText + ';">' +
            '<span style="width:6px;height:6px;border-radius:50%;background:' + proj.catColor + ';display:inline-block;"></span>' +
            proj.catLabel +
          '</span>' +
          '<div style="display:flex;align-items:center;gap:6px;">' +
            badgeHtml +
            '<span class="trim-badge">' + (trimLabels[proj.trimester] || "T" + proj.trimester) + '</span>' +
            '<span class="card-rating">★ ' + proj.rating.toFixed(1) + '</span>' +
          '</div>' +
        '</div>' +
        '<h3 class="card-title">' + proj.title + '</h3>' +
        '<p class="card-subject">' + (proj.subject || "") + '</p>' +
        '<div class="card-progress">' +
          '<div class="progress-label">' +
            '<span>' + proj.tasksDone + '/' + proj.tasksTotal + ' tareas</span>' +
            '<span>' + pct + '%</span>' +
          '</div>' +
          '<div class="progress-bar-track">' +
            '<div class="progress-bar-fill" data-pct="' + pct + '" style="background:' + proj.catColor + ';"></div>' +
          '</div>' +
        '</div>' +
        '<div class="card-footer">' +
          '<div class="card-teacher">' +
            '<div class="teacher-avatar">' + (proj.teacherIni || "CM") + '</div>' +
            '<span class="teacher-name">' + (proj.teacher || "Prof. de Música") + '</span>' +
          '</div>' +
          '<div class="card-arrow">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
          '</div>' +
        '</div>';

      fragment.appendChild(card);
    });

    grid.appendChild(fragment);
  }

  function renderMyProjects() {
    var list = qs(".my-proj-list");
    if (!list || !DATA.projects) return;
    if (list.children.length > 0) return;

    var stored = sessionStorage.getItem("compas_user");
    var user = stored ? JSON.parse(stored) : (DATA.user || {});
    var userCourse = user.course || null;

    var active = DATA.projects.filter(function (p) {
      return (!userCourse || p.course === userCourse) && p.tasksDone < p.tasksTotal;
    }).slice(0, 3);

    active.forEach(function (proj) {
      var item = document.createElement("a");
      item.className = "my-proj-item";
      item.href = "proyecto.html?id=" + proj.id;
      item.innerHTML =
        '<div class="my-proj-color" style="background:' + proj.catColor + ';"></div>' +
        '<div class="my-proj-info">' +
          '<div class="my-proj-cat" style="color:' + proj.catColor + ';">' + proj.catLabel + '</div>' +
          '<div class="my-proj-title">' + proj.title + '</div>' +
        '</div>' +
        '<div class="my-proj-rating">★ ' + proj.rating.toFixed(1) + '</div>';
      list.appendChild(item);
    });
  }

  /* ── Project Detail Page ───────────────────────────── */
  function initProyecto() {
    /* Read project id from URL */
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get("id") || "1", 10);
    var proj = (DATA.projects || []).find(function (p) { return p.id === id; });

    if (!proj) {
      /* Fallback to first project */
      proj = (DATA.projects || [])[0];
      if (!proj) return;
    }

    /* Apply category theme */
    document.documentElement.style.setProperty("--proj-color",  proj.catColor);
    document.documentElement.style.setProperty("--proj-bg",     proj.catBg);
    document.documentElement.style.setProperty("--proj-shadow", proj.catShadow);

    /* Header */
    var titleEl  = qs(".pdh-title");
    var catEl    = qs(".pdh-cat-badge");
    var teacherEl = qs(".pdh-teacher");

    if (titleEl)   titleEl.textContent = proj.title;
    if (catEl) {
      catEl.style.background = proj.catBg;
      catEl.style.color = proj.catText;
      catEl.innerHTML =
        '<span style="width:8px;height:8px;border-radius:50%;background:' + proj.catColor + ';display:inline-block;margin-right:6px;"></span>' +
        proj.catLabel;
    }
    if (teacherEl) teacherEl.textContent = proj.teacher;

    /* Progress stats */
    var doneStat   = qs("[data-pstat='done']");
    var totalStat  = qs("[data-pstat='total']");
    var pendStat   = qs("[data-pstat='pending']");
    var pctLabel   = qs("[data-pstat='pct']");
    var bigBar     = qs(".ppc-progress .progress-bar-fill");
    var pct = proj.tasksTotal > 0 ? Math.round((proj.tasksDone / proj.tasksTotal) * 100) : 0;

    if (doneStat)  doneStat.textContent  = proj.tasksDone;
    if (totalStat) totalStat.textContent = proj.tasksTotal;
    if (pendStat)  pendStat.textContent  = proj.tasksTotal - proj.tasksDone;
    if (pctLabel)  pctLabel.textContent  = pct + "%";
    if (bigBar) {
      bigBar.style.background = proj.catColor;
      bigBar.setAttribute("data-pct", pct);
    }

    /* Right panel project card */
    var rpTitle  = qs(".proj-rp-title");
    var rpCat    = qs(".proj-rp-cat");
    var rpRating = qs(".proj-rp-rating");
    if (rpTitle)  rpTitle.textContent = proj.title;
    if (rpCat) {
      rpCat.style.color = proj.catColor;
      rpCat.textContent = proj.catLabel;
    }
    if (rpRating) rpRating.textContent = "★ " + proj.rating.toFixed(1);

    /* Render tabs content */
    safe(function () { renderDescription(proj); }, "renderDescription");
    safe(function () { renderMaterials(proj); },   "renderMaterials");
    safe(function () { renderTasks(proj); },        "renderTasks");

    /* Tab switching */
    safe(initTabs, "initTabs");

    /* Sidebar */
    safe(initSidebar, "initSidebar");

    /* Progress bars */
    safe(initProgressBars, "initProgressBars");

    /* Submit modal */
    safe(initSubmitModal, "initSubmitModal");

    /* Reveals */
    safe(initReveals, "initReveals");
  }

  function renderDescription(proj) {
    var container = qs(".tab-desc-content");
    if (!container || container.children.length > 0) return;
    var div = document.createElement("div");
    div.className = "proj-description";
    div.innerHTML = proj.description || "<p>Sin descripción disponible.</p>";
    container.appendChild(div);
  }

  function renderMaterials(proj) {
    var container = qs(".tab-mat-content");
    if (!container || container.children.length > 0) return;
    var list = document.createElement("div");
    list.className = "material-list";

    (proj.materials || []).forEach(function (mat) {
      var item = document.createElement("div");
      item.className = "material-item";
      item.innerHTML =
        '<div class="material-icon" style="background:' + (mat.color || "#f5f0ff") + ';">' + mat.icon + '</div>' +
        '<div class="material-info">' +
          '<div class="material-title">' + mat.title + '</div>' +
          '<div class="material-meta">' + mat.meta + '</div>' +
        '</div>' +
        '<div class="material-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>';
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  function renderTasks(proj) {
    var container = qs(".tab-task-content");
    if (!container || container.children.length > 0) return;

    var taskList = document.createElement("div");
    taskList.className = "task-list";

    (proj.tasks || []).forEach(function (task, idx) {
      var item = document.createElement("div");
      item.className = "task-item reveal" + (task.done ? " done" : "");
      item.style.animationDelay = (idx * 0.05) + "s";

      var statusClass = "pendiente";
      if (task.status === "entregado") statusClass = "entregado";
      if (task.status === "revisado")  statusClass = "revisado";

      item.innerHTML =
        '<div class="task-check">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' +
        '</div>' +
        '<div class="task-body">' +
          '<div class="task-title">' + task.title + '</div>' +
          '<div class="task-desc">' + task.desc + '</div>' +
        '</div>' +
        '<div class="task-meta">' +
          '<span class="task-due' + (task.urgent ? " urgent" : "") + '">' + task.due + '</span>' +
          '<span class="task-status-badge ' + statusClass + '">' +
            (task.status === "revisado" ? "✓ Revisado" : task.status === "entregado" ? "Entregado" : "Pendiente") +
          '</span>' +
        '</div>';

      /* Toggle done state on click */
      item.addEventListener("click", function () {
        item.classList.toggle("done");
        var badge = item.querySelector(".task-status-badge");
        if (item.classList.contains("done")) {
          badge.textContent = "Entregado";
          badge.className = "task-status-badge entregado";
        } else {
          badge.textContent = "Pendiente";
          badge.className = "task-status-badge pendiente";
        }
        updateProjectProgress(proj);
      });

      taskList.appendChild(item);
    });

    /* Submit area */
    var submitArea = document.createElement("div");
    submitArea.className = "submit-area mt-24";
    submitArea.innerHTML =
      '<div class="submit-area-icon">📤</div>' +
      '<h3>¿Listo para entregar?</h3>' +
      '<p>Sube tus archivos o añade un enlace a tu trabajo.</p>' +
      '<button class="btn-submit" data-open-modal>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>' +
        'Subir tarea' +
      '</button>';

    container.appendChild(taskList);
    container.appendChild(submitArea);
  }

  function updateProjectProgress(proj) {
    var doneItems = qsa(".task-item.done").length;
    var totalItems = qsa(".task-item").length;
    var pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    var bigBar = qs(".ppc-progress .progress-bar-fill");
    var doneStat = qs("[data-pstat='done']");
    var pendStat = qs("[data-pstat='pending']");
    var pctLabel = qs("[data-pstat='pct']");

    if (bigBar)   bigBar.style.width = pct + "%";
    if (doneStat) doneStat.textContent = doneItems;
    if (pendStat) pendStat.textContent = Math.max(0, totalItems - doneItems);
    if (pctLabel) pctLabel.textContent = pct + "%";
  }

  /* ── Tabs ───────────────────────────────────────────── */
  function initTabs() {
    var tabs = qsa(".proj-tab");
    var contents = qsa(".tab-content");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        contents.forEach(function (c) { c.classList.remove("active"); });

        tab.classList.add("active");
        var target = qs("#" + tab.dataset.tab);
        if (target) target.classList.add("active");
      });
    });
  }

  /* ── Submit Modal ───────────────────────────────────── */
  function initSubmitModal() {
    var modal   = qs(".modal-overlay");
    var openBtn = qs("[data-open-modal]");
    var closeBtn = qs(".modal-close");
    var form    = qs(".modal-form");

    if (!modal) return;

    function openModal() { modal.classList.add("open"); }
    function closeModal() { modal.classList.remove("open"); }

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    /* Upload zone drag feedback */
    var zone = qs(".upload-zone");
    if (zone) {
      ["dragover","dragenter"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) {
          e.preventDefault();
          zone.style.borderColor = "var(--purple)";
          zone.style.background  = "rgba(124,58,237,0.13)";
        });
      });
      ["dragleave","drop"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) {
          e.preventDefault();
          zone.style.borderColor = "";
          zone.style.background  = "";
        });
      });
      zone.addEventListener("click", function () {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "*/*";
        input.onchange = function () {
          if (input.files && input.files[0]) {
            var fname = input.files[0].name;
            zone.innerHTML =
              '<div class="upload-icon">📎</div>' +
              '<div class="upload-text">' + fname + '</div>' +
              '<div class="upload-hint">Archivo seleccionado · Haz clic para cambiar</div>';
          }
        };
        input.click();
      });
    }

    /* Form submission → success */
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var mc = qs(".modal-card");
        if (!mc) return;
        mc.innerHTML =
          '<div class="success-screen">' +
            '<div class="success-icon">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' +
            '</div>' +
            '<h3>¡Tarea entregada!</h3>' +
            '<p>Tu trabajo ha llegado correctamente a la profesora.<br>Recibirás retroalimentación pronto.</p>' +
            '<button class="btn-submit mt-24" onclick="document.querySelector(\'.modal-overlay\').classList.remove(\'open\')" style="margin:24px auto 0;display:inline-flex;">' +
              '¡Perfecto!' +
            '</button>' +
          '</div>';
      });
    }
  }

  /* ── About-Mí: divide texto en spans de palabras ─────── */
  function splitIntoWords(el, wordsArray) {
    var nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    nodes.forEach(function (node) {
      if (node.nodeType === 3) { // nodo de texto
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            el.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement('span');
            span.className = 'ph-word';
            span.textContent = part;
            wordsArray.push(span);
            el.appendChild(span);
          }
        });
      } else if (node.nodeType === 1) { // elemento (br, strong, span…)
        splitIntoWords(node, wordsArray);
        el.appendChild(node);
      }
    });
  }

  /* ── Scroll-Expand Hero ───────────────────────────────── */
  function initScrollExpandHero() {
    var bg        = document.getElementById('sehBg');
    var mediaWrap = document.getElementById('sehMediaWrap');
    var mediaDark = document.getElementById('sehMediaDark');
    var name1     = document.getElementById('sehName1');
    var name2     = document.getElementById('sehName2');
    var hint      = document.getElementById('sehHint');
    var reveal    = document.getElementById('sehReveal');

    if (!bg || !mediaWrap || !name1 || !name2) return;

    var progress = 0;
    var expanded = false;
    var touchY   = 0;
    var ticking  = false;
    var mobile   = window.innerWidth < 768;

    window.addEventListener('resize', function () { mobile = window.innerWidth < 768; });

    function render(p) {
      bg.style.opacity = 1 - p;

      var maxW = mobile ? 950  : 1550;
      var maxH = mobile ? 600  : 800;
      mediaWrap.style.width  = (300 + p * (maxW - 300)) + 'px';
      mediaWrap.style.height = (400 + p * (maxH - 400)) + 'px';

      mediaDark.style.opacity = Math.max(0.5 - p * 0.35, 0);

      var vw = document.documentElement.clientWidth || 1280;
      var shiftPX = p * (mobile ? 40 : 42) * vw / 100;
      name1.style.transform = 'translateX(-' + shiftPX + 'px)';
      name2.style.transform = 'translateX('  + shiftPX + 'px)';

      if (hint) hint.style.opacity = Math.max(1 - p * 4, 0);

      if (reveal) {
        if (p >= 0.8) reveal.classList.add('is-visible');
        else          reveal.classList.remove('is-visible');
      }
    }

    function update(p) {
      progress = Math.max(0, Math.min(1, p));
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          render(progress);
          if (progress >= 1) expanded = true;
          ticking = false;
        });
      }
    }

    function onWheel(e) {
      if (expanded) {
        if (e.deltaY < 0 && window.scrollY <= 5) {
          expanded = false;
          e.preventDefault();
        }
        return;
      }
      e.preventDefault();
      update(progress + e.deltaY * 0.001);
    }

    function onScroll() {
      if (!expanded) window.scrollTo(0, 0);
    }

    function onTouchStart(e) { touchY = e.touches[0].clientY; }

    function onTouchMove(e) {
      if (!touchY) return;
      var dy = touchY - e.touches[0].clientY;
      if (expanded) {
        if (dy < -20 && window.scrollY <= 5) { expanded = false; e.preventDefault(); }
        return;
      }
      e.preventDefault();
      update(progress + dy * (dy < 0 ? 0.007 : 0.005));
      touchY = e.touches[0].clientY;
    }

    function onTouchEnd() { touchY = 0; }

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('scroll',     onScroll);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('touchend',   onTouchEnd);

    requestAnimationFrame(function() { render(0); });
  }

  /* ── Hero: cinemática de scroll — zoom lento hacia el músico, nombre sale ── */
  function initHeroPhotoScroll() {
    var hero = qs('.ph-hero');
    var text = qs('.ph-hero-text');
    var img  = qs('.ph-hero-bg-img');
    if (!hero || !text || !img) return;
    if (window.innerWidth <= 900) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var MAX_SCALE = 1.22;
    /* Origen del zoom en CSS: 74% → el margen sobrante a la derecha es 26% de lo que crece */
    var MAX_SHIFT = 0.26 * (MAX_SCALE - 1) * 0.9;

    function eio(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function eout(t) { return 1 - Math.pow(1 - t, 3); }

    var ticking = false;

    function update() {
      ticking = false;
      var viewH       = window.innerHeight || 720;
      var scrollSpace = hero.offsetHeight - viewH;
      if (scrollSpace <= 0) return;

      var rawP = Math.max(0, Math.min(1, window.scrollY / scrollSpace));
      var p    = eio(rawP);

      /* Texto: se va antes que termine el zoom, así el final es solo la foto */
      var tp    = eout(Math.min(1, rawP / 0.55));
      var alpha = 1 - tp;
      text.style.opacity       = alpha.toFixed(3);
      text.style.transform     = 'translateX(' + (-140 * tp).toFixed(1) + 'px)';
      text.style.filter        = tp > 0.01 ? 'blur(' + (6 * tp).toFixed(2) + 'px)' : '';
      text.style.pointerEvents = alpha < 0.02 ? 'none' : '';

      /* Foto: zoom hacia el músico y leve deriva hacia el centro, sin dejar bordes */
      var imgW = img.clientWidth || window.innerWidth;
      img.style.transform =
        'translateX(' + (-MAX_SHIFT * imgW * p).toFixed(1) + 'px) ' +
        'scale(' + (1 + (MAX_SCALE - 1) * p).toFixed(4) + ')';
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    });

    update();
  }

  /* ── Hero: nombre y frase se escriben a máquina (TextType) ── */
  function initHeroTyping() {
    var box   = qs('.ph-hero-text');
    var name  = qs('.ph-name');
    var claim = qs('.ph-claim');
    if (!box || !name || !claim || box.dataset.typed) return;
    box.dataset.typed = '1';

    function split(root) {
      var chars = [];
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var frag = document.createDocumentFragment();
        Array.from(node.nodeValue.replace(/\s+/g, ' ').trim()).forEach(function (ch) {
          var s = document.createElement('span');
          s.className = 'tt-char';
          s.textContent = ch;
          frag.appendChild(s);
          chars.push(s);
        });
        node.parentNode.replaceChild(frag, node);
      });
      return chars;
    }

    var nameChars  = split(name);
    var claimChars = split(claim);
    box.classList.add('tt-active');
    /* Red de seguridad: pase lo que pase, a los 15 s todo el texto es visible */
    setTimeout(function () {
      qsa('.tt-char', box).forEach(function (c) { c.classList.add('is-on'); });
    }, 15000);

    var cursor = document.createElement('span');
    cursor.className = 'tt-cursor no-glide is-idle';
    cursor.setAttribute('aria-hidden', 'true');
    box.appendChild(cursor);

    var curEl = null, curAfter = false;
    function place(el, after) {
      curEl = el; curAfter = after;
      var b  = box.getBoundingClientRect();
      var r  = el.getBoundingClientRect();
      var fs = parseFloat(getComputedStyle(el).fontSize) || 16;
      var h  = fs * 0.8;
      var x  = (after ? r.right + fs * 0.05 : r.left - fs * 0.04) - b.left;
      var y  = r.top + (r.height - h) / 2 - b.top;
      cursor.style.width     = Math.max(2, Math.round(fs * 0.035)) + 'px';
      cursor.style.height    = h.toFixed(1) + 'px';
      cursor.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    }
    function idle(on) { cursor.classList.toggle('is-idle', on); }
    function show(el) { el.classList.add('is-on'); }
    function hideNow(el) {
      el.classList.add('tt-instant');
      el.classList.remove('is-on');
      void el.offsetWidth;
      el.classList.remove('tt-instant');
    }

    /* Errores solo en la frase: un nombre con erratas no queda bien, ni siquiera un instante */
    var NEAR = { a:'sq', b:'vn', c:'xv', d:'sf', e:'wr', f:'dg', g:'fh', h:'gj', i:'uo', j:'hk',
                 l:'kñ', m:'n', n:'bm', o:'ip', p:'o', r:'et', s:'ad', t:'ry', u:'yi', v:'cb', ú:'u' };
    var typoAt = {};
    var candidates = [];
    claimChars.forEach(function (c, k) {
      var ch = c.textContent.toLowerCase();
      var nxt = claimChars[k + 1];
      if (k > 3 && NEAR[ch] && nxt && /\S/.test(nxt.textContent)) candidates.push(k);
    });
    for (var t = 0; t < 2 && candidates.length; t++) {
      var pick = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
      typoAt[pick] = true;
      candidates = candidates.filter(function (k) { return Math.abs(k - pick) > 14; });
    }

    var steps = [];
    nameChars.forEach(function (el)     { steps.push({ el: el, speed: 110, typo: false }); });
    claimChars.forEach(function (el, k) { steps.push({ el: el, speed: 45, typo: !!typoAt[k] }); });

    function jitter(ms) { return ms * (0.7 + Math.random() * 0.6); }

    var i = 0, finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      steps.forEach(function (s) { show(s.el); });
      cursor.classList.remove('is-jump');
      place(steps[steps.length - 1].el, true);
      idle(true);
    }

    function next() {
      if (finished) return;
      if (i >= steps.length) { finish(); return; }
      var s    = steps[i];
      var el   = s.el;
      var prev = i > 0 ? steps[i - 1].el : null;

      var newLine = prev && !s.jumped &&
        (el.parentNode !== prev.parentNode || (el.previousSibling && el.previousSibling.nodeName === 'BR'));
      if (newLine) {
        s.jumped = true;
        idle(true);
        cursor.classList.add('is-jump');
        place(el, false);
        var pause = el === claimChars[0] ? 700 : (el.previousSibling && el.previousSibling.nodeName === 'BR' ? 280 : 420);
        setTimeout(function () { cursor.classList.remove('is-jump'); next(); }, pause);
        return;
      }

      idle(false);
      if (s.typo) {
        s.typo = false;
        var real = el.textContent;
        var opts = NEAR[real.toLowerCase()];
        el.textContent = opts.charAt(Math.floor(Math.random() * opts.length));
        show(el);
        place(el, true);
        setTimeout(function () {
          idle(true);
          setTimeout(function () {
            hideNow(el);
            el.textContent = real;
            if (prev && prev.parentNode === el.parentNode) place(prev, true); else place(el, false);
            idle(false);
            setTimeout(next, 180);
          }, 320);
        }, jitter(s.speed));
        return;
      }

      show(el);
      place(el, true);
      i++;
      setTimeout(next, jitter(el.textContent === ' ' ? s.speed * 1.4 : s.speed));
    }

    function start() {
      place(steps[0].el, false);
      void cursor.offsetWidth;
      cursor.classList.remove('no-glide');
      cursor.classList.add('is-ready');
      setTimeout(next, 800);
    }

    window.addEventListener('resize', function () { if (curEl) place(curEl, curAfter); });

    if (document.visibilityState === 'hidden') {
      document.addEventListener('visibilitychange', function onVis() {
        if (document.visibilityState !== 'visible') return;
        document.removeEventListener('visibilitychange', onVis);
        start();
      });
    } else {
      start();
    }
  }

  /* ── Proyectos: borde con estrella al pasar el ratón (StarBorder) ── */
  function initProjStarBorder() {
    qsa('.ph-proj-card').forEach(function (card) {
      if (qs('.ph-star', card)) return;
      var star = document.createElement('span');
      star.className = 'ph-star';
      star.setAttribute('aria-hidden', 'true');
      card.insertBefore(star, card.firstChild);
      card.addEventListener('click', function () {
        star.classList.remove('is-pulse');
        void star.offsetWidth;
        star.classList.add('is-pulse');
      });
    });
  }

  /* ── Vídeos: galería acordeón (AccordionGallery) + reproductor en la página ── */
  function initVideoAccordion() {
    var acc = qs('#ph-acc');
    if (!acc || acc.dataset.ready) return;
    acc.dataset.ready = '1';
    var items = qsa('.ph-acc-item', acc);

    function activate(item) {
      items.forEach(function (it) { it.classList.toggle('is-active', it === item); });
    }

    items.forEach(function (item) {
      var wasActive = false, touch = false;
      item.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') activate(item); });
      item.addEventListener('pointerdown', function (e) {
        wasActive = item.classList.contains('is-active');
        touch = e.pointerType !== 'mouse';
      });
      item.addEventListener('focus', function () { activate(item); });
      item.addEventListener('click', function (e) {
        if (!item.dataset.video) { activate(item); return; }
        e.preventDefault();
        /* En táctil el primer toque abre el panel; el segundo reproduce */
        if (touch && !wasActive) { touch = false; activate(item); return; }
        touch = false;
        activate(item);
        openVideo(item.dataset.video, item.dataset.title || '', item);
      });
    });

    /* Comprobación directa en el scroll (no IntersectionObserver): no puede quedarse sin disparar */
    acc.classList.add('js-reveal');
    function revealCheck() {
      if (acc.getBoundingClientRect().top < window.innerHeight * 0.9) {
        acc.classList.add('is-in');
        window.removeEventListener('scroll', revealCheck);
        window.removeEventListener('resize', revealCheck);
      }
    }
    window.addEventListener('scroll', revealCheck, { passive: true });
    window.addEventListener('resize', revealCheck);
    revealCheck();

    var lb, frame, titleEl, ytLink, closeBtn, lastTrigger;
    function build() {
      lb = document.createElement('div');
      lb.className = 'ph-lightbox';
      lb.hidden = true;
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Reproductor de vídeo');
      lb.innerHTML =
        '<button type="button" class="ph-lightbox-close" aria-label="Cerrar vídeo">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
        '</button>' +
        '<div class="ph-lightbox-inner">' +
          '<div class="ph-lightbox-frame"></div>' +
          '<div class="ph-lightbox-bar">' +
            '<span class="ph-lightbox-title"></span>' +
            '<a class="ph-lightbox-yt" target="_blank" rel="noopener">Ver en YouTube ↗</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(lb);
      frame    = qs('.ph-lightbox-frame', lb);
      titleEl  = qs('.ph-lightbox-title', lb);
      ytLink   = qs('.ph-lightbox-yt', lb);
      closeBtn = qs('.ph-lightbox-close', lb);
      closeBtn.addEventListener('click', closeVideo);
      lb.addEventListener('click', function (e) { if (e.target === lb) closeVideo(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lb && !lb.hidden) closeVideo();
      });
    }

    function openVideo(id, title, trigger) {
      /* Abierta como archivo local no hay origen web y YouTube da "Error 153": se abre en YouTube */
      if (location.protocol === 'file:') {
        window.open('https://youtu.be/' + encodeURIComponent(id), '_blank', 'noopener');
        return;
      }
      if (!lb) build();
      lastTrigger = trigger;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
              '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      f.title = title;
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      /* YouTube rechaza el reproductor si no recibe el origen de la página */
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.innerHTML = '';
      frame.appendChild(f);
      titleEl.textContent = title;
      ytLink.href = 'https://youtu.be/' + encodeURIComponent(id);
      lb.hidden = false;
      document.documentElement.classList.add('ph-lock');
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      closeBtn.focus({ preventScroll: true });
    }

    function closeVideo() {
      lb.classList.remove('is-open');
      document.documentElement.classList.remove('ph-lock');
      setTimeout(function () {
        lb.hidden = true;
        frame.innerHTML = '';
      }, 350);
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    }
  }

  /* ── Trayectoria: iluminación por bloque al hacer scroll ── */
  function initTrayReveal() {
    var section = qs('#trayectoria');
    if (!section) return;

    qsa('.reveal', section).forEach(function (el) {
      el.classList.add('is-visible');
    });

    var bars = qsa('.ph-tl-bar', section);
    if (!bars.length) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var trigger = window.innerHeight * 0.62;
        bars.forEach(function (bar) {
          var top = bar.getBoundingClientRect().top;
          if (top < trigger) bar.classList.add('tl-active');
          else               bar.classList.remove('tl-active');
        });
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── About-Mí: scroll pegajoso con iluminación ────────── */
  function initAboutReveal() {
    var section = qs('#sobre-mi');
    if (!section) return;

    // Envolver contenido en contenedor sticky
    var sticky = document.createElement('div');
    sticky.className = 'ph-about-sticky';
    while (section.firstChild) sticky.appendChild(section.firstChild);
    section.appendChild(sticky);

    // Forzar visibilidad de los elementos reveal (siempre en viewport por sticky)
    qsa('.reveal', section).forEach(function (el) {
      el.classList.add('is-visible');
    });

    // Recopilar elementos de texto a dividir: h2 + todos los párrafos
    var textEls = [qs('.ph-about-title', section)].concat(
      qsa('.ph-about-text', section)
    ).filter(Boolean);

    var allWords = [];
    textEls.forEach(function (el) { splitIntoWords(el, allWords); });
    if (!allWords.length) return;

    // Empezar todas las palabras muy tenues
    allWords.forEach(function (w) { w.style.opacity = '0.12'; });

    // Actualizar iluminación al hacer scroll
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var rect        = section.getBoundingClientRect();
        var scrollRange = section.offsetHeight - window.innerHeight;
        if (scrollRange <= 0) {
          allWords.forEach(function (w) { w.style.opacity = '1'; });
          return;
        }
        var progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
        var litIdx   = progress * allWords.length;
        allWords.forEach(function (w, i) {
          var delta = litIdx - i;
          w.style.opacity = delta >= 1 ? '1'
            : delta > 0  ? String(0.12 + 0.88 * delta)
            : '0.12';
        });
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // estado inicial
  }

  /* ── Profesor Page ─────────────────────────────────── */
  function initProfesor() {
    safe(initHeroPhotoScroll, "initHeroPhotoScroll");
    safe(initHeroTyping, "initHeroTyping");
    safe(initProjStarBorder, "initProjStarBorder");
    safe(initVideoAccordion, "initVideoAccordion");
    safe(initTrayReveal,  "initTrayReveal");
    safe(initAboutReveal, "initAboutReveal");
    safe(initReveals, "initReveals");
    safe(initMensajeForm, "initMensajeForm");
    safe(updateInboxCount, "updateInboxCount");

    /* Sticky nav: scrolled class */
    var nav = qs("#ph-nav");
    if (nav) {
      window.addEventListener("scroll", function () {
        nav.classList.toggle("ph-nav-scrolled", window.scrollY > 40);
      }, { passive: true });
    }

    /* Smooth anchor scroll */
    qsa("a[href^='#']").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        var target = qs(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      });
    });

    /* Mostrar más / menos proyectos */
    var moreCard  = qs("#proj-more-card");
    var lessWrap  = qs("#proj-less-wrap");
    var lessBtn   = qs("#proj-less-btn");
    var extras    = qsa(".ph-proj-extra");

    function showMore() {
      extras.forEach(function (el, i) {
        el.style.animationDelay = (i * 0.07) + "s";
        el.classList.remove("ph-proj-extra");
        el.classList.add("ph-proj-appearing");
      });
      if (moreCard) moreCard.style.display = "none";
      if (lessWrap) lessWrap.style.display = "block";
    }

    function showLess() {
      qsa(".ph-proj-appearing").forEach(function (el) {
        el.classList.remove("ph-proj-appearing");
        el.classList.add("ph-proj-extra");
        el.style.animationDelay = "";
      });
      if (moreCard) moreCard.style.display = "";
      if (lessWrap) lessWrap.style.display = "none";
      var section = qs("#proyectos");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }

    if (moreCard) {
      moreCard.addEventListener("click", showMore);
      moreCard.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") showMore();
      });
    }
    if (lessBtn) lessBtn.addEventListener("click", showLess);

    /* Inbox toggle */
    var toggleBtn = qs("#inbox-toggle");
    var inboxList = qs("#inbox-list");
    if (toggleBtn && inboxList) {
      inboxList.style.display = "none";
      toggleBtn.addEventListener("click", function () {
        var isOpen = inboxList.style.display !== "none";
        if (isOpen) {
          inboxList.style.display = "none";
        } else {
          renderInbox(inboxList);
          inboxList.style.display = "flex";
        }
      });
    }
  }

  /* ── Contacto: el mensaje llega por email vía Web3Forms ── */
  function initMensajeForm() {
    var form = qs("#msg-form");
    if (!form || form.dataset.ready) return;
    form.dataset.ready = "1";

    /* Clave de acceso de Web3Forms: es pública por diseño (solo permite enviar a carlesbroseta.music@gmail.com) */
    var ACCESS_KEY = "554fc15d-7e14-446d-b1d2-0fac10e5a380";
    var EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var fields = {
      name:  { el: qs("#msg-name"),  err: qs("#msg-name-error") },
      email: { el: qs("#msg-email"), err: qs("#msg-email-error") },
      text:  { el: qs("#msg-text"),  err: qs("#msg-text-error") }
    };
    var status = qs("#msg-status");
    var btn    = qs('button[type="submit"]', form);
    var labels = qsa(".ph-ihb-text, .ph-ihb-reveal span", btn);
    var btnText = labels.length ? labels[0].textContent : "";

    function setError(f, msg) {
      f.el.classList.toggle("is-invalid", !!msg);
      f.el.setAttribute("aria-invalid", msg ? "true" : "false");
      f.err.textContent = msg || "";
    }
    Object.keys(fields).forEach(function (k) {
      fields[k].el.addEventListener("input", function () { setError(fields[k], ""); });
    });

    function validate(v) {
      var first = null;
      function fail(f, msg) { setError(f, msg); if (!first) first = f.el; }
      if (!v.name) fail(fields.name, "Escribe tu nombre.");
      if (!v.email) fail(fields.email, "Escribe tu email para que pueda responderte.");
      else if (!EMAIL_RE.test(v.email)) fail(fields.email, "Ese email no parece correcto. Revísalo.");
      if (!v.text) fail(fields.text, "Escribe tu mensaje.");
      if (first) first.focus();
      return !first;
    }

    function setSending(on) {
      btn.disabled = on;
      btn.classList.toggle("is-sending", on);
      labels.forEach(function (l) { l.textContent = on ? "Enviando…" : btnText; });
    }

    function showStatus(msg, isError) {
      status.textContent = msg;
      status.classList.toggle("is-error", !!isError);
    }

    function showSent(name) {
      var box = document.createElement("div");
      box.className = "ph-msg-sent";
      box.setAttribute("role", "status");
      box.innerHTML =
        '<div class="ph-msg-sent-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="28" height="28" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
        '</div>' +
        '<h3 class="ph-msg-sent-title">Mensaje enviado</h3>' +
        '<p class="ph-msg-sent-text"></p>' +
        '<button type="button" class="ph-btn-ghost ph-msg-again">Enviar otro mensaje</button>';
      qs(".ph-msg-sent-text", box).textContent =
        "Gracias, " + name + ". Te responderé a tu email lo antes posible.";
      qs(".ph-msg-again", box).addEventListener("click", function () {
        box.remove();
        form.reset();
        form.hidden = false;
        fields.name.el.focus();
      });
      form.hidden = true;
      form.parentNode.insertBefore(box, form.nextSibling);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      showStatus("");

      var v = {
        name:  fields.name.el.value.trim(),
        email: fields.email.el.value.trim(),
        text:  fields.text.el.value.trim()
      };
      if (!validate(v)) return;

      var bot = qs('input[name="botcheck"]', form);
      if (bot && bot.checked) return;

      setSending(true);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject:    "Nuevo mensaje desde tu web — " + v.name,
          from_name:  "Web de Carles Broseta",
          name:       v.name,
          email:      v.email,
          message:    v.text,
          botcheck:   false
        })
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (data) {
            if (!r.ok || !data.success) throw new Error(data.message || ("HTTP " + r.status));
          });
        })
        .then(function () {
          setSending(false);
          showSent(v.name);
        })
        .catch(function (err) {
          console.warn("[Compás] Envío de mensaje fallido:", err);
          setSending(false);
          showStatus("No se ha podido enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.", true);
        });
    });
  }

  function updateInboxCount() {
    var msgs = JSON.parse(localStorage.getItem("compas_msgs") || "[]");
    var badge = qs("#inbox-count");
    if (badge) {
      badge.textContent = msgs.length;
      badge.style.display = msgs.length > 0 ? "inline-flex" : "none";
    }
  }

  function renderInbox(container) {
    var msgs = JSON.parse(localStorage.getItem("compas_msgs") || "[]");
    container.innerHTML = "";

    if (!msgs.length) {
      var empty = document.createElement("p");
      empty.className = "inbox-empty";
      empty.textContent = "Todavía no hay mensajes. Cuando un alumno escriba, aparecerá aquí.";
      container.appendChild(empty);
      return;
    }

    /* Show newest first */
    msgs.slice().reverse().forEach(function (msg) {
      var el = document.createElement("div");
      el.className = "inbox-msg";
      el.innerHTML =
        '<div class="inbox-msg-header">' +
          '<span class="inbox-msg-from">' + (msg.from || "Alumno") + '</span>' +
          '<div class="inbox-msg-meta">' +
            '<span class="inbox-msg-course">' + (msg.course || "ESO") + '</span>' +
            '<span class="inbox-msg-date">' + (msg.date || "") + ' · ' + (msg.time || "") + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="inbox-msg-text">' + (msg.text || "") + '</p>';
      container.appendChild(el);
    });

    /* Clear button */
    var clearBtn = document.createElement("button");
    clearBtn.textContent = "Borrar todos los mensajes";
    clearBtn.style.cssText = "margin-top:8px;font-size:0.75rem;color:var(--rose);background:none;border:none;cursor:pointer;font-family:inherit;font-weight:700;padding:8px 0;";
    clearBtn.addEventListener("click", function () {
      localStorage.removeItem("compas_msgs");
      container.innerHTML = '<p class="inbox-empty">Bandeja vaciada.</p>';
      safe(updateInboxCount, "updateInboxCount");
    });
    container.appendChild(clearBtn);
  }

  /* ── Boot ───────────────────────────────────────────── */
  function boot() {
    if (PAGE === "login") {
      safe(initLogin, "initLogin");
    }

    if (PAGE === "dashboard") {
      safe(initDashboard, "initDashboard");
    }

    if (PAGE === "proyecto") {
      safe(initProyecto, "initProyecto");
    }

    if (PAGE === "profesor") {
      safe(initProfesor, "initProfesor");
    }

    /* Always init reveals + sidebar for any page */
    if (PAGE !== "login") {
      safe(initReveals,  "initReveals");
      safe(initSidebar,  "initSidebar");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
