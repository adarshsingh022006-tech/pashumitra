import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  Cpu,
  Share2,
  BellRing,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Stethoscope,
  Activity,
  Layers,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (email) => {
    try {
      await login(email, 'Demo@123');
      if (email.startsWith('farmer')) navigate('/dashboard');
      else if (email.startsWith('vet')) navigate('/vet/priority');
      else if (email.startsWith('govt')) navigate('/authority');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-2xs">
          <Sparkles size={14} className="text-emerald-600" />
          <span>Livestock Disease Early-Detection & Early-Warning Platform</span>
        </div>

        <div className="flex justify-center">
          <BrandLogo size="large" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-navy-dark tracking-tight max-w-3xl mx-auto">
          From Farmer Reports to Early-Warning Action
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
          A voice-enabled, offline-first livestock disease early-detection and surveillance platform fusing clinical AI risk modeling with spatial-temporal outbreak tracking.
        </p>

        {/* Core Tagline Banner: EXACT MATCH */}
        <div className="inline-block px-6 py-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-black text-sm sm:text-base shadow-xs">
          "Multiple weak signals &rarr; one actionable risk signal"
        </div>

        {/* 1-Click Role Login Shortcuts */}
        <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => handleQuickLogin('farmer@demo.com')}
            className="px-5 py-2.5 rounded-xl bg-pashu-dark hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            Farmer Demo &rarr;
          </button>
          <button
            onClick={() => handleQuickLogin('vet@demo.com')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            Veterinarian Demo &rarr;
          </button>
          <button
            onClick={() => handleQuickLogin('govt@demo.com')}
            className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-dark text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            Government Authority Demo &rarr;
          </button>
        </div>
      </div>

      {/* PASHUMITRA INTELLIGENCE LOOP - Exact recreation */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            End-To-End Surveillance Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-dark">
            The PashuMitra Intelligence Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Transforming fragmented grassroots farm reports into verified community biosecurity actions in four coordinated phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: CAPTURE */}
          <div
            className="rounded-2xl p-5 border border-slate-300/80 shadow-xs space-y-3 relative"
            style={{ backgroundColor: '#DCD6F7' }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-white text-navy font-black text-xs">
                01 • CAPTURE
              </span>
              <Mic size={20} className="text-navy" />
            </div>
            <h3 className="font-bold text-base text-navy-dark">Grassroots Ingestion</h3>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
              <li>• Multilingual Voice Dictation (English, Hindi, Punjabi)</li>
              <li>• 10 Symptom Chips & Herd Registry</li>
              <li>• GPS Location + Offline-first IndexedDB queue</li>
              <li>• Ante-mortem herd mortality reports</li>
            </ul>
          </div>

          {/* Step 2: ASSESS */}
          <div
            className="rounded-2xl p-5 border border-slate-300/80 shadow-xs space-y-3 relative"
            style={{ backgroundColor: '#F4B6B0' }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-white text-red-900 font-black text-xs">
                02 • ASSESS
              </span>
              <Cpu size={20} className="text-red-800" />
            </div>
            <h3 className="font-bold text-base text-red-950">AI Risk Classification</h3>
            <ul className="text-xs text-red-950 space-y-1.5 font-medium">
              <li>• Random Forest Classifier trained at server start</li>
              <li>• 19-dimensional clinical feature vector</li>
              <li>• Clinically calibrated fallback engine</li>
              <li>• High / Medium / Low with transparent reasoning</li>
            </ul>
          </div>

          {/* Step 3: CONNECT */}
          <div
            className="rounded-2xl p-5 border border-slate-300/80 shadow-xs space-y-3 relative"
            style={{ backgroundColor: '#C8E6C9' }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-white text-emerald-900 font-black text-xs">
                03 • CONNECT
              </span>
              <Share2 size={20} className="text-emerald-800" />
            </div>
            <h3 className="font-bold text-base text-emerald-950">Spatial-Temporal Fusion</h3>
            <ul className="text-xs text-emerald-950 space-y-1.5 font-medium">
              <li>• Haversine DBSCAN Hotspot Detection</li>
              <li>• 5 km radius, 14-day temporal window</li>
              <li>• OpenWeatherMap heat/humidity environmental context</li>
              <li>• Automatic boundary clustering (28 reports, 7 high-risk)</li>
            </ul>
          </div>

          {/* Step 4: ACT */}
          <div
            className="rounded-2xl p-5 border border-slate-300/80 shadow-xs space-y-3 relative"
            style={{ backgroundColor: '#F5E6DA' }}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-white text-amber-900 font-black text-xs">
                04 • ACT
              </span>
              <BellRing size={20} className="text-amber-800" />
            </div>
            <h3 className="font-bold text-base text-amber-950">Early-Warning Response</h3>
            <ul className="text-xs text-amber-950 space-y-1.5 font-medium">
              <li>• Live SSE alerts dispatched to veterinarians</li>
              <li>• Mobile clinic visit scheduling & treatments</li>
              <li>• Human-in-the-loop: "AI-assisted, vet-verified"</li>
              <li>• Government ring-vaccination containment advisory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo Credentials & Quick Switch Guide */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">
              Hackathon Evaluation Guide & Demo Credentials
            </h3>
            <p className="text-xs text-slate-400">
              Pre-configured test accounts with simulated outbreak cluster in Ludhiana, Punjab.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-emerald-400 rounded-full border border-slate-700">
            Password: Demo@123
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-emerald-400 block uppercase">1. Farmer Role</span>
            <div className="font-mono text-slate-300">farmer@demo.com</div>
            <p className="text-[11px] text-slate-400">
              Report sick cows via voice, view herd cards, check local weather and pending offline reports.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-blue-400 block uppercase">2. Veterinarian Role</span>
            <div className="font-mono text-slate-300">vet@demo.com</div>
            <p className="text-[11px] text-slate-400">
              Access Priority Triage queue, verify AI assessments, prescribe medicines, and schedule on-site visits.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
            <span className="font-bold text-amber-400 block uppercase">3. Government Authority</span>
            <div className="font-mono text-slate-300">govt@demo.com</div>
            <p className="text-[11px] text-slate-400">
              District surveillance matrix, Recharts epidemiological curves, and official BAHS 2025 mortality statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
