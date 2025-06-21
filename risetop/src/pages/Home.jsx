import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const [showOptions, setShowOptions] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1018] via-[#0c1123] to-[#08101f] text-white font-sans">
      {/* Hero Text */}
      <main className="text-center mt-24 px-6">
        <p className="uppercase text-sm tracking-widest text-blue-400 font-medium mb-3">Design To Code Copilot</p>
        <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Welcome To My Website <br />
          <span className="text-blue-400">Pengecekan Jawabann dari Soal Riset Operasi</span>
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">Production Ready Frontend Pages in minutes using Figma Designs or Screenshots.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg" onClick={() => setShowOptions(true)}>
          Get Started →
        </button>
      </main>
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
      <div className="flex flex-col items-center text-center mt-24 px-6">
        <div className="grid grid-cols-2 gap-4 text-5xl md:text-6xl font-bold leading-tight mb-6">
          <div className="text-blue-400">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">Pengecekan Jawaban</h2>
            <p className="text-gray-300 text-xl"> Membantu mahasiswa untuk mengerjakan soal untuk matakuliah Riset Operasi</p>
          </div>
          <div className="text-blue-400 flex items-center justify-center">
            <video
              src="/src/assets/32d2a8ea7cf9093439b10bfa40a101d0.mp4"
              className="w-full h-160 rounded-lg shadow-lg"
              autoPlay
              loop
              muted
            ></video>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
