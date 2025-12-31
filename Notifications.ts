import { useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { getGasStatus } from '@/lib/storage';
import { toast } from 'sonner';

export function useNotifications() {
  const { gasLevel } = useApp();
  const lastNotifiedLevel = useRef<'safe' | 'warning' | 'critical' | null>(null);
  const hasPermission = useRef(false);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      hasPermission.current = permission === 'granted';
      return permission === 'granted';
    }
    return false;
  }, []);

  // Send browser notification
  const sendBrowserNotification = useCallback((title: string, body: string, icon?: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'gastrack-alert',
      });
    }
  }, []);

  // Monitor gas level changes
  useEffect(() => {
    const status = getGasStatus(gasLevel);
    
    // Only notify when status changes (not on every level change)
    if (status !== lastNotifiedLevel.current) {
      if (status === 'critical' && lastNotifiedLevel.current !== 'critical') {
        // Critical alert
        toast.error('🚨 Niveau de gaz critique !', {
          description: `Il ne reste que ${gasLevel}% de gaz. Rechargez rapidement votre bouteille.`,
          duration: 10000,
          action: {
            label: 'Voir',
            onClick: () => window.location.href = '/predictions',
          },
        });
        
        sendBrowserNotification(
          'Alerte GasTrack - Niveau critique !',
          `Il ne reste que ${gasLevel}% de gaz. Planifiez une recharge rapidement.`
        );
      } else if (status === 'warning' && lastNotifiedLevel.current === 'safe') {
        // Warning alert
        toast.warning('⚠️ Niveau de gaz modéré', {
          description: `Niveau actuel : ${gasLevel}%. Pensez à anticiper votre recharge.`,
          duration: 6000,
        });
        
        sendBrowserNotification(
          'GasTrack - Niveau modéré',
          `Niveau actuel : ${gasLevel}%. Anticipez votre prochaine recharge.`
        );
      }
      
      lastNotifiedLevel.current = status;
    }
  }, [gasLevel, sendBrowserNotification]);

  return { requestPermission };
}
