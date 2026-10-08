import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skull, MapPin, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function ReportMortality() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    species: 'cow',
    count: 1,
    suspected_cause: '',
    date_of_death: new Date().toISOString().split('T')[0],
    latitude: 30.9010,
    longitude: 75.8572,
    village: 'Samrala',
    district: 'Ludhiana',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/reports/mortality', {
        ...formData,
        count: parseInt(formData.count) || 1,
        latitude: parseFloat(formData.latitude) || 30.9010,
        longitude: parseFloat(formData.longitude) || 75.8572
      });
      setSuccess('Mortality signal recorded! Risk fusion engine updated with epidemiological mortality alert.');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit mortality report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="p-3 rounded-xl bg-rose-100 text-rose-700">
            <Skull size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Report Livestock Mortality
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Mortality reports feed directly into spatial-temporal risk fusion to trigger early outbreak detection.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Species *
              </label>
              <select
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white capitalize"
              >
                {['cow', 'buffalo', 'goat', 'sheep', 'pig', 'poultry'].map(sp => (
                  <option key={sp} value={sp}>{sp.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Number of Animals Deceased *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Suspected Cause or Ante-Mortem Signs *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sudden recumbency, high fever with throat swelling, respiratory distress"
              value={formData.suspected_cause}
              onChange={(e) => setFormData({ ...formData, suspected_cause: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Date of Death *
              </label>
              <input
                type="date"
                required
                value={formData.date_of_death}
                onChange={(e) => setFormData({ ...formData, date_of_death: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Village / Locality *
              </label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                District *
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Additional Circumstances / Flock History
            </label>
            <textarea
              rows={3}
              placeholder="Provide flock size, water source changes, or other animals showing similar early symptoms..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Register Mortality Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
