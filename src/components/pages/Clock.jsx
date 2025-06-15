import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ClockSection from '@/components/organisms/ClockSection';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';

function Clock() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-full p-6">
        <div className="max-w-4xl mx-auto">
          <SkeletonLoader type="clockButton" count={1} />
          <div className="mt-8">
            <SkeletonLoader type="card" count={3} />
          </div>
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
            onRetry={() => {
              setError(null);
              setLoading(true);
              setTimeout(() => setLoading(false), 1000);
            }}
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Time Clock</h1>
          <p className="text-surface-600">
            Track your work hours and manage breaks
          </p>
        </div>

        <ClockSection />
      </div>
    </motion.div>
  );
}

export default Clock;