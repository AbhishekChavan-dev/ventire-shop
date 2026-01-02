import React, { useState, useEffect } from 'react';

const AnimatedBanner = () => {
    const [step, setStep] = useState(0);
    const [cycle, setCycle] = useState(0);
    // 🟢 FIX 1: Ensure coupon state is defined to prevent "ReferenceError"
    const [coupon, setCoupon] = useState({ code: "WELCOME10", discount: "10%" });
    useEffect(() => {
        // 1. Fetch dynamic coupon from your API
        const fetchPromotion = async () => {
            try {
                const res = await fetch('/api/get-promotion'); // Create this endpoint
                const data = await res.json();
                if (data.success) setCoupon(data.data);
            } catch (err) {
                console.error("Banner fetch failed, using fallback");
            }
        };
        fetchPromotion();
    }, []);

    useEffect(() => {
        // Timings for 4 stages (Total 13s loop)
        const t1 = setTimeout(() => setStep(1), 3000); // Respire
        const t2 = setTimeout(() => setStep(2), 6000); // Aspire
        const t3 = setTimeout(() => setStep(3), 9500); // Ventire
        const reset = setTimeout(() => {
            setStep(0);
            setCycle(c => c + 1);
        }, 13000);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(reset); };
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
                {/* Stage 3: Coupon (Safety checks added) */}
                {step === 3 && coupon && (
                    <div className="absolute flex flex-col items-center animate-coupon-pop">
                        <span className="text-[9px] text-emerald-400 tracking-widest uppercase mb-0.5">Limited Offer</span>
                        <div className="flex items-center gap-2">
                            {/* Use ?. to safely access properties */}
                            <span className="text-white font-bold text-xs">{coupon?.discount} OFF</span>
                            <span className="h-3 w-[1px] bg-white/20"></span>
                            <span className="text-emerald-300 font-mono font-bold px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10 text-xs">
                                {coupon?.code}
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