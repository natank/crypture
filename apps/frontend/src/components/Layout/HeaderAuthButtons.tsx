import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderAuthButtonsProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const HeaderAuthButtons: React.FC<HeaderAuthButtonsProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const isCompact = variant === 'compact';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/login"
          className={`
            ${isCompact 
              ? 'px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md hover:bg-indigo-50' 
              : 'px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md hover:bg-indigo-50'
            }
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          `}
        >
          Login
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Link
          to="/register"
          className={`
            ${isCompact
              ? 'px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm'
              : 'px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm'
            }
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          `}
        >
          Sign Up
        </Link>
      </motion.div>
    </div>
  );
};

export default HeaderAuthButtons;
