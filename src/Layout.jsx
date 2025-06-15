import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

function Layout() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-surface-900">ShiftLog</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm text-surface-600">
              {new Date().toLocaleString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-surface-200 z-40">
        <div className="flex">
          {routeArray.map((route) => {
            const isActive = location.pathname === route.path;
            
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className="flex-1 relative"
              >
                <div className="flex flex-col items-center py-3 px-2">
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-surface-500 hover:text-surface-700 hover:bg-surface-50'
                    }`}
                  >
                    <ApperIcon name={route.icon} className="w-6 h-6" />
                  </motion.div>
                  
                  <span className={`text-xs mt-1 ${
                    isActive ? 'text-primary font-medium' : 'text-surface-500'
                  }`}>
                    {route.label}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Layout;