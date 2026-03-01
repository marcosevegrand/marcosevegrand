import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type SectionRevealProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function SectionReveal({ id, className, children }: SectionRevealProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
