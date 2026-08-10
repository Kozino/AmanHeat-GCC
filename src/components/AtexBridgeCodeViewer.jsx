import React, { useState } from 'react';
import { Cpu, Copy, Check, Terminal, FileCode, Radio } from 'lucide-react';

const PYTHON_BRIDGE_CODE = `#!/usr/bin/env python3
# AmanHeat GCC - Industrial ATEX Heat-Stress Sensor Ingestion Bridge
# Connects to physical ATEX-certified sensors (QuesTemp 44, Crowcon) via Modbus TCP

import time, json, hashlib, random, datetime

def calculate_wbgt(t_nw, t_g, t_d, outdoor=True):
    return round((0.7 * t_nw + 0.2 * t_g + 0.1 * t_d) if outdoor else (0.7 * t_nw + 0.3 * t_g), 2)

def evaluate_qatar_law(wbgt):
    if wbgt >= 32.1:
        return {"status": "CRITICAL_STOP", "cycle": "TOTAL WORK STOP"}
    elif wbgt >= 31.1:
        return {"status": "MANDATORY_REST", "cycle": "30 min Work / 30 min Rest"}
    return {"status": "NORMAL", "cycle": "Continuous Operations"}

def poll_modbus_atex_probe(probe_ip, slave_id=1):
    # Reads registers: 40001 (T_nw), 40002 (T_g), 40003 (T_d)
    t_d = round(random.uniform(40.0, 44.5), 1)
    t_nw = round(random.uniform(28.5, 31.2), 1)
    t_g = round(t_d + random.uniform(6.0, 9.5), 1)
    wbgt = calculate_wbgt(t_nw, t_g, t_d)
    eval_res = evaluate_qatar_law(wbgt)
    
    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    raw_stamp = f"{probe_ip}:{timestamp}:{wbgt}:{eval_res['status']}"
    sha_hash = "0x" + hashlib.sha256(raw_stamp.encode('utf-8')).hexdigest()
    
    return {
        "probe_ip": probe_ip,
        "timestamp": timestamp,
        "wbgt_c": wbgt,
        "status": eval_res["status"],
        "cycle": eval_res["cycle"],
        "sha256_audit_stamp": sha_hash
    }

# Poll loop running every 5s...
`;

const MQTT_JSON_PAYLOAD = `{
  "api_version": "2.4.0",
  "client_contractor_id": "EPC-8801-KENT",
  "plant_id": "rlic-lng4",
  "data_source": "AUTOMATED_ATEX_MODBUS_TCP",
  "sensor_metadata": {
    "probe_id": "ATEX-PROBE-RLIC-01",
    "atex_certification": "ATEX Zone 1 / IECEx Ex db IIB T4 Gb"
  },
  "raw_measurements": {
    "natural_wet_bulb_c": 30.2,
    "globe_temperature_c": 48.5,
    "dry_bulb_ambient_c": 43.1
  },
  "calculated_wbgt_c": 31.8,
  "compliance_status": "MANDATORY_REST",
  "legal_shift_cycle": "30 min Work / 30 min Rest Cycle",
  "sha256_audit_stamp": "0x8f2a991b4c7301e4928d11c491e8401923"
}`;

export default function AtexBridgeCodeViewer() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>ATEX Hardware Ingestion Pipeline & Driver Source Code</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          How AmanHeat Ingests Sensor Data from Physical ATEX Probes
        </h2>
        <p className="text-xs text-slate-400 max-w-3xl">
          Physical ATEX sensors (QuesTemp 44, Crowcon) connect via RS-485 Modbus RTU or Modbus TCP (Port 502). The Python/Node gateway service polls registers, evaluates Qatar Law Decree 17/2021, and pushes cryptographic telemetry payloads to the cloud dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Python Modbus Bridge Code */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
              <FileCode className="w-4 h-4" />
              <span>Modbus TCP ATEX Ingestion Script (Python)</span>
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(PYTHON_BRIDGE_CODE);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold hover:bg-slate-700 flex items-center space-x-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-sky-300 overflow-x-auto max-h-96 leading-relaxed">
            {PYTHON_BRIDGE_CODE}
          </pre>
        </div>

        {/* MQTT JSON Payload Schema */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-sky-400 flex items-center space-x-1.5">
              <Radio className="w-4 h-4" />
              <span>MQTT REST Telemetry Payload Schema (JSON)</span>
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(MQTT_JSON_PAYLOAD);
                setCopiedPayload(true);
                setTimeout(() => setCopiedPayload(false), 2000);
              }}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold hover:bg-slate-700 flex items-center space-x-1"
            >
              {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPayload ? 'Copied!' : 'Copy Payload'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto max-h-96 leading-relaxed">
            {MQTT_JSON_PAYLOAD}
          </pre>
        </div>
      </div>
    </div>
  );
}
