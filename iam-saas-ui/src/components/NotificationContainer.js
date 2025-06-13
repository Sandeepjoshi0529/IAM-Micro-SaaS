import React from 'react';
import Notification from './Notification';
import { useNotification } from '../context/NotificationContext';

export default function NotificationContainer() {
  const { notification, hideNotification } = useNotification();

  return (
    <Notification
      open={notification.open}
      onClose={hideNotification}
      severity={notification.severity}
      message={notification.message}
    />
  );
}
