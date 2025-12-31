import { Bluetooth, BluetoothOff, Battery } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  type: 'bluetooth' | 'battery';
  connected?: boolean;
  level?: number;
}

export default function StatusBadge({ type, connected = true, level = 85 }: StatusBadgeProps) {
  if (type === 'bluetooth') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          connected 
            ? 'bg-gas-safe/10 text-gas-safe border border-gas-safe/20' 
            : 'bg-muted text-muted-foreground border border-border'
        )}
      >
        {connected ? (
          <Bluetooth className="w-3.5 h-3.5" />
        ) : (
          <BluetoothOff className="w-3.5 h-3.5" />
        )}
        <span>{connected ? 'Connecté' : 'Déconnecté'}</span>
        {connected && (
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-gas-safe"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    );
  }

  const batteryColor = level > 50 ? 'text-gas-safe' : level > 20 ? 'text-gas-warning' : 'text-gas-critical';
  const batteryBg = level > 50 ? 'bg-gas-safe/10 border-gas-safe/20' : level > 20 ? 'bg-gas-warning/10 border-gas-warning/20' : 'bg-gas-critical/10 border-gas-critical/20';

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border',
        batteryBg, 
        batteryColor
      )}
    >
      <Battery className="w-3.5 h-3.5" />
      <span>{level}%</span>
    </motion.div>
  );
}
