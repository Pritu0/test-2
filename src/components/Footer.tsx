import { Linkedin, Facebook, Instagram, MessageCircle, ArrowUpRight, FileText } from 'lucide-react';

export function Footer({ onGenerateCV }: { onGenerateCV: () => void }) {
  return (
    <footer className="py-20 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <a href="#" style={{ fontFamily: 'Georgia' }} className="font-bold text-2xl md:text-3xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Engr. Inas
          </a>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Building secure, scalable, and high-performance IT infrastructure for the modern digital landscape.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Quick Links</h4>
          <ul className="space-y-4">
            {['About', 'Experience', 'Services', 'Skills', 'Testimonials', 'Contact'].map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                  {link}
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
            <li>
              <button 
                onClick={onGenerateCV}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 group font-medium"
              >
                <span>Generate CV</span>
                <FileText size={13} className="text-indigo-500" />
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Contact</h4>
          <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Chattagong, Bangladesh</li>
            <li>inasbinyousuf@gmail.com</li>
            <li>+8801870932446</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-zinc-400">Social</h4>
          <div className="flex gap-4">
            {[
              { icon: Linkedin, href: 'https://www.linkedin.com/in/inas-bin-yousuf', label: 'LinkedIn' },
              { icon: Facebook, href: 'https://www.facebook.com/Inas.Bin.Yousuf', label: 'Facebook' },
              { icon: Instagram, href: 'https://www.instagram.com/inas.bin.yousuf', label: 'Instagram' },
              { icon: MessageCircle, href: 'https://wa.me/8801870932446', label: 'WhatsApp' },
            ].map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-zinc-600 dark:text-zinc-400"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} Eng. Inas Bin Yousuf. Designed & Built with Passion.
        </p>
      </div>
    </footer>
  );
}
