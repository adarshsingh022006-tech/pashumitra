import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPendingReports, removePendingReport, addPendingReport } from '../offline/idb';
import api from '../services/api';

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingReports, setPendingReports] = useState([]);
  const [syncToast, setSyncToast] = useState(null);

  const loadPendingReports = async () => {
    try {
      const reports = await getPendingReports();
      setPendingReports(reports);
    } catch (e) {
      console.warn('Could not read indexedDB pending reports:', e);
    }
  };

  const syncPendingReports = async () => {
    try {
      const reports = await getPendingReports();
      if (!reports || reports.length === 0) return;

      let syncedCount = 0;
      for (const item of reports) {
        try {
          const { id, queuedAt, syncStatus, ...payload } = item;
          await api.post('/reports', payload);
          await removePendingReport(id);
          syncedCount++;
        } catch (postError) {
          console.warn('Failed to sync item:', item, postError);
        }
      }

      await loadPendingReports();
      if (syncedCount > 0) {
        setSyncToast(`Synced ${syncedCount} report${syncedCount > 1 ? 's' : ''} successfully!`);
        setTimeout(() => setSyncToast(null), 6000);
      }
    } catch (err) {
      console.error('Error during automatic offline sync:', err);
    }
  };

  useEffect(() => {
    loadPendingReports();

    const handleOnline = () => {
      setIsOnline(true);
      syncPendingReports();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueReportOffline = async (reportData) => {
    const id = await addPendingReport(reportData);
    await loadPendingReports();
    return id;
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      pendingReports,
      syncToast,
      dismissSyncToast: () => setSyncToast(null),
      queueReportOffline,
      syncPendingReports,
      loadPendingReports
    }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
