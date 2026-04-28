import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function ReceptionHours() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="accent-bar mb-6" />
          <h1 className="font-heading">Дни и часы приёма</h1>
          <p>Информация о графике работы АО «Москоллектор»</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="card-modern rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-sky-600" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-[#0a1628]">График работы</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-[#0a1628]">Понедельник — Четверг</span>
                <span className="text-sky-600 font-bold text-lg">8:00 — 17:00</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-[#0a1628]">Пятница</span>
                <span className="text-sky-600 font-bold text-lg">8:00 — 15:45</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="font-medium text-amber-800">Обеденный перерыв</span>
                <span className="text-amber-700 font-bold text-lg">12:00 — 12:45</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <span className="font-medium text-gray-500">Суббота, Воскресенье</span>
                <span className="text-gray-400 font-bold">Выходные дни</span>
              </div>
            </div>
          </div>

          <div className="card-modern rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-sky-600" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-[#0a1628]">Адрес приёма документов</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-[#0a1628] mb-1">Центр обслуживания потребителей (ЦОП)</p>
                <p className="text-gray-600">г. Москва, ул. Лобачика, д. 4</p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4 text-sky-500" />
                  <a href="tel:+74992222201" className="text-sky-600 hover:text-sky-500">+7 (499) 222-22-01 (доб. 2403)</a>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-sky-500" />
                  <a href="mailto:tsop@moscollector.ru" className="text-sky-600 hover:text-sky-500">tsop@moscollector.ru</a>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-[#0a1628] mb-1">Канцелярия</p>
                <p className="text-gray-600">129090, Москва, 1-й Коптельский пер., д. 16, стр. 4</p>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4 text-sky-500" />
                  <a href="tel:+74992222201" className="text-sky-600 hover:text-sky-500">+7 (499) 222-22-01</a>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-sky-500" />
                  <a href="mailto:kancler@moscollector.ru" className="text-sky-600 hover:text-sky-500">kancler@moscollector.ru</a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800 text-sm">
              <strong>Примечание:</strong> Документация, поступившая в Канцелярию и ЦОП АО «Москоллектор» в понедельник-четверг после 16:00, в пятницу после 15:00, регистрируется с указанием даты следующего рабочего дня.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
