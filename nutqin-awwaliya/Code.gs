// تحدّي نُتقن — حفظ النتائج ولوحة الشرف
// مدرسة حكيم بن حزام الابتدائية وملحقتها الطريبيل المتوسطة
// الصق هذا الكود كاملًا في: الإضافات ← Apps Script، ثم انشره تطبيق ويب (التنفيذ بصفة: أنا، الوصول: أي شخص).
// يخدم الرابط نفسه الصفوف الأوّلية والعليا لاحقًا (عمود «المرحلة»).

const SHEET_NAME = 'المحاولات';
const HEADERS = ['الوقت', 'المرحلة', 'الصف', 'المادة', 'الجولة', 'الاسم', 'الفصل', 'الدرجة', 'الثواني', 'الجهاز'];
const SUBJECTS = ['ar', 'ma', 'sc', 'is', 'en', 'sd', 'rd'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'submit') return submit_(p);
  return board_(p);
}

// لوحة الشرف: أفضل درجة لكل طالب في كل جولة، لصفٍّ واحد
function board_(p) {
  const stage = norm_(p.stage, 20) || 'primary';
  const grade = norm_(p.grade, 4);
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return json_({ ok: true, rows: [] });
  const vals = sh.getRange(2, 2, n, 8).getValues(); // المرحلة، الصف، المادة، الجولة، الاسم، الفصل، الدرجة، الثواني
  const best = {};
  vals.forEach(r => {
    if (String(r[0]) !== stage || String(r[1]) !== grade || !r[4]) return;
    const name = norm_(r[4]);
    const k = name + '|' + r[2] + '|' + r[3];
    const score = Number(r[6]), secs = Number(r[7]);
    const cur = best[k];
    if (!cur || score > cur.score || (score === cur.score && secs < cur.secs)) {
      best[k] = { name: name, cls: String(r[5]), subj: String(r[2]), round: Number(r[3]), score: score, secs: secs };
    } else if (cur) {
      cur.cls = String(r[5]) || cur.cls;
    }
  });
  return json_({ ok: true, rows: Object.keys(best).map(k => best[k]) });
}

function submit_(p) {
  const stage = norm_(p.stage, 20) || 'primary';
  const grade = norm_(p.grade, 4);
  const subj = norm_(p.subj, 4);
  const round = Math.round(Number(p.round));
  const name = norm_(p.name);
  const cls = norm_(p.cls, 10);
  const score = Math.round(Number(p.score));
  const secs = Math.max(0, Math.min(36000, Math.round(Number(p.secs) || 0)));
  const dev = norm_(p.dev, 20);
  if (!/^\d{1,2}$/.test(grade) || SUBJECTS.indexOf(subj) < 0 || !(round >= 1 && round <= 200) ||
      name.length < 3 || !(score >= 0 && score <= 100) || score % 5 !== 0) {
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
