import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimesheetRow from '@/components/molecules/TimesheetRow';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

function TimesheetTable({ entries, onExport }) {
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getFilteredEntries = () => {
    if (viewMode === 'day') {
      const today = new Date().toISOString().split('T')[0];
      return entries.filter(entry => 
        entry.clockIn.split('T')[0] === today
      );
    }
    
    // Week view - current week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.clockIn);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });
  };

  const getTotalHours = (entries) => {
    return entries.reduce((total, entry) => total + (entry.totalHours || 0), 0);
  };

  const getOvertimeHours = (totalHours, threshold = 40) => {
    return Math.max(0, totalHours - threshold);
  };

  const filteredEntries = getFilteredEntries();
  const totalHours = getTotalHours(filteredEntries);
  const overtimeHours = viewMode === 'week' ? getOvertimeHours(totalHours) : 0;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'week' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week View
          </Button>
          <Button
            variant={viewMode === 'day' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Today
          </Button>
        </div>
        
        <Button
          onClick={onExport}
          icon="Download"
          variant="outline"
          size="sm"
        >
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-surface-600 mb-1">Total Hours</p>
            <p className="text-3xl font-bold text-surface-900">{totalHours.toFixed(1)}h</p>
            <p className="text-xs text-surface-500 mt-1">
              {viewMode === 'week' ? 'This week' : 'Today'}
            </p>
          </div>
        </Card>
        
        {viewMode === 'week' && (
          <>
            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-600 mb-1">Overtime</p>
                <p className="text-3xl font-bold text-warning">{overtimeHours.toFixed(1)}h</p>
                <p className="text-xs text-surface-500 mt-1">Over 40 hours</p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-600 mb-1">Estimated Pay</p>
                <p className="text-3xl font-bold text-success">
                  ${((totalHours - overtimeHours) * 18.50 + overtimeHours * 18.50 * 1.5).toFixed(0)}
                </p>
                <p className="text-xs text-surface-500 mt-1">@ $18.50/hr + OT</p>
              </div>
            </Card>
          </>
        )}
        
        {viewMode === 'day' && (
          <>
            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-600 mb-1">Entries</p>
                <p className="text-3xl font-bold text-primary">{filteredEntries.length}</p>
                <p className="text-xs text-surface-500 mt-1">Clock sessions</p>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <p className="text-sm font-medium text-surface-600 mb-1">Status</p>
                <div className="flex justify-center mt-1">
                  {filteredEntries.some(e => e.status === 'active') ? (
                    <Badge variant="success" icon="Clock">Active</Badge>
                  ) : (
                    <Badge variant="default" icon="CheckCircle">Complete</Badge>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Timesheet Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-50 border-b border-surface-100">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-surface-700">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-surface-700">Clock In</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-surface-700">Clock Out</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-surface-700">Breaks</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-surface-700">Total</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-surface-700">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredEntries.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    asChild
                  >
                    <TimesheetRow entry={entry} />
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-surface-500">
                No time entries found for {viewMode === 'week' ? 'this week' : 'today'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default TimesheetTable;