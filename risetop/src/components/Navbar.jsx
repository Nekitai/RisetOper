import React from "react";

// Mock Link component for demo purposes
const Link = ({ to, children, className, onClick }) => (
  <a href={to} className={className} onClick={onClick}>
    {children}
  </a>
);

function Navbar() {
  const [showOptions, setShowOptions] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="flex justify-between items-center px-4 md:px-8 py-5 bg-gradient-to-br from-[#0e1018] via-[#0c1123] to-[#08101f] fixed top-0 left-0 w-full z-50 shadow-lg">
      {/* Logo */}
      <a href="/">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Riset Operasi</h1>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <Link to="/" className="text-white hover:text-blue-400 transition-colors">Home</Link>
        <Link to="LPmin" className="text-white hover:text-blue-400 transition-colors">Program Linear Min</Link>
        <Link to="LPmax" className="text-white hover:text-blue-400 transition-colors">Program Linear Max</Link>
        <Link to="BiayaT" className="text-white hover:text-blue-400 transition-colors">Biaya Transportasi</Link>
      </nav>

      {/* Desktop Get Started Button */}
      <div className="hidden md:block">
        <button 
          className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-blue-300 transition-colors" 
          onClick={() => setShowOptions(true)}
        >
          Get Started
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0e1018] border-t border-gray-700 shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              to="/" 
              className="text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="LPmin" 
              className="text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Program Linear Min
            </Link>
            <Link 
              to="LPmax" 
              className="text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Program Linear Max
            </Link>
            <Link 
              to="BiayaT" 
              className="text-white hover:text-blue-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Biaya Transportasi
            </Link>
            <button 
              className="mt-4 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-blue-300 transition-colors w-full"
              onClick={() => {
                setShowOptions(true);
                setMobileMenuOpen(false);
              }}
            >
              Get Started
            </button>
          </nav>
        </div>
      )}

      {/* Modal Options */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181c2a] rounded-lg p-6 md:p-8 shadow-xl w-full max-w-md">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-white">Pilih yang ingin dikerjakan:</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/LPmin">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => setShowOptions(false)}
                  >
                    Program Linear Min
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/LPmax">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => setShowOptions(false)}
                  >
                    Program Linear Max
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/BiayaT">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => setShowOptions(false)}
                  >
                    Biaya Transportasi
                  </button>
                </Link>
              </li>
            </ul>
            <button 
              className="mt-6 text-gray-400 hover:text-white text-sm transition-colors" 
              onClick={() => setShowOptions(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;