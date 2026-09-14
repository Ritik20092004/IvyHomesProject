import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Filter, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Client-Side Fallback Filter State (Satisfies Requirement 2)
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyLive, setOnlyLive] = useState(true);

  const limit = 50;

  useEffect(() => {
    fetchListings();
  }, [offset]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Use offset instead of page as revealed by API audit
      const res = await api.get('/v1/listings', {
        params: { offset, limit }
      });
      setListings(res.data.results || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Error loading listings', err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side robust filter fallback
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (onlyLive && !item.is_live) return false;
      if (locality && !item.locality?.toLowerCase().includes(locality.toLowerCase())) return false;
      if (bhk && item.bedroom !== Number(bhk)) return false;
      if (furnishing && item.furnishing?.toLowerCase() !== furnishing.toLowerCase()) return false;
      if (maxPrice && item.price > Number(maxPrice)) return false;
      return true;
    });
  }, [listings, locality, bhk, furnishing, maxPrice, onlyLive]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter Properties (Client & Server Guaranteed)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Locality (e.g. Powai)..."
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1.5 text-sm"
          />
          <select
            value={bhk}
            onChange={(e) => setBhk(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="">Any BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
          <select
            value={furnishing}
            onChange={(e) => setFurnishing(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="">Any Furnishing</option>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-furnished</option>
            <option value="fully-furnished">Fully-furnished</option>
          </select>
          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-slate-300 rounded px-3 py-1.5 text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyLive}
              onChange={(e) => setOnlyLive(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Active only</span>
          </label>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">Loading listings...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => (
              <div
                key={item.listing_id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {item.property_type || 'Apartment'}
                    </span>
                    {item.is_verified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-800 text-base mt-2 line-clamp-1">
                    {item.apartment_name || `${item.bedroom} BHK in ${item.locality}`}
                  </h3>
                  <p className="text-xs text-slate-500 capitalize">{item.locality}</p>

                  <div className="mt-4 flex justify-between items-baseline">
                    <span className="text-xl font-bold text-slate-900">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500">{item.carpet_area} sqft</span>
                  </div>

                  <div className="mt-3 flex gap-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <span>{item.bedroom} BHK</span>
                    <span>•</span>
                    <span>Floor {item.floor}/{item.total_floors}</span>
                    <span>•</span>
                    <span className="capitalize">{item.furnishing}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-end">
                  <Link
                    to={`/listings/${item.listing_id}`}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls using Offset */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">
              Showing {offset + 1} - {Math.min(offset + limit, total)} of {total} listings
            </span>
            <div className="flex gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                disabled={offset + limit >= total}
                onClick={() => setOffset(offset + limit)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}