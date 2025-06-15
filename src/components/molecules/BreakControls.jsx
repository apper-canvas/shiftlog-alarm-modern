import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function BreakControls({ 
  onBreak = false,
  breakDuration = 0,
  onStartBreak,
  onEndBreak,
  disabled = false 
}) {
  const formatDuration = (hours) => {
    const minutes = Math.floor(hours * 60);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (onBreak) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-warning/10 border border-warning/20 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/20 rounded-lg">
              <ApperIcon name="Coffee" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="font-medium text-surface-900">On Break</p>
              <p className="text-sm text-surface-600">
                Duration: {formatDuration(breakDuration)}
              </p>
            </div>
          </div>
          
          <Button
            onClick={onEndBreak}
            disabled={disabled}
            variant="warning"
            size="sm"
            icon="Play"
          >
            Resume Work
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex space-x-3">
      <Button
        onClick={() => onStartBreak('paid')}
        disabled={disabled}
        variant="outline"
        size="sm"
        icon="Coffee"
        className="flex-1"
      >
        Paid Break
      </Button>
      
      <Button
        onClick={() => onStartBreak('unpaid')}
        disabled={disabled}
        variant="outline"
        size="sm"
        icon="PauseCircle"
        className="flex-1"
      >
        Unpaid Break
      </Button>
    </div>
  );
}

export default BreakControls;