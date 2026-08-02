import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { SectionTitle } from './SectionTitle';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Section({ children, id, className, title, subtitle }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 px-6 md:px-12 lg:px-24 relative scroll-mt-16", className)}>
      <div className="max-w-6xl mx-auto relative z-10">
        {title && (
          <SectionTitle title={title} subtitle={subtitle} />
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
