'use client';

export default function HomePage() {
    return (
        <div className="bg-black min-h-screen flex flex-col">
        
            <header className="h-16 bg-lime-600 flex items-center justify-center">
                <h1 className="text-white text-xl">menu? logo? account...</h1>
            </header>

            
            <main className="flex-1 bg-gray-900 text-white flex items-center justify-center">

                
            </main>

       
            <footer className=" bg-cyan-500 flex items-center justify-center">
                <p className="text-center text-xl">
                    © 2025 Your Company Name. All rights reserved. This website is intended for informational purposes only. 
                    By using this site, you agree to our Terms of Service and Privacy Policy. For inquiries, please contact 
                    us at support@yourcompany.com or call us at (123) 456-7890. Follow us on social media: 
                    <a href="#" className="underline">Facebook</a>, <a href="#" className="underline">Twitter</a>, 
                    <a href="#" className="underline">Instagram</a>. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vivamus venenatis, lacus nec placerat tempus, nisl sapien viverra urna, non facilisis justo odio a urna. 
                    Suspendisse id nisi ut sapien ultricies laoreet. Aenean vehicula feugiat velit, sed aliquam nulla iaculis id. 
                    Phasellus scelerisque purus ut turpis tincidunt, id fermentum velit fermentum. Proin tincidunt, ex non 
                    viverra vulputate, quam eros gravida nulla, sit amet pellentesque libero augue at justo. Donec ut venenatis elit.
                </p>
            </footer>

          
            <nav className="h-16 bg-red-700 flex items-center justify-center bottom-0 sticky">
                <h1 className="text-white text-xl">home ... bonus ... games?</h1>
            </nav>
        </div>
    );
}
