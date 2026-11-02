// تحدّي نُتقن — حفظ النتائج ولوحة الشرف ولوحة المدير
// مدرسة حكيم بن حزام الابتدائية وملحقتها الطريبيل المتوسطة
//
// كلمة مرور لوحة المعلم تُنشأ من اللوحة نفسها عند أول دخول، وتُحفظ في خصائص هذا المشروع.
// (اختياري) لإعادة تعيينها: اكتبها هنا بين علامتي التنصيص، وهي تتقدّم على المحفوظة.
const ADMIN_PIN = '';
// الصق هذا الكود كاملًا في: الإضافات ← Apps Script، ثم انشره تطبيق ويب (التنفيذ بصفة: أنا، الوصول: أي شخص).
// عند تغيير الكود لاحقًا: نشر ← إدارة عمليات النشر ← تعديل ← إصدار جديد، حتى يبقى الرابط نفسه.

// رقم جدول النتائج (من رابطه بين /d/ و /edit)، ويُترك فارغًا إذا كان الكود داخل الجدول نفسه.
const SHEET_ID = '';
const SHEET_NAME = 'المحاولات';
const HEADERS = ['الوقت', 'المرحلة', 'الصف', 'المادة', 'الجولة', 'الاسم', 'الفصل', 'الدرجة', 'الثواني', 'الجهاز'];
const SUBJECTS = ['ar', 'ma', 'sc', 'is', 'en', 'sd', 'rd', 'wk', 'dy']; // wk = نموذج الأسبوع، dy = مجموعة اليوم (تُحتسب المحاولة الأولى فقط)
const FIRST_ONLY = ['wk', 'dy'];
const C = { time: 1, stage: 2, grade: 3, subj: 4, round: 5, name: 6, cls: 7, score: 8, secs: 9, dev: 10 }; // أرقام الأعمدة

function sheet_() {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#148E9D').setFontColor('#FFFFFF');
    sh.setRightToLeft(true);
  }
  return sh;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function norm_(s, max) {
  return String(s || '').replace(/\s+/g, ' ').trim().slice(0, max || 60);
}
function allRows_() {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  return n < 1 ? [] : sh.getRange(2, 1, n, HEADERS.length).getValues();
}

// ===== الإعدادات (لكل مرحلة) =====
function settings_(stage) {
  const raw = PropertiesService.getScriptProperties().getProperty('settings_' + stage);
  const d = { open: true, board: true, msg: '' };
  if (!raw) return d;
  try { const s = JSON.parse(raw); return { open: s.open !== false, board: s.board !== false, msg: String(s.msg || '') }; } catch (e) { return d; }
}

// ===== طلبات الطلاب (GET) =====
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'submit') return submit_(p);
  return board_(p);
}

function board_(p) {
  const stage = norm_(p.stage, 20) || 'primary';
  const grade = norm_(p.grade, 4);
  const st = settings_(stage);
  if (!st.board) return json_({ ok: true, settings: st, rows: [] });
  const best = {};
  allRows_().forEach(r => {
    if (String(r[C.stage - 1]) !== stage || String(r[C.grade - 1]) !== grade || !r[C.name - 1]) return;
    const name = norm_(r[C.name - 1]);
    const k = name + '|' + r[C.subj - 1] + '|' + r[C.round - 1];
    const score = Number(r[C.score - 1]), secs = Number(r[C.secs - 1]);
    const cur = best[k];
    const wk = FIRST_ONLY.indexOf(String(r[C.subj - 1])) >= 0; // أول محاولة فقط
    if (!cur || (!wk && (score > cur.score || (score === cur.score && secs < cur.secs)))) {
      best[k] = { name: name, cls: String(r[C.cls - 1]), subj: String(r[C.subj - 1]), round: Number(r[C.round - 1]), score: score, secs: secs };
    }
  });
  return json_({ ok: true, settings: st, rows: Object.keys(best).map(k => best[k]) });
}

function submit_(p) {
  const stage = norm_(p.stage, 20) || 'primary';
  if (!settings_(stage).open) return json_({ ok: false, error: 'closed' });
  const grade = norm_(p.grade, 4);
  const subj = norm_(p.subj, 4);
  const round = Math.round(Number(p.round));
  const name = norm_(p.name);
  const cls = norm_(p.cls, 10);
  const score = Math.round(Number(p.score));
  const secs = Math.max(0, Math.min(36000, Math.round(Number(p.secs) || 0)));
  const dev = norm_(p.dev, 20);
  if (!/^\d{1,2}$/.test(grade) || SUBJECTS.indexOf(subj) < 0 || !(round >= 1 && round <= 200) ||
      name.length < 3 || !(score >= 0 && score <= 100) || (FIRST_ONLY.indexOf(subj) < 0 && score % 5 !== 0)) {
    return json_({ ok: false, error: 'bad input' });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([new Date(), stage, grade, subj, round, name, cls, score, secs, dev]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// ===== لوحة المدير (POST، بكلمة مرور) =====
function doPost(e) {
  let b = {};
  try { b = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad request' }); }
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('pin_fails') || 0);
  if (fails >= 5) return json_({ ok: false, error: 'locked' }); // ٥ محاولات خاطئة: إيقاف ١٠ دقائق
  const props = PropertiesService.getScriptProperties();
  const saved = String(ADMIN_PIN || '') || props.getProperty('admin_pin') || '';
  if (!saved) {
    if (b.op === 'status') return json_({ ok: true, setup: true });
    if (b.op === 'setup') {
      const np = String(b.newPin || '');
      if (np.length < 6) return json_({ ok: false, error: 'short pin' });
      props.setProperty('admin_pin', np);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'no pin' });
  }
  if (b.op === 'status') return json_({ ok: true, setup: false });
  if (String(b.pin || '') !== saved) {
    cache.put('pin_fails', String(fails + 1), 600);
    return json_({ ok: false, error: 'wrong pin' });
  }
  const stage = norm_(b.stage, 20) || 'primary';
  switch (b.op) {
    case 'login': return json_({ ok: true });
    case 'list': return list_(stage);
    case 'rename': return edit_(stage, norm_(b.grade, 4), norm_(b.name), function (row) { row[C.name - 1] = norm_(b.to); });
    case 'setcls': return edit_(stage, norm_(b.grade, 4), norm_(b.name), function (row) { row[C.cls - 1] = norm_(b.cls, 10); });
    case 'delete': return delete_(stage, norm_(b.grade, 4), norm_(b.name));
    case 'settings':
      const cur = settings_(stage);
      const next = { open: b.open === undefined ? cur.open : !!b.open, board: b.board === undefined ? cur.board : !!b.board, msg: b.msg === undefined ? cur.msg : norm_(b.msg, 200) };
      PropertiesService.getScriptProperties().setProperty('settings_' + stage, JSON.stringify(next));
      return json_({ ok: true, settings: next });
  }
  return json_({ ok: false, error: 'unknown op' });
}

function list_(stage) {
  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const m = {};
  let attempts = 0, attemptsToday = 0;
  allRows_().forEach(r => {
    if (String(r[C.stage - 1]) !== stage || !r[C.name - 1]) return;
    attempts++;
    const t = r[C.time - 1] instanceof Date ? r[C.time - 1] : new Date(r[C.time - 1]);
    if (Utilities.formatDate(t, tz, 'yyyy-MM-dd') === today) attemptsToday++;
    const grade = String(r[C.grade - 1]), name = norm_(r[C.name - 1]);
    const k = grade + '|' + name;
    if (!m[k]) m[k] = { grade: grade, name: name, cls: String(r[C.cls - 1]), attempts: 0, best: {}, weeks: {}, last: 0 };
    const s = m[k];
    s.attempts++;
    s.cls = String(r[C.cls - 1]) || s.cls;
    const rk = r[C.subj - 1] + ':' + r[C.round - 1];
    if (FIRST_ONLY.indexOf(String(r[C.subj - 1])) >= 0) {
      const w = (String(r[C.subj - 1]) === 'dy' ? 'd' : '') + r[C.round - 1]; // "3" للأسبوع، "d3" لليوم
      if (!(w in s.weeks)) s.weeks[w] = [Number(r[C.score - 1]), Number(r[C.secs - 1])]; // المحاولة الأولى
    } else {
      s.best[rk] = Math.max(s.best[rk] || 0, Number(r[C.score - 1]));
    }
    s.last = Math.max(s.last, t.getTime());
  });
  const roundStats = {}; // "الصف|المادة|الجولة" -> عدد الطلاب، مجموع أفضل الدرجات، الدرجات الكاملة
  const students = Object.keys(m).map(k => {
    const s = m[k];
    const rounds = Object.keys(s.best);
    rounds.forEach(x => {
      const key = s.grade + '|' + x.replace(':', '|');
      const r = roundStats[key] || (roundStats[key] = { n: 0, sum: 0, full: 0 });
      r.n++; r.sum += s.best[x]; if (s.best[x] >= 100) r.full++;
    });
    return { grade: s.grade, name: s.name, cls: s.cls, attempts: s.attempts, rounds: rounds.length,
             full: rounds.filter(x => s.best[x] >= 100).length, points: rounds.reduce((a, x) => a + s.best[x], 0), weeks: s.weeks, last: s.last };
  });
  return json_({ ok: true, settings: settings_(stage), students: students, roundStats: roundStats, attempts: attempts, attemptsToday: attemptsToday });
}

function edit_(stage, grade, name, fn) {
  if (!name) return json_({ ok: false, error: 'bad input' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const n = sh.getLastRow() - 1;
    if (n < 1) return json_({ ok: true, changed: 0 });
    const rng = sh.getRange(2, 1, n, HEADERS.length);
    const vals = rng.getValues();
    let changed = 0;
    vals.forEach(r => {
      if (String(r[C.stage - 1]) === stage && String(r[C.grade - 1]) === grade && norm_(r[C.name - 1]) === name) { fn(r); changed++; }
    });
    if (changed) rng.setValues(vals);
    return json_({ ok: true, changed: changed });
  } finally {
    lock.releaseLock();
  }
}

function delete_(stage, grade, name) {
  if (!name) return json_({ ok: false, error: 'bad input' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const vals = allRows_();
    let removed = 0;
    for (let i = vals.length - 1; i >= 0; i--) { // من الأسفل حتى لا تتغير أرقام الصفوف
      const r = vals[i];
      if (String(r[C.stage - 1]) === stage && String(r[C.grade - 1]) === grade && norm_(r[C.name - 1]) === name) {
        sh.deleteRow(i + 2); removed++;
      }
    }
    return json_({ ok: true, removed: removed });
  } finally {
    lock.releaseLock();
  }
}
