import { Section } from './Section';
import { Target } from 'lucide-react';

export function CareerObjective() {
  return (
    <Section id="objective" title="Career Objective" className="bg-zinc-50/50 dark:bg-zinc-900/20">
      <div className="max-w-4xl mx-auto">
        <div className="card-premium p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
              To build a career as a proficient <span className="text-indigo-600 dark:text-indigo-400 font-bold">IT Engineer</span> by leveraging my technical expertise in hardware systems, networking, and infrastructure management.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              I am committed to delivering high-quality, secure, and scalable solutions while continuously enhancing my analytical thinking and technical capabilities. My goal is to contribute to technological innovation and drive positive change through excellence in IT infrastructure.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
