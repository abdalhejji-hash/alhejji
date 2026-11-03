# بناء تحدّي نُتقن للصفوف العليا (٤–٦): رابط مستقل ولوحة تحكم مستقلة، على نفس الخادم بمرحلة upper
import json, sys, os
sys.path.insert(0, '/home/claude/primary')
import qrcode
from g1_days import DATES
import g4_days, g5_days, g6_days

OUT = '/home/claude/alhejji/nutqin-olya'
API = sys.argv[1] if len(sys.argv) > 1 else '__API__'
URL = 'https://abdalhejji-hash.github.io/alhejji/nutqin-olya/'
STARTS = ['2026-11-01', '2026-11-08', '2026-11-15', '2026-11-29', '2026-12-06', '2026-12-13', '2026-12-20', '2026-12-27',
          '2027-01-17', '2027-01-24', '2027-01-31', '2027-02-07', '2027-02-14', '2027-02-21', '2027-02-28', '2027-03-07']
data = {'starts': STARTS, 'grades': {}}
for g, mod in [('4', g4_days), ('5', g5_days), ('6', g6_days)]:
    data['grades'][g] = {'secs': {}, 'weeks': [[] for _ in STARTS], 'days': mod.build()}
js = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
G = "[['4','الرابع'],['5','الخامس'],['6','السادس']]"
COMMON = [('const STAGE = "primary";', 'const STAGE = "upper";'),
          ("[['1','الأول'],['2','الثاني'],['3','الثالث']]", G)]
STU = COMMON + [('<title>تحدّي نُتقن — الصفوف الأوّلية</title>', '<title>تحدّي نُتقن — الصفوف العليا</title>'),
                ('الصفوف الأوّلية • أسئلة جديدة باستمرار', 'الصفوف العليا (٤–٦) • أسئلة جديدة باستمرار')]
ADM = COMMON + [('https://abdalhejji-hash.github.io/alhejji/nutqin-awwaliya/', URL),
                ('الصفوف الأوّلية (١–٣)', 'الصفوف العليا (٤–٦)'),
                ('تحدّي نُتقن للصفوف الأوّلية', 'تحدّي نُتقن للصفوف العليا'),
                ("""    '<button class="ini"><b>المواد الأربع • الصفوف الأوّلية</b><small>تحدّي نُتقن — مدرسة حكيم بن حزام</small><span class="tag">' + (S.open ? 'مفتوحة' : 'موقوفة') + '</span></button>' +
    '<a class="ini" style="display:block;text-decoration:none;color:inherit" href="../nutqin-olya/admin.html"><b>المواد الأربع • الصفوف العليا</b><small>تحدّي نُتقن (٤–٦) — لوحة مستقلة</small></a>' +""",
                 """    '<a class="ini" style="display:block;text-decoration:none;color:inherit" href="../nutqin-awwaliya/admin.html"><b>المواد الأربع • الصفوف الأوّلية</b><small>تحدّي نُتقن (١–٣) — لوحة مستقلة</small></a>' +
    '<button class="ini"><b>المواد الأربع • الصفوف العليا</b><small>تحدّي نُتقن — مدرسة حكيم بن حزام</small><span class="tag">' + (S.open ? 'مفتوحة' : 'موقوفة') + '</span></button>' +""")]
os.makedirs(OUT, exist_ok=True)
for src, name, reps in [('/home/claude/primary/template.html', 'index.html', STU), ('/home/claude/primary/admin_template.html', 'admin.html', ADM)]:
    h = open(src, encoding='utf-8').read()
    for a, b in reps:
        assert a in h, (name, a[:60])
        h = h.replace(a, b)
    h = h.replace('__DATA__', js).replace('"__API__"', json.dumps(API))
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(h)
img = qrcode.make(URL, border=2, box_size=10)
img.save(os.path.join(OUT, 'qr.png'))
print('ok', len(js))
