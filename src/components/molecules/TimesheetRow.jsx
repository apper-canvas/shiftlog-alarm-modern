import { format } from 'date-fns';
import Badge from '@/components/atoms/Badge';

function TimesheetRow({ entry }) {
  const formatTime = (dateString) => {
    if (!dateString) return '--';
    return format(new Date(dateString), 'h:mm a');
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM d');
  };

  const getTotalBreakTime = (breaks) => {
    return breaks.reduce((total, breakItem) => total + (breakItem.duration || 0), 0);
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <Badge variant="success" icon="Clock">Active</Badge>;
    }
    return <Badge variant="default" icon="CheckCircle">Complete</Badge>;
  };

  return (
    <tr className="border-t border-surface-100 hover:bg-surface-50">
      <td className="py-4 px-4">
        <div className="font-medium text-surface-900">
          {formatDate(entry.clockIn)}
        </div>
      </td>
      
      <td className="py-4 px-4 text-surface-600">
        {formatTime(entry.clockIn)}
      </td>
      
      <td className="py-4 px-4 text-surface-600">
        {formatTime(entry.clockOut)}
      </td>
      
      <td className="py-4 px-4 text-surface-600">
        {entry.breaks.length > 0 ? (
          <div className="text-sm">
            {getTotalBreakTime(entry.breaks).toFixed(1)}h
            <div className="text-xs text-surface-400">
              ({entry.breaks.length} break{entry.breaks.length !== 1 ? 's' : ''})
            </div>
          </div>
        ) : '--'}
      </td>
      
      <td className="py-4 px-4">
        <div className="font-medium text-surface-900">
          {entry.totalHours ? entry.totalHours.toFixed(1) : '0.0'}h
        </div>
      </td>
      
      <td className="py-4 px-4">
        {getStatusBadge(entry.status)}
      </td>
    </tr>
  );
}

export default TimesheetRow;