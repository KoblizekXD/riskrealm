'use client';

export default function LandingPage() {
    return (
        <div className="h-screen lg:bg-black from-[#1e1e2e] to-[#181825] bg-linear-to-br text-[#cdd6f4] flex flex-col">
            <header className="h-16 bg-[#151520] shadow-lg flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-white">Risk Realm</div>
                </div>
                <nav className="flex items-center space-x-6">
                    <button className="text-white text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">Home</button>
                    <button className="text-white text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">Games</button>
                    <button className="text-white text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">About Us</button>
                </nav>
                <div>
                    <button className="bg-lime-500 text-black font-semibold py-1 px-4 rounded hover:bg-lime-400 cursor-pointer hover:scale-110 transition transform"
                        onClick={() => {}}>                    
                        Sign In
                    </button>
                </div>
            </header>

            <main className="relative flex-grow p-8 flex flex-col items-center">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-lime-400 to-cyan-400 text-transparent bg-clip-text mb-2 pt-14">
                    Welcome to Risk Realm
                </h1>
                <p className="text-gray-300 text-lg text-center mb-8 max-w-3xl">
                    Lets go gamble!!!
                </p>
                <div className="flex space-x-4">
                    <button className="bg-lime-500 text-black font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-lime-400 cursor-pointer hover:scale-110 transition transform"
                    onClick={() => {}}>
                  
                        Play Now
                    </button>
                    <button className="bg-gray-800 border border-lime-500 text-lime-500 font-semibold py-2 px-6 rounded-xl shadow-lg hover:bg-gray-700 cursor-pointer hover:scale-110 transition transform"
                    onClick={() => {}}>
                        Learn More
                    </button>
                </div>
              
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:scale-110 transition transform cursor-pointer text-center">
                        <h3 className="text-2xl font-bold text-lime-400 mb-2">🎰 Slots 🎰</h3>
                        <p className="text-gray-300">Spin and Win! Try our best paying slots!</p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:scale-110 transition transform cursor-pointer text-center">
                        <h3 className="text-2xl font-bold text-purple-400 mb-2">🃏 Cards 🃏</h3>
                        <p className="text-gray-300">Test your skill against best players in Blackjack and Poker!</p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg hover:scale-110 transition transform cursor-pointer text-center">
                        <h3 className="text-2xl font-bold text-yellow-400 mb-2">💰🎁 Bonus 💰🎁</h3>
                        <p className="text-gray-300">Gamble and login everyday to gain maximum bonus!</p>
                    </div>
                </div>
            </main>

            <footer className="h-20 flex items-center justify-center border-t border-gray-800 bg-[#181825]">
                <p className="text-gray-400 text-sm">© 2025 Risk Realm. All Rights Reserved. Gamble until zero.</p>
            </footer>
        </div>
    );
}
