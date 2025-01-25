'use client';

export default function LandingPage() {
    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <header className="h-16 bg-gradient-to-r from-lime-600 to-cyan-600 shadow-lg flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-white">Risk Realm</div>
                </div>
                <nav className="flex items-center space-x-6">
                    <button className="text-white text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">Home</button>
                    <button className="text-white text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">Games</button>
                    <button className="text-white text-lg hover:text-lime-400 hover:scale-115 transition transform cursor-pointer">About Us</button>
                </nav>
                <div>
                    <button className="bg-lime-500 text-black font-semibold py-1 px-4 rounded hover:bg-lime-400 cursor-pointer"
                        onClick={() => {}}>                    
                        Sign In
                    </button>
                </div>
            </header>

            <main className="relative flex-grow p-8 flex flex-col items-center justify-center">
                
            </main>

            <footer className="h-20 flex items-center justify-center border-t border-gray-800">
                <p className="text-gray-400 text-sm">© 2025 Risk Realm. All Rights Reserved. Gamble until zero.</p>
            </footer>
        </div>
    );
}
