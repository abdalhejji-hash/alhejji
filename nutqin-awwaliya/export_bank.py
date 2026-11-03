import sys, json
sys.path.insert(0, '/home/claude/primary')
import sys as _s
import g1_days, g2_days, g3_days, g4_days, g5_days, g6_days
from datetime import date
SN = {'ar': 'لغتي', 'ma': 'الرياضيات', 'sc': 'العلوم', 'is': 'الدراسات الإسلامية'}
AR = lambda n: ''.join('٠١٢٣٤٥٦٧٨٩'[int(c)] if c.isdigit() else c for c in str(n))
WD = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
MN = {11: 'نوفمبر', 12: 'ديسمبر'}
WEEKS = [('الأسبوع الأول', '2026-11-01'), ('الأسبوع الثاني', '2026-11-08'), ('الأسبوع الثالث', '2026-11-15'), ('الأسبوع الرابع', '2026-11-29')]
OUT = '/home/claude/alhejji/nutqin-olya/' if '--upper' in _s.argv else '/home/claude/alhejji/nutqin-awwaliya/'
GR = [('4', 'الرابع', g4_days), ('5', 'الخامس', g5_days), ('6', 'السادس', g6_days)] if '--upper' in _s.argv else [('1', 'الأول', g1_days), ('2', 'الثاني', g2_days), ('3', 'الثالث', g3_days)]
for g, name, mod in GR:
    days = mod.build()
    json.dump(days, open(OUT + 'g%s_bank.json' % g, 'w'), ensure_ascii=False, indent=1)
    L = ['# بنك أسئلة الصف ' + name + ' — تحدّي نُتقن', '',
         'مدرسة حكيم بن حزام الابتدائية وملحقتها الطريبيل المتوسطة • مبادرة نُتقن – النشاط الطلابي', '',
         'أسئلة مكتوبة على تسلسل دروس منصة «عين» للصف ' + name + ' (الفصل الدراسي الأول): ٤ أسابيع، ' + AR(len(days)) + ' يومًا، ' + AR(sum(len(d['q']) for d in days)) + ' سؤالًا (١٢ سؤالًا يوميًا: ٣ لكل مادة).',
         'محفوظة لاستعمالها لاحقًا في المسابقة بين المدرستين. الإجابة الصحيحة مكتوبة بعد كل سؤال (✓)، وفي التحدّي تُخلط الخيارات عند العرض.', '',
         'المصدر البرمجي في مستودع GitHub (abdalhejji-hash/alhejji): `%sg%s_days.py`، ونسخة JSON في `%sg%s_bank.json`.' % (OUT.split('alhejji/')[1], g, OUT.split('alhejji/')[1], g), '']
    cur = None
    for d in days:
        wk = [w for w in WEEKS if w[1] <= d['date']][-1]
        if wk != cur:
            cur = wk; L += ['', '## ' + wk[0], '']
        y, m, dd = map(int, d['date'].split('-'))
        L += ['### ' + WD[date(y, m, dd).weekday()] + ' ' + AR(dd) + ' ' + MN[m], '']
        for s in ['ar', 'ma', 'sc', 'is']:
            qs = [q for q in d['q'] if q['s'] == s]
            L.append('**' + SN[s] + ' — ' + qs[0]['t'] + '**')
            for i, q in enumerate(qs, 1):
                L.append(AR(i) + '. ' + q['stem'].replace('\n', ' — '))
                L.append('   الخيارات: ' + ' | '.join(q['opts']) + '  ✓ ' + q['opts'][q['ans']])
            L.append('')
    open(OUT + 'بنك_أسئلة_الصف_%s.md' % name, 'w').write('\n'.join(L))
    print(g, len(L))
