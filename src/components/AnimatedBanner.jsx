import React, { useState, useEffect } from 'react';

const AnimatedBanner = () => {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    // Timings: Respire (0-2.5s), Aspire (2.5-5s), Ventire (5-8s)
    const timer1 = setTimeout(() => setStep(1), 2500);
    const timer2 = setTimeout(() => setStep(2), 5000);
    const resetTimer = setTimeout(() => {
      setStep(0);
      setCycle(c => c + 1); // Reset the loop
    }, 8500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(resetTimer);
    };
  }, [cycle]);

  return (
    <div className="relative w-full h-10 overflow-hidden flex items-center justify-center z-[60] shadow-sm">
      {/* 🟢 AESTHETIC BACKGROUND: Deep Emerald Mesh Gradient */}
      <div className="absolute inset-0 bg-[#062c1e]">
        <div className="absolute inset-0 opacity-30 animate-pulse-slow bg-[radial-gradient(circle_at_50%_50%,#10b981,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <div className="relative w-full max-w-xs h-full flex items-center justify-center" key={cycle}>
        
        {/* Stage 0: RESPIRE */}
        {step === 0 && (
          <span className="absolute text-emerald-50 tracking-[0.4em] uppercase text-[10px] sm:text-xs font-medium animate-respire">
            Respire
          </span>
        )}

        {/* Stage 1: ASPIRE */}
        {step === 1 && (
          <span className="absolute text-emerald-50 tracking-[0.4em] uppercase text-[10px] sm:text-xs font-medium animate-aspire">
            Aspire
          </span>
        )}

        {/* Stage 2: VENTIRE */}
        {step === 2 && (
          <div className="relative animate-ventire-appear flex items-center justify-center">
            <span className="text-white tracking-[0.6em] uppercase text-sm sm:text-base font-black italic drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              Ventire
            </span>
            {/* Wind Streaks */}
            <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-wind-streak"></div>
          </div>
        )}
        {/* Stage 3: DYNAMIC COUPON */}
        {step === 3 && (
          <div className="absolute flex flex-col items-center animate-coupon-pop">
            <span className="text-[10px] text-emerald-400 tracking-widest uppercase mb-0.5">Special Offer</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-normal">{coupon.discount} OFF</span>
              <span className="h-4 w-[1px] bg-white/20"></span>
              <span className="text-emerald-300 font-mono font-bold px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10">
                {coupon.code}
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes respire {
           0% { opacity: 0; transform: translateY(15px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; filter: blur(0px); }
          100% { opacity: 0; filter: blur(10px); transform: scale(1.3); }
        }
        @keyframes aspire {
          0% { opacity: 0; transform: translateY(15px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; filter: blur(0px); }
          100% { opacity: 0; filter: blur(10px); transform: scale(1.3); }
        }
        @keyframes ventire-appear {
          0% { opacity: 0; filter: blur(15px); letter-spacing: 1.5em; }
          20% { opacity: 1; filter: blur(0px); letter-spacing: 0.6em; }
          85% { opacity: 1; filter: blur(0px); }
          100% { opacity: 0; filter: blur(5px); }
        }
        @keyframes wind-streak {
          0% { transform: translateX(-100%) scaleX(0.1); }
          50% { transform: translateX(0%) scaleX(1.5); }
          100% { transform: translateX(100%) scaleX(0.1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes coupon-pop {
          0% { opacity: 0; transform: scale(0.9); }
          15% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); filter: blur(5px); }
        }
        
        .animate-respire { animation: respire 2.5s ease-in-out forwards; }
        .animate-aspire { animation: aspire 2.5s ease-in-out forwards; }
        .animate-ventire-appear { animation: ventire-appear 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-wind-streak { animation: wind-streak 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-coupon-pop { animation: coupon-pop 3.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AnimatedBanner;