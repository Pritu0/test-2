import { motion } from 'motion/react';
import { Server, Network, Cpu, ShieldCheck, Globe, Database, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Hero({ onGenerateCV }: { onGenerateCV: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-16 md:pt-20 px-6 overflow-hidden bg-white dark:bg-zinc-950">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-white dark:bg-zinc-950" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 md:space-y-8 text-left">
          <div className="space-y-3 md:space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-7xl font-black tracking-tight leading-[1.05]"
            >
              <span className="text-zinc-900 dark:text-white">Eng. Inas Bin </span>
              <br />
              <span className="gradient-text">Yousuf</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-3"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-200">
                IT Systems & Infrastructure Engineer
              </h2>
              <div className="flex flex-wrap gap-2">
                {['Jr. Executive', 'Network Infrastructure', 'Solution Architect'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-100 dark:border-indigo-800">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed"
          >
            A dedicated Computer Science Engineering graduate with a deep passion for building and optimizing IT systems. I specialize in hardware infrastructure and network configuration, bringing hands-on expertise to deliver secure, scalable, and high-performance technology solutions for modern business needs.
          </motion.p>


        </div>

        {/* Right Content - Abstract IT Elements */}
        <div className="relative flex items-center justify-center h-[400px] lg:h-[600px]">
          {/* Central Hub */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full border-2 border-dashed border-indigo-500/30 flex items-center justify-center z-0"
          >
            <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-pulse" />
            <div className="w-36 h-36 lg:w-48 lg:h-48 rounded-full bg-white dark:bg-zinc-900 shadow-2xl flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
              <Server size={48} className="text-indigo-600 dark:text-indigo-400 lg:hidden" />
              <Server size={64} className="text-indigo-600 dark:text-indigo-400 hidden lg:block" />
            </div>
          </motion.div>

          {/* Floating Nodes */}
          {[
            { icon: Network, delay: 0, x: -120, y: -80, label: 'Network', mobileX: -80, mobileY: -50 },
            { icon: Cpu, delay: 1, x: 120, y: -60, label: 'Hardware', mobileX: 80, mobileY: -30 },
            { icon: ShieldCheck, delay: 2, x: 100, y: 120, label: 'Security', mobileX: 70, mobileY: 70 },
            { icon: Globe, delay: 3, x: -100, y: 100, label: 'Infrastructure', mobileX: -70, mobileY: 60 },
            { icon: Database, delay: 4, x: 0, y: -160, label: 'Systems', mobileX: 0, mobileY: -100 },
          ].map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: isMobile ? node.mobileX : node.x,
                y: (isMobile ? node.mobileY : node.y) + Math.sin(i) * 10
              }}
              transition={{ 
                delay: 1 + node.delay * 0.2,
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute group z-10"
              style={{ left: '50%', top: '50%', marginLeft: '-2rem', marginTop: '-2rem' }} // Approximate centering for nodes
            >
              <div className="relative p-3 lg:p-4 rounded-2xl glass border border-white/20 dark:border-zinc-800/50 shadow-xl flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <node.icon size={22} className="text-indigo-500 lg:hidden" />
                <node.icon size={28} className="text-indigo-500 hidden lg:block" />
                <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {node.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
