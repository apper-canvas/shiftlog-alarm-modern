import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TimesheetTable from '@/components/organisms/TimesheetTable';
import ExportModal from '@/components/organisms/ExportModal';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import { timeEntryService } from '@/services';

function Timesheet() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await timeEntryService.getAll();
      setEntries(result);
    } catch (err) {
      setError(err.message || 'Failed to load timesheet data');
      toast.error('Failed to load timesheet data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (entries.length === 0) {
      toast.warning('No data to export');
      return;
    }
    setShowExportModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-full p-6">
        <div className="max-w-6xl mx-auto">
          <SkeletonLoader type="card" count={3} />
          <div className="mt-6">
            <SkeletonLoader type="table" count={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorState 
            message={error}
            onRetry={loadEntries}
          />
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-full p-6">
        <div className="max-w-6xl mx-auto">
          <EmptyState 
            title="No timesheet entries found"
            description="Start tracking your time by clocking in from the Clock tab"
            icon="Clock"
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Timesheet</h1>
          <p className="text-surface-600">
            View and export your work hours and time entries
          </p>
        </div>

        <TimesheetTable 
          entries={entries}
          onExport={handleExport}
        />

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          entries={entries}
        />
      </div>
    </motion.div>
  );
}

export default Timesheet;