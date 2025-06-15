import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from './Button';

function ErrorState({ 
  message = 'Something went wrong', 
  onRetry,
  className = '' 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
        className="inline-block mb-4"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-surface-900 mb-2">Oops!</h3>
      <p className="text-surface-600 mb-6 max-w-sm mx-auto">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} icon="RefreshCw" variant="primary">
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

export default ErrorState;