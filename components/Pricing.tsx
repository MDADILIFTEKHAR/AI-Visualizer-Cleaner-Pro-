
import React from 'react';
import { CheckCircle, Zap, Shield, Crown } from 'lucide-react';
import { Card, Button, Badge } from './ui';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingProps {
  onUpgrade: (plan: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onUpgrade }) => {
  
  const handlePayment = (planName: string, amount: number) => {
    const options = {
      key: "rzp_test_placeholder_key", // In production, this comes from env
      amount: amount * 100, // Amount in cents
      currency: "USD",
      name: "AI Visualizer Pro",
      description: `${planName} Subscription`,
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      handler: function (response: any) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        onUpgrade(planName === 'Pro' ? 'Pro' : 'Enterprise');
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#4F46E5"
      }
    };

    if (window.Razorpay) {
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
          alert(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();
    } else {
      // Fallback if Razorpay script didn't load (or for demo purposes)
      console.warn("Razorpay SDK not loaded. Simulating success.");
      setTimeout(() => {
          alert("Simulating Razorpay Payment Success...");
          onUpgrade(planName === 'Pro' ? 'Pro' : 'Enterprise');
      }, 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-heading font-bold text-slate-800 mb-4">Upgrade to Pro Power</h2>
        <p className="text-slate-500 text-lg">
          Unlock unlimited datasets, advanced AI cleaning models, and 4K visualizations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Free Plan */}
        <Card className="relative p-8 flex flex-col border border-slate-200">
          <div className="mb-4">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Starter</span>
             <h3 className="text-3xl font-bold text-slate-800 mt-2">Free</h3>
             <p className="text-slate-400 text-sm mt-1">Forever free</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-indigo-500" /> 10MB File Limit</li>
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-indigo-500" /> Basic Cleaning</li>
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-indigo-500" /> 3 Charts per project</li>
          </ul>
          <Button variant="secondary" className="w-full" disabled>Current Plan</Button>
        </Card>

        {/* Pro Plan - $20/Year */}
        <Card className="relative p-8 flex flex-col border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
              POPULAR
          </div>
          <div className="mb-4">
             <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                 <Zap className="w-4 h-4" /> Pro
             </span>
             <h3 className="text-3xl font-bold text-slate-800 mt-2">$20<span className="text-lg text-slate-400 font-normal"> / year</span></h3>
             <p className="text-slate-400 text-sm mt-1">Billed annually</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-indigo-500" /> 1GB File Limit</li>
            <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-indigo-500" /> Advanced AI Cleaning</li>
            <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-indigo-500" /> Unlimited Charts</li>
            <li className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle className="w-5 h-5 text-indigo-500" /> Priority Support</li>
          </ul>
          <Button 
            onClick={() => handlePayment('Pro', 20)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
          >
            Upgrade to Pro
          </Button>
        </Card>

        {/* Pro+ Plan - $50/5 Years */}
        <Card className="relative p-8 flex flex-col border border-purple-200 bg-gradient-to-b from-purple-50/50 to-white">
          <div className="mb-4">
             <span className="text-sm font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                 <Crown className="w-4 h-4" /> Pro+ Lifetime Deal
             </span>
             <h3 className="text-3xl font-bold text-slate-800 mt-2">$50<span className="text-lg text-slate-400 font-normal"> / 5 years</span></h3>
             <p className="text-emerald-600 text-sm mt-1 font-bold">Best Value (Save 50%)</p>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-purple-500" /> Everything in Pro</li>
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-purple-500" /> 10GB File Limit</li>
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-purple-500" /> API Access</li>
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-purple-500" /> Custom AI Models</li>
            <li className="flex items-center gap-3 text-slate-600"><CheckCircle className="w-5 h-5 text-purple-500" /> Early Access features</li>
          </ul>
          <Button 
             onClick={() => handlePayment('Pro Plus', 50)}
             className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
          >
            Get Pro+ Access
          </Button>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto mt-16 p-8 bg-white/50 backdrop-blur rounded-3xl border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                  <Shield className="w-10 h-10 text-emerald-500" />
                  <div>
                      <h4 className="font-bold text-slate-800">Secure Payment via Razorpay</h4>
                      <p className="text-sm text-slate-500">We do not store your credit card details. All transactions are encrypted.</p>
                  </div>
              </div>
              <div className="flex gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                   {/* Payment Icons Placeholder */}
                   <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="Visa" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
              </div>
          </div>
      </div>
    </div>
  );
};
