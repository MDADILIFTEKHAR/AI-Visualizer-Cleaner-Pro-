
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, Mail, User, Eye, EyeOff, CheckCircle, MailCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { sendWelcomeEmail } from '../services/email';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successStep, setSuccessStep] = useState<'none' | 'email-sent'>('none');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name) return;
    
    setIsLoading(true);

    if (isSignUp) {
        // Simulate Sign Up Flow with Email Trigger
        await sendWelcomeEmail(email, name);
        setIsLoading(false);
        setSuccessStep('email-sent');
        
        // Redirect after showing success message
        setTimeout(() => {
             const finalName = name;
             onLogin({
                name: finalName.charAt(0).toUpperCase() + finalName.slice(1),
                email,
                plan: 'Free'
            });
        }, 2500);
    } else {
        // Simulate Sign In Flow
        setTimeout(() => {
            const finalName = name || email.split('@')[0];
            onLogin({
                name: finalName.charAt(0).toUpperCase() + finalName.slice(1),
                email,
                plan: 'Free'
            });
        }, 1500);
    }
  };

  const toggleMode = () => {
      setIsSignUp(!isSignUp);
      setName('');
      setEmail('');
      setPassword('');
      setSuccessStep('none');
  };

  if (successStep === 'email-sent') {
      return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 z-[-1] animate-gradient-xy bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"></div>
             <div className="w-full max-w-md p-8 relative z-10 animate-in zoom-in-95 duration-500">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/40 animate-bounce">
                        <MailCheck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold text-white mb-2">Welcome Aboard!</h2>
                    <p className="text-indigo-100 mb-6">
                        We've sent a welcome email to <span className="font-bold text-white">{email}</span>.
                    </p>
                    <div className="flex justify-center">
                        <div className="h-1 w-12 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-indigo-300 mt-8">Redirecting to your workspace...</p>
                </div>
             </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-[-1] animate-gradient-xy bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 z-[-1] opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-40 animate-blob"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-md p-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 transform transition-all hover:scale-[1.01] duration-500">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-white mb-2">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </h1>
                    <p className="text-indigo-200 text-sm">
                        {isSignUp ? "Join the AI-powered data revolution" : "Sign in to access your AI workspace"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Name Field - Only for Sign Up */}
                    {isSignUp && (
                        <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                            <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    required={isSignUp}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300 group-focus-within:text-white transition-colors" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-indigo-300 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isSignUp ? "Creating Account..." : "Signing In..."}
                            </>
                        ) : (
                            <>
                                {isSignUp ? "Get Started" : "Sign In"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-indigo-200 text-sm">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <button 
                            onClick={toggleMode}
                            className="ml-2 font-bold text-white hover:text-indigo-300 transition-colors underline decoration-indigo-500/50 underline-offset-4 hover:decoration-indigo-300"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
            
            <p className="text-center text-white/20 text-xs mt-8">
                &copy; 2024 AI Visualizer Pro. All rights reserved.
            </p>
        </div>
    </div>
  );
};
