/* SDIA study site engine: i18n, block renderer, QCM, timed mock, progress (localStorage).
 * No build step. Subject content lives in assets/data/<id>.js and calls Study.register({...}). */
(function () {
  "use strict";
  var Study = (window.Study = window.Study || {});
  var SUBJ_DATA = {};
  Study.data = SUBJ_DATA;
  Study.register = function (d) { SUBJ_DATA[d.id] = d; };

  /* ---------------- storage ---------------- */
  var NS = "sdia-prep:";
  function lsGet(k, d) { try { var v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch (e) {} }
  Study.lsGet = lsGet; Study.lsSet = lsSet;

  /* ---------------- i18n ---------------- */
  var navL = ((navigator.languages && navigator.languages[0]) || navigator.language || "en").toLowerCase();
  var lang = lsGet("lang", navL.indexOf("fr") === 0 ? "fr" : "en");
  if (lang !== "en" && lang !== "fr") lang = "en";
  function tr(b) {
    if (b == null) return "";
    if (typeof b === "string" || typeof b === "number") return String(b);
    if (Array.isArray(b)) return String(lang === "fr" ? (b[1] != null ? b[1] : b[0]) : b[0]);
    return String(b);
  }
  Study.tr = tr;
  Study.lang = function () { return lang; };
  var UI = {
    home: ["Home", "Accueil"], exam: ["The exam", "L'examen"], materials: ["Course materials", "Supports de cours"],
    lessons: ["Lessons", "Leçons"], bank: ["QCM bank", "Banque de QCM"], mock: ["Mock exam", "Examen blanc"],
    cheat: ["Cheat sheet", "Fiche résumé"], past: ["Past exams", "Anciens DS"],
    keyPoints: ["Key points", "Points clés"], traps: ["Exam traps", "Pièges d'examen"],
    miniQuiz: ["Mini-quiz", "Mini-quiz"], questions: ["questions", "questions"],
    prev: ["Previous", "Précédente"], next: ["Next lesson", "Leçon suivante"],
    markDone: ["Mark lesson as studied", "Marquer la leçon comme étudiée"], studied: ["Studied ✓", "Étudiée ✓"],
    check: ["Check", "Vérifier"], retry: ["Try again", "Réessayer"],
    multi: ["Multi-answer: one wrong tick = 0", "Plusieurs réponses : une coche fausse = 0"],
    single: ["Single answer", "Une seule réponse"],
    correct: ["Correct", "Correct"], missed: ["Missed: correct", "Oubliée : correcte"], wrong: ["Wrong", "Fausse"],
    right: ["Right. ", "Juste. "], notAns: ["Not answered: ", "Sans réponse : "], notQuite: ["Not quite: answer ", "Faux : réponse "],
    source: ["Source", "Source"], topic: ["Topic", "Thème"], status: ["Status", "Statut"],
    allSources: ["All sources", "Toutes les sources"], allTopics: ["All topics", "Tous les thèmes"],
    stAll: ["All", "Toutes"], stNew: ["Not answered", "Non répondues"], stWrong: ["Wrong ones", "Ratées"], stRight: ["Right ones", "Réussies"],
    shown: [" questions shown", " questions affichées"], resetBank: ["Reset my answers", "Effacer mes réponses"],
    confirmReset: ["Erase your saved answers for this subject?", "Effacer vos réponses enregistrées pour cette matière ?"],
    progress: ["Progress", "Progression"], answered: ["answered", "répondues"], rightN: ["right", "justes"],
    lessonsStudied: ["lessons studied", "leçons étudiées"],
    set: ["Set", "Série"], duration: ["Timer", "Minuteur"], start: ["Start the mock", "Commencer l'examen blanc"],
    submit: ["Submit", "Valider"], reset: ["Reset", "Recommencer"], timeLeft: ["Time left", "Temps restant"],
    timeUp: ["Time is up: the mock was submitted.", "Temps écoulé : l'examen blanc a été validé."],
    score: ["Score", "Score"], reviewTip: ["Review the explanations below, then Reset to retry.", "Relisez les explications ci-dessous, puis Recommencer."],
    noFeedback: ["No feedback until you submit. Exact match = 1 point.", "Pas de correction avant de valider. Réponse exacte = 1 point."],
    mockIntro: ["Pick a set and a timer, then start. Your answers are saved if you reload.", "Choisissez une série et un minuteur, puis commencez. Vos réponses sont gardées si vous rechargez."],
    showSol: ["Show solution", "Voir la solution"], hideSol: ["Hide solution", "Masquer la solution"],
    stepNext: ["Next step", "Étape suivante"], stepAll: ["Show all", "Tout afficher"], stepPlay: ["▶ Play", "▶ Lecture"],
    stepPause: ["❚❚ Pause", "❚❚ Pause"], stepReset: ["Restart", "Recommencer"], stepThrough: ["▶ Step through", "▶ Pas à pas"], stepBack: ["◀ Back", "◀ Retour"],
    stepOf: ["Step", "Étape"], of: ["of", "sur"],
    countdown: ["Next exam", "Prochain examen"], schedule: ["Exam schedule", "Calendrier des DS"],
    open: ["Open", "Ouvrir"], startMock: ["Mock", "Examen blanc"], today: ["today", "aujourd'hui"], done: ["done", "passé"],
    inD: ["in", "dans"], days: ["d", "j"], hours: ["h", "h"], mins: ["min", "min"],
    moodleNote: ["Opens the IIT Moodle in a new tab (log in first).", "Ouvre le Moodle de l'IIT dans un nouvel onglet (connectez-vous d'abord)."],
    filesNote: ["The course files from Moodle, hosted here. Preview PDFs right on the page, or download any file.", "Les fichiers du cours sur Moodle, hébergés ici. Prévisualisez les PDF sur la page ou téléchargez n'importe quel fichier."],
    gcourse: ["Course slides", "Cours"], gtdtp: ["TD / TP", "TD / TP"], gcorr: ["Corrections", "Corrections"], gexams: ["Past exams", "Anciens DS"], gother: ["Other files", "Autres fichiers"],
    preview: ["Preview", "Aperçu"], download: ["Download", "Télécharger"], colab: ["Open in Colab", "Ouvrir dans Colab"], newTab: ["Open in new tab", "Ouvrir dans un onglet"],
    close: ["Close", "Fermer"], pdfFallback: ["PDF not showing (common on phones)? Open it in a new tab or download it.", "Le PDF ne s'affiche pas (fréquent sur téléphone) ? Ouvrez-le dans un onglet ou téléchargez-le."],
    onMoodle: ["Also on Moodle", "Aussi sur Moodle"], filesWord: ["files", "fichiers"], origPaper: ["Original papers (PDF)", "Sujets originaux (PDF)"],
    allFiles: ["Course files", "Fichiers du cours"],
    loadingPdf: ["Loading the PDF…", "Chargement du PDF…"],
    coursePage: ["Course page on Moodle", "Page du cours sur Moodle"], examBank: ["Exam bank (Banque d'examen)", "Banque d'examen"],
    lang: ["Français", "English"], theme: ["Theme", "Thème"],
    timerPaper: ["Start a timer", "Lancer un minuteur"], stopTimer: ["Stop timer", "Arrêter"],
    paperTip: ["Write your answer on paper first, then reveal the solution step by step.", "Écrivez d'abord votre réponse sur papier, puis dévoilez la solution étape par étape."],
    ctxCase: ["Shared case", "Cas commun"], questionsWord: ["questions", "questions"], lessonsWord: ["lessons", "leçons"],
    footer: ["Built for personal revision. Lessons and QCM written from the IIT course notes; course files © their authors.", "Fait pour réviser. Leçons et QCM rédigés à partir des cours de l'IIT ; fichiers de cours © leurs auteurs."],
    lessonPick: ["Lesson", "Leçon"]
  };
  function u(k) { return tr(UI[k] || k); }
  Study.u = u;

  /* ---------------- helpers ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function bold(s) { return s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>"); }
  // `code` -> <code>, **bold** outside code
  function rich(b) {
    var s = tr(b);
    return s.split("`").map(function (part, i) { return i % 2 === 1 ? "<code>" + esc(part) + "</code>" : bold(esc(part)); }).join("");
  }
  Study.esc = esc; Study.rich = rich;
  var LET = "abcdefghij";
  function same(x, y) { if (x.length !== y.length) return false; var a = x.slice().sort(), b = y.slice().sort(); for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
  function fmt(v) { return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100); }
  Study.fmt = fmt;
  function subjMeta(id) { for (var i = 0; i < SUBJECTS.length; i++) if (SUBJECTS[i].id === id) return SUBJECTS[i]; return null; }

  /* ---------------- per-subject state ---------------- */
  var cur = null;          // current subject data
  var S = null;            // current subject state {q:{}, mock:{}, lessons:{}, ui:{}}
  function loadState(id) { var s = lsGet("subj:" + id, null) || {}; s.q = s.q || {}; s.mock = s.mock || {}; s.lessons = s.lessons || {}; s.ui = s.ui || {}; s.sol = s.sol || {}; return s; }
  function save() { if (cur) lsSet("subj:" + cur.id, S); }
  function stats(d, st) {
    var total = d.bank.length, ans = 0, ok = 0;
    d.bank.forEach(function (q) { var x = st.q[q.id]; if (x && x.done) { ans++; if (same(x.sel, q.a)) ok++; } });
    var nl = (d.lessons || []).length, ld = 0;
    (d.lessons || []).forEach(function (l) { if (st.lessons[l.id]) ld++; });
    return { total: total, answered: ans, right: ok, lessons: nl, lessonsDone: ld };
  }
  Study.stats = stats;

  /* ---------------- block renderer ---------------- */
  var REG = {};       // block key -> block (for partial re-render)
  var WIDGETS = Study.widgets = Study.widgets || {};
  function uiGet(k, d) { return S && S.ui[k] != null ? S.ui[k] : d; }
  function uiSet(k, v) { if (S) { S.ui[k] = v; save(); } }

  function blocks(list, key) { return (list || []).map(function (b, i) { return block(b, key + "." + i); }).join(""); }
  Study.blocks = blocks;

  function cell(c) {
    if (c && typeof c === "object" && !Array.isArray(c)) return { html: rich(c.t), tone: c.tone || "" };
    return { html: rich(c), tone: "" };
  }
  function table(b) {
    var al = b.align || [];
    var h = '<div class="tbl-wrap"><table class="tbl' + (b.compact ? " compact" : "") + '">';
    if (b.cols) h += "<thead><tr>" + b.cols.map(function (c, j) { return '<th class="al-' + (al[j] || "start") + '">' + rich(c) + "</th>"; }).join("") + "</tr></thead>";
    h += "<tbody>" + (b.rows || []).map(function (r, i) {
      var em = (b.emph === i || (Array.isArray(b.emph) && b.emph.indexOf(i) >= 0)) ? ' class="emph"' : "";
      return "<tr" + em + ">" + r.map(function (c, j) { var x = cell(c); return '<td class="al-' + (al[j] || "start") + (x.tone ? " tone-" + x.tone : "") + '">' + x.html + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody></table></div>";
    return h;
  }
  function bars(b) {
    var max = Math.max.apply(null, b.bars.map(function (x) { return x.v; })) || 1;
    return '<div class="bars">' + b.bars.map(function (x, i) {
      var em = b.emph === i;
      return '<div class="bar-row' + (em ? " emph" : "") + '"><div class="bar-l">' + rich(x.l) + '</div><div class="bar-t"><div class="bar-f" style="width:' + Math.max(2, (x.v / max) * 100).toFixed(1) + '%"></div></div><div class="bar-v">' + rich(x.d != null ? x.d : String(x.v)) + "</div></div>";
    }).join("") + "</div>";
  }
  function eqPart(p) {
    if (typeof p === "string" || Array.isArray(p)) return '<span class="eq-t">' + esc(tr(p)) + "</span>";
    if (p.frac) return '<span class="frac"><span class="num">' + esc(tr(p.frac[0])) + '</span><span class="den">' + esc(tr(p.frac[1])) + "</span></span>";
    if (p.sum) return '<span class="sum"><span class="sum-to">' + esc(tr(p.sum[1])) + '</span><span class="sum-s">Σ</span><span class="sum-from">' + esc(tr(p.sum[0])) + "</span></span>";
    if (p.br) return '<span class="eq-br"></span>';
    return "";
  }
  function steps(b, key) {
    var n = b.steps.length, k = uiGet(key, null);
    var showAll = k == null;
    var vis = showAll ? n : Math.max(1, Math.min(n, k));
    var h = '<ol class="steps">' + b.steps.slice(0, vis).map(function (s, i) {
      return '<li class="step' + (!showAll && i === vis - 1 ? " cur" : "") + '"><div class="step-n">' + (i + 1) + '</div><div class="step-b"><div class="step-h">' + rich(s.title) + "</div>" +
        (s.detail ? '<div class="step-d">' + rich(s.detail) + "</div>" : "") + (s.code ? '<pre class="code">' + esc(s.code) + "</pre>" : "") + (s.b ? blocks(s.b, key + ".s" + i) : "") + "</div></li>";
    }).join("") + "</ol>";
    h += '<div class="ctl">';
    if (showAll) h += btn(u("stepThrough"), "step", key + "|1");
    else {
      h += '<span class="ctl-l">' + u("stepOf") + " " + vis + " " + u("of") + " " + n + "</span>";
      if (vis > 1) h += btn(u("stepBack"), "step", key + "|" + (vis - 1));
      if (vis < n) h += btn(u("stepNext"), "step", key + "|" + (vis + 1), "primary");
      h += btn(u("stepAll"), "step", key + "|all");
    }
    return h + "</div>";
  }
  // trace: animated table, one row (instant) at a time
  var PLAY = {};
  function trace(b, key) {
    var n = b.rows.length, k = uiGet(key, b.start != null ? b.start : 1);
    var all = k === "all"; var vis = all ? n : Math.max(1, Math.min(n, k));
    var al = b.align || [];
    var h = '<div class="tbl-wrap"><table class="tbl trace"><thead><tr>' + b.cols.map(function (c, j) { return '<th class="al-' + (al[j] || "start") + '">' + rich(c) + "</th>"; }).join("") + "</tr></thead><tbody>";
    b.rows.forEach(function (r, i) {
      var cls = i < vis ? (i === vis - 1 && !all ? "cur" : "") : "future";
      h += '<tr class="' + cls + '">' + r.map(function (c, j) { var x = cell(c); return '<td class="al-' + (al[j] || "start") + (x.tone ? " tone-" + x.tone : "") + '">' + (i < vis ? x.html : "") + "</td>"; }).join("") + "</tr>";
    });
    h += "</tbody></table></div>";
    var note = b.notes && !all ? b.notes[vis - 1] : (all && b.summary ? b.summary : null);
    if (note) h += '<div class="trace-note">' + rich(note) + "</div>";
    h += '<div class="ctl"><span class="ctl-l">' + u("stepOf") + " " + vis + " " + u("of") + " " + n + "</span>";
    h += btn(u("stepBack"), "step", key + "|" + Math.max(1, vis - 1));
    h += btn(PLAY[key] ? u("stepPause") : u("stepPlay"), "play", key + "|" + n, "primary");
    h += btn(u("stepNext").replace(/lesson|leçon/i, ""), "step", key + "|" + Math.min(n, vis + 1));
    h += btn(u("stepAll"), "step", key + "|all");
    h += btn(u("stepReset"), "step", key + "|1");
    return h + "</div>";
  }
  function seg(b, key) {
    var v = uiGet(key, b.def != null ? b.def : b.opts[0].v);
    if (!b.panes[v]) v = b.opts[0].v;
    var h = '<div class="seg" role="tablist">' + b.opts.map(function (o) {
      return '<button type="button" role="tab" class="seg-b' + (o.v === v ? " on" : "") + '" data-act="seg" data-arg="' + esc(key + "|" + o.v) + '">' + rich(o.l != null ? o.l : o.v) + "</button>";
    }).join("") + "</div>";
    return h + '<div class="seg-p">' + blocks(b.panes[v], key + "." + v) + "</div>";
  }
  function btn(label, act, arg, kind, extra) { return '<button type="button" class="btn' + (kind ? " " + kind : "") + '" data-act="' + act + '" data-arg="' + esc(arg) + '"' + (extra || "") + ">" + label + "</button>"; }
  Study.btn = btn;
  function chain(b) {
    return '<div class="chain' + (b.tone ? " tone-" + b.tone : "") + '">' + (b.label ? '<span class="chain-l">' + rich(b.label) + "</span>" : "") + b.items.map(function (x, i) {
      return (i ? '<span class="chain-a">' + (b.sep || "→") + "</span>" : "") + '<span class="chain-i">' + rich(x) + "</span>";
    }).join("") + "</div>";
  }
  function cards(b) {
    return '<div class="cards c' + (b.cols || 3) + '">' + b.items.map(function (c) {
      return '<div class="card tone-' + (c.tone || "accent") + '">' + (c.icon ? '<div class="card-i">' + esc(c.icon) + "</div>" : "") + '<div class="card-h">' + rich(c.h) + "</div>" + (c.x ? '<div class="card-x">' + rich(c.x) + "</div>" : "") + (c.code ? '<pre class="code">' + esc(c.code) + "</pre>" : "") + "</div>";
    }).join("") + "</div>";
  }

  function block(b, key) {
    if (!b) return "";
    REG[key] = b;
    var inner = "";
    switch (b.t) {
      case "sec":
        return '<section class="sec"><h3>' + rich(b.h) + "</h3>" + (b.cap ? '<p class="cap">' + rich(b.cap) + "</p>" : "") + blocks(b.b, key) + "</section>";
      case "p": return '<p class="txt">' + rich(b.x) + "</p>";
      case "h": return '<h4 class="sub">' + rich(b.x) + "</h4>";
      case "table": return table(b);
      case "bars": return bars(b);
      case "eq": return '<div class="eq">' + b.x.map(eqPart).join("") + "</div>";
      case "callout": return '<div class="callout tone-' + (b.tone || "info") + '">' + (b.lead ? "<strong>" + rich(b.lead) + "</strong> " : "") + rich(b.x) + "</div>";
      case "list": var lt = b.ordered ? "ol" : "ul"; return '<' + lt + ' class="list' + (b.ordered ? " ord" : "") + (b.con ? " con" : "") + (b.pro ? " pro" : "") + '">' + b.items.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</" + lt + ">";
      case "grid": return '<div class="grid g' + (b.cols || 2) + '">' + b.b.map(function (x, i) { return '<div class="gcell">' + block(x, key + "." + i) + "</div>"; }).join("") + "</div>";
      case "props": return '<dl class="props">' + b.items.map(function (x) { return "<div><dt>" + rich(x.label) + "</dt><dd>" + rich(x.value) + "</dd></div>"; }).join("") + "</dl>";
      case "legend": return '<div class="legend">' + b.names.map(function (n, i) { return '<span><i class="lg c' + i + '"></i>' + rich(n) + "</span>"; }).join("") + "</div>";
      case "code": return '<pre class="code' + (b.lang ? " lang-" + b.lang : "") + '">' + (b.title ? '<span class="code-t">' + esc(tr(b.title)) + "</span>" : "") + hl(tr(b.x), b.lang) + "</pre>";
      case "chain": return chain(b);
      case "cards": return cards(b);
      case "diagram": return '<div class="diagram">' + Study.diagram(b) + "</div>";
      case "svg": return '<div class="svgw">' + (typeof b.x === "function" ? b.x() : b.x) + "</div>";
      case "links": return linkCards(b.items);
      case "steps": inner = steps(b, key); break;
      case "trace": inner = trace(b, key); break;
      case "seg": inner = seg(b, key); break;
      case "reveal": {
        var open = !!uiGet(key, false);
        inner = btn(open ? tr(b.hide || UI.hideSol) : tr(b.label || UI.showSol), "toggle", key, open ? "" : "primary") + (open ? '<div class="reveal-b">' + blocks(b.b, key + ".r") + "</div>" : "");
        break;
      }
      case "widget": {
        var w = WIDGETS[b.w];
        inner = w ? w(b, { key: key, get: function (d) { return uiGet(key + ":w", d); }, lang: lang }) : '<p class="txt">[missing widget ' + esc(b.w) + "]</p>";
        break;
      }
      default: return "";
    }
    return '<div class="blk" data-bk="' + esc(key) + '">' + inner + "</div>";
  }
  Study.block = block;
  function rerender(key) {
    var el = document.querySelector('[data-bk="' + cssEsc(key) + '"]');
    if (!el || !REG[key]) return false;
    var tmp = document.createElement("div"); tmp.innerHTML = block(REG[key], key);
    el.replaceWith(tmp.firstChild);
    return true;
  }
  Study.rerender = rerender;
  Study.uiGet = uiGet; Study.uiSet = uiSet;
  function cssEsc(s) { return String(s).replace(/(["\\])/g, "\\$1"); }

  /* tiny syntax highlighter (java / python) */
  function hl(src, lang) {
    var s = esc(src);
    if (!lang) return s;
    var kw = lang === "java"
      ? "abstract|boolean|break|catch|class|synchronized|volatile|else|extends|final|finally|for|if|implements|import|int|long|new|private|protected|public|return|static|this|throw|throws|try|void|while|super|true|false|null|interface|char|double|String"
      : "and|as|class|def|elif|else|except|False|for|from|if|import|in|is|lambda|None|not|or|pass|print|raise|return|True|try|while|with|super|self|cls";
    // protect strings and comments
    var out = [], re = lang === "java" ? /(\/\/[^\n]*|"(?:[^"\\\n]|\\.)*")/g : /(#[^\n]*|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/g;
    var raw = src, last = 0, m;
    var parts = [];
    while ((m = re.exec(raw))) { parts.push({ t: raw.slice(last, m.index), k: 0 }); parts.push({ t: m[0], k: m[0][0] === "/" || m[0][0] === "#" ? 2 : 1 }); last = m.index + m[0].length; }
    parts.push({ t: raw.slice(last), k: 0 });
    var kwRe = new RegExp("\\b(" + kw + ")\\b", "g");
    parts.forEach(function (p) {
      var e = esc(p.t);
      if (p.k === 1) out.push('<span class="hs">' + e + "</span>");
      else if (p.k === 2) out.push('<span class="hc">' + e + "</span>");
      else out.push(e.replace(kwRe, '<span class="hk">$1</span>').replace(/(@\w+)/g, '<span class="hd">$1</span>'));
    });
    return out.join("");
  }
  Study.hl = hl;

  function linkCards(items) {
    return '<div class="links">' + items.map(function (m) {
      return '<a class="link-card" href="' + esc(m.href) + '" target="_blank" rel="noopener"><span class="lk-kind">' + rich(m.kind || "Moodle") + '</span><span class="lk-t">' + rich(m.title) + "</span>" + (m.note ? '<span class="lk-n">' + rich(m.note) + "</span>" : "") + '<span class="lk-go">↗</span></a>';
    }).join("") + "</div>";
  }

  function wseg(key, opts, val) {
    return '<div class="seg">' + opts.map(function (o) { var v = o.v != null ? o.v : o; return '<button type="button" class="seg-b' + (v === val ? " on" : "") + '" data-act="wset" data-arg="' + esc(key + "|" + v) + '">' + rich(o.l != null ? o.l : v) + "</button>"; }).join("") + "</div>";
  }
  Study.wseg = wseg;

  /* ---------------- SVG diagram (layered auto layout) ---------------- */
  function wrapText(s, max) {
    var words = String(s).split(/\s+/), lines = [], line = "";
    words.forEach(function (w) { if ((line + " " + w).trim().length > max && line) { lines.push(line); line = w; } else line = (line + " " + w).trim(); });
    if (line) lines.push(line);
    return lines;
  }
  var dId = 0;
  Study.diagram = function (b) {
    var narrow = window.innerWidth < 720;
    var dir = b.dir === "horizontal" || b.dir === "h" ? "h" : "v";
    if (narrow && dir === "h" && b.nodes.length > 3) dir = "v";
    var nodes = b.nodes.map(function (n) { return { id: n.id, label: tr(n.label), detail: n.detail ? tr(n.detail) : "", kind: n.kind || "box", tone: n.tone }; });
    var byId = {}; nodes.forEach(function (n, i) { n.i = i; byId[n.id] = n; n.layer = 0; });
    var edges = (b.edges || []).map(function (e) { return { from: e.from, to: e.to, label: e.label ? tr(e.label) : "", dashed: !!e.dashed }; }).filter(function (e) { return byId[e.from] && byId[e.to]; });
    var fwd = edges.filter(function (e) { return !e.dashed || b.dashedForward; });
    for (var it = 0; it < nodes.length + 1; it++) fwd.forEach(function (e) { var a = byId[e.from], c = byId[e.to]; if (c.layer < a.layer + 1 && c.layer < nodes.length) c.layer = a.layer + 1; });
    if (b.layers) nodes.forEach(function (n) { if (b.layers[n.id] != null) n.layer = b.layers[n.id]; });
    var L = []; nodes.forEach(function (n) { (L[n.layer] = L[n.layer] || []).push(n); });
    L = L.filter(Boolean);
    L.forEach(function (layer, li) { layer.forEach(function (n, k) { n.layer = li; n.pos = k; }); });
    // barycenter ordering
    for (var li = 1; li < L.length; li++) {
      L[li].forEach(function (n) {
        var ps = fwd.filter(function (e) { return e.to === n.id && byId[e.from].layer === li - 1; }).map(function (e) { return byId[e.from].pos; });
        n.bc = ps.length ? ps.reduce(function (a, c) { return a + c; }, 0) / ps.length : n.pos;
      });
      L[li].sort(function (a, c) { return a.bc - c.bc || a.i - c.i; });
      L[li].forEach(function (n, k) { n.pos = k; });
    }
    var W = b.nodeW || (dir === "h" ? 150 : 168), CH = dir === "h" ? 18 : 20, DCH = dir === "h" ? 22 : 25;
    nodes.forEach(function (n) {
      n.ll = wrapText(n.label, CH); n.dl = n.detail ? wrapText(n.detail, DCH) : [];
      n.w = W; n.h = 18 + n.ll.length * 17 + n.dl.length * 15 + (n.dl.length ? 4 : 0);
    });
    var maxLab = Math.max.apply(null, [0].concat(edges.map(function (e) { return e.label && byId[e.to].layer > byId[e.from].layer ? Math.max.apply(null, wrapText(e.label, 14).map(function (x) { return x.length * 6.4 + 10; })) : 0; })));
    var GX = dir === "h" ? Math.max(64, maxLab + 22) : 22, GY = dir === "h" ? 26 : 56, pad = 14, hasBack = edges.some(function (e) { return byId[e.to].layer <= byId[e.from].layer; });
    var width, height;
    if (dir === "v") {
      var rowH = L.map(function (l) { return Math.max.apply(null, l.map(function (n) { return n.h; })); });
      var maxN = Math.max.apply(null, L.map(function (l) { return l.length; }));
      width = maxN * W + (maxN - 1) * GX + 2 * pad + (hasBack ? 70 : 0);
      var y = pad;
      L.forEach(function (l, li) {
        var rw = l.length * W + (l.length - 1) * GX, x0 = (width - (hasBack ? 70 : 0) - rw) / 2;
        l.forEach(function (n, k) { n.x = x0 + k * (W + GX); n.y = y + (rowH[li] - n.h) / 2; });
        y += rowH[li] + GY;
      });
      height = y - GY + pad;
    } else {
      var colH = L.map(function (l) { return l.reduce(function (a, n) { return a + n.h; }, 0) + (l.length - 1) * GY; });
      var maxH = Math.max.apply(null, colH);
      width = L.length * W + (L.length - 1) * GX + 2 * pad;
      height = maxH + 2 * pad + (hasBack ? 62 : 0);
      L.forEach(function (l, li) {
        var yy = pad + (maxH - colH[li]) / 2;
        l.forEach(function (n) { n.x = pad + li * (W + GX); n.y = yy; yy += n.h + GY; });
      });
    }
    var id = "ar" + (++dId);
    var s = '<svg class="dg" viewBox="0 0 ' + Math.ceil(width) + " " + Math.ceil(height) + '" width="100%" style="max-width:' + Math.ceil(width * 1.05) + 'px" role="img">';
    s += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dg-ah"/></marker></defs>';
    var labels = "";
    var backIdx = 0;
    edges.forEach(function (e) {
      var a = byId[e.from], c = byId[e.to], p, lx, ly;
      var back = c.layer <= a.layer;
      if (dir === "v") {
        if (!back) {
          var x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = c.x + c.w / 2, y2 = c.y, my = (y1 + y2) / 2;
          p = "M" + x1 + "," + y1 + " C" + x1 + "," + my + " " + x2 + "," + my + " " + x2 + "," + (y2 - 2);
          lx = (x1 + x2) / 2; ly = my;
        } else {
          backIdx++;
          var off = 26 + backIdx * 14;
          var xa = a.x + a.w, ya = a.y + a.h / 2, xc = c.x + c.w, yc = c.y + c.h / 2, xm = Math.max(xa, xc) + off;
          p = "M" + xa + "," + ya + " C" + xm + "," + ya + " " + xm + "," + yc + " " + (xc + 3) + "," + yc;
          lx = xm - 8; ly = (ya + yc) / 2;
        }
      } else {
        if (!back) {
          var hx1 = a.x + a.w, hy1 = a.y + a.h / 2, hx2 = c.x, hy2 = c.y + c.h / 2, mx = (hx1 + hx2) / 2;
          p = "M" + hx1 + "," + hy1 + " C" + mx + "," + hy1 + " " + mx + "," + hy2 + " " + (hx2 - 2) + "," + hy2;
          lx = mx; ly = (hy1 + hy2) / 2;
        } else {
          backIdx++;
          var bx1 = a.x + a.w / 2, by1 = a.y + a.h, bx2 = c.x + c.w / 2, by2 = c.y + c.h, bm = Math.max(by1, by2) + 18 + backIdx * 12;
          p = "M" + bx1 + "," + by1 + " C" + bx1 + "," + bm + " " + bx2 + "," + bm + " " + bx2 + "," + (by2 + 3);
          lx = (bx1 + bx2) / 2; ly = bm - 4;
        }
      }
      s += '<path d="' + p + '" class="dg-e' + (e.dashed ? " dash" : "") + '" marker-end="url(#' + id + ')"/>';
      if (e.label) {
        var lls = wrapText(e.label, dir === "h" ? 14 : 22), lw = Math.max.apply(null, lls.map(function (x) { return x.length * 6.4 + 10; })), lh = lls.length * 14 + 4;
        labels += '<g class="dg-lb"><rect x="' + (lx - lw / 2) + '" y="' + (ly - lh / 2) + '" width="' + lw + '" height="' + lh + '" rx="5"/>' + lls.map(function (x, k) { return '<text x="' + lx + '" y="' + (ly - lh / 2 + 13 + k * 14) + '" text-anchor="middle">' + esc(x) + "</text>"; }).join("") + "</g>";
      }
    });
    nodes.forEach(function (n) {
      var cls = "dg-n k-" + n.kind + (n.tone ? " tone-" + n.tone : "");
      s += '<g class="' + cls + '"><rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="' + (n.kind === "terminal" ? Math.min(20, n.h / 2) : n.kind === "decision" ? 4 : 10) + '"/>';
      var ty = n.y + 22;
      n.ll.forEach(function (ln) { s += '<text class="dg-t" x="' + (n.x + n.w / 2) + '" y="' + ty + '" text-anchor="middle">' + esc(ln) + "</text>"; ty += 17; });
      if (n.dl.length) ty += 2;
      n.dl.forEach(function (ln) { s += '<text class="dg-d" x="' + (n.x + n.w / 2) + '" y="' + (ty - 1) + '" text-anchor="middle">' + esc(ln) + "</text>"; ty += 15; });
      s += "</g>";
    });
    return s + labels + "</svg>";
  };

  /* ---------------- QCM ---------------- */
  var QREG = {};  // qk -> {q, opts}
  function qGet(scope, id) { var k = scope + id; var st = scope === "" ? S.q[id] : (S.mock[scope] && S.mock[scope].sel[id]); return st || { sel: [], done: false }; }
  function qcard(q, num, scope, mockInfo) {
    var qk = (scope || "") + "|" + q.id;
    QREG[qk] = { q: q, num: num, scope: scope, mock: mockInfo };
    var mock = !!mockInfo, st = mock ? { sel: (mockInfo.sel[q.id] || []), done: false } : (S.q[q.id] || { sel: [], done: false });
    var show = mock ? mockInfo.submitted : st.done;
    var isRight = show && same(st.sel, q.a);
    var srcL = cur.sources && cur.sources[q.s] ? tr(cur.sources[q.s]) : q.s;
    var h = '<div class="q' + (show ? (isRight ? " q-ok" : " q-ko") : "") + '" data-qk="' + esc(qk) + '">';
    h += '<div class="q-meta"><span class="q-num">' + num + "</span><span>" + esc(q.id) + " · " + esc(srcL) + '</span><span class="q-type ' + (q.m ? "m" : "s") + '">' + (q.m ? u("multi") : u("single")) + "</span></div>";
    h += '<div class="q-q">' + rich(q.q) + "</div>";
    if (q.k) h += '<pre class="code' + (cur.codeLang ? " lang-" + cur.codeLang : "") + '">' + hl(q.k, cur.codeLang) + "</pre>";
    h += '<div class="q-opts" role="group">';
    q.o.forEach(function (o, i) {
      var chosen = st.sel.indexOf(i) >= 0, isAns = q.a.indexOf(i) >= 0, mark = "", tone = "";
      if (show) {
        if (isAns && chosen) { mark = u("correct"); tone = "ok"; }
        else if (isAns) { mark = q.m ? u("missed") : u("correct"); tone = "ok miss"; }
        else if (chosen) { mark = u("wrong"); tone = "ko"; }
      }
      h += '<button type="button" class="opt' + (chosen ? " on" : "") + (tone ? " " + tone : "") + (q.m ? " multi" : "") + '"' + (show ? " disabled" : "") + ' data-act="pick" data-arg="' + esc(qk + "|" + i) + '" aria-pressed="' + chosen + '">';
      h += '<span class="box"></span><span class="opt-t"><span class="opt-l">' + LET[i] + ") </span>" + rich(o) + "</span>" + (mark ? '<span class="mark">' + mark + "</span>" : "") + "</button>";
    });
    h += "</div>";
    if (!mock && ((q.m && !st.done) || st.done)) {
      h += '<div class="ctl">';
      if (q.m && !st.done) h += btn(u("check"), "check", qk, "primary", st.sel.length ? "" : " disabled");
      if (st.done) h += btn(u("retry"), "retry", qk);
      h += "</div>";
    }
    if (show) {
      var ans = q.a.map(function (i) { return LET[i]; }).join(", ");
      h += '<div class="why"><strong class="' + (isRight ? "ok" : "ko") + '">' + (isRight ? u("right") : st.sel.length === 0 ? u("notAns") + ans + ". " : u("notQuite") + ans + ". ") + "</strong>" + rich(q.w) + "</div>";
    }
    return h + "</div>";
  }
  function ctxBlock(c) {
    var x = cur.contexts && cur.contexts[c];
    if (!x) return "";
    return '<div class="ctx"><div class="ctx-h">' + u("ctxCase") + "</div>" + blocks(x, "ctx." + c) + "</div>";
  }
  function qlist(list, scope, mockInfo) {
    var prev = "", out = "";
    list.forEach(function (q, n) {
      if (q.c && q.c !== prev) out += ctxBlock(q.c);
      prev = q.c || "";
      out += qcard(q, n + 1, scope, mockInfo);
    });
    return out;
  }
  function refreshCard(qk) {
    var r = QREG[qk]; if (!r) return;
    var el = document.querySelector('[data-qk="' + cssEsc(qk) + '"]'); if (!el) return;
    var tmp = document.createElement("div"); tmp.innerHTML = qcard(r.q, r.num, r.scope, r.mock ? mockInfoFor(r.scope) : null);
    el.replaceWith(tmp.firstChild);
    updateStats();
  }
  function onPick(qk, i) {
    var r = QREG[qk]; if (!r) return; var q = r.q;
    if (r.mock) {
      var m = S.mock[r.scope]; if (!m || m.submitted) return;
      var cs = m.sel[q.id] || [];
      m.sel[q.id] = q.m ? (cs.indexOf(i) >= 0 ? cs.filter(function (x) { return x !== i; }) : cs.concat([i]).sort()) : [i];
      save(); refreshCard(qk); updateMockBar(); return;
    }
    var st = S.q[q.id] || { sel: [], done: false };
    if (st.done) return;
    var sel = q.m ? (st.sel.indexOf(i) >= 0 ? st.sel.filter(function (x) { return x !== i; }) : st.sel.concat([i]).sort()) : [i];
    S.q[q.id] = { sel: sel, done: !q.m };
    save(); refreshAllCards(q.id);
  }
  function refreshAllCards(id) { Object.keys(QREG).forEach(function (qk) { if (QREG[qk].q.id === id && !QREG[qk].mock) refreshCard(qk); }); }
  function updateStats() {
    if (!cur) return;
    var st = stats(cur, S);
    document.querySelectorAll("[data-stat]").forEach(function (el) {
      var k = el.getAttribute("data-stat");
      if (k === "answered") el.textContent = st.answered + " / " + st.total;
      if (k === "right") el.textContent = String(st.right);
      if (k === "lessons") el.textContent = st.lessonsDone + " / " + st.lessons;
      if (k === "ring") el.style.setProperty("--p", st.total ? (st.right / st.total * 100).toFixed(1) : 0);
      if (k === "ringtxt") el.textContent = st.total ? Math.round(st.right / st.total * 100) + "%" : "0%";
    });
  }

  /* ---------------- mock exam ---------------- */
  var mockTimer = null;
  function mockInfoFor(setId) { var m = S.mock[setId]; return m ? { sel: m.sel, submitted: !!m.submitted } : null; }
  function mockQuestions(setId) {
    var ids = (cur.mocks[setId] || {}).ids || [];
    return ids.map(function (id) { return cur.bank.filter(function (q) { return q.id === id; })[0]; }).filter(Boolean);
  }
  function mockScore(setId) {
    var m = S.mock[setId], qs = mockQuestions(setId), sc = 0, an = 0;
    qs.forEach(function (q) { var s = (m && m.sel[q.id]) || []; if (s.length) an++; if (same(s, q.a)) sc++; });
    var ng = 0;
    qs.forEach(function (q) { var s = (m && m.sel[q.id]) || []; if (s.length) ng += (s.filter(function (i) { return q.a.indexOf(i) >= 0; }).length - s.filter(function (i) { return q.a.indexOf(i) < 0; }).length) / q.a.length; });
    return { score: sc, answered: an, n: qs.length, neg: Math.round(ng * 100) / 100 };
  }
  function fmtClock(ms) { if (ms < 0) ms = 0; var t = Math.round(ms / 1000), m = Math.floor(t / 60), s = t % 60; return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s; }
  function mockPanel() {
    var sets = Object.keys(cur.mocks || {});
    if (!sets.length) return "<p>—</p>";
    var setId = uiGet("mockSet", sets[0]); if (sets.indexOf(setId) < 0) setId = sets[0];
    var m = S.mock[setId];
    var h = '<div class="panel-h"><h2>' + u("mock") + "</h2>" + (cur.mockCaption ? '<p class="cap">' + rich(cur.mockCaption) + "</p>" : "") + "</div>";
    h += '<div class="seg">' + sets.map(function (k) { var mm = cur.mocks[k]; return '<button type="button" class="seg-b' + (k === setId ? " on" : "") + '" data-act="mockset" data-arg="' + esc(k) + '">' + rich(mm.label || (u("set") + " " + k)) + " (" + mockQuestions(k).length + ")</button>"; }).join("") + "</div>";
    if (!m) {
      var mins = uiGet("mockMin", cur.mocks[setId].minutes || (subjMeta(cur.id) || {}).durationMin || 60);
      h += '<div class="mock-start"><p>' + u("mockIntro") + " " + u("noFeedback") + "</p>";
      if (cur.mocks[setId].note) h += '<p class="cap">' + rich(cur.mocks[setId].note) + "</p>";
      h += '<label class="sel-l">' + u("duration") + ' <select data-act="mockmin">' + [10, 15, 20, 30, 40, 45, 60, 90].map(function (x) { return '<option value="' + x + '"' + (x === mins ? " selected" : "") + ">" + x + " min</option>"; }).join("") + "</select></label> ";
      h += btn(u("start"), "mockstart", setId, "primary big") + "</div>";
      return h;
    }
    var sc = mockScore(setId);
    h += '<div class="mock-bar" id="mockbar">';
    if (!m.submitted) {
      h += '<span class="clock" id="mockclock">' + fmtClock(m.end - Date.now()) + "</span><span class='mb-a' id='mockans'>" + sc.answered + " / " + sc.n + " " + u("answered") + "</span>";
      h += btn(u("submit"), "mocksubmit", setId, "primary") + btn(u("reset"), "mockreset", setId);
    } else {
      var p20 = Math.round((sc.score / sc.n) * 200) / 10;
      h += '<span class="score-big">' + u("score") + (Study.lang() === "fr" ? " : " : ": ") + sc.score + " / " + sc.n + " <small>(≈ " + p20 + " / 20)</small></span>" + (m.timeUp ? '<span class="cap">' + u("timeUp") + "</span>" : "") + btn(u("reset"), "mockreset", setId, "primary");
    }
    h += "</div>";
    if (m.submitted && cur.negMark) h += '<p class="txt"><strong>' + rich(cur.negMark.label) + " " + sc.neg + " / " + sc.n + "</strong> " + rich(cur.negMark.note) + "</p>";
    if (m.submitted) h += '<p class="cap">' + u("reviewTip") + "</p>";
    h += '<div class="qlist">' + qlist(mockQuestions(setId), setId, mockInfoFor(setId)) + "</div>";
    return h;
  }
  function updateMockBar() {
    var setId = uiGet("mockSet", Object.keys(cur.mocks)[0]); var el = document.getElementById("mockans");
    if (el) { var sc = mockScore(setId); el.textContent = sc.answered + " / " + sc.n + " " + u("answered"); }
  }
  function tickMock() {
    if (!cur || !cur.mocks) return;
    Object.keys(S.mock).forEach(function (k) {
      var m = S.mock[k];
      if (m && !m.submitted && Date.now() >= m.end) { m.submitted = true; m.timeUp = true; save(); if (route().tab === "mock") renderPanel(); }
    });
    var setId = uiGet("mockSet", Object.keys(cur.mocks)[0]); var m = S.mock[setId]; var el = document.getElementById("mockclock");
    if (el && m && !m.submitted) { var left = m.end - Date.now(); el.textContent = fmtClock(left); el.classList.toggle("low", left < 5 * 60000); }
  }

  /* ---------------- paper timer (past exams) ---------------- */
  function paperTimerHtml(pid, minutes) {
    var t = S.ui["ptimer:" + pid];
    if (t && t > Date.now()) return '<span class="clock" data-ptimer="' + esc(pid) + '">' + fmtClock(t - Date.now()) + "</span>" + btn(u("stopTimer"), "ptimer", pid + "|0");
    return btn("⏱ " + u("timerPaper") + " (" + minutes + " min)", "ptimer", pid + "|" + minutes);
  }
  function tickPaper() {
    document.querySelectorAll("[data-ptimer]").forEach(function (el) {
      var t = S.ui["ptimer:" + el.getAttribute("data-ptimer")]; var left = (t || 0) - Date.now();
      el.textContent = left > 0 ? fmtClock(left) : "00:00"; el.classList.toggle("low", left < 5 * 60000);
    });
  }

  /* ---------------- countdown helpers ---------------- */
  function untilText(iso, durMin) {
    var t = new Date(iso).getTime(), now = Date.now();
    if (now > t + (durMin || 60) * 60000) return '<span class="pill done">' + u("done") + "</span>";
    var d = t - now;
    if (d <= 0) return '<span class="pill live">' + u("today") + "</span>";
    var days = Math.floor(d / 86400000), hrs = Math.floor((d % 86400000) / 3600000), mins = Math.floor((d % 3600000) / 60000);
    var s = days > 0 ? days + " " + u("days") + " " + hrs + " " + u("hours") : hrs + " " + u("hours") + " " + mins + " " + u("mins");
    return '<span class="pill' + (days < 1 ? " soon" : "") + '">' + u("inD") + " " + s + "</span>";
  }
  function dateText(iso) {
    try {
      return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Tunis" }).format(new Date(iso));
    } catch (e) { return iso; }
  }
  Study.dateText = dateText;

  /* ---------------- layout: nav ---------------- */
  function navHtml(active) {
    var h = '<header class="top"><div class="top-in"><a class="brand" href="index.html"><span class="logo">◆</span><span>' + esc(tr(SITE.title)) + "</span></a>";
    h += '<nav class="snav">' + SUBJECTS.map(function (s) {
      return '<a href="' + esc(s.page) + '" class="' + (s.id === active ? "on" : "") + '" style="--sc:' + s.color + '"><i></i>' + esc(s.short) + "</a>";
    }).join("") + "</nav>";
    h += '<div class="tools"><button type="button" class="tbtn" data-act="lang" title="Language / Langue">' + (lang === "en" ? "EN · <b>FR</b>" : "<b>EN</b> · FR") + '</button><button type="button" class="tbtn" data-act="theme" title="' + u("theme") + '">' + themeIcon() + "</button></div>";
    return h + "</div></header>";
  }
  var theme = lsGet("theme", "auto");
  function themeIcon() { return theme === "dark" ? "☾" : theme === "light" ? "☀" : "◐"; }
  function applyTheme() {
    var t = theme === "auto" ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
    document.documentElement.setAttribute("data-theme", t);
  }

  /* ---------------- subject page ---------------- */
  function tabs() {
    var t = [["exam", u("exam")], ["lessons", u("lessons")]];
    (cur.extraTabs || []).forEach(function (x) { t.push([x.id, tr(x.label)]); });
    t.push(["bank", u("bank")], ["mock", u("mock")]);
    if (cur.past && cur.past.length) t.push(["past", tr(cur.pastLabel || UI.past)]);
    t.push(["cheat", u("cheat")], ["materials", u("materials")]);
    return t;
  }
  function route() {
    var h = (location.hash || "").replace(/^#/, ""); var p = h.split("/");
    var tab = p[0] || "exam"; var ok = tabs().some(function (x) { return x[0] === tab; });
    return { tab: ok ? tab : "exam", sub: p[1] || "" };
  }
  function subjectHeader(meta) {
    var st = stats(cur, S);
    var h = '<section class="shero" style="--sc:' + meta.color + '"><div class="shero-t"><div class="kicker">' + esc(meta.short) + " · DS</div><h1>" + esc(tr(meta.name)) + "</h1>";
    h += '<p class="when">' + esc(dateText(meta.exam)) + " · " + (meta.durationMin || 60) + " min " + untilText(meta.exam, meta.durationMin) + "</p>";
    if (cur.summary) h += '<p class="lead">' + rich(cur.summary) + "</p>";
    h += '</div><div class="shero-p"><div class="ring" data-stat="ring" style="--p:' + (st.total ? (st.right / st.total * 100).toFixed(1) : 0) + '"><span data-stat="ringtxt">' + (st.total ? Math.round(st.right / st.total * 100) : 0) + "%</span></div>";
    h += '<div class="pstats"><div><b data-stat="right">' + st.right + "</b> " + u("rightN") + '</div><div><b data-stat="answered">' + st.answered + " / " + st.total + "</b> " + u("answered") + '</div><div><b data-stat="lessons">' + st.lessonsDone + " / " + st.lessons + "</b> " + u("lessonsStudied") + "</div></div></div></section>";
    h += '<nav class="tabs" id="tabs">' + tabs().map(function (t) { return '<a href="#' + t[0] + '" data-tab="' + t[0] + '">' + esc(t[1]) + "</a>"; }).join("") + "</nav>";
    return h;
  }
  function examPanel() {
    var e = cur.exam || {};
    var h = '<div class="panel-h"><h2>' + u("exam") + "</h2></div>";
    if (e.props) h += block({ t: "props", items: e.props }, "exam.props");
    h += blocks(e.b, "exam");
    var ex = (cur.past && cur.past.length) ? [] : subjFiles(cur.id).filter(function (f) { return f.g === "exams"; });
    if (ex.length) h += '<section class="sec papers-src"><h3>' + u("origPaper") + '</h3><ul class="flist">' + ex.map(fileRow).join("") + "</ul></section>";
    // lesson path
    h += '<section class="sec"><h3>' + u("lessons") + '</h3><div class="lpath">' + cur.lessons.map(function (l, i) {
      return '<a class="lp' + (S.lessons[l.id] ? " done" : "") + '" href="#lessons/' + esc(l.id) + '"><span class="lp-n">' + (i + 1) + '</span><span class="lp-t">' + rich(l.label).replace(/^\d+\.\s*/, "") + "</span>" + (l.min ? '<span class="lp-m">' + l.min + " min</span>" : "") + "</a>";
    }).join("") + "</div></section>";
    return h;
  }
  function lessonPanel(sub) {
    var L = cur.lessons, idx = 0;
    for (var i = 0; i < L.length; i++) if (L[i].id === sub) idx = i;
    if (!sub) { var last = uiGet("lastLesson", L[0].id); for (var j = 0; j < L.length; j++) if (L[j].id === last) idx = j; }
    var l = L[idx]; uiSet("lastLesson", l.id);
    var h = '<div class="panel-h"><h2>' + u("lessons") + "</h2>" + (cur.lessonCaption ? '<p class="cap">' + rich(cur.lessonCaption) + "</p>" : "") + "</div>";
    h += '<div class="lpick">' + L.map(function (x, i) { return '<a href="#lessons/' + esc(x.id) + '" class="' + (i === idx ? "on" : "") + (S.lessons[x.id] ? " done" : "") + '">' + rich(x.label) + "</a>"; }).join("") + "</div>";
    h += '<article class="lesson"><h2 class="lt">' + rich(l.label) + "</h2>";
    if (l.intro) h += '<p class="lead">' + rich(l.intro) + "</p>";
    h += blocks(l.b, "L." + l.id);
    if (l.points && l.points.length) h += '<section class="sec"><h3>' + u("keyPoints") + '</h3><ul class="list pro">' + l.points.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul></section>";
    if (l.traps && l.traps.length) h += '<section class="sec"><h3>' + u("traps") + '</h3><ul class="list con">' + l.traps.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul></section>";
    var quiz = cur.bank.filter(function (q) { return q.t === l.id; });
    if (quiz.length) h += '<section class="sec"><h3>' + u("miniQuiz") + " (" + quiz.length + " " + u("questions") + ')</h3><div class="qlist">' + qlist(quiz, "", null) + "</div></section>";
    h += '<div class="ctl lnav">';
    if (idx > 0) h += '<a class="btn" href="#lessons/' + esc(L[idx - 1].id) + '">← ' + u("prev") + "</a>";
    h += btn(S.lessons[l.id] ? u("studied") : u("markDone"), "lessondone", l.id, S.lessons[l.id] ? "ok" : "");
    if (idx < L.length - 1) h += '<a class="btn primary" href="#lessons/' + esc(L[idx + 1].id) + '">' + u("next") + " →</a>";
    return h + "</div></article>";
  }
  function bankPanel() {
    var srcs = []; cur.bank.forEach(function (q) { if (srcs.indexOf(q.s) < 0) srcs.push(q.s); });
    var fs = uiGet("bankSrc", "all"), ft = uiGet("bankTop", "all"), fst = uiGet("bankSt", "all");
    var list = cur.bank.filter(function (q) {
      if (fs !== "all" && q.s !== fs) return false;
      if (ft !== "all" && q.t !== ft) return false;
      var st = S.q[q.id];
      if (fst === "new" && st && st.done) return false;
      if (fst === "wrong" && !(st && st.done && !same(st.sel, q.a))) return false;
      if (fst === "right" && !(st && st.done && same(st.sel, q.a))) return false;
      return true;
    });
    var h = '<div class="panel-h"><h2>' + u("bank") + "</h2>" + (cur.bankCaption ? '<p class="cap">' + rich(cur.bankCaption) + "</p>" : "") + "</div>";
    h += '<div class="filters"><label class="sel-l">' + u("source") + ' <select data-act="filter" data-arg="bankSrc"><option value="all">' + u("allSources") + " (" + cur.bank.length + ")</option>" + srcs.map(function (s) { var n = cur.bank.filter(function (q) { return q.s === s; }).length; return '<option value="' + esc(s) + '"' + (fs === s ? " selected" : "") + ">" + esc(cur.sources && cur.sources[s] ? tr(cur.sources[s]) : s) + " (" + n + ")</option>"; }).join("") + "</select></label>";
    h += '<label class="sel-l">' + u("topic") + ' <select data-act="filter" data-arg="bankTop"><option value="all">' + u("allTopics") + "</option>" + cur.lessons.map(function (l) { var n = cur.bank.filter(function (q) { return q.t === l.id; }).length; return n ? '<option value="' + esc(l.id) + '"' + (ft === l.id ? " selected" : "") + ">" + esc(tr(l.label)) + " (" + n + ")</option>" : ""; }).join("") + "</select></label>";
    h += '<label class="sel-l">' + u("status") + ' <select data-act="filter" data-arg="bankSt">' + [["all", "stAll"], ["new", "stNew"], ["wrong", "stWrong"], ["right", "stRight"]].map(function (x) { return '<option value="' + x[0] + '"' + (fst === x[0] ? " selected" : "") + ">" + u(x[1]) + "</option>"; }).join("") + "</select></label>";
    h += btn(u("resetBank"), "resetbank", "", "ghost") + "</div>";
    h += '<p class="cap">' + list.length + u("shown") + " · <span data-stat=\"answered\"></span> " + u("answered") + ", <span data-stat=\"right\"></span> " + u("rightN") + "</p>";
    h += '<div class="qlist">' + qlist(list, "", null) + "</div>";
    return h;
  }
  function pastPanel() {
    var h = '<div class="panel-h"><h2>' + esc(tr(cur.pastLabel || UI.past)) + "</h2><p class=\"cap\">" + u("paperTip") + "</p></div>";
    var ex = subjFiles(cur.id).filter(function (f) { return f.g === "exams"; });
    if (ex.length) h += '<section class="sec papers-src"><h3>' + u("origPaper") + '</h3><ul class="flist">' + ex.map(fileRow).join("") + "</ul></section>";
    cur.past.forEach(function (p, pi) {
      h += '<section class="paper"><div class="paper-h"><h3>' + rich(p.title) + "</h3>" + (p.meta ? '<p class="cap">' + rich(p.meta) + "</p>" : "") + '<div class="ctl">' + paperTimerHtml(p.id, p.minutes || 60) + "</div></div>";
      h += blocks(p.intro, "past." + p.id + ".i");
      (p.parts || []).forEach(function (part, qi) {
        h += '<div class="part"><h4>' + rich(part.h) + "</h4>" + blocks(part.q, "past." + p.id + "." + qi + ".q");
        h += block({ t: "reveal", b: part.sol, label: part.solLabel }, "past." + p.id + "." + qi + ".sol") + "</div>";
      });
      h += "</section>";
    });
    return h;
  }
  function cheatPanel() {
    var h = '<div class="panel-h"><h2>' + u("cheat") + '</h2></div><div class="cheat">';
    h += cur.cheat.map(function (c, i) {
      return '<div class="cheat-c"><h3>' + rich(c.h) + "</h3>" + (c.items ? '<ul class="list">' + c.items.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + "</ul>" : "") + (c.b ? blocks(c.b, "cheat." + i) : "") + "</div>";
    }).join("");
    return h + "</div>" + (cur.cheatAfter ? blocks(cur.cheatAfter, "cheatA") : "");
  }
  function materialsPanel(meta) {
    var base = SITE.moodle;
    var items = (cur.materials || []).map(function (m) { return { title: m.title, kind: "Moodle · " + tr(m.kind || ""), note: m.note, href: m.path ? base + m.path : base + "course/view.php?id=" + meta.moodle }; });
    items.unshift({ title: u("coursePage"), kind: "Moodle", href: base + "course/view.php?id=" + meta.moodle, note: "course/view.php?id=" + meta.moodle });
    items.push({ title: u("examBank"), kind: "Moodle · " + tr(["Exams", "Examens"]), href: base + "course/view.php?id=" + SITE.examBank });
    var h = '<div class="panel-h"><h2>' + u("materials") + '</h2><p class="cap">' + u("filesNote") + "</p></div>" + fileGroups(subjFiles(cur.id));
    h += '<section class="sec moodle-sec"><h3>' + u("onMoodle") + '</h3><p class="cap">' + u("moodleNote") + "</p>" + linkCards(items) + "</section>";
    return h;
  }
  /* ---------------- course files (assets/files.js) ---------------- */
  var GROUPS = ["course", "tdtp", "corr", "exams", "other"];
  var GICON = { course: "📘", tdtp: "🧪", corr: "✅", exams: "📝", other: "📎" };
  function subjFiles(id) { return (window.FILES && window.FILES[id]) || []; }
  function fsize(n) {
    var fr = lang === "fr", k = n / 1024;
    var s = k < 1024 ? Math.max(1, Math.round(k)) + (fr ? " Ko" : " KB") : (k / 1024).toFixed(k < 10240 ? 1 : 0) + (fr ? " Mo" : " MB");
    return fr ? s.replace(".", ",") : s;
  }
  function fileExt(f) { var m = /\.([a-z0-9]+)$/i.exec(f.f); return m ? m[1].toLowerCase() : ""; }
  function fileRow(f) {
    var ext = fileExt(f), isPdf = ext === "pdf";
    var h = '<li class="frow"><span class="ficon ft-' + esc(ext) + '">' + esc(ext === "ipynb" ? "IPY" : ext.toUpperCase()) + '</span><span class="fmain"><span class="ft">' + rich(f.t) + '</span><span class="fm">' + esc(f.type) + " · " + esc(fsize(f.size)) + (f.orig ? ' · <span class="forig">' + esc(f.orig) + "</span>" : "") + '</span></span><span class="fact">';
    if (isPdf) h += '<button type="button" class="btn primary sm" data-act="fpreview" data-arg="' + esc(f.f) + '">👁 ' + u("preview") + "</button>";
    if (ext === "ipynb" && SITE.repo) h += '<a class="btn sm" href="https://colab.research.google.com/github/' + esc(SITE.repo) + "/blob/main/" + esc(f.f) + '" target="_blank" rel="noopener">' + u("colab") + " ↗</a>";
    h += '<a class="btn sm" href="' + esc(f.f) + '" download="' + esc(f.f.split("/").pop()) + '">⬇ ' + u("download") + "</a>";
    return h + "</span></li>";
  }
  function fileGroups(list, only) {
    if (!list.length) return "";
    return '<div class="fgroups">' + GROUPS.filter(function (g) { return !only || only === g; }).map(function (g) {
      var xs = list.filter(function (f) { return f.g === g; });
      if (!xs.length) return "";
      return '<section class="fgroup fg-' + g + '"><h3><span class="fg-i">' + GICON[g] + "</span>" + u("g" + g) + ' <span class="fg-n">' + xs.length + "</span></h3><ul class=\"flist\">" + xs.map(fileRow).join("") + "</ul></section>";
    }).join("") + "</div>";
  }
  Study.fileGroups = fileGroups;
  function findFile(path) { var all = window.FILES || {}; for (var k in all) for (var i = 0; i < all[k].length; i++) if (all[k][i].f === path) return all[k][i]; return null; }
  var lastFocus = null;
  function openViewer(path) {
    var f = findFile(path); if (!f) return;
    closeViewer();
    lastFocus = document.activeElement;
    var name = path.split("/").pop();
    var m = document.createElement("div");
    m.className = "fviewer"; m.id = "fviewer"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", tr(f.t));
    m.innerHTML = '<div class="fv-back" data-act="fclose"></div><div class="fv-box"><div class="fv-bar"><span class="fv-t">' + rich(f.t) + '<small>' + esc(f.type) + " · " + esc(fsize(f.size)) + '</small></span><a class="btn sm" href="' + esc(path) + '" target="_blank" rel="noopener">' + u("newTab") + ' ↗</a><a class="btn sm" href="' + esc(path) + '" download="' + esc(name) + '">⬇ ' + u("download") + '</a><button type="button" class="btn sm primary fv-x" data-act="fclose" aria-label="' + u("close") + '">✕ ' + u("close") + '</button></div>' +
      '<div class="fv-body">' + (nativePdf() ? '<iframe src="' + esc(path) + '#view=FitH" title="' + esc(tr(f.t)) + '"></iframe>' : '<div class="fv-pages" id="fv-pages"><p class="fv-load">' + u("loadingPdf") + "</p></div>") + '</div><p class="fv-fb">' + u("pdfFallback") + ' <a href="' + esc(path) + '" target="_blank" rel="noopener">' + u("newTab") + " ↗</a></p></div>";
    document.body.appendChild(m); document.body.classList.add("fv-open");
    var x = m.querySelector(".fv-x"); if (x) x.focus();
    if (!nativePdf()) renderPdfJs(path, m);
  }
  /* Browsers with a built-in PDF viewer (desktop) embed it in an iframe; phones/tablets (Android has none,
     iOS shows only page 1) get pages drawn with the bundled pdf.js. Force with ?pdfjs=1 or ?pdfjs=0. */
  function nativePdf() {
    var q = /[?&]pdfjs=([01])/.exec(location.search); if (q) return q[1] === "0";
    var ua = navigator.userAgent || "", ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (ios || /Android|Mobi/i.test(ua)) return false;
    return navigator.pdfViewerEnabled !== false;
  }
  var pdfLib = null;
  function loadPdfJs() {
    if (pdfLib) return pdfLib;
    pdfLib = loadScript("assets/vendor/pdfjs/pdf.min.js").then(function () {
      var L = window.pdfjsLib; if (!L) throw new Error("pdf.js failed to load");
      L.GlobalWorkerOptions.workerSrc = "assets/vendor/pdfjs/pdf.worker.min.js"; return L;
    });
    return pdfLib;
  }
  function renderPdfJs(path, m) {
    var box = m.querySelector("#fv-pages");
    loadPdfJs().then(function (L) { return L.getDocument(path).promise; }).then(function (doc) {
      if (!document.body.contains(m)) return;
      box.innerHTML = "";
      var w = Math.max(280, box.clientWidth - 16), dpr = Math.min(window.devicePixelRatio || 1, 2);
      var io = "IntersectionObserver" in window ? new IntersectionObserver(function (ents) { ents.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); draw(e.target); } }); }, { root: box, rootMargin: "600px 0px" }) : null;
      function draw(c) {
        var n = +c.getAttribute("data-p");
        doc.getPage(n).then(function (pg) {
          var v1 = pg.getViewport({ scale: 1 }), sc = w / v1.width, vp = pg.getViewport({ scale: sc * dpr });
          c.width = vp.width; c.height = vp.height; c.style.width = w + "px"; c.style.height = (vp.height / dpr) + "px";
          pg.render({ canvasContext: c.getContext("2d"), viewport: vp });
        });
      }
      doc.getPage(1).then(function (p1) {
        var v = p1.getViewport({ scale: 1 }), hh = Math.round(w * v.height / v.width);
        for (var i = 1; i <= doc.numPages; i++) {
          var c = document.createElement("canvas"); c.className = "fv-pg"; c.setAttribute("data-p", i); c.style.width = w + "px"; c.style.height = hh + "px";
          var lab = document.createElement("div"); lab.className = "fv-pn"; lab.textContent = i + " / " + doc.numPages;
          box.appendChild(c); box.appendChild(lab);
          if (io) io.observe(c); else if (i <= 3) draw(c);
        }
      });
    }).catch(function () {
      if (box) box.innerHTML = '<p class="fv-load">' + u("pdfFallback") + ' <a class="btn sm primary" href="' + esc(path) + '" target="_blank" rel="noopener">' + u("newTab") + " ↗</a></p>";
    });
  }
  function closeViewer() {
    var m = document.getElementById("fviewer"); if (!m) return;
    m.parentNode.removeChild(m); document.body.classList.remove("fv-open");
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
  }
  Study.openViewer = openViewer; Study.closeViewer = closeViewer;
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeViewer(); });

  function renderPanel() {
    var r = route(), meta = subjMeta(cur.id), p = document.getElementById("panel");
    REG = {}; QREG = {};
    var h = "";
    if (r.tab === "exam") h = examPanel();
    else if (r.tab === "lessons") h = lessonPanel(r.sub);
    else if (r.tab === "bank") h = bankPanel();
    else if (r.tab === "mock") h = mockPanel();
    else if (r.tab === "past") h = pastPanel();
    else if (r.tab === "cheat") h = cheatPanel();
    else if (r.tab === "materials") h = materialsPanel(meta);
    else (cur.extraTabs || []).forEach(function (x) { if (x.id === r.tab) h = '<div class="panel-h"><h2>' + rich(x.h || x.label) + "</h2>" + (x.cap ? '<p class="cap">' + rich(x.cap) + "</p>" : "") + "</div>" + blocks(x.b, "x." + x.id); });
    p.innerHTML = h;
    document.querySelectorAll("#tabs a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-tab") === r.tab); });
    updateStats();
  }
  function renderSubject(id) {
    cur = SUBJ_DATA[id]; S = loadState(id);
    var meta = subjMeta(id);
    document.title = tr(meta.name) + " · " + tr(SITE.title);
    document.getElementById("app").innerHTML = navHtml(id) + '<main class="wrap">' + subjectHeader(meta) + '<div id="panel" class="panel"></div></main>' + footer();
    renderPanel();
  }
  function footer() { return '<footer class="foot"><div class="wrap">' + u("footer") + "</div></footer>"; }

  /* ---------------- home page ---------------- */
  function renderHome() {
    cur = null; S = null;
    document.title = tr(SITE.title);
    var now = Date.now();
    var next = SUBJECTS.filter(function (s) { return new Date(s.exam).getTime() + (s.durationMin || 60) * 60000 > now; }).sort(function (a, b) { return new Date(a.exam) - new Date(b.exam); })[0];
    var h = navHtml("") + '<main class="wrap">';
    h += '<section class="hero"><div class="hero-t"><div class="kicker">' + esc(SITE.student) + " · " + esc(tr(SITE.school)) + "</div><h1>" + esc(tr(["Mid-term exam prep", "Révisions des DS"])) + "</h1><p class=\"lead\">" +
      esc(tr(["Five subjects, one week. Visual lessons, clickable QCM with explanations, timed mocks and one-page cheat sheets. Your progress is saved in this browser.", "Cinq matières, une semaine. Leçons visuelles, QCM cliquables avec explications, examens blancs chronométrés et fiches résumé. Votre progression est gardée dans ce navigateur."])) + "</p></div>";
    if (next) h += '<div class="cd" style="--sc:' + next.color + '"><div class="cd-l">' + u("countdown") + '</div><div class="cd-s">' + esc(tr(next.name)) + '</div><div class="cd-n" id="cd" data-t="' + esc(next.exam) + '">--</div><div class="cd-d">' + esc(dateText(next.exam)) + '</div><a class="btn primary" href="' + esc(next.page) + '">' + u("open") + " →</a></div>";
    h += "</section>";
    h += '<section class="sec"><h3>' + u("schedule") + '</h3><ol class="sched">' + SUBJECTS.slice().sort(function (a, b) { return new Date(a.exam) - new Date(b.exam); }).map(function (s) {
      return '<li style="--sc:' + s.color + '"><span class="sd">' + esc(dateText(s.exam)) + '</span><a href="' + esc(s.page) + '">' + esc(tr(s.name)) + "</a>" + untilText(s.exam, s.durationMin) + "</li>";
    }).join("") + "</ol></section>";
    h += '<section class="sec"><div class="scards">' + SUBJECTS.map(function (s) {
      var d = SUBJ_DATA[s.id], st = d ? stats(d, loadState(s.id)) : { total: 0, answered: 0, right: 0, lessons: 0, lessonsDone: 0 };
      var pq = st.total ? Math.round(st.right / st.total * 100) : 0, pl = st.lessons ? Math.round(st.lessonsDone / st.lessons * 100) : 0;
      return '<article class="scard" style="--sc:' + s.color + '"><div class="sc-top"><span class="sc-short">' + esc(s.short) + "</span>" + untilText(s.exam, s.durationMin) + "</div><h3>" + esc(tr(s.name)) + '</h3><p class="sc-when">' + esc(dateText(s.exam)) + "</p>" +
        (d && d.tagline ? '<p class="sc-tag">' + rich(d.tagline) + "</p>" : "") +
        '<div class="pbar"><span>' + u("lessonsStudied") + " " + st.lessonsDone + "/" + st.lessons + '</span><i><b style="width:' + pl + '%"></b></i></div>' +
        '<div class="pbar"><span>QCM ' + u("rightN") + " " + st.right + "/" + st.total + '</span><i><b style="width:' + pq + '%"></b></i></div>' +
        '<div class="ctl"><a class="btn primary" href="' + esc(s.page) + '">' + u("open") + '</a><a class="btn" href="' + esc(s.page) + '#lessons">' + u("lessons") + '</a><a class="btn" href="' + esc(s.page) + '#mock">' + u("startMock") + "</a></div></article>";
    }).join("") + "</div></section>";
    h += '<section class="sec"><h3>' + u("allFiles") + '</h3><div class="links">' + SUBJECTS.map(function (s) {
      var fs = subjFiles(s.id), tot = fs.reduce(function (a, f) { return a + f.size; }, 0);
      return '<a class="link-card" href="' + esc(s.page) + '#materials" style="border-left:4px solid ' + s.color + '"><span class="lk-kind">' + esc(s.short) + '</span><span class="lk-t">' + esc(tr(s.name)) + '</span><span class="lk-n">' + fs.length + " " + u("filesWord") + " · " + esc(fsize(tot)) + '</span><span class="lk-go">→</span></a>';
    }).join("") + "</div></section>";
    h += '<section class="sec"><h3>' + u("onMoodle") + "</h3>" + linkCards(SUBJECTS.map(function (s) { return { title: s.name, kind: "Moodle · " + s.short, href: SITE.moodle + "course/view.php?id=" + s.moodle }; }).concat([{ title: u("examBank"), kind: "Moodle", href: SITE.moodle + "course/view.php?id=" + SITE.examBank }])) + "</section>";
    h += "</main>" + footer();
    document.getElementById("app").innerHTML = h;
    tickHome();
  }
  function tickHome() {
    var el = document.getElementById("cd"); if (!el) return;
    var d = new Date(el.getAttribute("data-t")).getTime() - Date.now();
    if (d <= 0) { el.textContent = u("today"); return; }
    var dd = Math.floor(d / 86400000), hh = Math.floor((d % 86400000) / 3600000), mm = Math.floor((d % 3600000) / 60000), ss = Math.floor((d % 60000) / 1000);
    el.innerHTML = "<b>" + dd + "</b>" + u("days") + " <b>" + hh + "</b>" + u("hours") + " <b>" + (mm < 10 ? "0" : "") + mm + "</b>m <b>" + (ss < 10 ? "0" : "") + ss + "</b>s";
  }

  /* ---------------- events ---------------- */
  function render() { var sid = document.body.getAttribute("data-subject"); if (sid && SUBJ_DATA[sid]) renderSubject(sid); else renderHome(); }
  Study.render = render;
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act]"); if (!el || el.tagName === "SELECT") return;
    var act = el.getAttribute("data-act"), arg = el.getAttribute("data-arg") || "";
    if (act === "lang") { lang = lang === "en" ? "fr" : "en"; lsSet("lang", lang); document.documentElement.lang = lang; var y = window.scrollY; render(); window.scrollTo(0, y); return; }
    if (act === "theme") { theme = theme === "auto" ? "dark" : theme === "dark" ? "light" : "auto"; lsSet("theme", theme); applyTheme(); el.innerHTML = themeIcon(); return; }
    if (act === "fpreview") { openViewer(arg); return; }
    if (act === "fclose") { closeViewer(); return; }
    if (!cur) return;
    var p, k;
    switch (act) {
      case "pick": p = arg.split("|"); onPick(p[0] + "|" + p[1], parseInt(p[2], 10)); break;
      case "check": { var r = QREG[arg]; if (r) { var st = S.q[r.q.id] || { sel: [] }; if (!st.sel.length) return; S.q[r.q.id] = { sel: st.sel, done: true }; save(); refreshAllCards(r.q.id); } break; }
      case "retry": { var r2 = QREG[arg]; if (r2) { delete S.q[r2.q.id]; save(); refreshAllCards(r2.q.id); } break; }
      case "seg": p = arg.split("|"); k = p.shift(); uiSet(k, p.join("|")); rerender(k); break;
      case "step": p = arg.split("|"); k = p[0]; stopPlay(k); uiSet(k, p[1] === "all" ? (REG[k] && REG[k].t === "trace" ? "all" : null) : parseInt(p[1], 10)); rerender(k); break;
      case "play": p = arg.split("|"); k = p[0]; if (PLAY[k]) { stopPlay(k); rerender(k); } else startPlay(k, parseInt(p[1], 10)); break;
      case "toggle": uiSet(arg, !uiGet(arg, false)); rerender(arg); break;
      case "wset": p = arg.split("|"); k = p.shift(); uiSet(k + ":w", p.join("|")); rerender(k); break;
      case "wobj": p = arg.split("|"); k = p.shift(); uiSet(k + ":w", JSON.parse(p.join("|"))); rerender(k); break;
      case "lessondone": S.lessons[arg] = !S.lessons[arg]; save(); renderPanel(); break;
      case "resetbank": if (window.confirm(u("confirmReset"))) { S.q = {}; save(); renderPanel(); } break;
      case "mockset": uiSet("mockSet", arg); renderPanel(); break;
      case "mockstart": { var mins = uiGet("mockMin", cur.mocks[arg].minutes || (subjMeta(cur.id) || {}).durationMin || 60); S.mock[arg] = { sel: {}, start: Date.now(), end: Date.now() + mins * 60000, submitted: false }; save(); renderPanel(); window.scrollTo(0, document.getElementById("panel").offsetTop - 70); break; }
      case "mocksubmit": if (S.mock[arg]) { S.mock[arg].submitted = true; save(); renderPanel(); window.scrollTo(0, document.getElementById("panel").offsetTop - 70); } break;
      case "mockreset": delete S.mock[arg]; save(); renderPanel(); break;
      case "ptimer": p = arg.split("|"); var mn = parseInt(p[1], 10); S.ui["ptimer:" + p[0]] = mn ? Date.now() + mn * 60000 : 0; save(); renderPanel(); break;
      default: if (Study.onAction) Study.onAction(act, arg, el);
    }
  });
  function startPlay(k, n) {
    var cv = uiGet(k, 1); if (cv === "all" || cv >= n) uiSet(k, 1);
    PLAY[k] = setInterval(function () {
      var v = uiGet(k, 1); v = v === "all" ? n : v;
      if (v >= n || !document.querySelector('[data-bk="' + cssEsc(k) + '"]')) { stopPlay(k); rerender(k); return; }
      uiSet(k, v + 1); rerender(k);
    }, (REG[k] && REG[k].ms) || 1400);
    rerender(k);
  }
  function stopPlay(k) { if (PLAY[k]) { clearInterval(PLAY[k]); delete PLAY[k]; } }
  document.addEventListener("change", function (ev) {
    var el = ev.target; if (!el.matches || !cur) return;
    if (el.matches('[data-act="filter"]')) { uiSet(el.getAttribute("data-arg"), el.value); renderPanel(); }
    else if (el.matches('[data-act="mockmin"]')) { uiSet("mockMin", parseInt(el.value, 10)); }
    else if (el.matches("[data-winput]")) { var k = el.getAttribute("data-winput"); var o = uiGet(k + ":w", {}) || {}; if (typeof o !== "object") o = {}; o[el.name] = el.value; uiSet(k + ":w", o); rerender(k); var again = document.querySelector('[data-bk="' + cssEsc(k) + '"] [name="' + el.name + '"]'); if (again) again.focus(); }
  });
  window.addEventListener("hashchange", function () { if (cur) { renderPanel(); var t = document.getElementById("tabs"); if (t && window.scrollY > t.offsetTop) window.scrollTo(0, t.offsetTop - 8); } });
  setInterval(function () { if (cur) { tickMock(); tickPaper(); } else tickHome(); }, 1000);

  /* ---------------- boot: load data files listed in subjects.js ---------------- */
  function loadScript(src) { return new Promise(function (res) { var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = function () { console.warn("Could not load " + src); res(); }; document.head.appendChild(s); }); }
  function boot() {
    applyTheme(); document.documentElement.lang = lang;
    if (window.matchMedia) { try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme); } catch (e) {} }
    var sid = document.body.getAttribute("data-subject");
    var list = sid ? SUBJECTS.filter(function (s) { return s.id === sid; }) : SUBJECTS;
    Promise.all(list.map(function (s) { return loadScript("assets/data/" + s.id + ".js"); }).concat([loadScript("assets/files.js")])).then(function () { render(); Study.ready = true; document.documentElement.setAttribute("data-ready", "1"); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
