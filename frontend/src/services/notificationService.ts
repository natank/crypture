/**
 * Notification Service - Web Notifications API wrapper
 * REQ-013-notifications / Backlog Item 24 / Story 2
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export interface AlertNotification {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  coinId?: string;
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getPermissionStatus(): NotificationPermissionStatus {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionStatus;
}

/**
 * Request notification permission from user
 * Returns the new permission status
 */
export async function requestPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const result = await Notification.requestPermission();
    return result as NotificationPermissionStatus;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'denied';
  }
}

/**
 * Send a browser notification
 * Returns true if notification was sent successfully
 */
export function sendNotification(notification: AlertNotification): boolean {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser');
    return false;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  try {
    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon || '/logo/svg/crypture-logo-negative-space-monochrome.svg',
      tag: notification.tag || `alert-${Date.now()}`,
      requireInteraction: false,
      silent: false,
    };

    const notif = new Notification(notification.title, options);

    // Auto-close after 5 seconds
    setTimeout(() => {
      notif.close();
    }, 5000);

    // Handle click - focus window
    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}

/**
 * Send an alert triggered notification
 */
export function sendAlertNotification(
  coinSymbol: string,
  condition: 'above' | 'below',
  targetPrice: number,
  currentPrice: number,
  coinImage?: string
): boolean {
  const formattedTarget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: targetPrice < 1 ? 6 : 2,
  }).format(targetPrice);

  const formattedCurrent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: currentPrice < 1 ? 6 : 2,
  }).format(currentPrice);

  const direction = condition === 'above' ? 'above' : 'below';

  return sendNotification({
    title: `🔔 Price Alert: ${coinSymbol}`,
    body: `${coinSymbol} is now ${direction} ${formattedTarget}! Current price: ${formattedCurrent}`,
    icon: coinImage,
    tag: `alert-${coinSymbol}-${condition}-${targetPrice}`,
  });
}
