import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Sliders, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { NICHES } from '../data/niches';
import { US_CITIES, getStateForCity } from '../data/cities';
import { SearchParams } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isProcessing: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isProcessing }) => {
  const [selectedNiche, setSelectedNiche] = useState<string>(NICHES[0].id);
  const [selectedCity, setSelectedCity] = useState<string>('Austin');
  const [selectedState, setSelectedState] = useState<string>('Texas');
  const [leadLimit, setLeadLimit] = useState<number>(5);
  const [cityQuery, setCityQuery] = useState<string>('');
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);

  // Sync state whenever city changes from city list
  useEffect(() => {
    const cityData = getStateForCity(selectedCity);
    if (cityData) {
      setSelectedState(cityData.state);
    }
  }, [selectedCity]);

  const handleSelectCity = (cityName: string) => {
    const cityData = getStateForCity(cityName);
    setSelectedCity(cityName);
    if (cityData) {
      setSelectedState(cityData.state);
    }
    setCityQuery('');
    setShowCityDropdown(false);
  };

  const filteredCities = US_CITIES.filter(c =>
    c.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(cityQuery.toLowerCase())
  ).slice(0, 8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      nicheId: selectedNiche,
      cityName: selectedCity,
      stateName: selectedState,
      limit: leadLimit,
      requireWebsiteOnly: true,
    });
  };

  const selectedNicheObj = NICHES.find(n => n.id === selectedNiche);

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-950/40 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" /> Lead Targeting & Extraction
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Target local US businesses, extract emails, capture screenshots, and generate cold drafts.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Website Required
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Niche Selection */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Target Niche
            </label>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              {NICHES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection with 100+ cities */}
          <div className="md:col-span-4 space-y-1.5 relative">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" /> US City Location
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => handleSelectCity(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
              >
                {US_CITIES.map((c, idx) => (
                  <option key={`${c.name}-${c.stateCode}-${idx}`} value={c.name}>
                    {c.name}, {c.stateCode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* State Auto-mapped (READONLY / DISABLED as required) */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-medium text-slate-400 flex items-center gap-1">
              Mapped State
            </label>
            <input
              type="text"
              value={selectedState}
              readOnly
              disabled
              title="State is automatically mapped from the selected US city for data integrity"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 font-medium cursor-not-allowed select-none"
            />
          </div>

          {/* Lead Batch Count Limit */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Lead Limit
            </label>
            <select
              value={leadLimit}
              onChange={(e) => setLeadLimit(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value={3}>3 Leads</option>
              <option value={5}>5 Leads</option>
              <option value={8}>8 Leads</option>
              <option value={10}>10 Leads</option>
            </select>
          </div>
        </div>

        {/* Niche Insights summary bar */}
        {selectedNicheObj && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900/60 border border-slate-700/50 rounded-xl px-3.5 py-2 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-medium">Common CRO Gaps:</span>
              <span className="text-slate-400 truncate max-w-md sm:max-w-xl">
                {selectedNicheObj.commonProblems.join(' • ')}
              </span>
            </div>
            <span className="text-slate-400 italic">Targeting {selectedCity}, {selectedState}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Find & Audit Leads</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
