import { Section } from './Section';
import { motion } from 'motion/react';
import { portfolioData } from '../data';
import { Server, Network, ShieldAlert, Cpu, Layers } from 'lucide-react';
import networkImg from '../assets/projects/project-1-network-architecture.jpg';
import printingImg from '../assets/projects/project-2-printing-myq.jpg';
import addsImg from '../assets/projects/project-3-addns-dns.jpg';
import linuxImg from '../assets/projects/project-4-linux-admin.jpg';

// Placeholder images — to use your own photos, just replace the 4 files in
// src/assets/projects/ with your own images (keep the same filenames, or
// update the filenames below to match).
const projectImages = [networkImg, printingImg, addsImg, linuxImg];

const projectIcons = [Network, Cpu, Server, Layers];

export function Projects() {
  const projects = portfolioData.projects;

  return (
    <Section id="projects" title="Key Infrastructure Projects" subtitle="Enterprise network architectures, directory services, and server setups managed by me.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          const IconComponent = projectIcons[index] || Server;
          const image = projectImages[index] || projectImages[0];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ 
                y: { type: 'spring', stiffness: 300, damping: 20 },
                opacity: { duration: 0.5 },
                delay: index * 0.1 
              }}
              className="card-premium overflow-hidden group hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300 cursor-default flex flex-col h-full"
            >
              {/* Project Image Header */}
              <div className="relative h-48 overflow-hidden bg-zinc-900">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
                <img 
                  src={image} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Icon Badge */}
                <div className="absolute bottom-4 left-6 z-20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <IconComponent size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-500/30 backdrop-blur-sm">
                    Verified Infrastructure
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-3 leading-tight font-display">
                    {project.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="border-t border-zinc-100 dark:border-zinc-800/50 pt-4 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.split(',').map((techItem) => (
                      <span 
                        key={techItem} 
                        className="px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900 text-[10px] md:text-xs font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500/20 transition-colors"
                      >
                        {techItem.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
