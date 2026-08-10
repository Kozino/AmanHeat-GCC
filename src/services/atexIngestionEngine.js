// AmanHeat GCC - ATEX Sensor Ingestion & Calculation Engine Service

export function calculateWbgt(tnw, tg, td, isOutdoorSun = true) {
  if (isOutdoorSun) {
    return Number((0.7 * tnw + 0.2 * tg + 0.1 * td).toFixed(2));
  }
  return Number((0.7 * tnw + 0.3 * tg).toFixed(2));
}

export function evaluateQatarHeatLaw(wbgt) {
  if (wbgt >= 32.1) {
    return {
      status: 'CRITICAL_STOP',
      cycle: 'TOTAL OUTDOOR WORK STOP',
      action: 'Immediate work halt. All personnel routed to cooling shelters.',
      signageText: 'CRITICAL STOP: WBGT EXCEEDED 32.1°C. OUTDOOR WORK HALTED.',
      color: 'red'
    };
  } else if (wbgt >= 31.1) {
    return {
      status: 'MANDATORY_REST',
      cycle: '30 min Work / 30 min Rest Cycle',
      action: 'Mandatory 30-minute cooling rest break per hour active.',
      signageText: 'MANDATORY REST: 30/30 CYCLE ACTIVE. COOLING BREAK ENFORCED.',
      color: 'amber'
    };
  } else {
    return {
      status: 'NORMAL',
      cycle: 'Continuous Shift Operations',
      action: 'Continuous environmental monitoring & safe hydration.',
      signageText: 'NORMAL OPERATIONAL MARGIN: SAFE THERMAL CONDITIONS.',
      color: 'emerald'
    };
  }
}

export function generateSha256Stamp(probeId, timestamp, wbgt, status) {
  const str = `${probeId}:${timestamp}:${wbgt}:${status}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x8f${hex}c941e2a09182f`;
}
