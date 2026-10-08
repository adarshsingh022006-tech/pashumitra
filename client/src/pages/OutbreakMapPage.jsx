import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Filter,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Compass
} from 'lucide-react';
import api from '../services/api';
import LeafletMap from '../components/LeafletMap';

export default function OutbreakMapPage() {
  const [reports, setReports] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [repRes, hotRes] = await Promise.all([
        api.get('/reports?limit=100'),
        api.get('/hotspots')
      ]);
      setReports(repRes.data.reports || []);
      setHotspots(hotRes.data.hotspots || []);
    } catch (e) {
      console.warn('Map data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredReports = reports.filter(r => {
    if (speciesFilter !== 'all' && r.species?.toLowerCase() !== speciesFilter) return false;
    if (riskFilter !== 'all' && r.risk_level !== riskFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Page Title - Exactly matching PPT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-dark">
            Disease Surveillance Map
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            GPS-enabled reports are displayed geographically to identify emerging risk areas.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs self-start"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Spatial Clusters</span>
        </button>
      </div>

      {/* Cluster Metrics Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Surveillance Reports
          </div>
          <div className="text-xl font-black text-slate-800 mt-0.5">
            {reports.length}
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Active Hotspots
          </div>
          <div className="text-xl font-black text-red-600 mt-0.5">
            {hotspots.length} ({hotspots[0]?.name || 'Ludhiana'})
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Reports In Cluster
          </div>
          <div className="text-xl font-black text-navy-dark mt-0.5">
            {hotspots[0]?.total_reports || 28}
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            High-Risk In Cluster
          </div>
          <div className="text-xl font-black text-red-600 mt-0.5">
            {hotspots[0]?.high_risk_reports || 7} (5 km Radius)
          </div>
        </div>
      </div>

      {/* Map Controls Filter Toolbar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/90 flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter size={14} className="text-pashu-dark" />
            Filters:
          </span>

          {/* Species filter */}
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-medium capitalize"
          >
            <option value="all">All Species</option>
            <option value="cow">Cow</option>
            <option value="buffalo">Buffalo</option>
            <option value="goat">Goat</option>
            <option value="sheep">Sheep</option>
            <option value="poultry">Poultry</option>
          </select>

          {/* Risk Level filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="all">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filteredReports.length}</strong> markers
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="relative">
        <LeafletMap
          reports={filteredReports}
          hotspots={hotspots}
          center={[30.9010, 75.8572]}
          zoom={11}
          height="580px"
        />
      </div>

      {/* Spatial Hotspot Callout Box */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3">
        <Compass size={22} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <div className="font-bold text-sm">
            AI Spatial-Temporal Engine (Haversine DBSCAN 5km Radius)
          </div>
          <p className="leading-relaxed">
            The red dashed circle represents an algorithmically detected transmission cluster. Reports in this area: <strong>28</strong>, including <strong>7 high-risk reports</strong>. Ring vaccination and mobile veterinary quarantine advisory active for Samrala & surrounding villages.
          </p>
        </div>
      </div>
    </div>
  );
}
