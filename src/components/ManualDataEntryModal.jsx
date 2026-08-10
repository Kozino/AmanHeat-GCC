import React, { useState } from 'react';
import { calculateWbgt, evaluateQatarHeatLaw, generateSha256Stamp } from '../services/atexIngestionEngine';
import { ShieldAlert, HardHat, Flame, Check, X, FileText, AlertTriangle } from 'lucide-react';

export default function ManualDataEntryModal({ isOpen, onClose, onAddMeasurement }) {
  const [zoneName, setZoneName] = useState('Scaffolding Deck Phase 3 - Height +28m');
  const [contractorId, setContractorId] = useState('Kent / Wood JV (ID: EPC-8801)');
  const [officerName, setContractorOfficerName] = useState('Sanjay Patel (HSE Officer)');
  const [entryMode, setEntryMode] = useState('direct'); // 'direct' or 'components'
  
  const [directWbgt, setDirectWbgt] = useState(31.5);
  const [tnw, setTnw] = useState(30.2);
  const [tg, setTg] = useState(48.5);
  const [td, setTd] = useState(42.1);
  
  const [metabolicWorkload, setMetabolicWorkload] = useState('Heavy'); // 'Light', 'Moderate', 'Heavy', 'Very Heavy'
  const [workerCount, setWorkerCount] = useState(45);
  const [shadeWaterChecked, setShadeWaterChecked] = useState(true);

  if (!isOpen) return null;

  const finalWbgt = entryMode === 'direct' ? Number(directWbgt) : calculateWbgt(Number(tnw), Number(tg), Number(td), true);
  const legalEval = evaluateQatarHeatLaw(finalWbgt);

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const newRecord = {
      id: `MANUAL-${Date.now()}`,
      name: zoneName,
      operator: contractorId,
      zone: `Work Front: ${zoneName} (${metabolicWorkload} Workload)`,
      atexClass: 'Manual HSE Officer Calibrated Instrument Entry',
      sensorModel: `Handheld Calibrated Kestrel Probe (Entry by ${officerName})`,
      wbgt: finalWbgt,
      ambient: entryMode === 'direct' ? 42.0 : Number(td),
      humidity: 58,
      status: legalEval.status,
      cycle: legalEval.cycle,
      signageText: legalEval.signageText,
      paBroadcastStatus: 'Dispatched to Local Zone Radio & LED Board',
      ackSupervisor: officerName,
      ackTime: 'Just Now (Manual Entry)',
      shaHash: generateSha256Stamp(zoneName, timestamp, finalWbgt, legalEval.status),
      isManual: true,
      workerCount,
      shadeWaterChecked
    };

    onAddMeasurement(newRecord);
    alert(`Manual Reading Logged Successfully!\n\nZone: ${zoneName}\nWBGT: ${finalWbgt}°C\nLegal Status: ${legalEval.status}\nSHA-256 Hash: ${newRecord.shaHash}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <HardHat className="w-4 h-4" />
              <span>Contractor HSE Field Data Entry Form</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-100">
              Manual Field Heat-Stress Log (Scaffolding / Remote Work Fronts)
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Work Front & Contractor info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Work Front / Zone Location</label>
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Contractor / JV ID</label>
              <input
                type="text"
                value={contractorId}
                onChange={(e) => setContractorId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">HSE Officer Name & ID</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setContractorOfficerName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Active Crew Size</label>
              <input
                type="number"
                value={workerCount}
                onChange={(e) => setWorkerCount(Number(e.target.value))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Entry mode toggle */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-300">Temperature Reading Mode:</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setEntryMode('direct')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    entryMode === 'direct' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Direct WBGT Value
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode('components')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    entryMode === 'components' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Component Temps (T_nw, T_g, T_d)
                </button>
              </div>
            </div>

            {entryMode === 'direct' ? (
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Calibrated WBGT Reading (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={directWbgt}
                  onChange={(e) => setDirectWbgt(Number(e.target.value))}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-lg font-bold text-amber-400 font-mono focus:outline-none"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400">Wet Bulb Temp T_nw (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tnw}
                    onChange={(e) => setTnw(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Globe Temp T_g (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tg}
                    onChange={(e) => setTg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400">Ambient Dry Bulb T_d (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={td}
                    onChange={(e) => setTd(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Workload and Rest Checks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Metabolic Workload Level</label>
              <select
                value={metabolicWorkload}
                onChange={(e) => setMetabolicWorkload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"
              >
                <option value="Light">Light (Scaffolding Inspection / Painting)</option>
                <option value="Moderate">Moderate (Bricklaying / Cable Pulling)</option>
                <option value="Heavy">Heavy (Concrete Pouring / Rigging)</option>
                <option value="Very Heavy">Very Heavy (Manual Shoveling / Steel Erection)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="shadeWater"
                checked={shadeWaterChecked}
                onChange={(e) => setShadeWaterChecked(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <label htmlFor="shadeWater" className="text-slate-300 font-medium">
                Confirmed: Shaded cooling shelter & electrolyte water active at work front.
              </label>
            </div>
          </div>

          {/* Legal Result Preview Banner */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Calculated WBGT:</span>
              <span className="text-lg font-black text-amber-400 font-mono">{finalWbgt}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Qatar Ministerial Decree No. 17 Status:</span>
              <span className={`font-bold ${legalEval.color === 'red' ? 'text-red-400' : legalEval.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {legalEval.status} ({legalEval.cycle})
              </span>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
            >
              Sign & Commit Entry to SHA-256 Audit Ledger
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
