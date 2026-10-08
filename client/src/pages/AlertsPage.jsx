import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  Compass,
  Calendar,
  CheckCircle2,
  CheckCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function AlertsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'high_risk') return n.type === 'high_risk_alert';
    if (filter === 'hotspot') return n.type === 'hotspot_warning';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-dark">
              Early-Warning Alerts & Notices
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Real-time notifications dispatched for critical risk detections, veterinary visits, and active outbreak clusters.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors self-start"
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'all' ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'unread' ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('high_risk')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'high_risk' ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          High-Risk Alerts
        </button>
        <button
          onClick={() => setFilter('hotspot')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'hotspot' ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Hotspot Warnings
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
            No alerts found matching this filter.
          </div>
        ) : (
          filtered.map((n) => {
            const isHighRisk = n.type === 'high_risk_alert';
            const isHotspot = n.type === 'hotspot_warning';

            return (
              <div
                key={n.id}
                onClick={() => !n.is_read && markAsRead(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  !n.is_read
                    ? isHighRisk
                      ? 'bg-red-50/70 border-red-200 shadow-xs'
                      : 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isHighRisk
                        ? 'bg-red-100 text-red-700'
                        : isHotspot
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {isHighRisk ? (
                      <AlertTriangle size={20} />
                    ) : isHotspot ? (
                      <Compass size={20} />
                    ) : (
                      <Calendar size={20} />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {n.title}
                      </h3>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping"></span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>

                    <span className="text-[11px] text-slate-400 block pt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {n.report_id && (
                  <Link
                    to={`/case/${n.report_id}`}
                    className="shrink-0 p-2 text-navy hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 self-center"
                  >
                    <span>View</span>
                    <ChevronRight size={15} />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
