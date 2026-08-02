import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Skills } from './components/Skills';
import { Testimonials } from './components/Testimonials';
import { Certifications } from './components/Certifications';
import { CareerObjective } from './components/CareerObjective';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Background } from './components/Background';
import { BackToTop } from './components/BackToTop';
import { ScrollProgress } from './components/ScrollProgress';
import { motion } from 'motion/react';
import { useState, useEffect, lazy, Suspense } from 'react';

// Lazy-loaded: this component pulls in @google/genai and html2pdf.js, which
// are large libraries only needed when someone actually opens the CV builder.
// Splitting it out keeps the initial page load fast.
const CVGenerator = lazy(() =>
  import('./components/CVGenerator').then((m) => ({ default: m.CVGenerator }))
);

export default function App() {
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Fallback default
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white dark:bg-zinc-950">
      <ScrollProgress />
      <BackToTop />
      <Background />

      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero onGenerateCV={() => setIsCVOpen(true)} />
        <About />
        <Experience />
        <Projects />
        <Services />
        <Education />
        <Skills />
        <Testimonials />
        <Certifications />
        <CareerObjective />
        <Contact />
      </main>
      <Footer onGenerateCV={() => setIsCVOpen(true)} />

      {isCVOpen && (
        <Suspense fallback={null}>
          <CVGenerator isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
