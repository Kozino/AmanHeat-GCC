import React, { useState } from 'react';
import {
  Flame,
  Radio,
  Users,
  TrendingUp,
  FileText,
  MapPin,
  Clock,
  Download,
  Terminal,
  ShieldCheck,
  Lock,
  Sliders,
  CheckCircle2,
  HardHat,
  FileCode,
  Check
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import ContractorHseDashboard from './components/ContractorHseDashboard';
import QatarEnergyOversightDashboard from './components/QatarEnergyOversightDashboard';
import AtexBridgeCodeViewer from './components/AtexBridgeCodeViewer';

// MOCK INITIAL ATEX PLANT ASSETS
const INITIAL_ATEX_PLANTS = [
  {
    id: 'rlic-lng4',
    name: 'Ras Laffan Industrial City - LNG Train 4',
    operator: 'Kent / Wood JV (ID: EPC-8801)',
    zone: 'Zone 1: Liquefaction Cracker & Scaffolding Deck',
    atexClass: 'ATEX Zone 1 / IECEx Ex db IIB T4 Gb',
    sensorModel: 'QuesTemp 44 / Wireless ATEX Probe Array #04',
    wbgt: 31.8,
    ambient: 43.8,
    humidity: 61,
    status: 'MANDATORY_REST',
    cycle: '30 min Work / 30 min Rest Cycle',
    signageText: 'ZONE 1 ALERT: MANDATORY 30/30 COOLING BREAK ACTIVE',
    paBroadcastStatus: 'PA System Auto-Chime Dispatched (13:30 AST)',
    ackSupervisor: 'Mohammed Al-Kuwari (HSE Lead)',
    ackTime: '13:32 AST (Acknowledged)',
    shaHash: '0x8f2a991b4c7301e4928d11c491',
    isManual: false
  },
  {
    id: 'mesaieed-tank',
    name: 'Mesaieed Refinery - Storage Tank Farm B',
    operator: 'Consolidated Contractors Company (CCC - ID: EPC-4402)',
    zone: 'Zone 3: Hydrocarbon Storage & High Solar Reflection',
    atexClass: 'ATEX Zone 1 / IECEx Ex ia IIC T4 Ga',
    sensorModel: 'Crowcon Industrial Wireless ATEX Sensor #12',
    wbgt: 29.5,
    ambient: 39.2,
    humidity: 54,
    status: 'NORMAL',
    cycle: 'Continuous Shift Operations',
    signageText: 'ZONE 3 STATUS: NORMAL OPERATIONAL MARGIN',
    paBroadcastStatus: 'Standby Monitoring',
    ackSupervisor: 'Tariq Habib (Site HSE Supervisor)',
    ackTime: 'Continuous Feed',
    shaHash: '0x3b11e89201f99c812048aa0192',
    isManual: false
  },
  {
    id: 'halul-marine',
    name: 'Halul Island Marine Crude Terminal',
    operator: 'McDermott International (ID: EPC-1092)',
    zone: 'Berth 2 Offloading Platform & Piping Rack',
    atexClass: 'ATEX Zone 0/1 / IECEx Certified',
    sensorModel: 'Explosion-Proof Telemetry Probe #02',
    wbgt: 32.3,
    ambient: 42.1,
    humidity: 68,
    status: 'CRITICAL_STOP',
    cycle: 'TOTAL WORK STOP (WBGT > 32.1°C Legal Stop Limit)',
    signageText: 'CRITICAL STOP: ALL OUTDOOR PIPING WORK SUSPENDED',
    paBroadcastStatus: 'Emergency Sirens & LED Red Strobe Active',
    ackSupervisor: 'Sanjay Patel (Offshore HSE Officer)',
    ackTime: '13:41 AST (Evacuation Confirmed)',
    shaHash: '0x7a99d10428fa88102377b21901',
    isManual: false
  }
];

const CONTRACTOR_PROFILES = [
  {
    id: 'galfar',
    name: 'Galfar Al Misnad',
    sector: 'Infrastructure & Ashghal Highway Projects',
    workforce: '12,000+',
    keyProjects: 'Al Wakrah Expressway, Doha South Sewage Infrastructure, Ashghal Local Roads',
    decisionMaker: 'Navaneetha Shetty (Executive Director - HSE) & Commercial VP',
    painPoint: 'High asphalt thermal radiation (+4°C spike) causing unrecorded worker heat exhaustion during highway paving.',
    solutionPitch: 'Mobile Solar WBGT Trailers + Smart Band Fleet with automated Ashghal KPI compliance logs.',
    estArr: 'QAR 576,000 / yr'
  },
  {
    id: 'ccc',
    name: 'Consolidated Contractors Company (CCC)',
    sector: 'Oil & Gas EPC & Civil Mega-Infrastructure',
    workforce: '25,000+',
    keyProjects: 'North Field East LNG, Mesaieed Tank Farm Expansion, Lusail Infrastructure',
    decisionMaker: 'Samir Khoury (Vice President HSE & Quality) & Procurement Director',
    painPoint: 'Managing subcontractor liabilities across O&G ATEX zones and general civil construction sites simultaneously.',
    solutionPitch: 'Enterprise Dual-Tier SaaS: ATEX Sensor Software Integration for O&G + HaaS Band Fleet for Civil.',
    estArr: 'QAR 1,200,000 / yr'
  },
  {
    id: 'hbk',
    name: 'HBK Contracting Company W.L.L.',
    sector: 'Building, Stadiums & Civil Infrastructure',
    workforce: '15,000+',
    keyProjects: 'Lusail Stadium District, Msheireb Downtown, Qatar Rail Phase 2 Prep',
    decisionMaker: 'Sheikh Ali Bin Hamad Al-Thani (President) & HSE Director',
    painPoint: 'Surprise Ministry of Labour field audits and site closure risks under Ministerial Decree 17/2021.',
    solutionPitch: '20ft Container Charging Kiosk Depot + 1-Click Immutable Ministry Compliance Audit Vault.',
    estArr: 'QAR 720,000 / yr'
  },
  {
    id: 'kent-wood',
    name: 'Kent / Wood Group Joint Venture',
    sector: 'QatarEnergy Onshore & Offshore Asset Maintenance',
    workforce: '8,000+',
    keyProjects: 'Ras Laffan LNG Maintenance, Offshore Offloading Platforms, Mesaieed Refinery Shutdowns',
    decisionMaker: 'David Miller (Regional Director - O&G Operations)',
    painPoint: 'Strict QatarEnergy ATEX restrictions prohibit standard smartwatches on plant premises.',
    solutionPitch: 'Software-Only Enterprise Integration Layer: Ingests existing QuesTemp ATEX sensors with zero hardware delays.',
    estArr: 'QAR 300,000 / yr (Pure SaaS)'
  },
  {
    id: 'ucc',
    name: 'UCC (Urbacon Trading & Contracting)',
    sector: 'Commercial, High-Rise & Coastal Tourism Mega-Projects',
    workforce: '20,000+',
    keyProjects: 'The Pearl-Qatar Marina, Simaisma Resort, Katara Towers',
    decisionMaker: 'Ramez Al-Khayyat (Group Managing Director) & HSE VP',
    painPoint: 'Severe coastal humidity thermal stress causing cardiovascular strain on high-elevation scaffolding crews.',
    solutionPitch: 'Cardiovascular Drift AI Engine + Real-time Hydration & Electrolyte Dispatch Alerts.',
    estArr: 'QAR 960,000 / yr'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('contractor-dash'); // 'contractor-dash', 'qe-dash', 'ingestion-code', 'pipeline', 'financial', 'deck'
  const [plants, setPlants] = useState(INITIAL_ATEX_PLANTS);
  const [selectedEpc, setSelectedEpc] = useState(CONTRACTOR_PROFILES[0]);
  const [showLoiModal, setShowLoiModal] = useState(false);

  // Financial Model Sliders State
  const [ogPlantsCount, setOgPlantsCount] = useState(8);
  const [civilWorkersCount, setCivilWorkersCount] = useState(4000);
  const [kiosksCount, setKiosksCount] = useState(6);

  // Financial Calculations
  const monthlyOgSaaS = ogPlantsCount * 25000;
  const monthlyCivilHaaS = civilWorkersCount * 40;
  const totalMRR = monthlyOgSaaS + monthlyCivilHaaS;
  const totalARR = totalMRR * 12;

  const totalCapEx = kiosksCount * 102450 + civilWorkersCount * 110;
  const monthlyHardwareDepr = (civilWorkersCount * 110) / 24;
  const totalMonthlyOpEx = 45000 + monthlyHardwareDepr;
  const monthlyEbitda = totalMRR - totalMonthlyOpEx;
  const grossMargin = Math.round(((totalMRR - totalMonthlyOpEx) / totalMRR) * 100);
  const paybackMonths = (totalCapEx / monthlyEbitda).toFixed(1);

  // Deck State
  const [currentDeckSlide, setCurrentDeckSlide] = useState(0);

  const DECK_SLIDES = [
    {
      title: 'Slide 1: Executive Identity',
      headline: 'AmanHeat GCC: Enterprise Heat-Safety & Labor-Welfare SaaS Platform',
      bullets: [
        'Solving Legal Compliance under Ministerial Decree No. 17 of 2021 (Qatar Heat Law).',
        'Dual-Tier SaaS Architecture: ATEX Integration for Oil & Gas + HaaS Smart Bands for Civil/Ashghal.',
        'Incubation Applicant: Qatar Science & Technology Park (QSTP), Doha, Qatar.',
        'Alignment: Supporting Qatar National Vision 2030 (Human & Social Development Pillars).'
      ],
      tag: 'Startup Executive Identity'
    },
    {
      title: 'Slide 2: Legal Mandate & Market Problem',
      headline: 'Mandatory Midday Outdoor Work Ban & Legal WBGT Thresholds',
      bullets: [
        'Illegal outdoor work from 10:00 AM to 3:30 PM (June 1 to Sept 15).',
        'Work shifts to mandatory rest cycles at 31.1°C WBGT and complete stop at 32.1°C WBGT.',
        'Subcontractor Liability: Main contractors face immediate site closure orders for unrecorded violations.',
        'The Gap: No unified, real-time digital monitoring platform exists across Qatar contractors.'
      ],
      tag: 'Problem & Market Urgency'
    },
    {
      title: 'Slide 3: Enterprise Oil & Gas Solution (The ATEX Tier)',
      headline: 'Zero Hardware Approval Delay in QatarEnergy Industrial Plants',
      bullets: [
        'QatarEnergy strictly prohibits uncertified consumer smartwatches inside hazardous plant zones.',
        'Solution: Software-only integration layer ingesting telemetry from pre-existing ATEX/IECEx Zone 1 sensors.',
        'Automated PA system chimes & plant digital LED signage shift alerts.',
        'SHA-256 cryptographic compliance logging for 1-click Ministry of Labour & QatarEnergy audits.'
      ],
      tag: 'O&G SaaS Product Moat'
    },
    {
      title: 'Slide 4: Connected Worker Package (Civil & Ashghal Roads)',
      headline: 'Full-Stack HaaS Package for Construction & Infrastructure Crews',
      bullets: [
        'Rugged White-Label IP68 Smart Bands ($30 cost) flashed with custom firmware.',
        'Ashghal Road Paving Solution: Towable Solar WBGT trailers tracking asphalt thermal blooms (+4°C over ambient).',
        '20ft Container Charging Kiosk Depot: Climate-controlled (22°C), positive pressure dust sealing, and UV-C mass sanitization.',
        'Fast-Throughput: RFID check-in/checkout processed in under 4 seconds per worker.'
      ],
      tag: 'Civil Infrastructure Solution'
    },
    {
      title: 'Slide 5: Commercialization Pipeline & Target EPC Clients',
      headline: 'Targeting Top 5 Tier-1 EPC Contractors in Doha',
      bullets: [
        'Galfar Al Misnad (12,000+ workers): Ashghal road paving mobile solar WBGT trailers.',
        'Consolidated Contractors Company - CCC (25,000+ workers): Dual-tier O&G + Civil coverage.',
        'HBK Contracting (15,000+ workers): Container kiosk depot + 1-click Ministry audit vault.',
        'Kent / Wood JV (8,000+ workers): Software-only ATEX enterprise layer for QatarEnergy maintenance.',
        'UCC (20,000+ workers): Coastal marine humidity cardiovascular strain monitoring.'
      ],
      tag: 'Go-To-Market Pipeline'
    },
    {
      title: 'Slide 6: 3-Year Financial Model & Unit Economics',
      headline: 'High-Margin Subscription Revenue with Rapid CapEx Payback',
      bullets: [
        'Tier 1 O&G SaaS: QAR 25,000 / month / plant (92% Gross Margin).',
        'Tier 2 Civil HaaS: QAR 40 / worker / month (Includes smart band, kiosk lease, software).',
        'Baseline ARR (8 O&G Plants + 4,000 Workers): QAR 4,320,000 ($1.18M USD).',
        'Unit Economics: 81% Gross Margin, Payback Period < 5.5 Months, LTV:CAC > 8.5x.'
      ],
      tag: 'Financial Metrics'
    },
    {
      title: 'Slide 7: Technical System Architecture & Fail-Safe Logic',
      headline: 'Edge-First Computing & 10kVA UPS Double-Conversion Power Shedding',
      bullets: [
        'Edge Server Local Mirroring: Maintains 7-day local DB queue during remote 5G network drops.',
        'Zero-Latency Check-Ins: Offline RFID authentication with automated delta-sync upon reconnection.',
        '10kVA Online Double-Conversion UPS: 0ms switchover during grid power failures.',
        'Automated Power Shedding: Disconnects AC/charging loads to preserve critical RFID terminals for 2+ hours.'
      ],
      tag: 'System Architecture'
    },
    {
      title: 'Slide 8: QSTP Incubation Request & Milestones',
      headline: '12-Month Roadmap & QAR 350,000 Seed Grant Utilization',
      bullets: [
        'Months 1-3: Finalize ATEX software connector APIs & build 2 prototype 20ft container kiosks.',
        'Months 4-6: Launch 30-day pilot trials with Galfar Al Misnad & CCC in Doha.',
        'Months 7-9: Secure formal pre-qualification on QatarEnergy & Ashghal approved vendor lists.',
        'Months 10-12: Commercial rollout to 10,000+ active workers across Qatar & initial KSA expansion.'
      ],
      tag: 'QSTP Roadmap'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-amber-500 to-red-600 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-400 via-amber-300 to-amber-200 bg-clip-text text-transparent">
                  AmanHeat GCC
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-full">
                  Enterprise System Architecture
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Qatar Science & Technology Park (QSTP) Technical Application Package
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-200">Doha, Qatar</span>
              <span className="text-slate-600">|</span>
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-200 font-mono">13:45 AST</span>
            </div>

            <button
              onClick={() => alert('Proposal "QatarEnergy_ATEX_Enterprise_Platform_Proposal.md" exported!')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Proposals & Drivers</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 overflow-x-auto border-t border-slate-800/80 scrollbar-none py-1.5">
          <button
            onClick={() => setActiveTab('contractor-dash')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'contractor-dash'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HardHat className="w-4 h-4 text-amber-400" />
            <span>Contractor HSE Control Center</span>
          </button>

          <button
            onClick={() => setActiveTab('qe-dash')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'qe-dash'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-4 h-4 text-sky-400" />
            <span>QatarEnergy Corporate Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('ingestion-code')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'ingestion-code'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>ATEX Sensor Data Capture Code</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Target EPC Client Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'financial'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>3-Year Financial Model</span>
          </button>

          <button
            onClick={() => setActiveTab('deck')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'deck'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>QSTP Executive Pitch Deck</span>
          </button>
        </div>
      </header>

      {/* CONTENT TAB ROUTER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'contractor-dash' && (
          <ContractorHseDashboard plants={plants} setPlants={setPlants} />
        )}

        {activeTab === 'qe-dash' && (
          <QatarEnergyOversightDashboard plants={plants} />
        )}

        {activeTab === 'ingestion-code' && <AtexBridgeCodeViewer />}

        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-purple-800/40 rounded-2xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Commercial Outreach & Strategic Partner Pipeline</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Top 5 Tier-1 EPC Contractors in Qatar
              </h2>
              <p className="text-xs text-slate-400 max-w-3xl">
                Securing Letters of Intent (LOI) from these prime contractors is the core commercial requirement for QSTP incubation acceptance and seed funding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CONTRACTOR_PROFILES.map((epc) => (
                <div
                  key={epc.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between hover:border-purple-500/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase">{epc.sector}</span>
                        <h3 className="text-base font-bold text-slate-100">{epc.name}</h3>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full">
                        {epc.workforce} Workers
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Key Qatar Projects</div>
                        <p className="text-slate-300 font-medium">{epc.keyProjects}</p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-2">
                        <div className="text-[10px] font-bold text-amber-400 uppercase">Target Decision Maker</div>
                        <p className="text-slate-200">{epc.decisionMaker}</p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-2">
                        <div className="text-[10px] font-bold text-red-400 uppercase">Specific Pain Point</div>
                        <p className="text-slate-300">{epc.painPoint}</p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-2">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase">Pitch Angle & Value Proposition</div>
                        <p className="text-slate-200 font-medium">{epc.solutionPitch}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs px-1">
                      <span className="text-slate-400">Est. ARR Opportunity:</span>
                      <span className="font-mono font-bold text-purple-300">{epc.estArr}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEpc(epc);
                        setShowLoiModal(true);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Generate Pilot LOI Request Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-orange-800/40 rounded-2xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>QSTP Commercial Feasibility & Financial Model</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Interactive 3-Year SaaS + HaaS Financial Simulator
              </h2>
              <p className="text-xs text-slate-400 max-w-3xl">
                Simulate your financial metrics by adjusting scale sliders below. Shows real-time Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), Gross Margin %, EBITDA, and CapEx payback periods.
              </p>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Oil & Gas Enterprise Sites (SaaS)</span>
                  <span className="text-sky-400 font-mono font-bold">{ogPlantsCount} Industrial Plants</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={ogPlantsCount}
                  onChange={(e) => setOgPlantsCount(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">QAR 25,000 / plant / month (92% margin)</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Civil & Ashghal Smart Bands (HaaS)</span>
                  <span className="text-amber-400 font-mono font-bold">{civilWorkersCount.toLocaleString()} Workers</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="500"
                  value={civilWorkersCount}
                  onChange={(e) => setCivilWorkersCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">QAR 40 / worker / month</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Container Kiosks Deployed</span>
                  <span className="text-emerald-400 font-mono font-bold">{kiosksCount} Depots</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={kiosksCount}
                  onChange={(e) => setKiosksCount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="text-[10px] text-slate-500">CapEx QAR 102,450 per unit</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-medium">Monthly Recurring Revenue (MRR)</div>
                <div className="text-2xl font-black text-amber-400 font-mono">QAR {totalMRR.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">USD ${(totalMRR / 3.64).toFixed(0)}</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-medium">Annualized Revenue (ARR)</div>
                <div className="text-2xl font-black text-sky-400 font-mono">QAR {totalARR.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">USD ${(totalARR / 3.64).toFixed(0)}</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-medium">Gross Margin %</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">{grossMargin}%</div>
                <div className="text-[10px] text-slate-500">SaaS software-led margin</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-medium">Hardware CapEx Payback</div>
                <div className="text-2xl font-black text-purple-400 font-mono">{paybackMonths} Months</div>
                <div className="text-[10px] text-slate-500">CapEx QAR {totalCapEx.toLocaleString()}</div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-100">
                3-Year Projected Income Statement (P&L) Summary
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Financial Metric</th>
                      <th className="p-3 text-right">Year 1</th>
                      <th className="p-3 text-right">Year 2</th>
                      <th className="p-3 text-right">Year 3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-3 font-semibold">Tier 1 Oil & Gas SaaS Revenue</td>
                      <td className="p-3 text-right font-mono text-sky-400">QAR 1,200,000</td>
                      <td className="p-3 text-right font-mono text-sky-400">QAR 3,000,000</td>
                      <td className="p-3 text-right font-mono text-sky-400">QAR 6,000,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Tier 2 Civil HaaS Revenue</td>
                      <td className="p-3 text-right font-mono text-amber-400">QAR 1,920,000</td>
                      <td className="p-3 text-right font-mono text-amber-400">QAR 4,800,000</td>
                      <td className="p-3 text-right font-mono text-amber-400">QAR 9,600,000</td>
                    </tr>
                    <tr className="bg-slate-950/60 font-bold text-slate-100">
                      <td className="p-3">Total Gross Revenue</td>
                      <td className="p-3 text-right font-mono text-emerald-400">QAR 3,120,000</td>
                      <td className="p-3 text-right font-mono text-emerald-400">QAR 7,800,000</td>
                      <td className="p-3 text-right font-mono text-emerald-400">QAR 15,600,000</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-400">COGS (Band Depr + Kiosk OpEx)</td>
                      <td className="p-3 text-right font-mono text-slate-400">(QAR 540,000)</td>
                      <td className="p-3 text-right font-mono text-slate-400">(QAR 1,200,000)</td>
                      <td className="p-3 text-right font-mono text-slate-400">(QAR 2,100,000)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-400">SG&A, Engineering & Cloud Infra</td>
                      <td className="p-3 text-right font-mono text-slate-400">(QAR 720,000)</td>
                      <td className="p-3 text-right font-mono text-slate-400">(QAR 1,500,000)</td>
                      <td className="p-3 text-right font-mono text-slate-400">(QAR 2,800,000)</td>
                    </tr>
                    <tr className="bg-slate-950 font-black text-sm border-t-2 border-slate-700">
                      <td className="p-3 text-amber-400">EBITDA (Operating Profit)</td>
                      <td className="p-3 text-right font-mono text-emerald-400">QAR 1,860,000</td>
                      <td className="p-3 text-right font-mono text-emerald-400">QAR 5,100,000</td>
                      <td className="p-3 text-right font-mono text-emerald-400">QAR 10,700,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deck' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-teal-800/40 rounded-2xl p-6 space-y-3 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  <span>QSTP Tech Incubator Application Deck</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100">
                  Interactive Executive Pitch Slide Deck
                </h2>
                <p className="text-xs text-slate-400">
                  Structured explicitly for QSTP Technical & Commercial Evaluation Committee.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentDeckSlide === 0}
                  onClick={() => setCurrentDeckSlide((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200"
                >
                  Previous
                </button>
                <span className="text-xs font-mono font-bold text-slate-400 px-2">
                  Slide {currentDeckSlide + 1} of {DECK_SLIDES.length}
                </span>
                <button
                  disabled={currentDeckSlide === DECK_SLIDES.length - 1}
                  onClick={() => setCurrentDeckSlide((prev) => Math.min(DECK_SLIDES.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl min-h-[420px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                    {DECK_SLIDES[currentDeckSlide].tag}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {DECK_SLIDES[currentDeckSlide].title}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-100 leading-tight">
                  {DECK_SLIDES[currentDeckSlide].headline}
                </h3>

                <ul className="space-y-3 pt-2">
                  {DECK_SLIDES[currentDeckSlide].bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-1.5 pt-4 border-t border-slate-800/80 overflow-x-auto">
                {DECK_SLIDES.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentDeckSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentDeckSlide
                        ? 'w-8 bg-amber-400'
                        : 'w-3 bg-slate-800 hover:bg-slate-700'
                    }`}
                    title={s.title}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LOI MODAL */}
      {showLoiModal && selectedEpc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                  Pilot LOI Request Generator
                </span>
                <h3 className="text-lg font-extrabold text-slate-100">
                  Letter of Intent (LOI) Proposal for {selectedEpc.name}
                </h3>
              </div>
              <button
                onClick={() => setShowLoiModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3 max-h-80 overflow-y-auto leading-relaxed">
              <p>
                <strong>TO:</strong> {selectedEpc.decisionMaker}
                <br />
                <strong>COMPANY:</strong> {selectedEpc.name} (Qatar Operations)
                <br />
                <strong>SUBJECT:</strong> Non-Binding Proposal for 30-Day Heat-Safety SaaS Pilot Trial
              </p>

              <p>Dear Sir/Madam,</p>

              <p>
                AmanHeat GCC hereby proposes a non-binding 30-day trial deployment of our Heat-Safety & Labor-Welfare platform for active personnel under {selectedEpc.name}'s management in Doha.
              </p>

              <p>
                <strong>Scope of Pilot:</strong>
                <br />
                - Deployment of 100 white-labeled IP68 smart bands (or direct software integration with ATEX sensors if O&G plant).
                <br />
                - Automated WBGT work-rest cycle tracking under Qatar Ministerial Decree No. 17 of 2021.
                <br />
                - 1-Click Ministry of Labour compliance audit log export.
              </p>

              <p>
                In exchange for this zero-cost pilot trial, {selectedEpc.name} agrees to provide operational feedback and issue a non-binding Letter of Intent (LOI) to support AmanHeat GCC's application to the Qatar Science & Technology Park (QSTP).
              </p>

              <p>
                Sincerely,
                <br />
                <strong>Founding Team, AmanHeat GCC</strong>
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  alert(`LOI Request Letter copied to clipboard for ${selectedEpc.name}!`);
                  setShowLoiModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/20"
              >
                Copy LOI Request Letter
              </button>
              <button
                onClick={() => setShowLoiModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
