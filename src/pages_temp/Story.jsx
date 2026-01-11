import React from 'react';
import { Link } from 'react-router-dom'; // 🟢 ADD THIS IMPORT

const Story = () => {
    return (
        <div className="bg-white text-gray-900">
            {/* Hero Section */}
            <section className="py-24 px-6 max-w-5xl mx-auto text-center">
                <h2 className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-6">Ventire — Brand Story</h2>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                    Air is invisible, but its impact on our lives is <span className="text-blue-500">profound.</span>
                </h1>
                <p className="text-xl text-gray-500 italic">Every breath shapes how we feel, think, and live.</p>
            </section>

            {/* Main Narrative */}
            <section className="py-16 px-6 max-w-4xl mx-auto space-y-12 text-lg leading-relaxed text-gray-700">
                <div className="border-l-4 border-blue-500 pl-8">
                    <p className="text-2xl font-medium text-gray-900">
                        VENTIRE was born from a simple belief: Clean air should not be a luxury — it should be a standard.
                    </p>
                </div>

                <p>
                    As cities grow, pollution increases, and indoor spaces become more enclosed, the air we breathe indoors is often more harmful than what we face outside. Yet most people never see it, never measure it, and never question it.
                </p>

                <p className="text-3xl font-bold text-gray-900 text-center py-8">We did.</p>

                <p>
                    VENTIRE exists to bring purity, intelligence, and trust back into the air around you. By combining advanced filtration, precision engineering, and thoughtful design, we create air purification systems that work quietly, efficiently, and beautifully — protecting your health without disrupting your life.
                </p>

                <div className="grid md:grid-cols-2 gap-8 py-12">
                    <img src="/Performance.jpg" alt="Ventire Performance" className="rounded-2xl shadow-lg" />
                    <img src="/3 level filter details.jpg" alt="Filter Details" className="rounded-2xl shadow-lg" />
                </div>

                <p>
                    Our products are designed not just to clean the air, but to understand it. From fine particles to allergens and odors, VENTIRE continuously adapts to your environment, ensuring that every breath you take is cleaner than the last.
                </p>

                <p className="text-center font-semibold text-gray-900">
                    We believe technology should feel human.
                </p>

                <p>
                    That’s why VENTIRE is built to be intuitive, reliable, and seamlessly integrated into modern living.
                    Because when the air is clean, everything feels lighter — your mind, your body, your home.
                </p>
            </section>

            {/* Footer Branding */}
            <section className="py-24 bg-gray-50 text-center">
                <h3 className="text-3xl font-bold mb-4">VENTIRE. Breathe Pure. Live Better.</h3>
                {/* 🟢 CHANGE THIS FROM <button> TO <Link> */}
                <Link
                    to="/shop"
                    className="inline-block bg-blue-600 text-white px-10 py-3 rounded-full hover:bg-blue-700 transition shadow-lg"
                >
                    Shop the Collection
                </Link>
            </section>
        </div>
    );
};

export default Story;