import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

function ClockButton({ 
  isActive = false, 
  onBreak = false,
  onClick,
  disabled = false 
}) {
  const getButtonState = () => {
    if (onBreak) return { text: 'ON BREAK', color: 'bg-warning', icon: 'Coffee' };
    if (isActive) return { text: 'CLOCK OUT', color: 'bg-error', icon: 'LogOut' };
    return { text: 'CLOCK IN', color: 'bg-success', icon: 'LogIn' };
  };

  const state = getButtonState();

  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={onClick}
        disabled={disabled}
        className={`relative w-48 h-48 rounded-full ${state.color} text-white shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {/* Pulse animation for active state */}
        {isActive && !onBreak && (
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full bg-success"
          />
        )}
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <ApperIcon name={state.icon} className="w-12 h-12 mb-2" />
          <span className="text-xl font-bold tracking-wider">{state.text}</span>
        </div>
      </motion.button>
      
      {/* Current time display */}
      <div className="mt-6 text-center">
        <div className="text-3xl font-mono font-bold text-surface-900">
          {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </div>
        <div className="text-sm text-surface-500 mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
  );
}

export default ClockButton;