
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AppView, DataSet, PivotConfig, UserProfile } from './types';
import { parseFile, cleanMissingValues, generatePivotTable, removeDuplicates } from './utils/data';
import { Button, Card, Badge } from './components/ui';
import { UploadCloud, FileType, AlertTriangle, CheckCircle, Table, ArrowRight, Bot, Sparkles, XCircle, ChevronRight, Zap, Database } from 'lucide-react';
import { ChatDrawer } from './components/ChatDrawer';
import { VizGallery } from './components/Charts';
import { MapViewer } from './components/Map';
import { LoginPage } from './components/Login';
import { Pricing } from './components/Pricing';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.UPLOAD);
  const [dataset, setDataset] = useState<DataSet | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pivotConfig, setPivotConfig] = useState<PivotConfig>({ rows: [], columns: [], values: [] });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const data = await parseFile(e.target.files[0]);
        setDataset(data);
        setCurrentView(AppView.CLEAN);
      } catch (err) {
        console.error(err);
        alert("Failed to parse file.");
      }
    }
  };

  const handleClean = (column: string) => {
      if (!dataset) return;
      const cleaned = cleanMissingValues(dataset, column, 'mean');
      setDataset(cleaned);
  };

  const handleRemoveDuplicates = () => {
      if (!dataset) return;
      const cleaned = removeDuplicates(dataset);
      setDataset(cleaned);
  };

  const handleUpgrade = (plan: string) => {
      if(user) {
          setUser({ ...user, plan: plan as any });
      }
      alert(`Successfully upgraded to ${plan}!`);
  };

  // Login Handler
  if (!user) {
      return <LoginPage onLogin={setUser} />;
  }

  // --- Render Views ---

  const renderUpload = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-[40%] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-2xl w-full">
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 shadow-sm text-sm font-medium text-slate-600 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI-Powered Data Platform v2.0</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 leading-tight">
                Data Science,<br/>Democratized.
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                Welcome, {user.name.split(' ')[0]}. Upload your CSV or Excel files. Experience automated cleaning, intelligent pivots, and stunning visualizations generated in seconds.
            </p>
          </div>

          <label className="group block w-full relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/80 backdrop-blur-xl p-12 rounded-[1.8rem] border-2 border-dashed border-indigo-100 hover:border-indigo-400 transition-all duration-300 cursor-pointer shadow-2xl shadow-indigo-500/10 group-hover:-translate-y-1">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
                <UploadCloud className="w-10 h-10 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Drop your dataset here</h3>
                <p className="text-slate-400 mb-8">or click to browse local files</p>
                
                <div className="flex justify-center gap-6">
                    <Badge color="blue">CSV</Badge>
                    <Badge color="green">EXCEL</Badge>
                    <Badge color="yellow">XLSX</Badge>
                </div>
            </div>
            <input 
                type="file" 
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
            />
          </label>

          <div className="mt-12 grid grid-cols-3 gap-8 text-left max-w-lg mx-auto opacity-70">
              <div>
                  <h4 className="font-bold text-slate-800">Auto-Clean</h4>
                  <p className="text-xs text-slate-500 mt-1">AI fixes missing values & types</p>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800">Smart Pivot</h4>
                  <p className="text-xs text-slate-500 mt-1">Drag & drop analysis builder</p>
              </div>
              <div>
                  <h4 className="font-bold text-slate-800">Visuals</h4>
                  <p className="text-xs text-slate-500 mt-1">Instant charts & exports</p>
              </div>
          </div>
      </div>
    </div>
  );

  const renderClean = () => {
    if (!dataset) return null;
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200/60">
          <div>
            <h2 className="text-3xl font-heading font-bold text-slate-800">Cleaning Studio</h2>
            <p className="text-slate-500 mt-1">Review detected anomalies and apply AI-driven fixes.</p>
          </div>
          <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsChatOpen(true)}>
                  <Bot className="w-4 h-4" /> Ask Assistant
              </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
                {dataset.issues.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-16 bg-emerald-50/50 border-emerald-100 text-center">
                         <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="w-10 h-10" />
                         </div>
                         <h3 className="text-2xl font-bold text-emerald-900 mb-2">Immaculate Data!</h3>
                         <p className="text-emerald-700 max-w-md">Our algorithms couldn't find any missing values, duplicates, or formatting errors. You are ready to visualize.</p>
                         <Button className="mt-8 bg-emerald-600 hover:bg-emerald-700" onClick={() => setCurrentView(AppView.VISUALIZE)}>
                             Go to Visuals <ArrowRight className="w-4 h-4" />
                         </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                <span>Detected Issues ({dataset.issues.length})</span>
                            </h3>
                        </div>
                        {dataset.issues.map((issue) => (
                            <Card key={issue.id} className="group relative overflow-hidden border-l-[6px] border-l-orange-400 pl-6">
                                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white via-white to-transparent z-10 hidden sm:block"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-20">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-heading font-bold text-lg text-slate-800 tracking-tight">{issue.type.toUpperCase()}</span>
                                            <Badge color={issue.severity === 'high' ? 'red' : 'yellow'}>{issue.severity}</Badge>
                                        </div>
                                        <p className="text-slate-600 max-w-md">{issue.description}</p>
                                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-medium">
                                            <span>Affects {issue.affectedRows.length} rows</span>
                                            <span>•</span>
                                            <span>ID: {issue.id}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                                         {issue.column && (
                                             <Button onClick={() => handleClean(issue.column!)} variant="primary" className="w-full sm:w-auto justify-between group-hover:scale-105">
                                                 <span>Auto-Fix</span> <Zap className="w-4 h-4 fill-white" />
                                             </Button>
                                         )}
                                         {issue.type === 'duplicate' && (
                                             <Button onClick={handleRemoveDuplicates} variant="primary" className="w-full sm:w-auto">
                                                 <span>Remove All</span> <XCircle className="w-4 h-4" />
                                             </Button>
                                         )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <Card className="bg-slate-900 text-white border-slate-800">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-white">Data Health Score</h3>
                            <p className="text-slate-400 text-sm">Real-time quality metric</p>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                        </div>
                    </div>
                    
                    <div className="relative pt-2">
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-5xl font-heading font-bold text-white">
                                {(100 - (dataset.issues.filter(i => i.type === 'missing').length / (dataset.columns.length || 1) * 10)).toFixed(0)}
                            </span>
                            <span className="text-xl text-slate-400 mb-1">/ 100</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000" 
                                style={{ width: `${(100 - (dataset.issues.filter(i => i.type === 'missing').length / (dataset.columns.length || 1) * 10))}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800">
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Rows</p>
                             <p className="text-2xl font-bold text-white mt-1">{dataset.rows.length.toLocaleString()}</p>
                         </div>
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Columns</p>
                             <p className="text-2xl font-bold text-white mt-1">{dataset.columns.length}</p>
                         </div>
                    </div>
                </Card>

                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
                     <h3 className="font-bold text-lg mb-2">Need Insights?</h3>
                     <p className="text-indigo-100 text-sm mb-4">Our AI can generate a summary report of this dataset in seconds.</p>
                     <Button className="w-full bg-white/20 hover:bg-white/30 border-none text-white justify-between" onClick={() => setIsChatOpen(true)}>
                         <span>Generate Report</span>
                         <ChevronRight className="w-4 h-4" />
                     </Button>
                </div>
            </div>
        </div>
        
        {/* Data Preview Table */}
        <Card noPadding className="overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <Table className="w-4 h-4 text-slate-400" /> 
                     Raw Data Preview
                 </h3>
                 <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">Showing first 10 rows</span>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-600">
                     <thead className="bg-slate-50/50 text-slate-800 font-semibold text-xs uppercase tracking-wider">
                         <tr>
                             {dataset.columns.map(col => (
                                 <th key={col} className="px-6 py-4 whitespace-nowrap border-b border-slate-200/60 first:pl-8">{col}</th>
                             ))}
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {dataset.rows.slice(0, 10).map((row, i) => (
                             <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                                 {dataset.columns.map(col => (
                                     <td key={`${i}-${col}`} className="px-6 py-3 whitespace-nowrap max-w-xs truncate first:pl-8 group-hover:text-indigo-900">
                                         {row[col]?.toString() || <span className="text-slate-300 italic">null</span>}
                                     </td>
                                 ))}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </Card>
      </div>
    );
  };

  const renderPivot = () => {
     if (!dataset) return null;
     
     const pivotData = pivotConfig.rows.length > 0 && pivotConfig.columns.length > 0 
        ? generatePivotTable(dataset.rows, pivotConfig) 
        : null;

     return (
        <div className="space-y-6 h-full flex flex-col animate-in slide-in-from-bottom-4 duration-500">
           <header>
              <h2 className="text-3xl font-heading font-bold text-slate-800">Pivot Studio</h2>
              <p className="text-slate-500 mt-1">Drag and drop fields to slice and dice your data.</p>
           </header>
           
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[500px]">
               <Card className="lg:col-span-1 flex flex-col gap-6 h-full">
                   <div>
                       <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                           <Database className="w-3 h-3" /> Available Fields
                       </h4>
                       <div className="space-y-2 max-h-[300px] overflow-y-auto glass-scroll pr-2">
                           {dataset.columns.map(col => (
                               <div key={col} className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/10 transition-all flex items-center gap-2 group">
                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors"></div>
                                   {col}
                               </div>
                           ))}
                       </div>
                   </div>
                   
                   <div className="space-y-5 pt-6 border-t border-slate-100">
                       <div className="space-y-2">
                           <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Rows</h4>
                           <select 
                             className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                             onChange={(e) => setPivotConfig({...pivotConfig, rows: [e.target.value]})}
                             value={pivotConfig.rows[0] || ''}
                           >
                               <option value="">Select Row Source...</option>
                               {dataset.columns.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                       </div>
                       <div className="space-y-2">
                           <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Columns</h4>
                            <select 
                             className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                             onChange={(e) => setPivotConfig({...pivotConfig, columns: [e.target.value]})}
                             value={pivotConfig.columns[0] || ''}
                           >
                               <option value="">Select Column Source...</option>
                               {dataset.columns.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                       </div>
                        <div className="space-y-2">
                           <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Values (Sum)</h4>
                            <select 
                             className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                             onChange={(e) => setPivotConfig({...pivotConfig, values: [{ field: e.target.value, agg: 'sum'}]})}
                             value={pivotConfig.values[0]?.field || ''}
                           >
                               <option value="">Select Value Field...</option>
                               {dataset.columns.filter(c => dataset.profile.find(p => p.name === c)?.type === 'number').map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                       </div>
                   </div>
               </Card>
               
               <Card noPadding className="lg:col-span-3 overflow-hidden bg-white/50 flex flex-col relative min-h-[400px]">
                   {pivotData ? (
                       <div className="overflow-auto glass-scroll h-full">
                        <table className="min-w-full text-sm">
                           <thead>
                               <tr>
                                   <th className="p-4 bg-slate-50/80 backdrop-blur font-bold text-left text-indigo-900 border-b border-r border-slate-200 sticky top-0 left-0 z-20">
                                       {pivotConfig.rows[0]} <span className="text-slate-400 mx-1">\</span> {pivotConfig.columns[0]}
                                   </th>
                                   {Object.keys(pivotData[Object.keys(pivotData)[0]]).map(colKey => (
                                       <th key={colKey} className="p-4 bg-slate-50/80 backdrop-blur font-bold text-right text-slate-700 border-b border-slate-200 sticky top-0 z-10 min-w-[100px]">
                                           {colKey}
                                       </th>
                                   ))}
                               </tr>
                           </thead>
                           <tbody>
                               {Object.keys(pivotData).map((rowKey, idx) => (
                                   <tr key={rowKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                                       <td className="p-4 border-r border-slate-100 font-medium text-slate-800 sticky left-0 bg-inherit z-10">{rowKey}</td>
                                       {Object.keys(pivotData[rowKey]).map(colKey => (
                                           <td key={colKey} className="p-4 text-right text-slate-600 font-mono">
                                               {pivotData[rowKey][colKey].sum.toLocaleString()}
                                           </td>
                                       ))}
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                       </div>
                   ) : (
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                           <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 opacity-50">
                                <Table className="w-10 h-10 text-slate-400" />
                           </div>
                           <p className="text-lg font-medium text-slate-500">Pivot Table Empty</p>
                           <p className="text-sm">Select a Row, Column, and Value field to generate.</p>
                       </div>
                   )}
               </Card>
           </div>
        </div>
     );
  };

  return (
    <Layout 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        user={user}
    >
      {!dataset && currentView !== AppView.UPLOAD && currentView !== AppView.PRICING ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p className="mb-4">No dataset loaded.</p>
              <Button onClick={() => setCurrentView(AppView.UPLOAD)}>Go to Upload</Button>
          </div>
      ) : (
          <>
            {currentView === AppView.UPLOAD && renderUpload()}
            {currentView === AppView.CLEAN && renderClean()}
            {currentView === AppView.PIVOT && renderPivot()}
            {currentView === AppView.VISUALIZE && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <header className="flex justify-between items-end border-b border-slate-200/60 pb-6">
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-slate-800">Visualization Gallery</h2>
                            <p className="text-slate-500 mt-1">Auto-generated insights and charts.</p>
                        </div>
                        <Button onClick={() => setIsChatOpen(true)} variant="secondary" className="shadow-sm">
                            <Sparkles className="w-4 h-4 mr-2 text-indigo-500" /> Explain with AI
                        </Button>
                    </header>
                    <VizGallery dataset={dataset!} />
                </div>
            )}
            {currentView === AppView.MAP && (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    <header className="border-b border-slate-200/60 pb-6">
                        <h2 className="text-3xl font-heading font-bold text-slate-800">Geospatial Analysis</h2>
                        <p className="text-slate-500 mt-1">Map your data points.</p>
                    </header>
                    <MapViewer dataset={dataset!} />
                </div>
            )}
             {currentView === AppView.API && (
                 <div className="space-y-6 animate-in fade-in duration-500">
                     <header className="border-b border-slate-200/60 pb-6"><h2 className="text-3xl font-heading font-bold text-slate-800">API Connect</h2></header>
                     <Card>
                         <h3 className="font-bold text-lg text-slate-800 mb-4">Developer Endpoint</h3>
                         <div className="bg-slate-900 text-emerald-400 p-6 rounded-2xl font-mono text-sm mb-6 shadow-inner border border-slate-800 relative group">
                             <span className="text-purple-400">GET</span> https://api.aivisualizer.com/v1/datasets/{'{id}'}/export
                             <Button variant="ghost" className="absolute right-2 top-2 text-slate-500 hover:text-white">Copy</Button>
                         </div>
                         <Button>Generate API Key</Button>
                     </Card>
                 </div>
            )}
            {currentView === AppView.PRICING && (
                <Pricing onUpgrade={handleUpgrade} />
            )}
          </>
      )}

      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        dataset={dataset} 
      />
    </Layout>
  );
}
