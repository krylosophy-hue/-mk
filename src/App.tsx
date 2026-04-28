import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './Layout';

// Eager load — Home is always the landing page
import Home from './pages/Home';

// Lazy load all other pages — splits JS bundle into per-route chunks
const About = lazy(() => import('./pages/About'));
const Shareholders = lazy(() => import('./pages/Shareholders'));
const Consumers = lazy(() => import('./pages/Consumers'));
const ConsumerNews = lazy(() => import('./pages/ConsumerNews'));
const Info = lazy(() => import('./pages/Info'));
const Press = lazy(() => import('./pages/Press'));
const Procurement = lazy(() => import('./pages/Procurement'));
const Vacancies = lazy(() => import('./pages/Vacancies'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Social = lazy(() => import('./pages/Social'));
const Union = lazy(() => import('./pages/Union'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Status = lazy(() => import('./pages/Status'));
const ReceptionHours = lazy(() => import('./pages/ReceptionHours'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="shareholders" element={<Shareholders />} />
            <Route path="consumers" element={<Consumers />} />
            <Route path="consumer-news" element={<ConsumerNews />} />
            <Route path="info" element={<Info />} />
            <Route path="press" element={<Press />} />
            <Route path="procurement" element={<Procurement />} />
            <Route path="vacancies" element={<Vacancies />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="social" element={<Social />} />
            <Route path="union" element={<Union />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="status" element={<Status />} />
            {/* Additional info pages */}
            <Route path="anticorruption" element={<Info />} />
            <Route path="antiterror" element={<Info />} />
            <Route path="revocation" element={<Info />} />
            <Route path="tech-info" element={<Info />} />
            {/* Consumer pages */}
            <Route path="contract-forms" element={<Consumers />} />
            <Route path="reception-hours" element={<ReceptionHours />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
