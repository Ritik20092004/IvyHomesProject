import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

export default function Favourites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const res = await api.get('/v1/saved');
      setFavs(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFav = async (id) => {
    try {
      await api.delete(`/v1/saved/${id}`);
      setFavs(favs.filter((item) => (item.listing_id || item.id) !== id));
    } catch (err) {
      alert('Failed to remove saved listing');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Saved Listings</h1>
        <p className="text-xs text-slate-500 mt-1">Per-user synchronized favourites across sessions</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading saved items...</div>
      ) : favs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
          No saved listings yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favs.map((item) => {
            const id = item.listing_id || item.id;
            return (
              <div key={id} className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{item.apartment_name || id}</h3>
                  <p className="text-xs text-slate-500 capitalize">{item.locality}</p>
                  <p className="mt-2 text-base font-bold text-slate-900">₹{Number(item.price).toLocaleString('en-IN')}</p>
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-slate-100 pt-3">
                  <Link to={`/listings/${id}`} className="text-xs text-emerald-600 font-semibold">
                    View →
                  </Link>
                  <button onClick={() => removeFav(id)} className="text-rose-500 hover:text-rose-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}