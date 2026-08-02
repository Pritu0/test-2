import { Section } from './Section';
import { Server, Network, Cpu, Settings, Shield, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    title: 'IT Infrastructure Management',
    description: 'Expertise in server setup, system monitoring, and maintaining robust IT environments for seamless operations.',
    icon: Server,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    title: 'Network Solutions',
    description: 'Specialized in Cisco router configuration, LAN/WAN setup, and ensuring secure, high-speed connectivity.',
    icon: Network,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  {
    title: 'Hardware Support',
    description: 'Comprehensive diagnostic and maintenance services for computer hardware, printers, and peripheral devices.',
    icon: Cpu,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
  },
  {
    title: 'Software Troubleshooting',
    description: 'Rapid resolution of OS issues, software conflicts, and providing technical support for enterprise applications.',
    icon: Settings,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  {
    title: 'Cybersecurity Basics',
    description: 'Implementing fundamental security protocols to protect systems from unauthorized access and data breaches.',
    icon: Shield,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  {
    title: 'IT Consulting',
    description: 'Providing strategic advice on technology adoption and infrastructure optimization to meet business goals.',
    icon: Globe,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
  },
];

export function Services() {
  return (
    <Section id="services" title="My Services" subtitle="Professional IT solutions tailored to your infrastructure needs.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ 
              y: { type: 'spring', stiffness: 300, damping: 20 },
              scale: { type: 'spring', stiffness: 300, damping: 20 },
              opacity: { duration: 0.5 },
              delay: index * 0.1
            }}
            className="card-premium p-8 group hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 cursor-default"
          >
            <div className={`w-14 h-14 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              <service.icon size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100 font-display">
              {service.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
