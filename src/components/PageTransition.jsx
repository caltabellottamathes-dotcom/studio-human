import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

export default function PageTransition({ children, className }) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.4, ease } },
        exit: { opacity: 0, transition: { duration: 0.25, ease } },
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}