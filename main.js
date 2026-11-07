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

    var MAX_SCALE = 1.32;
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
      var vpW = window.innerWidth || 1280;
      img.style.transform =
        'translateX(' + (-MAX_SHIFT * vpW * p).toFixed(1) + 'px) ' +
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

  function initMensajeForm() {
    var form = qs("#msg-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name   = (qs("#msg-name")   || {}).value || "";
      var text   = (qs("#msg-text")   || {}).value || "";
      var course = (qs("#msg-course") || {}).value || "ESO";

      if (!name.trim() || !text.trim()) {
        var nameEl = qs("#msg-name");
        if (nameEl && !nameEl.value.trim()) {
          nameEl.style.borderColor = "var(--rose)";
          nameEl.focus();
        }
        return;
      }

      var msgs = JSON.parse(localStorage.getItem("compas_msgs") || "[]");
      msgs.push({
        from:   name.trim(),
        course: course,
        text:   text.trim(),
        date:   new Date().toLocaleDateString("es-ES", { day:"2-digit", month:"short" }),
        time:   new Date().toLocaleTimeString("es-ES", { hour:"2-digit", minute:"2-digit" }),
      });
      localStorage.setItem("compas_msgs", JSON.stringify(msgs));

      /* Success state */
      var msgCard = qs(".msg-card");
      if (msgCard) {
        msgCard.innerHTML =
          '<div style="text-align:center;padding:20px 0;">' +
            '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--teal));display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 8px 24px rgba(124,58,237,0.3);">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="32" height="32"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
            '</div>' +
            '<h3 style="font-size:1.1rem;font-weight:800;color:var(--ink);margin-bottom:8px;">¡Mensaje enviado!</h3>' +
            '<p style="font-size:0.85rem;color:var(--ink-mute);font-weight:500;">El Prof. Carles lo verá en su bandeja de entrada.</p>' +
          '</div>';
      }
      safe(updateInboxCount, "updateInboxCount");
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
