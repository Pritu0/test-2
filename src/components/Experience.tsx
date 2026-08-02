import { Section } from './Section';
import { Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { portfolioData } from '../data';

export function Experience() {
  const experiences = portfolioData.experience;

  return (
    <Section id="experience" title="Professional Experience" subtitle="My professional journey and contributions.">
      <div className="space-y-12 relative">
        {/* Timeline Line */}
        <motion.div 
          className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/50 via-blue-500/50 to-transparent md:-translate-x-1/2 hidden sm:block origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {experiences.map((exp, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            {/* Icon/Node */}
            <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl border-4 border-white dark:border-zinc-950 bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
              <Briefcase size={18} className="md:hidden" />
              <Briefcase size={24} className="hidden md:block" />
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-3.5rem)] md:w-[45%] card-premium p-6 md:p-8 hover:ring-2 hover:ring-indigo-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="font-bold text-lg md:text-xl text-zinc-900 dark:text-zinc-100">{exp.role}</div>
                <time className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full w-fit border border-indigo-100 dark:border-indigo-500/20">{exp.period}</time>
              </div>
              <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                {exp.company}
              </div>
              
              {/* Detailed Accompanishments */}
              <ul className="space-y-3">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed">
                    <ChevronRight size={14} className="text-indigo-500 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
