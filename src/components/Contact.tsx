import { Section } from './Section';
import { Mail, Phone, Linkedin, Facebook, Instagram, Send, MessageCircle, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import React from 'react';

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoLink = `mailto:inasbinyousuf@gmail.com?subject=${encodeURIComponent(
      subject || 'Portfolio Contact Form'
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <Section id="contact" title="Get in Touch" subtitle="Have a question or want to work together? Feel free to reach out.">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold font-display">Let's Connect</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
          </div>

          <div className="grid gap-4">
            <a href="mailto:inasbinyousuf@gmail.com" className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-all group text-zinc-700 dark:text-zinc-300">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Email</p>
                <p className="font-semibold text-sm">inasbinyousuf@gmail.com</p>
              </div>
            </a>

            <a href="tel:+8801870932446" className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-all group text-zinc-700 dark:text-zinc-300">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Phone</p>
                <p className="font-semibold text-sm">+8801870932446</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Location</p>
                <p className="font-semibold text-sm">Chattagong, Bangladesh</p>
              </div>
            </div>
          </div>

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
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:bg-indigo-600 hover:text-white transition-all shadow-sm text-zinc-600 dark:text-zinc-400"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="card-premium p-8 relative overflow-hidden">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 z-10 p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Opening Your Email App</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Your message is ready — just hit send in your email app to deliver it. I'll get back to you as soon as possible.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-6 text-sm font-bold text-indigo-600 hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : null}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Subject</label>
              <input required type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Project Inquiry" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</label>
              <textarea required rows={4} name="message" value={formData.message} onChange={handleChange} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Tell me about your project..." />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
