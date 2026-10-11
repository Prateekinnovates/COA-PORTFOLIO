import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Landing     = lazy(() => import('./pages/Landing'));
const Home        = lazy(() => import('./pages/Home'));
const About       = lazy(() => import('./pages/About'));
const Achievements = lazy(() => import('./pages/Achievements'));
const COALab      = lazy(() => import('./pages/COALab'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-base-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-base-500">Loading…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base-950">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"             element={<Landing />} />
            <Route path="/home"         element={<Home />} />
            <Route path="/about"        element={<About />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/lab"          element={<COALab />} />
            <Route path="/lab/:tool"    element={<COALab />} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
