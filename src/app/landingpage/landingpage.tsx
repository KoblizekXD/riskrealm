'use client';

export default function LandingPage() {
    return (
        <div className="h-screen md:min-h-screen lg:bg-black from-[#1e1e2e] to-[#181825] bg-gradient-to-br text-[#cdd6f4] flex flex-col overflow-hidden">
            <header className="h-20 bg-[#151520] shadow-lg flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="text-lg md:text-2xl font-bold text-white">Risk Realm</div>
                </div>
                <nav className="flex items-center space-x-3 md:space-x-6">
                    <button className="text-white text-sm md:text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">
                        Home
                    </button>
                    <button className="text-white text-sm md:text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">
                        Games
                    </button>
                    <button className="text-white text-sm md:text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">
                        About Us
                    </button>
                </nav>
                <div>
                    <button className="bg-lime-500 text-black font-semibold py-1 px-3 md:px-4 rounded hover:bg-lime-400 cursor-pointer hover:scale-110 transition transform">
                        Sign In
                    </button>
                </div>
            </header>

            <main className="relative flex-grow p-4 md:p-8 flex flex-col items-center overflow-y-auto">
                <h1 className="text-4xl md:text-8xl font-extrabold bg-gradient-to-r from-[#7e02bc]  via-[#B200D8] to-[#D600F0] text-transparent bg-clip-text mb-4 pt-6 md:pt-10">
                    Welcome to Risk Realm
                </h1>

                <p className="text-base md:text-2xl text-center mb-4 md:mb-8 max-w-3xl bg-gradient-to-r from-[#6eff26] to-[#1fb20c] text-transparent bg-clip-text font-semibold">
                    Your One-Stop Destination for Thrilling Games and Big Wins
                </p>

                <p className="text-gray-300 text-sm md:text-lg text-center mb-4 md:mb-8 max-w-3xl">
                    At Risk Realm, we bring the excitement of the casino floor right to your fingertips. Whether you’re a seasoned player or a casual gamer, we’ve got something for everyone:
                </p>

                <div className="flex space-x-2 md:space-x-4">
                    <button className="bg-lime-500 text-black font-semibold py-2 px-4 md:px-6 rounded-xl shadow-lg hover:bg-lime-400 cursor-pointer hover:scale-110 transition transform">
                        Play Now
                    </button>
                    <button className="bg-gray-800 border border-lime-500 text-lime-500 font-semibold py-2 px-4 md:px-6 rounded-xl shadow-lg hover:bg-gray-700 cursor-pointer hover:scale-110 transition transform">
                        Learn More
                    </button>
                </div>

                <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-xl shadow-lg hover:scale-105 transition transform cursor-pointer text-center">
                        <h3 className="text-lg md:text-2xl font-bold text-lime-400 mb-2">🎰 Slots 🎰</h3>
                        <p className="text-gray-300 text-sm md:text-base">
                            Spin the reels on our wide selection of classic and modern slot games!
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-xl shadow-lg hover:scale-105 transition transform cursor-pointer text-center">
                        <h3 className="text-lg md:text-2xl font-bold text-purple-400 mb-2">🃏 Cards 🃏</h3>
                        <p className="text-gray-300 text-sm md:text-base">
                            Test your skills and strategies in thrilling card games with competitive odds!
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-xl shadow-lg hover:scale-105 transition transform cursor-pointer text-center">
                        <h3 className="text-lg md:text-2xl font-bold text-blue-400 mb-2">💰🧰 Cases 🧰💰</h3>
                        <p className="text-gray-300 text-sm md:text-base">
                            Open cases, win big, and feel the adrenaline rush of every drop!
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-xl shadow-lg hover:scale-105 transition transform cursor-pointer text-center">
                        <h3 className="text-lg md:text-2xl font-bold text-yellow-400 mb-2">💰🎁 Bonus 🎁💰</h3>
                        <p className="text-gray-300 text-sm md:text-base">
                            Gamble and login every day to gain maximum bonus!
                        </p>
                    </div>
                </div>

                <h1 className="mt-8 text-xl md:text-2xl text-center mb-4 max-w-3xl bg-gradient-to-r from-[#6eff26] to-[#1fb20c] text-transparent bg-clip-text font-semibold">
                    Why Choose Risk Realm?
                </h1>

                <h2 className="text-lg md:text-xl text-yellow-300">💎 Exclusive Bonuses & Promotions 💎</h2>
                <p className="text-gray-300 text-center max-w-3xl text-xs md:text-sm mb-4">
                    Get rewarded with generous welcome bonuses, free spins, and exciting offers.
                </p>
                <h2 className="text-lg md:text-xl text-yellow-300">📱 Play Anywhere, Anytime 📱</h2>
                <p className="text-gray-300 text-center max-w-3xl text-xs md:text-sm mb-4">
                    Enjoy seamless gaming on any device—desktop, tablet, or mobile.
                </p>
                <h2 className="text-lg md:text-xl text-yellow-300">🌟 24/7 Support 🌟</h2>
                <p className="text-gray-300 text-center max-w-3xl text-xs md:text-sm">
                    Our dedicated support team is here to help, no matter the time.
                </p>
            </main>

            <footer className="h-16 flex items-center justify-center border-t border-gray-800 bg-[#181825]">
                <p className="text-gray-400 text-xs md:text-sm">
                    © 2025 Risk Realm. All Rights Reserved. Gamble until zero.
                </p>
            </footer>
        </div>
    );
}
