import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    api.get('/v1/rentals', { params: { offset, limit } }).then((res) => {
      setRentals(res.data.results || []);
      setTotal(res.data.total || 0);
    });
  }, [offset]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Rental Properties[cite: 1]</h1>
        <p className="text-xs text-slate-500 mt-1">Verified rentals with exact security deposit and monthly rent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rentals.map((r) => (
          <div key={r.listing_id} className="bg-white border border-slate-200 rounded-lg p-5">
            <span className="text-xs font-mono uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Rental</span>
            <h3 className="font-semibold text-slate-800 text-sm mt-2">{r.title || `${r.bedroom} BHK in ${r.locality}`}</h3>
            <p className="text-xs text-slate-500 capitalize">{r.locality}</p>
            <div className="mt-3 flex justify-between items-baseline">
              <span className="text-lg font-bold text-slate-900">₹{r.price?.toLocaleString('en-IN')}/mo</span>
              <span className="text-xs text-slate-500">Deposit: ₹{r.deposit?.toLocaleString('en-IN')}[cite: 3]</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs text-slate-500">Showing {offset + 1} - {Math.min(offset + limit, total)} of {total}</span>
        <div className="flex gap-2">
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            disabled={offset + limit >= total}
            onClick={() => setOffset(offset + limit)}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs disabled:opacity-40 flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}