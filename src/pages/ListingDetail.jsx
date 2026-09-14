import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Bookmark, CheckCircle2, ArrowLeft, Building, Phone } from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/v1/listings/${id}`);
      setListing(res.data);

      const savedRes = await api.get('/v1/saved');
      const exists = (savedRes.data.results || []).some(
        (item) => (item.listing_id || item.id) === id
      );
      setIsSaved(exists);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = async () => {
    try {
      if (isSaved) {
        await api.delete(`/v1/saved/${id}`);
        setIsSaved(false);
      } else {
        await api.post('/v1/saved', { listing_id: id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Save error:', err.response?.data);
      alert(err.response?.data?.detail || 'Failed to update saved listing');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading details...</div>;
  if (!listing) return <div className="p-8 text-center text-rose-500">Listing not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" /> Back to Listings
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {listing.listing_id}
              </span>
              {listing.is_verified && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{listing.apartment_name}</h1>
            <p className="text-slate-500 text-sm capitalize">{listing.locality}, Mumbai</p>
          </div>
          <button
            onClick={toggleFavourite}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              isSaved ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {isSaved ? 'Saved' : 'Save Property'}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block uppercase">Price</span>
            <span className="text-lg font-bold text-slate-800">₹{Number(listing.price).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase">Carpet Area</span>
            <span className="text-lg font-bold text-slate-800">{listing.carpet_area} sqft[cite: 3]</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase">Bedrooms</span>
            <span className="text-lg font-bold text-slate-800">{listing.bedroom} BHK</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase">Floor</span>
            <span className="text-lg font-bold text-slate-800">{listing.floor} of {listing.total_floors}</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {listing.description || 'No description provided by seller.'}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500 pt-4 border-t border-slate-100">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {listing.posted_by_contact || 'Contact not listed'}[cite: 3]</span>
          {listing.project_id && (
            <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Project: {listing.project_id}[cite: 3]</span>
          )}
          <span>Furnishing: {listing.furnishing}[cite: 3]</span>
          <span>Posted: {new Date(listing.posted_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}