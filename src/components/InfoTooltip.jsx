import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function InfoTooltip({ text, title = "Fundamento Neurocognitivo" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-google-blue"
        aria-label="Información y fundamento"
      >
        <Info className="w-4 h-4 text-zinc-400 hover:text-google-blue transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 bg-zinc-900/95 border border-zinc-700/80 rounded-xl shadow-2xl backdrop-blur-md z-50 text-left pointer-events-none"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-google-blue"></span>
              <span className="text-xs font-semibold text-zinc-200 tracking-wide uppercase">
                {title}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {text}
            </p>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-zinc-700/80 border-t-4 border-x-transparent border-x-4 border-b-0"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
