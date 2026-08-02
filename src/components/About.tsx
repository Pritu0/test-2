import { Section } from './Section';
import { motion } from 'motion/react';
import { AnimatedCounter } from './AnimatedCounter';

export function About() {
  return (
    <Section id="about" title="About Me">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Eng. Inas Bin Yousuf</span> is a dedicated and detail-oriented Computer Science Engineering graduate, currently serving as a Jr. Executive with hands-on expertise in IT infrastructure and networking technologies.
          </p>
          <p>
            Coming from a family that values discipline and responsibility, he has developed a strong work ethic inspired by his father’s professional integrity and commitment.
          </p>
          <p>
            With a solid academic foundation in Computer Science Engineering, Inas specializes in hardware systems, IT support, and networking solutions. He is continuously enhancing his technical capabilities while staying aligned with emerging technologies and industry standards.
          </p>
          <p>
            Beyond his professional journey, he is deeply committed to social impact and community development. He believes in leveraging technology not only for innovation but also as a powerful tool to create sustainable and meaningful change in society.
          </p>
          <p>
            His career objective is to grow as a proficient IT Engineer by integrating technical excellence, analytical thinking, and a strong sense of social responsibility.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[
              { label: 'Experience', value: 1.5, decimals: 1, suffix: '+', display: undefined, sub: 'Years Active' },
              { label: 'Technical', value: 20, decimals: 0, suffix: '+', display: undefined, sub: 'Total Skills' },
              { label: 'Infrastructure', value: 4, decimals: 0, suffix: '+', display: undefined, sub: 'Projects' },
              { label: 'Professional', value: undefined, decimals: 0, suffix: '', display: 'Current', sub: 'Jr. Executive' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-center group hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-center min-h-[100px]"
              >
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  {stat.value !== undefined ? (
                    <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  ) : (
                    stat.display
                  )}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors mt-1">{stat.label}</div>
                <div className="text-[9px] text-zinc-400 font-medium mt-0.5">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative group">
          <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
            <img 
              src="https://i.postimg.cc/LXXHPcYy/Inas-Bin-Yousuf.png" 
              alt="Eng. Inas Bin Yousuf" 
              className="w-full h-auto block opacity-95"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-2xl -z-10 blur-2xl" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full -z-10 blur-2xl" />
        </div>
      </div>
    </Section>
  );
}
