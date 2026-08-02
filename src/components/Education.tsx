import { Section } from './Section';
import { GraduationCap } from 'lucide-react';

const education = [
  {
    degree: 'Diploma in Engineering – Computer Science',
    school: 'Shyamoli Ideal Polytechnic Institute',
    period: '2020 – 2025',
  },
  {
    degree: 'SSC – Business Studies',
    school: 'West Banshkhali High School and College',
    period: '2019 – 2020',
  },
];

export function Education() {
  return (
    <Section id="education" title="Education">
      <div className="grid md:grid-cols-2 gap-8">
        {education.map((edu, index) => (
          <div key={index} className="card-premium p-8 group">
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-transform duration-500 group-hover:rotate-6">
                <GraduationCap size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 font-display text-zinc-900 dark:text-zinc-100">{edu.degree}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-3">{edu.school}</p>
                {edu.period && (
                  <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {edu.period}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
