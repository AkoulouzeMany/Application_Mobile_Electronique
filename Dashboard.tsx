import { motion } from 'framer-motion';
import MobileLayout from '@/components/layout/MobileLayout';
import GasBottle from '@/components/GasBottle';
import StatusBadge from '@/components/StatusBadge';
import DevModeSlider from '@/components/DevModeSlider';
import { useApp } from '@/context/AppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { getGasStatus, getEstimatedDays } from '@/lib/storage';
import { AlertTriangle, Clock, Flame, Calendar, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { gasLevel, isConnected, connectedDevice, cookingFrequency } = useApp();
  const { requestPermission } = useNotifications();
  const status = getGasStatus(gasLevel);
  const estimatedDays = getEstimatedDays(gasLevel, cookingFrequency);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);

  useEffect(() => {
    // Check if we should show notification prompt
    if ('Notification' in window && Notification.permission === 'default') {
      setShowNotifPrompt(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    await requestPermission();
    setShowNotifPrompt(false);
  };

  return (
    <MobileLayout>
      <div className="min-h-screen p-5 pb-32">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground">{connectedDevice || 'GasModule'}</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge type="battery" level={85} />
            <StatusBadge type="bluetooth" connected={isConnected} />
          </div>
        </motion.div>

        {/* Notification prompt */}
        {showNotifPrompt && (
          <motion.div
            className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Activer les notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recevez une alerte quand le niveau de gaz est bas
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleEnableNotifications}
                className="rounded-xl text-xs"
              >
                Activer
              </Button>
            </div>
          </motion.div>
        )}

        {/* Critical alert */}
        {status === 'critical' && (
          <motion.div
            className="bg-gradient-to-r from-gas-critical/10 to-gas-critical/5 border border-gas-critical/30 rounded-2xl p-4 mb-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gas-critical/20 flex items-center justify-center flex-shrink-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AlertTriangle className="w-5 h-5 text-gas-critical" />
              </motion.div>
              <div>
                <p className="font-semibold text-gas-critical">Niveau critique !</p>
                <p className="text-sm text-gas-critical/80">Rechargez votre bouteille rapidement</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Warning alert */}
        {status === 'warning' && (
          <motion.div
            className="bg-gradient-to-r from-gas-warning/10 to-gas-warning/5 border border-gas-warning/30 rounded-2xl p-4 mb-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gas-warning/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-gas-warning" />
              </div>
              <div>
                <p className="font-semibold text-gas-warning">Niveau modéré</p>
                <p className="text-sm text-gas-warning/80">Prévoyez votre prochaine recharge</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Gas bottle visualization */}
        <motion.div
          className="flex flex-col items-center py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GasBottle level={gasLevel} size={160} />
          
          {/* Status label */}
          <motion.div
            className={cn(
              'flex items-center gap-2 mt-5 px-4 py-2 rounded-full',
              status === 'safe' && 'bg-gas-safe/10 text-gas-safe border border-gas-safe/20',
              status === 'warning' && 'bg-gas-warning/10 text-gas-warning border border-gas-warning/20',
              status === 'critical' && 'bg-gas-critical/10 text-gas-critical border border-gas-critical/20'
            )}
          >
            <Flame className="w-4 h-4" />
            <span className="font-medium text-sm">
              {status === 'safe' && 'Niveau optimal'}
              {status === 'warning' && 'Niveau modéré'}
              {status === 'critical' && 'Niveau critique'}
            </span>
          </motion.div>
        </motion.div>

        {/* Info cards */}
        <motion.div
          className="grid grid-cols-2 gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">~{estimatedDays}</p>
            <p className="text-xs text-muted-foreground mt-1">jours restants</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {cookingFrequency === 'low' ? 'Faible' : cookingFrequency === 'medium' ? 'Normale' : 'Élevée'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">consommation</p>
          </div>
        </motion.div>

        {/* Dev mode slider */}
        <DevModeSlider />
      </div>
    </MobileLayout>
  );
}
