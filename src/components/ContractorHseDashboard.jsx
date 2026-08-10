import React, { useState } from 'react';
import { Radio, Bell, ShieldCheck, Download, Plus, HardHat, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import ManualDataEntryModal from './ManualDataEntryModal';

export default function ContractorHseDashboard({ plants, setPlants }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMeasurement = (newRecord) => {
    setPlants([newRecord, ...plants]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Manual Entry Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HardHat className="w-4 h-4" />
            <span>Contractor HSE Officer Control Center (Tier-1 EPC Operations)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Real-Time Zone Shift Management & Data Ingestion
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Ingests live Modbus/MQTT streams from installed ATEX sensors. For un-instrumented remote work fronts or scaffolding decks, HSE officers can submit verified field readings below.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Field Data Entry</span>
        </button>
      </div>

      {/* Real-Time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Active Monitored Work Fronts</div>
          <div className="text-2xl font-black text-sky-400 font-mono">{plants.length} Zones</div>
          <p className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>ATEX Probes & HSE Officer Field Feeds</span>
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Active 30/30 Rest Cycles</div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {plants.filter((p) => p.status === 'MANDATORY_REST').length} Work Fronts
          </div>
          <p className="text-[10px] text-amber-300">30-min cooling breaks enforced</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Critical Outdoor Work Halts</div>
          <div className="text-2xl font-black text-red-500 font-mono">
            {plants.filter((p) => p.status === 'CRITICAL_STOP').length} Work Fronts
          </div>
          <p className="text-[10px] text-red-400">WBGT &gt; 32.1°C Total Work Stop</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">PA / Signage Dispatches</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">100% Synced</div>
          <p className="text-[10px] text-slate-400">Automated Plant Board Displays</p>
        </div>
      </div>

      {/* Monitored Work Fronts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className={`bg-slate-900 border rounded-2xl p-6 space-y-4 shadow-xl ${
              plant.status === 'CRITICAL_STOP'
                ? 'border-red-600/70 shadow-red-950/20'
                : plant.status === 'MANDATORY_REST'
                ? 'border-amber-500/50 shadow-amber-950/20'
                : 'border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  <span>{plant.atexClass}</span>
                  {plant.isManual && (
                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono">
                      Manual Field Entry
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-extrabold text-slate-100">{plant.name}</h3>
                <p className="text-xs text-amber-400/90 font-medium">{plant.operator}</p>
                <p className="text-xs text-slate-400">{plant.zone}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                  plant.status === 'CRITICAL_STOP'
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                    : plant.status === 'MANDATORY_REST'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {plant.status === 'CRITICAL_STOP'
                  ? 'Critical Work Stop 🔴'
                  : plant.status === 'MANDATORY_REST'
                  ? 'Mandatory Rest 🟡'
                  : 'Normal 🟢'}
              </span>
            </div>

            {/* Temperatures Row */}
            <div className="grid grid-cols-3 gap-3 text-center bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">WBGT Heat</div>
                <div
                  className={`text-xl font-black ${
                    plant.wbgt >= 32.1
                      ? 'text-red-500'
                      : plant.wbgt >= 31.1
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {plant.wbgt}°C
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Ambient Air</div>
                <div className="text-xl font-bold text-slate-200">{plant.ambient}°C</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Humidity</div>
                <div className="text-xl font-bold text-sky-400">{plant.humidity}%</div>
              </div>
            </div>

            {/* Details */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Data Ingestion Source:</span>
                <span className="font-mono text-slate-200">{plant.sensorModel}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Legal Shift Constraint:</span>
                <span className="font-bold text-amber-400">{plant.cycle}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Sign-off Supervisor:</span>
                <span className="text-emerald-400 font-medium">{plant.ackSupervisor}</span>
              </div>
            </div>

            {/* PA / LED Dispatch Box */}
            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs space-y-1">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Plant Public Address & Digital LED Board Broadcast
              </div>
              <p className="text-slate-200 font-mono text-[11px]">{plant.signageText}</p>
              <p className="text-[10px] text-slate-400">{plant.paBroadcastStatus}</p>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                onClick={() =>
                  alert(
                    `Manual Override / Push Alert executed for ${plant.name}.\n\nBroadcast Message: "${plant.signageText}"\nDispatched to zone LED boards & supervisor WhatsApp.`
                  )
                }
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center justify-center space-x-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Push PA & LED Alert</span>
              </button>

              <button
                onClick={() =>
                  alert(
                    `Audit Hash Verification:\n\nSHA-256 Stamp: ${plant.shaHash}\nTimestamped and queued for Ministry Audit.`
                  )
                }
                className="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify SHA-256 Ledger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ManualDataEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMeasurement={handleAddMeasurement}
      />
    </div>
  );
}
