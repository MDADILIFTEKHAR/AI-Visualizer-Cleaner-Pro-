import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { streamChat } from '../services/gemini';
import { DataSet, ChatMessage } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: DataSet | null;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, dataset }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: "Hello! I'm your data assistant. Upload a file, and I can help you clean, analyze, or visualize it.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let currentResponse = "";
      const stream = streamChat(messages.map(m => ({role: m.role, content: m.content})), input, dataset);
      
      // Placeholder for streaming
      setMessages(prev => [...prev, { id: 'temp-ai', role: 'model', content: '', timestamp: Date.now() }]);

      for await (const chunk of stream) {
        currentResponse += chunk;
        setMessages(prev => prev.map(m => m.id === 'temp-ai' ? { ...m, content: currentResponse } : m));
      }
      
      // Finalize ID
      setMessages(prev => prev.map(m => m.id === 'temp-ai' ? { ...m, id: Date.now().toString() } : m));

    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: "Sorry, I encountered an error.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-center gap-2 text-indigo-700">
          <Bot className="w-5 h-5" />
          <span className="font-bold">AI Assistant</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
            }`}>
              {msg.role === 'model' && <Sparkles className="w-4 h-4 text-indigo-400 mb-1" />}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
               <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
               <span className="text-xs text-slate-400">Thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask to clean data, analyze trends..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Quick Prompts */}
        {dataset && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button onClick={() => setInput("Show me 5 insights")} className="whitespace-nowrap px-3 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full hover:bg-indigo-100 transition-colors">
                    ✨ 5 Insights
                </button>
                <button onClick={() => setInput("Fix missing values")} className="whitespace-nowrap px-3 py-1 bg-teal-50 text-teal-600 text-xs rounded-full hover:bg-teal-100 transition-colors">
                    🔧 Fix Missing
                </button>
                 <button onClick={() => setInput("Create a pivot table")} className="whitespace-nowrap px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full hover:bg-purple-100 transition-colors">
                    📊 Pivot
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
