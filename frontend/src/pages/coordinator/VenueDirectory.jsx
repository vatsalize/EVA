import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Users, 
  Clock, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Calendar 
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, Badge, EmptyState } from '../../components/common/UIComponents';

export function VenueDirectory() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [capacityFilter, setCapacityFilter] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params = {};
      if (capacityFilter) params.capacity = capacityFilter;
      if (facilityFilter) params.facility = facilityFilter;
      const res = await api.get('/venues', { params });
      
      let list = res.data.venues || [];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(v => v.name.toLowerCase().includes(s) || v.building.toLowerCase().includes(s));
      }
      setVenues(list);
    } catch (err) {
      console.error('Failed to load venues', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [capacityFilter, facilityFilter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Campus Venue Directory
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore approved auditoriums, lecture theatres, halls, and labs available for club reservations.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Search Venue / Block
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue name or building..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Minimum Capacity
          </label>
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none bg-white"
          >
            <option value="">Any Capacity</option>
            <option value="50">50+ Attendees</option>
            <option value="100">100+ Attendees</option>
            <option value="200">200+ Attendees</option>
            <option value="400">400+ Attendees</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Required Equipment
          </label>
          <select
            value={facilityFilter}
            onChange={(e) => setFacilityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-900 focus:outline-none bg-white"
          >
            <option value="">Any Facilities</option>
            <option value="projector">Projector</option>
            <option value="sound_system">Sound System</option>
            <option value="air_conditioning">Air Conditioning</option>
            <option value="stage">Stage</option>
            <option value="wifi">Wi-Fi</option>
          </select>
        </div>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <LoadingSpinner message="Loading campus venues..." />
      ) : venues.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No venues match your criteria"
          description="Try broadening your capacity or equipment filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {venues.map((v) => (
            <div
              key={v.venue_id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-brand-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500">{v.venue_id}</span>
                  <Badge variant={v.status === 'ACTIVE' ? 'success' : 'warning'}>
                    {v.status}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{v.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{v.building}</p>

                <div className="space-y-2 text-xs text-slate-600 mb-5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-700" />
                    <span className="font-semibold text-slate-900">{v.capacity} Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-700" />
                    <span>Operating: {v.operating_start} - {v.operating_end}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Installed Amenities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {v.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium capitalize"
                      >
                        {fac.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
