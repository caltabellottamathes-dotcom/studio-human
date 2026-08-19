import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const btnVariants = {
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
};

const arrowVariants = {
  hover: { x: 3 },
  tap: { x: 0 },
};

const arrowLeftVariants = {
  hover: { x: -3 },
  tap: { x: 0 },
};

const spring = { type: 'spring', stiffness: 400, damping: 17 };

export default function BrandedButton({ children, href, to, direction = 'right', onClick, type = 'button', className = '', compact = false }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 15 });
  const sy = useSpring(my, { stiffness: 200, damping: 15 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * 0.25);
    my.set((e.clientY - (rect.top + rect.height / 2)) * 0.25);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const circleClass = compact ? 'w-6 h-6' : 'w-8 h-8 md:w-9 md:h-9';
  const arrowClass = compact ? 'w-3 h-3' : 'w-4 h-4';
  const containerPad = compact ? 'p-1' : 'p-1.5';
  const textRight = compact ? 'px-3 text-[10px]' : 'px-4 text-[11px]';
  const textLeft = compact ? 'px-3 text-[10px]' : 'px-4 text-[11px]';

  const inner = (
    <motion.span
      ref={ref}
      className={`inline-flex items-center bg-neutral-900 hover:bg-black rounded-full ${containerPad} shadow-md transition-colors duration-300`}
      variants={btnVariants}
      whileHover="hover"
      whileTap="tap"
      transition={spring}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {direction === 'left' ? (
        <>
          <motion.span
            className={`rounded-full bg-white flex items-center justify-center flex-shrink-0 ${circleClass}`}
            variants={arrowLeftVariants}
            transition={spring}
          >
            <ArrowLeft className={`${arrowClass} text-red-600`} strokeWidth={1.5} />
          </motion.span>
          <span className={`uppercase tracking-widest text-white font-body font-light ${textLeft}`}>{children}</span>
        </>
      ) : (
        <>
          <span className={`uppercase tracking-widest text-white font-body font-light ${textRight}`}>{children}</span>
          <motion.span
            className={`rounded-full bg-white flex items-center justify-center flex-shrink-0 ${circleClass}`}
            variants={arrowVariants}
            transition={spring}
          >
            <ArrowRight className={`${arrowClass} text-red-600`} strokeWidth={1.5} />
          </motion.span>
        </>
      )}
    </motion.span>
  );

  if (to) return <Link to={to} className={className}>{inner}</Link>;
  if (href) return <a href={href} className={className} onClick={onClick}>{inner}</a>;
  return <button type={type} onClick={onClick} className={className}>{inner}</button>;
}