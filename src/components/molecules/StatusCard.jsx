import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

function StatusCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'primary',
  badge,
  trend,
  className = '' 
}) {
  const colors = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-green-100',
    warning: 'text-warning bg-yellow-100',
    error: 'text-error bg-red-100',
    info: 'text-info bg-blue-100'
  };

  return (
    <Card className={`${className}`} hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-surface-600">{title}</p>
            {badge && <Badge variant={badge.variant} size="sm">{badge.text}</Badge>}
          </div>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-surface-900">{value}</p>
            {trend && (
              <span className={`text-sm ${trend.positive ? 'text-success' : 'text-error'}`}>
                <ApperIcon 
                  name={trend.positive ? 'TrendingUp' : 'TrendingDown'} 
                  className="w-4 h-4 inline mr-1" 
                />
                {trend.value}
              </span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-sm text-surface-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}

export default StatusCard;