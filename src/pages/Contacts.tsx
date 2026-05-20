import { useState, useRef } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Building2,
  ChevronDown,
  ChevronUp,
  Users,
  Wrench,
  FileText,
  Globe,
  Info,
  Hash,
} from 'lucide-react';
import { contacts } from '@/lib/content';

/* ------------------------------------------------------------------ */
/*  Section 1 data — берётся из content/contacts.yml (CMS)             */
/* ------------------------------------------------------------------ */

const mainContacts = [
  {
    icon: MapPin,
    title: 'Юридический адрес / Главный офис',
    content: contacts.mainAddress,
  },
  {
    icon: Clock,
    title: 'Дни и часы приёма',
    lines: contacts.receptionHours,
  },
  {
    icon: Phone,
    title: 'Единый номер',
    content: contacts.mainPhone,
    link: 'tel:' + contacts.mainPhone.replace(/[^+\d]/g, ''),
    linkText: 'Позвонить',
  },
  {
    icon: Mail,
    title: 'Канцелярия',
    content: contacts.mainPhone,
    subContent: contacts.chancelleryEmail,
    link: 'mailto:' + contacts.chancelleryEmail,
    linkText: 'Написать',
  },
  {
    icon: Users,
    title: 'Центр обслуживания потребителей',
    lines: [contacts.tsop.address, contacts.tsop.phone, contacts.tsop.email],
    link: 'mailto:' + contacts.tsop.email,
    linkText: 'Написать',
  },
  {
    icon: Building2,
    title: 'Бюро пропусков',
    lines: [contacts.passOffice.address, contacts.passOffice.phone],
  },
];

const socialLinks = contacts.socialLinks;

const requisites = [
  { label: 'ИНН', value: contacts.requisites.inn },
  { label: 'КПП', value: contacts.requisites.kpp },
  { label: 'ОКПО', value: contacts.requisites.okpo },
  { label: 'ОГРН', value: contacts.requisites.ogrn },
  { label: 'Адрес', value: contacts.requisites.legalAddress },
];

/* ------------------------------------------------------------------ */
/*  Section 2 — РЭК и СУЭКК (из CMS)                                   */
/* ------------------------------------------------------------------ */

const productionUnits = contacts.productionUnits;


/* ------------------------------------------------------------------ */
/*  Section 3 data                                                     */
/* ------------------------------------------------------------------ */

const specializedServices = contacts.specializedServices;

/* ------------------------------------------------------------------ */
/*  Collapsible section wrapper                                        */
/* ------------------------------------------------------------------ */

function Section({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const willOpen = !open;
    if (willOpen && ref.current) {
      setOpen(true);
      setTimeout(() => {
        if (ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    } else {
      setOpen(willOpen);
    }
  };

  return (
    <div ref={ref} className="card-modern rounded-2xl overflow-hidden scroll-mt-24">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-6 lg:p-8 text-left hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="font-heading text-xl lg:text-2xl font-bold text-[#0a1628]">
            {title}
          </h2>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>
      {open && <div className="px-6 lg:px-8 pb-8">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function Contacts() {
  return (
    <div className="min-h-screen bg-slate-50/60">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl font-bold text-white mb-4 tracking-tight">
            Контакты
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Контактная информация АО «Москоллектор», производственных подразделений и специализированных служб
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* ============================================================ */}
        {/*  SECTION 1 — Контакты АО «Москоллектор»                      */}
        {/* ============================================================ */}
        <Section title='Контакты АО «Москоллектор»' icon={Building2}>
          {/* Contact cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mainContacts.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-4">
                  <item.icon className="w-4.5 h-4.5 text-sky-600" />
                </div>
                <h3 className="font-heading font-semibold text-[#0a1628] mb-2 text-sm">
                  {item.title}
                </h3>
                {item.content && (
                  <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                )}
                {item.subContent && (
                  <p className="text-slate-500 text-sm mt-1">{item.subContent}</p>
                )}
                {item.lines &&
                  item.lines.map((line) => (
                    <p key={line} className="text-slate-600 text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                {item.link && (
                  <a
                    href={item.link}
                    target={item.link.startsWith('http') ? '_blank' : undefined}
                    rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors mt-3"
                  >
                    {item.linkText}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <Globe className="w-4 h-4 text-sky-600" />
              </div>
              <h3 className="font-heading font-semibold text-[#0a1628]">Социальные сети</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-5 py-2.5 text-sm font-medium text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  {s.name}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Notice */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">
                Документация, поступившая в Канцелярию и ЦОП АО «Москоллектор» в понедельник-четверг
                после 16:00, в пятницу после 15:00, регистрируется с указанием даты следующего
                рабочего дня.
              </p>
            </div>
          </div>

          {/* Requisites */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <Hash className="w-4 h-4 text-sky-600" />
              </div>
              <h3 className="font-heading font-semibold text-[#0a1628]">Реквизиты</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {requisites.map((r) => (
                <div key={r.label} className="flex gap-2 text-sm">
                  <span className="text-slate-400 font-medium shrink-0">{r.label}:</span>
                  <span className="text-slate-700 font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  SECTION 2 — Производственные подразделения                   */}
        {/* ============================================================ */}
        <Section title="Производственные подразделения" icon={Wrench} defaultOpen={false}>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {productionUnits.map((unit) => (
              <div
                key={unit.name}
                className="rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-md transition-shadow duration-300"
              >
                <h4 className="font-heading font-bold text-[#0a1628] mb-3">{unit.name}</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    {unit.address}
                  </p>
                  {unit.phones && unit.phones.length > 0 && (
                    <p className="flex items-start gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      {unit.phones.join(', ')}
                    </p>
                  )}
                  {unit.head && (
                    <p className="flex items-start gap-2 text-slate-600">
                      <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <span className="text-slate-400">Начальник:</span> {unit.head}
                        {unit.ext && (
                          <span className="text-slate-400 ml-1">(доб. {unit.ext})</span>
                        )}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dispatch & operations */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h4 className="font-heading font-bold text-[#0a1628] mb-2">
                Центральная диспетчерская
              </h4>
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                +7 (499) 738-01-91
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h4 className="font-heading font-bold text-[#0a1628] mb-2">
                Отдел эксплуатации
              </h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  г. Москва, ул. Лобачика, д. 4
                </p>
                <p className="flex items-start gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  +7 (499) 222-22-01 доб. 1720, 1730, 1703, 1733
                </p>
                <p className="flex items-start gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <span className="text-slate-400">Начальник:</span> Воронин Александр Михайлович
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  SECTION 3 — Специализированные службы                       */}
        {/* ============================================================ */}
        <Section title="Специализированные службы" icon={FileText} defaultOpen={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 pr-4 font-semibold text-[#0a1628]">Подразделение</th>
                  <th className="py-3 pr-4 font-semibold text-[#0a1628] hidden sm:table-cell">
                    Адрес
                  </th>
                  <th className="py-3 pr-4 font-semibold text-[#0a1628]">Руководитель</th>
                  <th className="py-3 font-semibold text-[#0a1628] text-right">Доб.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {specializedServices.map((svc) => (
                  <tr key={svc.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4 font-medium text-[#0a1628] align-top">
                      {svc.name}
                      {svc.phone && (
                        <span className="block text-xs text-slate-400 mt-0.5 font-normal">
                          {svc.phone}
                        </span>
                      )}
                      {/* address on mobile */}
                      <span className="block text-xs text-slate-400 mt-0.5 font-normal sm:hidden">
                        {svc.address}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-500 hidden sm:table-cell align-top">
                      {svc.address}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600 align-top">
                      {svc.head ? (
                        <>
                          <span className="text-slate-400 text-xs">
                            {svc.headTitle ?? 'Начальник'}
                          </span>
                          <br />
                          {svc.head}
                        </>
                      ) : (
                        <span className="text-slate-300">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right text-slate-600 tabular-nums align-top whitespace-nowrap">
                      {svc.headExt ? (
                        <>
                          <span className="text-slate-400 text-xs block">{svc.ext}</span>
                          {svc.headExt}
                        </>
                      ) : svc.ext ? (
                        svc.ext
                      ) : (
                        <span className="text-slate-300">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Map */}
        <div className="mt-6">
          <div className="relative h-96 rounded-3xl overflow-hidden bg-slate-100 shadow-lg ring-1 ring-black/5">
            <iframe
              title="Карта: АО «Москоллектор»"
              src="https://yandex.ru/map-widget/v1/?ll=37.643500%2C55.780480&z=17&mode=search&text=Москва%2C%201-й%20Коптельский%20пер.%2C%2016%20стр.%204&pt=37.643500%2C55.780480%2Cpm2rdm"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
