
import React, { useState } from 'react';
import { LayoutDashboard, Table, Wand2, BarChart3, Map, Database, FileUp, Settings, Menu, X, Bot, Sparkles, LogOut, CreditCard } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  user: UserProfile;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onToggleChat, isChatOpen, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: AppView.UPLOAD, icon: FileUp, label: 'Upload Data' },
    { id: AppView.CLEAN, icon: Wand2, label: 'Cleaning Studio' },
    { id: AppView.PIVOT, icon: Table, label: 'Pivot Studio' },
    { id: AppView.VISUALIZE, icon: BarChart3, label: 'Visual Gallery' },
    { id: AppView.MAP, icon: Map, label: 'Geo Maps' },
    { id: AppView.API, icon: Database, label: 'API Connect' },
    { id: AppView.PRICING, icon: CreditCard, label: 'Plans & Billing' },
  ];

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200 blur-[100px]" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-[280px] m-4 mr-0 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-4 h-4" />
             </div>
             <h1 className="text-xl font-heading font-bold text-slate-800 tracking-tight">
                AI Visualizer
             </h1>
          </div>
          <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 ml-10">PRO+ EDITION</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`relative flex items-center w-full px-5 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-900'
              }`}
            >
              {currentView === item.id && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-r-full" />
              )}
              <item.icon className={`w-5 h-5 mr-3.5 transition-colors ${currentView === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className={`font-medium ${currentView === item.id ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors cursor-pointer group relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
               <span className="font-bold text-slate-600">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{user.plan.toUpperCase()} PLAN</p>
            </div>
            <Settings className="w-4 h-4 ml-auto text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
             </div>
             <h1 className="text-lg font-heading font-bold text-slate-800">AI Visualizer</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={onToggleChat} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                <Bot className="w-6 h-6" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-50 p-6 animate-in slide-in-from-right">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-heading font-bold text-slate-800">Navigation</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-600" /></button>
                </div>
                <div className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { onChangeView(item.id); setIsMobileMenuOpen(false); }}
                            className="flex items-center w-full p-4 rounded-xl bg-slate-50 active:scale-95 transition-transform"
                        >
                            <item.icon className="w-6 h-6 mr-4 text-indigo-600" />
                            <span className="text-lg font-medium text-slate-800">{item.label}</span>
                        </button>
                    ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="flex-1 overflow-y-auto glass-scroll p-4 md:p-8 relative">
            {children}
        </div>
        
        {/* Floating AI Trigger (Desktop) */}
        {!isChatOpen && (
            <button 
                onClick={onToggleChat}
                className="hidden md:flex absolute bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-indigo-500/25 transition-all duration-300 items-center gap-3 group z-30 border border-slate-700"
            >
                <div className="relative">
                    <Bot className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-slate-900 animate-pulse" />
                </div>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
                    Ask AI Assistant
                </span>
            </button>
        )}
      </main>
    </div>
  );
};
