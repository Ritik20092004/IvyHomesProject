import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/v1/projects', { params: { limit: 50, offset: 0 } }).then((res) => {
      setProjects(res.data.results || []);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Builder Projects</h1>
        <p className="text-xs text-slate-500 mt-1">Normalized price ranges (converted from Cr to raw INR)[cite: 1, 3]</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => {
          // Fix Unit Lie: Project prices in API are Crores, convert to INR for honest UI[cite: 1, 3]
          const minINR = p.price_min < 1000 ? p.price_min * 10000000 : p.price_min;
          const maxINR = p.price_max < 1000 ? p.price_max * 10000000 : p.price_max;

          return (
            <div key={p.project_id} className="bg-white border border-slate-200 rounded-lg p-5">
              <span className="text-xs font-mono uppercase bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                {p.project_id}
              </span>
              <h3 className="font-semibold text-slate-800 text-sm mt-2">{p.apartment_name}</h3>
              <p className="text-xs text-slate-500 capitalize">{p.locality} • By {p.developer_name}[cite: 3]</p>
              
              <div className="mt-3 bg-slate-50 p-2.5 rounded border border-slate-100">
                <span className="text-xs text-slate-500 block">Price Range[cite: 3]</span>
                <span className="text-sm font-bold text-slate-800">
                  ₹{(minINR / 10000000).toFixed(2)} Cr - ₹{(maxINR / 10000000).toFixed(2)} Cr
                </span>
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Units: {p.total_units}[cite: 3]</span>
                <span>Listings: {p.total_listings}[cite: 3]</span>
                <span>RERA: {p.rera_number ? 'Yes' : 'N/A'}[cite: 3]</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}