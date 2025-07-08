import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [showOptions, setShowOptions] = React.useState(false);
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-gradient-to-br from-[#0e1018] via-[#0c1123] to-[#08101f] fixed top-0 left-0 w-full z-50 shadow-lg">
      <a href="/"><h1 className="text-2xl font-bold tracking-tight">Riset Operasi</h1></a>
      <nav className="space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        <Link to="LPmin" className="hover:text-blue-400">Program Linear Min</Link>
        <Link to="LPmax" className="hover:text-blue-400">Program Linear Max</Link>
        <Link to="BiayaT" className="hover:text-blue-400">Biaya Transportasi</Link>
        
      </nav>
      <div className="space-x-3">
        <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-blue-300" onClick={() => setShowOptions(true)}>Get Started</button>
      </div>
      {showOptions && (
              <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#181c2a] rounded-lg p-8 shadow-xl w-full max-w-md">
                  <h3 className="text-xl font-bold mb-4">Pilih yang ingin dikerjakan:</h3>
                  <ul className="space-y-4">
                    <li>
                      <Link to="/LPmin"><button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">Program Linear Min</button></Link>
                    </li>
                    <li>
                      <Link to="/LPmax"><button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">Program Linear Max</button></Link>
                    </li>
                    <li>
                      <Link to="/BiayaT"><button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">Biaya Transportasi</button></Link>
                    </li>
                  </ul>
                  <button className="mt-6 text-gray-400 hover:text-white text-sm" onClick={() => setShowOptions(false)}>
                    Tutup
                  </button>
                </div>
              </div>
            )}
    </header>
  );
}

export default Navbar;
