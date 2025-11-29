import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  icon,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg shadow-secondary-500/30',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
    ghost: 'text-primary-600 hover:bg-primary-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-medium
        transition-all duration-300
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
