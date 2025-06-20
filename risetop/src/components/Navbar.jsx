import React from "react";

function Navbar() {
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-gradient-to-br from-[#0e1018] via-[#0c1123] to-[#08101f]">
      <h1 className="text-2xl font-bold tracking-tight">Riset Operasi</h1>
      <nav className="space-x-6 text-sm font-medium">
        <a href="#" className="hover:text-blue-400">Program Linear Min</a>
        <a href="#" className="hover:text-blue-400">Program Linear Max</a>
        <a href="#" className="hover:text-blue-400">Barat Laut</a>
        <a href="#" className="hover:text-blue-400">Biaya Terendah</a>
        <a href="#" className="hover:text-blue-400">Vogel</a>
      </nav>
      <div className="space-x-3">
        <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-blue-300">Get Started</button>
      </div>
    </header>
  );
}

export default Navbar;
