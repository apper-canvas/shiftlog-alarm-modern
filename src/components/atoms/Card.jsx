import { motion } from 'framer-motion';

function Card({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  ...props 
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `bg-white rounded-xl shadow-sm border border-surface-100 ${paddings[padding]} ${className}`;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, shadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

export default Card;