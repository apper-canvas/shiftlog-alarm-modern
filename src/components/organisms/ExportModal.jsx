import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

function ExportModal({ isOpen, onClose, entries }) {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileName = `timesheet_${dateRange}_${new Date().toISOString().split('T')[0]}.${format}`;
      
      if (format === 'csv') {
        exportCSV(entries, fileName);
      } else {
        exportPDF(entries, fileName);
      }
      
      toast.success(`Timesheet exported as ${format.toUpperCase()}`);
      onClose();
    } catch (error) {
      toast.error('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = (data, fileName) => {
    const headers = ['Date', 'Clock In', 'Clock Out', 'Break Time', 'Total Hours', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(entry => [
        format(new Date(entry.clockIn), 'yyyy-MM-dd'),
        format(new Date(entry.clockIn), 'HH:mm'),
        entry.clockOut ? format(new Date(entry.clockOut), 'HH:mm') : '',
        entry.breaks.reduce((total, b) => total + (b.duration || 0), 0).toFixed(1),
        entry.totalHours?.toFixed(1) || '0.0',
        entry.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = (data, fileName) => {
    // In a real implementation, you would use a PDF library like jsPDF
    // For demo purposes, we'll create a simple text file
    const content = `TIMESHEET REPORT\n\n${data.map(entry => 
      `${format(new Date(entry.clockIn), 'yyyy-MM-dd')} | ${format(new Date(entry.clockIn), 'HH:mm')} - ${entry.clockOut ? format(new Date(entry.clockOut), 'HH:mm') : 'Active'} | ${entry.totalHours?.toFixed(1) || '0.0'}h`
    ).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.pdf', '.txt');
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900">Export Timesheet</h3>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  icon="X"
                />
              </div>

              <div className="space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    File Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFormat('csv')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        format === 'csv'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <ApperIcon name="FileSpreadsheet" className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">CSV</div>
                      <div className="text-xs text-surface-500">Excel compatible</div>
                    </button>
                    
                    <button
                      onClick={() => setFormat('pdf')}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        format === 'pdf'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 hover:border-surface-300'
                      }`}
                    >
                      <ApperIcon name="FileText" className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-medium">PDF</div>
                      <div className="text-xs text-surface-500">Print ready</div>
                    </button>
                  </div>
                </div>

                {/* Date Range Selection */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'week', label: 'This Week', count: entries.length },
                      { value: 'month', label: 'This Month', count: entries.length },
                      { value: 'all', label: 'All Records', count: entries.length }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setDateRange(option.value)}
                        className={`w-full p-3 border rounded-lg text-left transition-colors ${
                          dateRange === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-sm text-surface-500">
                            {option.count} entries
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExport}
                    variant="primary"
                    className="flex-1"
                    loading={loading}
                    icon="Download"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ExportModal;