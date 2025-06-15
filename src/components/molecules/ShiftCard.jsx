import { format } from 'date-fns';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

function ShiftCard({ shift, isUpcoming = false }) {
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: { variant: 'info', icon: 'Calendar', text: 'Scheduled' },
      completed: { variant: 'success', icon: 'CheckCircle', text: 'Completed' },
      missed: { variant: 'error', icon: 'XCircle', text: 'Missed' }
    };
    
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant} icon={config.icon}>{config.text}</Badge>;
  };

  const getDuration = () => {
    const [startHours, startMinutes] = shift.startTime.split(':').map(Number);
    const [endHours, endMinutes] = shift.endTime.split(':').map(Number);
    
    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;
    
    const durationInMinutes = endInMinutes - startInMinutes;
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <Card 
      className={`${isUpcoming ? 'border-primary/20 bg-primary/5' : ''}`}
      hover
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-semibold text-surface-900">
              {format(new Date(shift.date), 'EEEE, MMM d')}
            </p>
            {getStatusBadge(shift.status)}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-surface-600">
              <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </span>
              <span className="ml-2 text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded">
                {getDuration()}
              </span>
            </div>
            
            <div className="flex items-center text-surface-600">
              <ApperIcon name="Building" className="w-4 h-4 mr-2" />
              <span className="text-sm">{shift.department}</span>
            </div>
          </div>
        </div>
        
        {isUpcoming && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="ml-4"
          >
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}

export default ShiftCard;