import { Fragment, useState, useRef } from 'react';
import { Calculator as CalculatorIcon, Plus, Trash2, Info, FileText, FileSpreadsheet, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ================================================================== */
/* Tariff data — per km/year BEFORE VAT                                */
/* Источник: приказ АО «Москоллектор» от 17.12.2025 № 612 (тарифы на   */
/* техническую эксплуатацию на 2026 год) и приказ от 22.01.2026 № 12   */
/* (цены на дополнительные услуги, действуют с 22.01.2026).            */
/* ================================================================== */

const VAT = 1.22; // НДС 22%

/* Кабель связи */
const CABLE_COMM: Record<string, Record<string, number>> = {
  'ВОЛС':           { 'Общегородской': 269730, 'Внутриквартальный': 303115 },
  'Прочие кабели':  { 'Общегородской': 89900,  'Внутриквартальный': 101039 },
};

/* Силовой кабель — Общегородской */
const POWER_OGK: Record<string, number> = {
  'до 20 кВ включительно (с изоляцией из сшитого полиэтилена)': 444066,
  'до 20 кВ включительно (кроме кабеля с изоляцией из сшитого полиэтилена)': 177626,
  'от 20 до 110 кВ включительно (с изоляцией из сшитого полиэтилена)': 617481,
  'от 20 до 110 кВ включительно (кроме кабеля с изоляцией из сшитого полиэтилена)': 246990,
  'от 110 кВ включительно': 1417446,
};
/* Силовой кабель — Внутриквартальный (единый тариф) */
const POWER_VKK = 153298;

/* Трубопровод — Водопровод ОГК */
const WATER_OGK: Record<string, number> = {
  'до 200 мм': 1031410,
  'от 200 мм до 300 мм': 1194264,
  'от 300 мм до 400 мм': 1357116,
  'от 400 мм до 500 мм': 1533548,
  'от 500 мм до 600 мм': 1764256,
  'от 600 мм до 700 мм': 1940680,
  'от 700 мм до 800 мм': 2103530,
  'от 800 мм до 900 мм': 2497095,
  'от 900 мм до 1000 мм': 2687089,
  'от 1000 мм до 1200 мм': 2877083,
};

/* Трубопровод — Теплосеть ОГК */
const HEAT_OGK: Record<string, number> = {
  'до 300 мм': 2086569,
  'от 300 мм до 400 мм': 3338511,
  'от 400 мм до 500 мм': 4799108,
  'от 500 мм до 600 мм': 5007762,
  'от 600 мм до 700 мм': 6955229,
  'от 700 мм до 800 мм': 7372536,
  'от 800 мм до 900 мм': 9407682,
  'от 900 мм до 1000 мм': 11823889,
  'от 1000 мм до 1200 мм': 13214932,
};

/* Трубопровод — ВКК */
const PIPE_VKK: Record<string, number> = {
  'ГВС': 1393614,
  'ХВС': 1319446,
  'Теплосеть': 1742031,
};

/* Аппаратура */
const EQUIP_TARIFF = 7208; // руб/ед/год

/* ================================================================== */
/* Types                                                               */
/* ================================================================== */

interface Row {
  id: number;
  vid: string;       // Кабель связи | Силовой кабель | Трубопровод | Аппаратура
  collector: string;  // Общегородской | Внутриквартальный
  subType: string;    // ВОЛС | Прочие кабели | вид силового | вид трубопровода
  diameter: string;   // диаметр (только для труб ОГК)
  length: string;     // протяжённость п.м. или кол-во для аппаратуры
}

interface Computed extends Row {
  tariff: number;
  monthly: number;
  annual: number;
  collectorShort: string;
}

/* ================================================================== */
/* Calculation — exact formula from moscollector.ru                    */
/* ================================================================== */

function getTariff(r: Row): number {
  if (r.vid === 'Кабель связи') {
    return CABLE_COMM[r.subType]?.[r.collector] ?? 0;
  }
  if (r.vid === 'Силовой кабель') {
    if (r.collector === 'Внутриквартальный') return POWER_VKK;
    return POWER_OGK[r.subType] ?? 0;
  }
  if (r.vid === 'Трубопровод') {
    if (r.collector === 'Внутриквартальный') return PIPE_VKK[r.subType] ?? 0;
    const list = r.subType === 'Водопровод' ? WATER_OGK : r.subType === 'Теплосеть' ? HEAT_OGK : {};
    return list[r.diameter] ?? 0;
  }
  if (r.vid === 'Аппаратура') return EQUIP_TARIFF;
  return 0;
}

function calc(r: Row): Computed {
  const tariff = getTariff(r);
  const qty = parseFloat(r.length) || 0;
  if (!tariff || !qty) return { ...r, tariff, monthly: 0, annual: 0, collectorShort: '' };

  const base = r.vid === 'Аппаратура' ? tariff * qty : tariff * (qty / 1000);
  const monthly = Math.round(base * VAT / 12 * 100) / 100;
  const annual = Math.round(monthly * 12 * 100) / 100;
  const collectorShort = r.collector === 'Общегородской' ? 'ОГК' : r.collector === 'Внутриквартальный' ? 'ВКК' : '';

  return { ...r, tariff, monthly, annual, collectorShort };
}

/* Человекочитаемое название коммуникации (для таблицы и экспорта) */
function commName(r: Computed): string {
  if (r.vid === 'Кабель связи') return r.subType;
  if (r.vid === 'Силовой кабель') return r.collector === 'Внутриквартальный' ? 'Силовой кабель' : r.subType;
  if (r.vid === 'Трубопровод') return `${r.subType}${r.diameter ? ' (' + r.diameter + ')' : ''}`;
  return 'НРПК (аппаратура)';
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/* ================================================================== */
/* Formatting                                                          */
/* ================================================================== */

const fmt2 = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtI = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

/* ================================================================== */
/* Custom native select (matches moscollector style)                   */
/* ================================================================== */

function NativeSelect({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-[#0a1628] text-sm
                 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20
                 appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
    >
      {/* Подсказка видна только в свёрнутом поле; в раскрытом списке — только варианты выбора */}
      <option value="" disabled hidden>{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

/* ================================================================== */
/* Form for one line item                                              */
/* ================================================================== */

function LineForm({ row, onChange, onRemove, idx }: {
  row: Row; onChange: (r: Row) => void; onRemove: () => void; idx: number;
}) {
  const set = (patch: Partial<Row>) => onChange({ ...row, ...patch });

  /* Dynamic options based on selections */
  const showCollector = row.vid === 'Кабель связи' || row.vid === 'Силовой кабель' || row.vid === 'Трубопровод';

  // Кабель связи → подтип всегда
  const showCableSubType = row.vid === 'Кабель связи';
  // Силовой кабель → подтип только ОГК
  const showPowerSubType = row.vid === 'Силовой кабель' && row.collector === 'Общегородской';
  // Трубопровод → вид трубопровода
  const showPipeSubType = row.vid === 'Трубопровод' && !!row.collector;
  // Трубопровод ОГК → диаметр
  const showDiameter = row.vid === 'Трубопровод' && row.collector === 'Общегородской' && (row.subType === 'Водопровод' || row.subType === 'Теплосеть');

  const isEquip = row.vid === 'Аппаратура';

  // Pipe sub-type options depend on collector
  const pipeOptions = row.collector === 'Общегородской'
    ? ['Водопровод', 'Теплосеть']
    : ['ГВС', 'ХВС', 'Теплосеть'];

  const diameterOptions = row.subType === 'Водопровод' ? Object.keys(WATER_OGK) : row.subType === 'Теплосеть' ? Object.keys(HEAT_OGK) : [];

  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-semibold text-sky-600">Коммуникация {idx + 1}</span>
        <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Удалить коммуникацию">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Вид коммуникации */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0a1628]">Вид коммуникации</label>
          <NativeSelect
            value={row.vid}
            placeholder="Выберите вид"
            options={['Кабель связи', 'Силовой кабель', 'Трубопровод', 'Аппаратура']}
            onChange={(v) => set({ vid: v, collector: '', subType: '', diameter: '', length: '' })}
          />
        </div>

        {/* Вид коллектора */}
        {showCollector && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0a1628]">Тип коллектора</label>
            <NativeSelect
              value={row.collector}
              placeholder="Выберите коллектор"
              options={['Общегородской', 'Внутриквартальный']}
              onChange={(v) => set({ collector: v, subType: '', diameter: '' })}
            />
          </div>
        )}

        {/* Кабель связи → вид кабеля */}
        {showCableSubType && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0a1628]">Вид кабеля связи</label>
            <NativeSelect
              value={row.subType}
              placeholder="Выберите вид кабеля"
              options={['ВОЛС', 'Прочие кабели']}
              onChange={(v) => set({ subType: v })}
            />
          </div>
        )}

        {/* Силовой кабель ОГК → вид силового кабеля */}
        {showPowerSubType && (
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium text-[#0a1628]">Вид силового кабеля</label>
            <NativeSelect
              value={row.subType}
              placeholder="Выберите вид кабеля"
              options={Object.keys(POWER_OGK)}
              onChange={(v) => set({ subType: v })}
            />
          </div>
        )}

        {/* Трубопровод → вид трубопровода */}
        {showPipeSubType && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0a1628]">Вид трубопровода</label>
            <NativeSelect
              value={row.subType}
              placeholder="Выберите вид"
              options={pipeOptions}
              onChange={(v) => set({ subType: v, diameter: '' })}
            />
          </div>
        )}

        {/* Диаметр трубопровода (только ОГК) */}
        {showDiameter && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#0a1628]">Диаметр трубопровода</label>
            <NativeSelect
              value={row.diameter}
              placeholder="Выберите диаметр"
              options={diameterOptions}
              onChange={(v) => set({ diameter: v })}
            />
          </div>
        )}

        {/* Протяжённость / Количество */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0a1628]">
            {isEquip ? 'Количество единиц аппаратуры' : 'Протяженность, пог. м'}
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={isEquip ? 'Введите количество' : 'Введите протяженность'}
            value={row.length}
            onChange={(e) => {
              // Allow digits and a single decimal point (comma converted to dot)
              let v = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
              const firstDot = v.indexOf('.');
              if (firstDot !== -1) {
                v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
              }
              set({ length: v });
            }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-[#0a1628] text-sm
                       focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Main component                                                      */
/* ================================================================== */

let _nextId = 1;
const newRow = (): Row => ({ id: _nextId++, vid: '', collector: '', subType: '', diameter: '', length: '' });

export default function Calculator() {
  const [rows, setRows] = useState<Row[]>([newRow()]);
  const [results, setResults] = useState<Computed[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const addRow = () => { setRows([...rows, newRow()]); setResults(null); };
  const removeRow = (id: number) => { if (rows.length > 1) { setRows(rows.filter(r => r.id !== id)); setResults(null); } };
  const updateRow = (id: number, updated: Row) => { setRows(rows.map(r => r.id === id ? updated : r)); setResults(null); };

  const canCalc = rows.every((r) => {
    if (!r.vid || !r.length) return false;
    if (r.vid === 'Аппаратура') return true;
    if (!r.collector) return false;
    if (r.vid === 'Кабель связи' && !r.subType) return false;
    if (r.vid === 'Силовой кабель' && r.collector === 'Общегородской' && !r.subType) return false;
    if (r.vid === 'Трубопровод') {
      if (!r.subType) return false;
      if (r.collector === 'Общегородской' && !r.diameter) return false;
    }
    return true;
  });

  const doCalc = () => {
    const res = rows.map(calc);
    setResults(res);
    setTimeout(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const doReset = () => {
    _nextId = 1;
    setRows([newRow()]);
    setResults(null);
    setSelected(null);
  };

  const removeSelected = () => {
    if (selected === null) { alert('Вы не выбрали элемент'); return; }
    if (confirm('Вы уверены что хотите удалить элемент?')) {
      setRows(rows.filter(r => r.id !== selected));
      setSelected(null);
      // Recalculate with remaining rows
      const remaining = rows.filter(r => r.id !== selected);
      if (remaining.length > 0) {
        setResults(remaining.map(calc));
      } else {
        setResults(null);
      }
    }
  };

  const totalM = results ? results.reduce((s, r) => s + r.monthly, 0) : 0;
  const totalA = results ? results.reduce((s, r) => s + r.annual, 0) : 0;

  // Group results by vid
  const groups: Record<string, Computed[]> = {};
  results?.forEach((r) => {
    if (!groups[r.vid]) groups[r.vid] = [];
    groups[r.vid].push(r);
  });

  /* --- Экспорт в Excel (.xlsx) — печатная форма по образцу УРсП («Пример 1») --- */
  const exportExcel = async () => {
    if (!results || results.length === 0) return;
    const XLSX = await import('xlsx');
    const dateStr = new Date().toLocaleDateString('ru-RU');
    const aoa: (string | number)[][] = [];
    aoa.push(['Расчёт стоимости услуг по технической эксплуатации коллекторов АО «Москоллектор»']);
    aoa.push([`Дата расчёта: ${dateStr}`]);
    aoa.push([]);
    aoa.push(['Тип коммуникации', 'Протяженность, пог. м/ Количество, шт.', 'Тариф, руб./км в год *', 'Сумма ежемесячная, руб.**', 'Сумма ежегодная, руб.**']);
    Object.entries(groups).forEach(([vid, items]) => {
      aoa.push([vid]);
      items.forEach((r, i) => {
        const qty = r.length !== '' && !isNaN(Number(r.length)) ? Number(r.length) : r.length;
        aoa.push([`${i + 1}. ${r.collectorShort} ${commName(r)}`.trim(), qty, r.tariff, r.monthly, r.annual]);
      });
      const gM = round2(items.reduce((s, r) => s + r.monthly, 0));
      const gA = round2(items.reduce((s, r) => s + r.annual, 0));
      aoa.push(['Итого по коммуникации', '', '', gM, gA]);
    });
    aoa.push(['ИТОГО', '', '', round2(totalM), round2(totalA)]);
    aoa.push([]);
    aoa.push(['*Тарифы утверждены приказом АО «Москоллектор» от 17.12.2025 № 612 «О тарифах на услуги АО «Москоллектор» по технической эксплуатации коммуникационных коллекторов». Тарифы указаны без учета НДС;']);
    aoa.push(['** Сумма указана с учётом НДС 22%.']);

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    // Оформление под печать А4: ширины столбцов + объединение строк заголовка и сносок
    ws['!cols'] = [{ wch: 38 }, { wch: 16 }, { wch: 15 }, { wch: 16 }, { wch: 16 }];
    const lastRow = aoa.length - 1;
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },            // заголовок
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },            // дата
      { s: { r: lastRow - 1, c: 0 }, e: { r: lastRow - 1, c: 4 } }, // сноска *
      { s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 4 } },         // сноска **
    ];
    ws['!margins'] = { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Расчёт');
    XLSX.writeFile(wb, 'Расчет_стоимости_Москоллектор.xlsx');
  };

  /* --- Экспорт в PDF — чистая печатная форма (без стилей сайта) --- */
  const exportPDF = () => {
    if (!results || results.length === 0) return;
    const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const dateStr = new Date().toLocaleDateString('ru-RU');
    let body = '';
    Object.entries(groups).forEach(([vid, items]) => {
      body += `<tr class="grp"><td colspan="5">${esc(vid)}</td></tr>`;
      items.forEach((r, i) => {
        body += `<tr><td>${i + 1}. ${esc(r.collectorShort)} ${esc(commName(r))}</td>` +
          `<td class="c">${esc(r.length)}</td><td class="r">${fmtI(r.tariff)}</td>` +
          `<td class="r">${fmt2(r.monthly)}</td><td class="r">${fmt2(r.annual)}</td></tr>`;
      });
      const gM = items.reduce((s, r) => s + r.monthly, 0);
      const gA = items.reduce((s, r) => s + r.annual, 0);
      body += `<tr class="sub"><td colspan="3" class="r">Итого по коммуникации:</td><td class="r">${fmt2(gM)}</td><td class="r">${fmt2(gA)}</td></tr>`;
    });
    const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">` +
      `<title>Расчёт стоимости услуг — АО «Москоллектор»</title><style>` +
      `*{font-family:Arial,Helvetica,sans-serif;color:#000;box-sizing:border-box}` +
      `body{margin:22px}h1{font-size:14px;margin:0 0 3px;line-height:1.3}` +
      `.d{font-size:11px;color:#444;margin:0 0 16px}` +
      `table{width:100%;border-collapse:collapse;font-size:11px}` +
      `th,td{border:1px solid #555;padding:5px 7px;vertical-align:top}` +
      `th{background:#ececec;font-weight:bold;text-align:center}` +
      `td.r{text-align:right;white-space:nowrap}td.c{text-align:center}` +
      `tr.grp td{background:#f4f4f4;font-weight:bold}tr.sub td{font-weight:bold;background:#fafafa}` +
      `tfoot td{font-weight:bold;background:#e3e3e3}` +
      `.note{font-size:9.5px;color:#333;margin-top:12px;line-height:1.4}` +
      `@page{size:A4;margin:14mm}@media print{body{margin:0}}</style></head><body>` +
      `<h1>Расчёт стоимости услуг по технической эксплуатации коллекторов АО «Москоллектор»</h1>` +
      `<p class="d">Дата расчёта: ${dateStr}</p>` +
      `<table><thead><tr><th>Тип коммуникации</th><th>Протяженность, пог. м/ Количество, шт.</th><th>Тариф, руб./км в год *</th>` +
      `<th>Сумма ежемесячная, руб.**</th><th>Сумма ежегодная, руб.**</th></tr></thead>` +
      `<tbody>${body}</tbody>` +
      `<tfoot><tr><td colspan="3" class="r">ИТОГО:</td><td class="r">${fmt2(totalM)}</td><td class="r">${fmt2(totalA)}</td></tr></tfoot></table>` +
      `<p class="note">*Тарифы утверждены приказом АО «Москоллектор» от 17.12.2025 № 612 «О тарифах на услуги АО «Москоллектор» по технической эксплуатации коммуникационных коллекторов». Тарифы указаны без учета НДС;<br>** Сумма указана с учётом НДС 22%.</p>` +
      `</body></html>`;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) { alert('Не удалось открыть окно печати. Разрешите всплывающие окна для сохранения в PDF.'); return; }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Печать вызываем из родительского окна — не зависит от inline-скриптов/CSP попапа
    setTimeout(() => { try { w.focus(); w.print(); } catch { /* пользователь может напечатать вручную */ } }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="font-heading">Тарифный калькулятор</h1>
          <p>Расчёт стоимости услуг по технической эксплуатации коммуникационных коллекторов АО «Москоллектор»</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Form card */}
        <div className="card-modern rounded-2xl p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center">
              <CalculatorIcon className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-[#0a1628]">Расчёт стоимости</h2>
              <p className="text-sm text-slate-400 mt-0.5">Заполните все поля и нажмите «Рассчитать»</p>
            </div>
          </div>
          <div className="accent-bar mb-8" />

          <div className="space-y-5 mb-6">
            {rows.map((row, i) => (
              <LineForm key={row.id} row={row} idx={i}
                onChange={(u) => updateRow(row.id, u)}
                onRemove={() => removeRow(row.id)} />
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium mb-8 transition-colors"
          >
            <Plus className="w-4 h-4" /> Добавить коммуникацию
          </button>

          <div className="flex flex-wrap gap-3">
            <Button onClick={doCalc} disabled={!canCalc}
              className="bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white rounded-xl h-12 px-8 text-base font-semibold shadow-[0_8px_24px_-6px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:opacity-50 transition-all duration-300">
              Рассчитать
            </Button>
            <Button variant="outline" onClick={doReset}
              className="rounded-xl border-slate-200 text-slate-600 h-12 px-8">
              Создать новый расчёт
            </Button>
          </div>
        </div>

        {/* Results */}
        {results && results.length > 0 && (
          <div ref={tableRef} className="card-modern rounded-2xl p-8 lg:p-10 mt-8 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="font-heading text-xl font-bold text-[#0a1628]">
                Расчёт стоимости услуг по технической эксплуатации коллекторов АО «Москоллектор»
              </h2>
            </div>

            <div className="overflow-x-auto" id="calc-print-area">
              <table className="w-full text-sm border-collapse">
                <colgroup>
                  <col className="w-auto" />
                  <col className="w-[100px]" />
                  <col className="w-[120px]" />
                  <col className="w-[120px] sm:w-[130px]" />
                  <col className="w-[120px] sm:w-[130px]" />
                </colgroup>
                <thead>
                  <tr className="bg-[#0a1628] text-white text-xs">
                    <th rowSpan={2} className="px-3 py-3 text-left font-semibold rounded-tl-xl">Тип коммуникации</th>
                    <th rowSpan={2} className="px-2 py-3 font-semibold text-center">Протяженность, пог. м / Количество, шт.</th>
                    <th rowSpan={2} className="px-2 py-3 font-semibold text-center">Тариф, руб./км в год</th>
                    <th colSpan={2} className="px-2 py-2 font-semibold rounded-tr-xl text-center">Сумма оплаты, руб.</th>
                  </tr>
                  <tr className="bg-[#0a1628] text-white text-xs">
                    <th className="px-2 py-2 font-semibold text-center">Ежемесячная</th>
                    <th className="px-2 py-2 font-semibold text-center">Ежегодная</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groups).map(([vid, items]) => {
                    const groupM = items.reduce((s, r) => s + r.monthly, 0);
                    const groupA = items.reduce((s, r) => s + r.annual, 0);
                    return (
                      <Fragment key={vid}>
                        {/* Group header */}
                        <tr className="bg-slate-100 border-y border-slate-200">
                          <td className="px-3 py-2.5" colSpan={5}>
                            <span className="font-semibold text-[#0a1628]">{vid}</span>
                          </td>
                        </tr>
                        {/* Line items */}
                        {items.map((r, ri) => (
                          <tr
                            key={r.id}
                            onClick={() => setSelected(selected === r.id ? null : r.id)}
                            className={`border-b border-slate-100 cursor-pointer transition-colors
                              ${selected === r.id ? 'bg-sky-50 ring-1 ring-sky-300' : ri % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-50'}`}
                          >
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                <span className="text-slate-400 flex-shrink-0">{ri + 1}</span>
                                <span className="font-medium text-sky-600 flex-shrink-0">{r.collectorShort}</span>
                                <span className="text-[#0a1628] truncate">
                                  {r.vid === 'Кабель связи' ? r.subType
                                    : r.vid === 'Силовой кабель' ? (r.collector === 'Внутриквартальный' ? 'Силовой кабель' : r.subType)
                                    : r.vid === 'Трубопровод' ? `${r.subType}${r.diameter ? ' (' + r.diameter + ')' : ''}`
                                    : 'НРПК'}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 py-3 text-center tabular-nums text-xs sm:text-sm text-slate-600">{r.length}</td>
                            <td className="px-2 py-3 text-right tabular-nums text-xs sm:text-sm text-slate-600">{fmtI(r.tariff)}</td>
                            <td className="px-2 py-3 text-right tabular-nums font-medium text-xs sm:text-sm">{fmt2(r.monthly)}</td>
                            <td className="px-2 py-3 text-right tabular-nums font-medium text-xs sm:text-sm">{fmt2(r.annual)}</td>
                          </tr>
                        ))}
                        {/* Group subtotal */}
                        <tr className="bg-slate-100 border-y border-slate-200">
                          <td className="px-3 py-2.5 text-right font-semibold text-[#0a1628] text-xs" colSpan={3}>Итого по коммуникации:</td>
                          <td className="px-2 py-2.5 text-right tabular-nums font-semibold text-sm">{fmt2(groupM)}</td>
                          <td className="px-2 py-2.5 text-right tabular-nums font-semibold text-sm">{fmt2(groupA)}</td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#0a1628] text-white font-bold text-base">
                    <td className="px-3 py-4 text-right rounded-bl-xl" colSpan={3}>ИТОГО:</td>
                    <td className="px-2 py-4 text-right tabular-nums">{fmt2(totalM)}</td>
                    <td className="px-2 py-4 text-right tabular-nums rounded-br-xl">{fmt2(totalA)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-sm text-slate-400 mt-4 text-right">
              Сумма указана с учётом НДС 22%;<br />
              Тариф указан без учета НДС.
            </p>

            {/* Action buttons — like moscollector.ru */}
            <div className="flex flex-wrap gap-3 mt-6 print:hidden">
              <Button variant="outline" onClick={addRow}
                className="rounded-xl border-sky-200 text-sky-600 hover:bg-sky-50">
                <Plus className="w-4 h-4 mr-2" /> Добавить коммуникацию
              </Button>
              <Button variant="outline" onClick={removeSelected}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                <Trash2 className="w-4 h-4 mr-2" /> Удалить коммуникацию
              </Button>
              <Button variant="outline" onClick={exportExcel}
                className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Сохранить в Excel
              </Button>
              <Button variant="outline" onClick={exportPDF}
                className="rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50">
                <FileDown className="w-4 h-4 mr-2" /> Сохранить в PDF
              </Button>
              <Button variant="outline" onClick={doReset}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 ml-auto">
                Создать новый расчёт
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-10 bg-amber-50 border border-amber-200/80 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-amber-800 mb-2">Важная информация</h3>
              <p className="text-amber-700 text-sm leading-relaxed mb-3">
                Расчёт выполняется по тарифам, утверждённым{' '}
                <strong>приказом АО «Москоллектор» от 17.12.2025 № 612</strong>{' '}
                «О тарифах на услуги АО «Москоллектор» по технической эксплуатации коммуникационных коллекторов».
              </p>
              <p className="text-amber-700 text-sm leading-relaxed">
                Калькулятор позволяет получить предварительную стоимость услуг. Окончательная стоимость услуг
                рассчитывается при заключении договора на услуги по технической эксплуатации коллекторов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
