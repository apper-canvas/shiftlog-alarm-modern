import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ShiftCalendar from '@/components/organisms/ShiftCalendar';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import { shiftService } from '@/services';

function Schedule() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    setLoading(true);
    setError(null);
    
try {
      const result = await shiftService.getAll();
      setShifts(result || []);
    } catch (err) {
      setError(err.message || 'Failed to load schedule data');
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full p-6">
        <div className="max-w-4xl mx-auto">
          <SkeletonLoader type="card" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState 
            message={error}
            onRetry={loadShifts}
          />
        </div>
      </div>
    );
  }

  if (shifts.length === 0) {
    return (
      <div className="min-h-full p-6">
        <div className="max-w-4xl mx-auto">
          <EmptyState 
            title="No shifts scheduled"
            description="Your schedule will appear here once shifts are assigned"
            icon="Calendar"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-full p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Schedule</h1>
          <p className="text-surface-600">
            View your upcoming shifts and work calendar
          </p>
        </div>

        <ShiftCalendar shifts={shifts} />
      </div>
    </motion.div>
  );
}

export default Schedule;