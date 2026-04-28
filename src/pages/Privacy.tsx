export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Политика в отношении обработки и защиты персональных данных</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card-modern p-8 md:p-12">
          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">1. Общие положения</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Настоящая Политика в отношении обработки и защиты персональных данных (далее — Политика)
                разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ
                «О персональных данных» и определяет порядок обработки персональных данных
                и меры по обеспечению безопасности персональных данных в АО «Москоллектор».
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">2. Цели обработки персональных данных</h2>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                АО «Москоллектор» обрабатывает персональные данные в следующих целях:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Исполнение договорных обязательств</li>
                <li>Оказание услуг потребителям</li>
                <li>Кадровое администрирование</li>
                <li>Взаимодействие с контрагентами</li>
                <li>Соблюдение требований законодательства</li>
              </ul>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">3. Правовые основания обработки</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Обработка персональных данных осуществляется на основании согласия субъекта
                персональных данных, а также в случаях, предусмотренных законодательством
                Российской Федерации.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">4. Права субъектов персональных данных</h2>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Субъекты персональных данных имеют право:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Получать информацию об обработке своих персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения персональных данных</li>
                <li>Отзывать согласие на обработку персональных данных</li>
                <li>Обжаловать действия или бездействие оператора</li>
              </ul>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">5. Меры по обеспечению безопасности</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                АО «Москоллектор» принимает необходимые организационные и технические меры
                для защиты персональных данных от неправомерного или случайного доступа,
                уничтожения, изменения, блокирования, копирования, распространения,
                а также от иных неправомерных действий.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="accent-bar" />
                <h2 className="text-2xl font-bold font-heading text-[#0a1628]">6. Контактная информация</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                По всем вопросам, связанным с обработкой персональных данных,
                обращайтесь по адресу: 129090, г. Москва, 1-й Коптельский пер., д. 16, стр. 4
                или по электронной почте:{' '}
                <a href="mailto:privacy@moscollector.ru" className="text-sky-600 hover:underline font-medium">
                  privacy@moscollector.ru
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
