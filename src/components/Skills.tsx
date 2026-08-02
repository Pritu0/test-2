import { Section } from './Section';
import { 
  Terminal, Layout, Users, CheckCircle2,
  Server, Network, Cpu, Globe, Printer, HardDrive, ShieldCheck,
  FileSpreadsheet, FileText, Cloud, Table, Palette, Zap, BarChart2,
  MessageSquare, Award, Mic, Lightbulb, Brain
} from 'lucide-react';
import { motion } from 'motion/react';

// Map of individual skill items to their custom icons and colors
const skillMetaMap: Record<string, { icon: any, color: string, bg: string }> = {
  // Technical / IT Infrastructure
  'Windows Server 2022': { icon: Server, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  'MikroTik Configuration': { icon: Network, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  'Router Configuration': { icon: Cpu, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  'CCNA - CISCO Router Configuration': { icon: Network, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  'Linux Administration': { icon: Terminal, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
  'DNS Server Configuration': { icon: Globe, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10' },
  'AD-DS Configuration': { icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  'Printer Service': { icon: Printer, color: 'text-zinc-600 dark:text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800' },
  'Myq Server': { icon: HardDrive, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },

  // Productivity
  'Project-Based Excel': { icon: FileSpreadsheet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  'Microsoft Excel': { icon: FileSpreadsheet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  'Data Analysis': { icon: BarChart2, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  'Microsoft Word': { icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  'Office 365': { icon: Cloud, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  'Google Sheet': { icon: Table, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10' },
  'Canva': { icon: Palette, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-500/10' },
  'Best AI Recharge': { icon: Zap, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-500/10' },

  // Soft Skills
  'Communication': { icon: MessageSquare, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  'Leadership': { icon: Award, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  'Teamwork': { icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  'Public Speaking': { icon: Mic, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  'Problem Solving': { icon: Lightbulb, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10' },
  'Analytical Thinking': { icon: Brain, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
};

const skills = [
  {
    category: 'Technical',
    icon: Terminal,
    items: [
      'Windows Server 2022', 'MikroTik Configuration', 'Router Configuration', 
      'CCNA - CISCO Router Configuration', 'Linux Administration', 
      'DNS Server Configuration', 'AD-DS Configuration', 'Printer Service', 'Myq Server'
    ],
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10'
  },
  {
    category: 'Productivity',
    icon: Layout,
    items: [
      'Project-Based Excel', 'Microsoft Excel', 'Data Analysis', 
      'Microsoft Word', 'Office 365', 'Google Sheet', 'Canva', 'Best AI Recharge'
    ],
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10'
  },
  {
    category: 'Soft Skills',
    icon: Users,
    items: [
      'Communication', 'Leadership', 'Teamwork', 'Public Speaking', 'Problem Solving', 'Analytical Thinking'
    ],
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10'
  }
];

export function Skills() {
  return (
    <Section id="skills" title="Skills & Expertise" subtitle="A comprehensive list of my technical and professional capabilities.">
      <div className="grid md:grid-cols-3 gap-8">
        {skills.map((skillGroup) => (
          <div key={skillGroup.category} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${skillGroup.bg} ${skillGroup.color}`}>
                <skillGroup.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">{skillGroup.category}</h3>
            </div>
            <div className="grid gap-3">
              {skillGroup.items.map((skill) => {
                const meta = skillMetaMap[skill] || { icon: CheckCircle2, color: skillGroup.color, bg: skillGroup.bg };
                const SkillIcon = meta.icon;

                return (
                  <motion.div 
                    key={skill} 
                    whileHover={{ x: 8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="card-premium p-4 flex items-center gap-4 group cursor-default"
                  >
                    <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center ${meta.color} group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300`}>
                      <SkillIcon size={16} />
                    </div>
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{skill}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
