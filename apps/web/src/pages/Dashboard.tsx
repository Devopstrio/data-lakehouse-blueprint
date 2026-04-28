import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Layers, Zap, Database, TrendingUp, RefreshCcw, ExternalLink, Target, GitBranch } from 'lucide-react';

const throughputData = [
  { name: 'Jan', gb: 1200 },
  { name: 'Feb', gb: 1850 },
  { name: 'Mar', gb: 2400 },
  { name: 'Apr', gb: 3100 },
  { name: 'May', gb: 4200 },
];

const medallionData = [
  { name: 'Bronze', tables: 450 },
  { name: 'Silver', tables: 280 },
  { name: 'Gold', tables: 45 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Lakehouse Executive</h1>
          <p className="text-slate-400 mt-3 text-xl max-w-2xl font-medium">Unified analytics visibility, medallion architecture health, and platform scale intelligence.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-900 border border-slate-800 text-slate-300 px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition flex items-center gap-2">
             <RefreshCcw size={18} /> Refresh Telemetry
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition shadow-xl shadow-blue-900/40 flex items-center gap-2">
             <Zap size={18} /> Run All Pipelines
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Data Managed" value="4.2 PB" change="+1.2 PB" icon={<Database className="text-blue-400" />} />
        <StatCard title="Pipeline Success" value="99.4%" change="Optimal" icon={<Zap className="text-emerald-400" />} />
        <StatCard title="Query Latency" value="1.8s" change="-0.4s" icon={<Target className="text-sky-400" />} />
        <StatCard title="Monthly Cost" value="$12.4K" change="Optimized" icon={<TrendingUp className="text-rose-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Throughput Trend */}
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Ingestion Throughput (GB)
            </h2>
            <div className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] bg-blue-900/20 px-4 py-2 rounded-full border border-blue-800/50">Scaling Velocity</div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <defs>
                  <linearGradient id="colorGb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                />
                <Area type="monotone" dataKey="gb" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorGb)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medallion Distribution */}
        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
              Medallion Asset Inventory
            </h2>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold italic">
               <GitBranch size={20} />
               Governance Maturity
            </div>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={medallionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{ fill: '#1e293b', opacity: 0.4 }}
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                />
                <Bar dataKey="tables" radius={[8, 8, 0, 0]} barSize={50}>
                  {medallionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pipeline Ops Hub */}
      <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-10 text-white flex items-center gap-3 text-blue-400 uppercase tracking-widest">
           <Layers size={28} />
           Active Data Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <ProductCard name="Customer 360" layer="Gold" freshness="4.2m" color="text-blue-400" />
           <ProductCard name="Revenue Analytics" layer="Gold" freshness="1.2h" color="text-emerald-400" />
           <ProductCard name="Supply Chain Raw" layer="Bronze" freshness="Real-time" color="text-sky-400" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: any) => (
  <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] hover:border-blue-500/30 transition-all group overflow-hidden relative shadow-2xl">
    <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-150 duration-1000 rotate-12">
       {React.cloneElement(icon, { size: 160 })}
    </div>
    <div className="relative z-10">
      <div className="p-4 bg-slate-950 rounded-2xl w-fit mb-6 border border-slate-800/50 shadow-inner group-hover:scale-110 transition duration-500">{icon}</div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <div className="flex items-end gap-3">
        <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
        <span className={`text-[11px] font-black pb-1.5 ${change.startsWith('+') || change === 'Optimal' || change === 'Optimized' ? 'text-emerald-400' : 'text-rose-400'}`}>{change}</span>
      </div>
    </div>
  </div>
);

const ProductCard = ({ name, layer, freshness, color }: any) => (
  <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl hover:bg-slate-800/50 transition cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-slate-100">{name}</h3>
      <span className={`text-2xl font-black ${color}`}>{layer}</span>
    </div>
    <div className="flex justify-between items-center mt-8">
       <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Freshness: {freshness}</span>
       <ExternalLink size={14} className="text-slate-700 group-hover:text-white transition" />
    </div>
  </div>
);

export default Dashboard;
