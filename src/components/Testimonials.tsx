import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section } from './Section';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Rahat Chowdhury",
    role: "Senior IT Manager",
    content: "Eng. Inas is an exceptional hardware engineer. His expertise in network configuration and Windows Server management helped our office infrastructure become more stable and secure.",
    rating: 5
  },
  {
    name: "Samiul Islam",
    role: "Network Administrator",
    content: "Working with Inas was a great experience. His analytical thinking and problem-solving skills in MikroTik and Cisco configurations are top-notch.",
    rating: 5
  },
  {
    name: "Tanvir Ahmed",
    role: "Project Lead",
    content: "Inas has a strong work ethic and deep technical knowledge. He successfully managed our server migration project with zero downtime. Highly recommended!",
    rating: 5
  },
  {
    name: "Md. Ehsan Habib",
    role: "Project Director",
    content: "Inas Bin Yousuf has demonstrated exceptional growth and dedication during his eight-month journey at YSSE, where he progressed from an intern in the Communication Department to a Management Trainee. He consistently showed a strong willingness to learn, adapt, and take on new challenges with a positive mindset. His skills in problem-solving, time management, and teamwork improved significantly, and he proved himself capable of both collaborating effectively and leading when needed. What truly sets him apart is his eagerness to improve and contribute meaningfully. He is proactive, curious, and committed to continuous learning—qualities that make him a valuable asset to any organization.",
    rating: 5
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(slideNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Section id="testimonials" title="Testimonials" subtitle="What colleagues and clients say about my work.">
      <div className="relative max-w-4xl mx-auto px-12">
        <div className="overflow-hidden py-8">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Quote size={32} />
              </div>
              
              <div className="flex gap-1">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xl md:text-2xl font-medium italic text-zinc-700 dark:text-zinc-300 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>

              <div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <button
          onClick={slidePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg z-10"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={slideNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg z-10"
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-indigo-600' 
                  : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
