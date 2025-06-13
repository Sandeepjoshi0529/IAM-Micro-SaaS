// src/context/NotificationContext.js
import React, { createContext } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Stub function for notifications
  const notify = (message) => {
    console.log("Notification:", message);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
    </NotificationContext.Provider>
  );
};
