import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Filter, 
  Clock, 
  Building2, 
  Users, 
  X,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { LoadingSpinner, EmptyState } from '../../components/common/UIComponents';

export function ExploreEvents() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [clubId, setClubId] = useState('');
  const [venueId, setVenueId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    async function loadFilters() {
      try {
        const [clubsRes, venuesRes] = await Promise.all([
          api.get('/clubs'),
          api.get('/venues')
        ]);
        setClubs(clubsRes.data.clubs || []);
        setVenues(venuesRes.data.venues || []);
      } catch (err) {
        console.error('Failed to load filter options', err);
      }
    }
    loadFilters();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (clubId) params.clubId = clubId;
      if (venueId) params.venueId = venueId;
      if (date) params.date = date;

      const res = await api.get('/events', { params });
      setEvents(res.data.events || []);
    } catch (err) {
      console.error('Failed to search events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, category, clubId, venueId, date]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setClubId('');
    setVenueId('');
    setDate('');
  };

  const hasActiveFilters = Boolean(search || category || clubId || venueId || date);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262B32] tracking-tight">
          Explore Campus Events
        </h1>
        <p className="text-sm text-[#68635D] mt-1">
          Discover hackathons, workshops, cultural nights, and guest lectures across Thapar campus.
        </p>
      </div>

      {/* Search & Filters Card */}
      <div className="bg-[#FFFDFC] rounded-3xl p-5 border border-[#DFD0BE] shadow-xs space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#8C857D] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, organizing club, or keywords..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-[#F6F3EE] border border-[#DFD0BE] rounded-2xl text-[#262B32] placeholder:text-[#9CA3AF] focus:bg-[#FFFDFC] focus:ring-2 focus:ring-[#B8956B] focus:outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#68635D] hover:text-[#262B32]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#68635D] uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F3EE] border border-[#DFD0BE] rounded-xl text-[#262B32] focus:ring-2 focus:ring-[#B8956B] focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Literary">Literary</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Creative">Creative</option>
              <option value="Sports">Sports</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#68635D] uppercase tracking-wider mb-1">
              Organizing Club
            </label>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F3EE] border border-[#DFD0BE] rounded-xl text-[#262B32] focus:ring-2 focus:ring-[#B8956B] focus:outline-none"
            >
              <option value="">All Clubs</option>
              {clubs.map((c) => (
                <option key={c.club_id} value={c.club_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#68635D] uppercase tracking-wider mb-1">
              Venue
            </label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F3EE] border border-[#DFD0BE] rounded-xl text-[#262B32] focus:ring-2 focus:ring-[#B8956B] focus:outline-none"
            >
              <option value="">All Venues</option>
              {venues.map((v) => (
                <option key={v.venue_id} value={v.venue_id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#68635D] uppercase tracking-wider mb-1">
              Event Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6F3EE] border border-[#DFD0BE] rounded-xl text-[#262B32] focus:ring-2 focus:ring-[#B8956B] focus:outline-none"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#DFD0BE] text-xs">
            <span className="text-[#68635D]">
              Showing filtered results ({events.length} found)
            </span>
            <button
              onClick={clearFilters}
              className="text-[#87613B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner message="Searching published campus events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events matched your search"
          description="Try relaxing your filters or check back later for new club announcements."
          actionText="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.event_id}
              className="bg-[#FFFDFC] rounded-3xl border border-[#DFD0BE] p-6 shadow-xs hover:border-[#B8956B] hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#262B32] bg-[#EDE5D9] px-3 py-1 rounded-full border border-[#DFD0BE]">
                    {evt.category}
                  </span>
                  
                  {evt.is_full ? (
                    <span className="text-xs font-bold text-[#B83D3D] bg-[#B83D3D]/10 px-2.5 py-0.5 rounded-full border border-[#B83D3D]/30">
                      Full Capacity
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#237451] bg-[#237451]/10 px-2.5 py-0.5 rounded-full border border-[#237451]/30">
                      {evt.remaining_capacity} seats left
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#262B32] mb-1 group-hover:text-[#87613B] transition-colors line-clamp-1">
                  {evt.title}
                </h3>
                
                <p className="text-xs font-medium text-[#68635D] mb-4">
                  {evt.club_name}
                </p>

                <p className="text-xs text-[#68635D] line-clamp-2 mb-5 leading-relaxed">
                  {evt.description || 'Join this exciting campus event organized by the club.'}
                </p>

                {/* Event Schedule & Location */}
                <div className="bg-[#F6F3EE] rounded-2xl p-3.5 border border-[#DFD0BE]/60 text-xs text-[#68635D] space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#87613B] flex-shrink-0" />
                    <span className="font-semibold text-[#262B32]">{evt.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#87613B] flex-shrink-0" />
                    <span className="text-[#262B32]">{evt.start_time} - {evt.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#87613B] flex-shrink-0" />
                    <span className="truncate text-[#262B32]">{evt.venue_name || 'Campus Venue'} ({evt.venue_building || 'Campus'})</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/student/events/${evt.event_id}`}
                className="w-full py-3 px-4 bg-[#262B32] hover:bg-[#191F24] text-white text-xs font-bold rounded-2xl text-center shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <span>View Event Details</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
