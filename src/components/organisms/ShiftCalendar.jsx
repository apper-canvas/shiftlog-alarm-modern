import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ShiftCard from '@/components/molecules/ShiftCard';

function ShiftCalendar({ shifts }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getShiftForDay = (day) => {
    return shifts.find(shift => isSameDay(new Date(shift.date), day));
  };

  const getUpcomingShifts = () => {
    const today = new Date();
    return shifts
      .filter(shift => !isBefore(new Date(shift.date), today))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const upcomingShifts = getUpcomingShifts();

  return (
    <div className="space-y-6">
      {/* Upcoming Shifts */}
      <div>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Upcoming Shifts</h3>
        <div className="space-y-3">
          {upcomingShifts.map((shift, index) => (
            <motion.div
              key={shift.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ShiftCard shift={shift} isUpcoming />
            </motion.div>
          ))}
          
          {upcomingShifts.length === 0 && (
            <Card>
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500">No upcoming shifts scheduled</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => navigateMonth(-1)}
                variant="outline"
                size="sm"
                icon="ChevronLeft"
              />
              <Button
                onClick={() => setCurrentDate(new Date())}
                variant="outline"
                size="sm"
              >
                Today
              </Button>
              <Button
                onClick={() => navigateMonth(1)}
                variant="outline"
                size="sm"
                icon="ChevronRight"
              />
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-surface-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(day => {
              const shift = getShiftForDay(day);
              const isCurrentDay = isToday(day);
              
              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    relative p-3 rounded-lg text-center cursor-pointer transition-colors
                    ${isCurrentDay 
                      ? 'bg-primary text-white' 
                      : shift 
                        ? 'bg-success/10 text-success border border-success/20 hover:bg-success/20' 
                        : 'hover:bg-surface-50'
                    }
                  `}
                >
                  <span className={`text-sm font-medium ${isCurrentDay ? 'text-white' : 'text-surface-900'}`}>
                    {format(day, 'd')}
                  </span>
                  
                  {shift && (
                    <div className="absolute bottom-1 right-1">
                      <div className={`w-2 h-2 rounded-full ${
                        shift.status === 'completed' ? 'bg-success' :
                        shift.status === 'missed' ? 'bg-error' :
                        'bg-info'
                      }`} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-surface-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-info rounded-full" />
              <span className="text-sm text-surface-600">Scheduled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-sm text-surface-600">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full" />
              <span className="text-sm text-surface-600">Missed</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ShiftCalendar;