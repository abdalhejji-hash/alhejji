// تحدّي نُتقن الأسبوعي — حفظ النتائج ولوحة الشرف
// مدرسة حكيم بن حزام الابتدائية وملحقتها الطريبيل المتوسطة
// الصق هذا الكود كاملًا في: الإضافات ← Apps Script، ثم انشره تطبيق ويب (الوصول: أي شخص).

const SHEET_NAME = 'النتائج';
const HEADERS = ['الوقت', 'الأسبوع', 'الاسم', 'الفصل', 'الدرجة', 'الثواني', 'الجهاز'];

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

function norm_(s) {
  return String(s || '').replace(/\s+/g, ' ').trim().slice(0, 60);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'submit') return submit_(p);
  return board_();
}

function board_() {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return json_({ ok: true, rows: [] });
  const vals = sh.getRange(2, 2, n, 5).getValues(); // الأسبوع، الاسم، الفصل، الدرجة، الثواني
  const rows = vals
    .filter(r => r[1] !== '' && r[0] !== '')
    .map(r => ({ week: Number(r[0]), name: String(r[1]), cls: String(r[2]), score: Number(r[3]), secs: Number(r[4]) }));
  return json_({ ok: true, rows: rows });
}

function submit_(p) {
  const week = Math.round(Number(p.week));
  const name = norm_(p.name);
  const cls = norm_(p.cls).slice(0, 10);
  const score = Math.round(Number(p.score));
  const secs = Math.max(0, Math.min(36000, Math.round(Number(p.secs) || 0)));
  const dev = norm_(p.dev).slice(0, 20);
  if (!(week >= 1 && week <= 52) || name.length < 3 || !(score >= 0 && score <= 100) || score % 5 !== 0) {
    return json_({ ok: false, error: 'bad input' });
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const n = sh.getLastRow() - 1;
    if (n >= 1) {
      const vals = sh.getRange(2, 2, n, 2).getValues();
      const dup = vals.some(r => Number(r[0]) === week && norm_(r[1]) === name);
      if (dup) return json_({ ok: true, dup: true });
    }
    sh.appendRow([new Date(), week, name, cls, score, secs, dev]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
