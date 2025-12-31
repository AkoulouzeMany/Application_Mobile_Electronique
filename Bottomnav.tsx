import { Home, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Accueil' },
  { to: '/history', icon: BarChart3, label: 'Historique' },
  { to: '/predictions', icon: TrendingUp, label: 'Prédictions' },
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div className="mx-4 mb-4 bg-card/90 backdrop-blur-xl rounded-2xl border border-border shadow-lg">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <motion.div
                  animate={isActive ? { y: -2 } : { y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <item.icon
                    className={cn(
                      'relative z-10 w-5 h-5 transition-colors duration-200',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </motion.div>
                <span
                  className={cn(
                    'relative z-10 text-[10px] font-medium transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
