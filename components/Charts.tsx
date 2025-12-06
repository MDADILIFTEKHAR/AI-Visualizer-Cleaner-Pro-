import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import { Card, Button } from './ui';
import { Download, Image as ImageIcon, FileImage, FileCode, MoreHorizontal } from 'lucide-react';
import { DataSet } from '../types';
import { downloadChartImage, downloadChartSvg } from '../utils/download';

interface VizGalleryProps {
  dataset: DataSet;
}

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Reusable Chart Card Component with Download Logic
const ChartCard: React.FC<{ 
    title: string; 
    desc: string; 
    chartId: string; 
    children: React.ReactNode 
}> = ({ title, desc, chartId, children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleDownload = (format: 'png' | 'jpeg' | 'svg') => {
        if (format === 'svg') {
            downloadChartSvg(chartId, `${title.replace(/\s+/g, '-').toLowerCase()}`);
        } else {
            downloadChartImage(chartId, `${title.replace(/\s+/g, '-').toLowerCase()}`, format);
        }
        setIsMenuOpen(false);
    };

    return (
        <Card className="relative overflow-visible group flex flex-col h-[400px]" noPadding>
            <div className="p-6 pb-2 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-heading font-bold text-slate-800 tracking-tight">{title}</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">{desc}</p>
                </div>
                <div className="relative">
                    <button 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {isMenuOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setIsMenuOpen(false)} 
                            />
                            <div className="absolute right-0 top-10 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 z-40 py-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Export Chart
                                </div>
                                <button 
                                    onClick={() => handleDownload('png')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                                >
                                    <ImageIcon className="w-4 h-4" /> 
                                    <span>PNG Image</span>
                                </button>
                                <button 
                                    onClick={() => handleDownload('jpeg')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                                >
                                    <FileImage className="w-4 h-4" /> 
                                    <span>JPEG Image</span>
                                </button>
                                <button 
                                    onClick={() => handleDownload('svg')}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors border-t border-slate-50 mt-1"
                                >
                                    <FileCode className="w-4 h-4" /> 
                                    <span>Vector SVG</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {/* Chart Container */}
            <div id={chartId} className="flex-1 w-full min-h-0 p-4">
                {children}
            </div>
        </Card>
    );
};

export const VizGallery: React.FC<VizGalleryProps> = ({ dataset }) => {
  const numericCols = dataset.profile.filter(p => p.type === 'number').map(p => p.name);
  const catCols = dataset.profile.filter(p => p.type === 'string' && p.uniqueCount < 20).map(p => p.name);

  if (numericCols.length === 0 || catCols.length === 0) {
    return (
        <div className="col-span-2 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <BarChart className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Insufficient data for auto-visualization.</p>
            <p className="text-sm text-slate-400 mt-2">Need at least one numeric column and one categorical column (with &lt; 20 unique values).</p>
        </div>
    );
  }

  // Helper to aggregate data for charts
  const getAggData = (catCol: string, numCol: string) => {
     const counts: {[key:string]: number} = {};
     dataset.rows.forEach(r => {
         const key = r[catCol] || 'Unknown';
         const val = Number(r[numCol]) || 0;
         counts[key] = (counts[key] || 0) + val;
     });
     return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 10);
  };

  const chartData1 = getAggData(catCols[0], numericCols[0]);
  const chartData2 = numericCols.length > 1 ? getAggData(catCols[0], numericCols[1]) : chartData1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
      
      {/* Bar Chart */}
      <ChartCard 
        title="Distribution Analysis" 
        desc={`Sum of ${numericCols[0]} by ${catCols[0]}`}
        chartId="chart-bar"
      >
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData1}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                />
                <Bar dataKey="value" fill="url(#colorGradient)" radius={[6, 6, 0, 0]}>
                    {chartData1.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Area Chart */}
      <ChartCard 
        title="Trend Overview" 
        desc={`Area view of ${numericCols[0]}`}
        chartId="chart-area"
      >
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData1}>
                <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Pie Chart */}
      <ChartCard 
        title="Composition" 
        desc={`Share of ${numericCols[0]}`}
        chartId="chart-pie"
      >
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData1}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {chartData1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
      </ChartCard>

       {/* Scatter Chart (Simulated) */}
      <ChartCard 
        title="Correlation" 
        desc={`${numericCols[0]} vs ${numericCols[1] || numericCols[0]}`}
        chartId="chart-scatter"
      >
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="value" name={numericCols[0]} unit="" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="value" name={numericCols[1] || numericCols[0]} unit="" tick={{fontSize: 11, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Scatter name="Data Point" data={chartData2} fill="#8884d8">
                    {chartData2.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
};