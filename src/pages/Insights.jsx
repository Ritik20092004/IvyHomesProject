import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Bug } from 'lucide-react';

export default function Insights() {
  return (
    <div className="space-y-6">
      {/* Overview Aggregates */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">City Insights & Integrity Audit[cite: 1]</h1>
        <p className="text-xs text-slate-500 mt-1">
          Calculated directly from full dataset audit for Mumbai (Reference: 2026-09-10T00:00:00+05:30)[cite: 1]
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-400 block uppercase">Total Listings</span>
            <span className="text-xl font-bold text-slate-800">4,950</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-400 block uppercase">Unique Properties</span>
            <span className="text-xl font-bold text-slate-800">4,931</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-400 block uppercase">Active (is_live)</span>
            <span className="text-xl font-bold text-emerald-600">3,892</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-400 block uppercase">Avg 2BHK Price/SqFt</span>
            <span className="text-xl font-bold text-slate-800">₹62,804.13</span>
          </div>
        </div>
      </div>

      {/* Discrepancy & Fraud Report Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 font-bold mb-4">
            <ShieldAlert className="w-5 h-5" />
            <h2>Corrupt Records Identified (31)[cite: 1]</h2>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Physically impossible records: Negative pricing (11), floor exceeding total building height (10), and carpet area exceeding outer super built-up area (10)[cite: 1, 3].
          </p>
          <div className="h-40 overflow-y-auto bg-slate-50 p-2 rounded border border-slate-200 font-mono text-xs space-y-1">
            {[
              "100-5000050", "100-5000339", "100-5002758", "100-5003364", "100-5003914",
              "100-5004028", "DWE-5000518", "DWE-5001929", "DWE-5001932", "DWE-5002147",
              "DWE-5002309", "DWE-5002623", "DWE-5003926", "MAG-5000193", "MAG-5000775",
              "MAG-5001549", "MAG-5001852", "MAG-5001874", "MAG-5002204", "MAG-5003706",
              "SQU-5000538", "SQU-5001700", "SQU-5001891", "SQU-5002700", "SQU-5003006",
              "SQU-5003458", "SQU-5003909", "ZER-5001536", "ZER-5002788", "ZER-5003818",
              "ZER-5004007"
            ].map(id => <div key={id} className="text-rose-600">• {id}</div>)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 font-bold mb-4">
            <Bug className="w-5 h-5" />
            <h2>Identified Documentation Discrepancies</h2>
          </div>
          <ul className="text-xs text-slate-600 space-y-2.5">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Auth Header:</strong> Requires <code>X-API-Key</code> header, query parameter causes 401[cite: 3].</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Token Expiry:</strong> Expires in 900s (15 min) with refresh flow, not 86,400s[cite: 3].</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Pagination:</strong> Uses <code>offset</code> & <code>limit</code>; <code>page</code> is ignored[cite: 1, 3].</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Project Units:</strong> Project prices are quoted in Crores, not integer INR[cite: 1, 3].</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Detail Route:</strong> <code>/v1/listing/:id</code> 404s; true route is <code>/v1/listings/:id</code>[cite: 3].</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}