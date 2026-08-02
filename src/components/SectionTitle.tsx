import { motion } from 'motion/react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-16 text-center ${className}`}
    >
      <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight font-display">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {title}
        </span>
      </h2>
      
      {/* Decorative Underline Accent */}
      <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mx-auto mt-4 rounded-full shadow-sm" />
      
      {subtitle && (
        <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed mt-8">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
