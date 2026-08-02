import { Section } from './Section';
import { Award } from 'lucide-react';
import { motion } from 'motion/react';

const certifications = [
  'CCNA – CISCO - Skill Zone',
  'MikroTik Certified Network Associate (MTCNA)',
  'Management Trainee in Communication Department Certificate – YSSE',
  'Communication Department Certificate – YSSE',
  'Boost Your Productivity with AI Tools - udemy',
  'Cyber Hygiene - SAJIDA FOUNDATION',
  'Master Minds - ILC',
  'MTCNA - Skill Zone',
  'Linux Administration - Skill Zone',
  'Business Email - HP LIFE Certificate',
  'Project-based-Excel - Grameenphone Academy Certificate',
  'Data Science & Analytics - HP LIFE Certificate',
  'Professional Networking Skill & Fiber Technology - IT Experts BD Technology',
  'IT For Business - HP LIFE Certificate',
  'Leadership Skills - ILC',
  'Personal Branding for Future Leaders - ILC',
  'Sensitization Training for Workplace Inclusion - LEAD ACADEMY',
  'Sensitization Training - LEAD ACADEMY',
  'Skills Boost - ILC',
  'Technology in Leadership - LEAD ACADEMY',
  'Waste to Hope – Volunteer for Bangladesh'
];

export function Certifications() {
  return (
    <Section id="certifications" title="Certifications">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ 
              y: { type: 'spring', stiffness: 300, damping: 20 },
              scale: { type: 'spring', stiffness: 300, damping: 20 },
              opacity: { duration: 0.4 },
              delay: (index % 6) * 0.05
            }}
            className="card-premium p-6 flex items-center gap-5 group relative overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300 cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              <Award size={24} />
            </div>
            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300 leading-tight">{cert}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
