import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNotifications } from '../context/NotificationContext';
import { useOffline } from '../context/OfflineContext';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { latestAlert, dismissLatestAlert } = useNotifications();
  const { syncToast, dismissSyncToast } = useOffline();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header Navbar */}
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        {/* Global Floating Live Alert Banner (when high-risk or hotspot triggers) */}
        {latestAlert && (
          <div className="mx-4 mt-3 p-3 bg-red-600 text-white rounded-xl shadow-lg flex items-center justify-between gap-3 animate-bounce">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <AlertCircle size={20} className="shrink-0 text-white" />
              <span>{latestAlert.message}</span>
            </div>
            <button
              onClick={dismissLatestAlert}
              className="p-1 hover:bg-red-700 rounded-lg text-white/80 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Global Offline Sync Toast Banner */}
        {syncToast && (
          <div className="mx-4 mt-3 p-3 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <CheckCircle2 size={20} className="shrink-0 text-white" />
              <span>{syncToast}</span>
            </div>
            <button
              onClick={dismissSyncToast}
              className="p-1 hover:bg-emerald-700 rounded-lg text-white/80 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Routed Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
