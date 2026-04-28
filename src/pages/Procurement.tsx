import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, ExternalLink, FileText, Download,
  CheckCircle, Phone, User, ShieldCheck
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const principles = [
  'информационная открытость закупки',
  'равноправие, справедливость, отсутствие дискриминации и необоснованного ограничения конкуренции по отношению к участникам закупок',
  'организация эффективной закупочной деятельности, оптимальное использование имеющихся финансовых и трудовых ресурсов заказчика',
  'целевое и экономически эффективное расходование денежных средств на приобретение товаров, работ, услуг (с учетом жизненного цикла закупаемой продукции) и реализация мер, направленных на сокращение издержек заказчика',
  'отсутствие ограничения допуска к участию в закупке путем установления неизмеримых требований к участникам закупки',
];

const documents = [
  { title: 'Положение о закупках товаров работ услуг АО «Москоллектор» утв. Советом директоров № 84 от 18.12.2025', file: '/docs/polozhenie-o-zakupkah.docx' },
  { title: 'Перечень товаров, работ, услуг, закупки которых осуществляются у субъектов малого и среднего предпринимательства', file: '/docs/perechen-zakupok-smsp.xlsx' },
];

export default function Procurement() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#0a1628]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#0a1628] font-medium">Закупки</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
              Закупки
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-white/80 max-w-3xl">
              Информация о закупочной деятельности АО «Москоллектор»
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Section 1: Общие сведения о закупках */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
            <div className="accent-bar" />
            <h2 className="text-xl font-bold font-heading text-[#0a1628]">Общие сведения о закупках</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="card-modern p-6 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
              <ExternalLink className="w-6 h-6 text-sky-600" />
            </div>
            <p className="text-gray-700 leading-relaxed">
              Уважаемые участники закупочных процедур! Информируем Вас, что сведения о проводимых закупочных процедурах АО «Москоллектор» размещены на сайте Единой информационной системы{' '}
              <a
                href="https://zakupki.gov.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-600 font-medium hover:underline"
              >
                https://zakupki.gov.ru
                <ExternalLink className="w-4 h-4" />
              </a>
            </p>
          </motion.div>

          {/* Принципы закупочной деятельности */}
          <motion.div variants={fadeInUp} className="card-modern p-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-lg font-bold font-heading text-[#0a1628] mb-3">
              Принципы закупочной деятельности АО «Москоллектор»
            </h3>
            <p className="text-gray-700 leading-relaxed mb-5">
              В АО «Москоллектор» действует система закупок товаров, работ и услуг, обеспечивающая прозрачность закупочной деятельности, конкурентность процедур и эффективное целевое расходование средств.
            </p>
            <ul className="space-y-3">
              {principles.map((principle, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{principle}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* Section 2: Регламентирующие документы */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
            <div className="accent-bar" />
            <h2 className="text-xl font-bold font-heading text-[#0a1628]">Регламентирующие документы</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-4 mb-8">
            {documents.map((doc, idx) => (
              <a key={idx} href={doc.file} download className="card-modern p-5 flex items-start gap-4 hover:shadow-md transition-shadow group block">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                  <FileText className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-700 font-medium group-hover:text-sky-700 transition-colors">{doc.title}</span>
                  <p className="text-sm text-sky-600 mt-1 flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Скачать документ
                  </p>
                </div>
              </a>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="card-modern p-6">
            <p className="text-gray-700 leading-relaxed">
              Отдел организации закупок обеспечивает проведение в соответствии с действующим законодательством РФ закупочных процедур на поставку товаров, выполнение работ и оказание услуг для нужд Общества за счет собственных средств и по инвестиционной программе АО «Москоллектор» по строительству кабельных коллекторов. Разрабатывает стратегию и политику Общества в области закупочной деятельности. Осуществляет контроль за проведением закупочной деятельности Общества в соответствии с Положением о закупках товаров, работ и услуг для нужд АО «Москоллектор» и организует работу комиссий по проведению закупок.
            </p>
          </motion.div>
        </motion.section>

        {/* Section 3: Контакты */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
            <div className="accent-bar" />
            <h2 className="text-xl font-bold font-heading text-[#0a1628]">Контакты</h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="card-modern p-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-lg font-bold font-heading text-[#0a1628] mb-4">Отдел организации закупок</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-sky-600 shrink-0" />
                <p>
                  <span className="font-medium text-[#0a1628]">Начальник отдела:</span> Титов Сергей Николаевич
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-600 shrink-0" />
                <p>
                  <span className="font-medium text-[#0a1628]">Тел.:</span> +7 (499) 222-22-01 доб. 2222
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

      </div>
    </div>
  );
}
