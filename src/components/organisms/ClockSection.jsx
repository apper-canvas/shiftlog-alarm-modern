import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ClockButton from '@/components/molecules/ClockButton';
import BreakControls from '@/components/molecules/BreakControls';
import StatusCard from '@/components/molecules/StatusCard';
import { timeEntryService } from '@/services';

function ClockSection() {
  const [currentEntry, setCurrentEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [onBreak, setOnBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState(0);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update break duration if on break
      if (currentEntry && onBreak) {
        const activeBreak = currentEntry.breaks.find(b => !b.endTime);
        if (activeBreak) {
          const breakStart = new Date(activeBreak.startTime);
          const duration = (new Date() - breakStart) / (1000 * 60 * 60);
          setBreakDuration(duration);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEntry, onBreak]);

  // Load current active entry on mount
  useEffect(() => {
    loadCurrentEntry();
  }, []);

  const loadCurrentEntry = async () => {
    try {
      const active = await timeEntryService.getCurrentActive();
      setCurrentEntry(active);
      
      if (active) {
        // Check if currently on break
        const activeBreak = active.breaks.find(b => !b.endTime);
        setOnBreak(!!activeBreak);
        
        if (activeBreak) {
          const breakStart = new Date(activeBreak.startTime);
          const duration = (new Date() - breakStart) / (1000 * 60 * 60);
          setBreakDuration(duration);
        }
      }
    } catch (error) {
      console.error('Error loading current entry:', error);
    }
  };

  const handleClockAction = async () => {
    if (onBreak) {
      toast.warning('Please end your break before clocking out');
      return;
    }

    setLoading(true);
    
    try {
      if (currentEntry) {
        // Clock out
        const updated = await timeEntryService.clockOut(currentEntry.id);
        setCurrentEntry(null);
        toast.success(`Clocked out successfully! Total hours: ${updated.totalHours}h`);
      } else {
// Clock in
        const newEntry = await timeEntryService.create({
          employeeId: 1,
          clockIn: new Date().toISOString(),
          breaks: []
        });
        setCurrentEntry(newEntry);
        toast.success('Clocked in successfully!');
      }
    } catch (error) {
      toast.error('Clock action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBreak = async (breakType) => {
    if (!currentEntry) return;
    
    setLoading(true);
    
    try {
      const updated = await timeEntryService.startBreak(currentEntry.id, breakType);
      setCurrentEntry(updated);
      setOnBreak(true);
      setBreakDuration(0);
      toast.success(`${breakType === 'paid' ? 'Paid' : 'Unpaid'} break started`);
    } catch (error) {
      toast.error('Failed to start break');
    } finally {
      setLoading(false);
    }
  };

  const handleEndBreak = async () => {
    if (!currentEntry) return;
    
    setLoading(true);
    
    try {
      const updated = await timeEntryService.endBreak(currentEntry.id);
      setCurrentEntry(updated);
      setOnBreak(false);
      setBreakDuration(0);
      toast.success('Break ended. Welcome back!');
    } catch (error) {
      toast.error('Failed to end break');
    } finally {
      setLoading(false);
    }
  };

  const getTodayHours = () => {
    if (!currentEntry) return 0;
    
    if (currentEntry.status === 'completed') {
      return currentEntry.totalHours;
    }
    
    // Calculate current hours for active entry
    const clockIn = new Date(currentEntry.clockIn);
    const now = new Date();
    const hoursWorked = (now - clockIn) / (1000 * 60 * 60);
    
    // Subtract break time
    const breakTime = currentEntry.breaks.reduce((total, breakItem) => {
      if (breakItem.endTime) {
        return total + breakItem.duration;
      } else {
        // Active break
        const breakStart = new Date(breakItem.startTime);
        const currentBreakDuration = (now - breakStart) / (1000 * 60 * 60);
        return total + currentBreakDuration;
      }
    }, 0);
    
    return Math.max(0, hoursWorked - breakTime);
  };

  return (
    <div className="space-y-8">
      {/* Main Clock Button */}
      <div className="flex justify-center">
        <ClockButton
          isActive={!!currentEntry}
          onBreak={onBreak}
          onClick={handleClockAction}
          disabled={loading}
        />
      </div>

      {/* Break Controls */}
      {currentEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <BreakControls
            onBreak={onBreak}
            breakDuration={breakDuration}
            onStartBreak={handleStartBreak}
            onEndBreak={handleEndBreak}
            disabled={loading}
          />
        </motion.div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Today's Hours"
          value={getTodayHours().toFixed(1) + 'h'}
          subtitle={currentEntry ? 'In progress' : 'Not clocked in'}
          icon="Clock"
          color={currentEntry ? 'success' : 'primary'}
        />
        
        <StatusCard
          title="Status"
          value={onBreak ? 'On Break' : currentEntry ? 'Working' : 'Off Duty'}
          subtitle={currentEntry ? `Since ${new Date(currentEntry.clockIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : 'Ready to clock in'}
          icon={onBreak ? 'Coffee' : currentEntry ? 'PlayCircle' : 'PauseCircle'}
          color={onBreak ? 'warning' : currentEntry ? 'success' : 'primary'}
        />
        
        <StatusCard
          title="Breaks Today"
          value={currentEntry ? currentEntry.breaks.length.toString() : '0'}
          subtitle={currentEntry && currentEntry.breaks.length > 0 ? 
            `${currentEntry.breaks.reduce((total, b) => total + (b.duration || 0), 0).toFixed(1)}h total` : 
            'No breaks taken'
          }
          icon="Coffee"
          color="info"
        />
      </div>
    </div>
  );
}

export default ClockSection;