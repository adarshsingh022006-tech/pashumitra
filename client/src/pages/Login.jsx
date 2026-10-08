import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Shield, Stethoscope, User, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('farmer@demo.com');
  const [password, setPassword] = useState('Demo@123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('farmer');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Samrala');
  const [district, setDistrict] = useState('Ludhiana');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoFill = async (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'Demo@123');
      if (demoRole === 'farmer') navigate('/dashboard');
      else if (demoRole === 'vet') navigate('/vet/priority');
      else if (demoRole === 'authority') navigate('/authority');
    } catch (err) {
      setError('Login failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          name,
          email,
          password,
          role,
          phone,
          village,
          district
        });
      } else {
        await login(email, password);
      }

      if (role === 'vet') navigate('/vet/priority');
      else if (role === 'authority') navigate('/authority');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo size="large" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-dark">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500">
            Livestock disease surveillance and early detection platform
          </p>
        </div>

        {/* 1-Click Demo Evaluation Box */}
        <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles size={14} className="text-amber-600" />
            <span>Hackathon 1-Click Evaluation Login</span>
          </div>
          <p className="text-[11px] text-amber-800">
            Select a role below to log in instantly with pre-seeded demo data:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('farmer@demo.com', 'farmer')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-xs font-bold text-pashu-dark shadow-2xs transition-colors flex flex-col items-center gap-1"
            >
              <User size={15} />
              <span>Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('vet@demo.com', 'vet')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-blue-50 border border-blue-300 text-xs font-bold text-navy-light shadow-2xs transition-colors flex flex-col items-center gap-1"
            >
              <Stethoscope size={15} />
              <span>Veterinarian</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('govt@demo.com', 'authority')}
              className="py-2 px-2.5 rounded-xl bg-white hover:bg-purple-50 border border-purple-300 text-xs font-bold text-navy-dark shadow-2xs transition-colors flex flex-col items-center gap-1"
            >
              <Shield size={15} />
              <span>Authority</span>
            </button>
          </div>
        </div>

        {/* Login / Register Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-1.5 text-center transition-colors ${
                !isRegister ? 'text-navy border-b-2 border-navy' : 'text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-1.5 text-center transition-colors ${
                isRegister ? 'text-navy border-b-2 border-navy' : 'text-slate-400'
              }`}
            >
              New Registration
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isRegister && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurdeep Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="vet">Veterinarian</option>
                    <option value="authority">Government Authority</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Village</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-pashu-dark hover:bg-emerald-900 text-white font-bold shadow-xs transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In to PashuRakshak'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/about" className="text-xs text-slate-500 hover:text-slate-800 underline">
            Learn more about the PashuRakshak Intelligence Loop
          </Link>
        </div>
      </div>
    </div>
  );
}
