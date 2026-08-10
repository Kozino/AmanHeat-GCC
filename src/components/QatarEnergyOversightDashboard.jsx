import React from 'react';
import { Lock, Download, ShieldCheck, Award, CheckCircle2, AlertTriangle, Building2, Radio } from 'lucide-react';

export default function QatarEnergyOversightDashboard({ plants }) {
  const totalRecords = plants.length * 3570 + 12800; // Simulated total

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-amber-800/40 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4" />
              <span>QatarEnergy Corporate HSE & Ministry of Labour Oversight Portal</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Macro Compliance Scoring & Zero-Trust Audit Ledger Vault
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl">
              Provides real-time oversight of all Tier-1 contractors operating on QatarEnergy onshore/offshore assets. Every record is cryptographically stamped with SHA-256 hashes to guarantee unalterable legal compliance under Ministerial Decree No. 17 of 2021.
            </p>
          </div>

          <button
            onClick={() => alert('Exporting Official QatarEnergy Certified Compliance Certificate (PDF)...')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Official Audit Certificate (PDF)</span>
          </button>
        </div>

        {/* Corporate Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Overall QatarEnergy Compliance Score</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">98.4%</div>
            <div className="text-[10px] text-emerald-300">Class A Regulatory Health</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Active Monitored EPC Contractors</div>
            <div className="text-2xl font-black text-slate-100 font-mono">14 Prime Partners</div>
            <div className="text-[10px] text-slate-500">Kent, Wood, CCC, McDermott, Chiyoda, etc.</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Cryptographic Ledger Vault</div>
            <div className="text-2xl font-black text-sky-400 font-mono">{totalRecords.toLocaleString()} Hashes</div>
            <div className="text-[10px] text-slate-500">SHA-256 Zero-Trust Records</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Heat Stroke Incidents (2026)</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">0 Incidents</div>
            <div className="text-[10px] text-emerald-300">Zero Lost Time Injuries (LTI)</div>
          </div>
        </div>
      </div>

      {/* Zero-Trust Audit Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Immutable Cryptographic Audit Vault (Ministry Verification Logs)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Status: Live SHA-256 Verification Queue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">Plant & Work Zone</th>
                <th className="p-3">EPC Contractor</th>
                <th className="p-3">WBGT Temp</th>
                <th className="p-3">Ingestion Source</th>
                <th className="p-3">Legal Status</th>
                <th className="p-3">SHA-256 Audit Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {plants.map((plant) => (
                <tr key={plant.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-semibold text-slate-100">{plant.name}</td>
                  <td className="p-3 text-amber-400 font-medium">{plant.operator}</td>
                  <td className="p-3 font-mono font-bold text-amber-300">{plant.wbgt}°C</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{plant.sensorModel}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        plant.status === 'CRITICAL_STOP'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : plant.status === 'MANDATORY_REST'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {plant.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-sky-400">{plant.shaHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
