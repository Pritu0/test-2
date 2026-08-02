import { motion } from 'motion/react';

export function Background() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-white dark:bg-zinc-950">
      {/* Soft Radial Gradients for Depth */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_80%,rgba(139,92,246,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Abstract Flowing Shapes (Blobs) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/5 dark:bg-blue-400/3 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[15%] right-[5%] w-[35vw] h-[35vw] rounded-full bg-purple-400/5 dark:bg-purple-400/3 blur-[100px]"
      />

      {/* Network Lines & Connection Nodes (SVG Pattern) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="network-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-zinc-400 dark:text-zinc-500" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-zinc-200 dark:text-zinc-800" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#network-grid)" />
        
        {/* Randomized Connection Lines */}
        <g className="text-indigo-500/20 dark:text-indigo-400/10">
          <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="currentColor" strokeWidth="1" />
          <line x1="30%" y1="40%" x2="20%" y2="70%" stroke="currentColor" strokeWidth="1" />
          <line x1="70%" y1="10%" x2="85%" y2="35%" stroke="currentColor" strokeWidth="1" />
          <line x1="85%" y1="35%" x2="75%" y2="60%" stroke="currentColor" strokeWidth="1" />
          <line x1="40%" y1="80%" x2="60%" y2="75%" stroke="currentColor" strokeWidth="1" />
          
          {/* Nodes */}
          <circle cx="10%" cy="20%" r="3" fill="currentColor" />
          <circle cx="30%" cy="40%" r="3" fill="currentColor" />
          <circle cx="20%" cy="70%" r="3" fill="currentColor" />
          <circle cx="70%" cy="10%" r="3" fill="currentColor" />
          <circle cx="85%" cy="35%" r="3" fill="currentColor" />
          <circle cx="75%" cy="60%" r="3" fill="currentColor" />
          <circle cx="40%" cy="80%" r="3" fill="currentColor" />
          <circle cx="60%" cy="75%" r="3" fill="currentColor" />
        </g>
      </svg>

      {/* Subtle Noise Texture for Premium Feel */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
    </div>
  );
}
