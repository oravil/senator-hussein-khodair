import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        bg-white rounded-2xl shadow-lg
        border border-gray-100
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
