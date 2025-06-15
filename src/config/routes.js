import Clock from '@/components/pages/Clock';
import Timesheet from '@/components/pages/Timesheet';
import Schedule from '@/components/pages/Schedule';

export const routes = {
  clock: {
    id: 'clock',
    label: 'Clock',
    path: '/clock',
    icon: 'Clock',
    component: Clock
  },
  timesheet: {
    id: 'timesheet',
    label: 'Timesheet',
    path: '/timesheet',
    icon: 'FileText',
    component: Timesheet
  },
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    path: '/schedule',
    icon: 'Calendar',
    component: Schedule
  }
};

export const routeArray = Object.values(routes);
export default routes;