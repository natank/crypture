/**
 * NotificationPermission Component - Permission request dialog
 * REQ-013-notifications / Backlog Item 24 / Story 2
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as notificationService from '@services/notificationService';

interface NotificationPermissionProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export default function NotificationPermission({
  isOpen,
  onClose,
  onPermissionGranted,
  onPermissionDenied,
}: NotificationPermissionProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnable = async () => {
    setIsRequesting(true);
    const result = await notificationService.requestPermission();
    setIsRequesting(false);

    if (result === 'granted') {
      onPermissionGranted?.();
    } else {
      onPermissionDenied?.();
    }
    onClose();
  };

  const handleNotNow = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔔</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">
                Enable Notifications?
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                Get notified when your price alerts are triggered, even when you're not actively looking at the app.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleNotNow}
                  disabled={isRequesting}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Not Now
                </button>
                <button
                  onClick={handleEnable}
                  disabled={isRequesting}
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors focus-ring"
                >
                  {isRequesting ? 'Requesting...' : 'Enable'}
                </button>
              </div>

              {/* Footer note */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                You can change this later in your browser settings.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
