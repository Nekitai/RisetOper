import React from "react";

function Footer() {
  return (
    <>
      <footer className="grid grid-cols-2 bg-[#0c1123] text-gray-400 py-6 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm mb-2">Follow us on:</p>
          <div className="flex justify-center space-x-6">
            <ul>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fab fa-twitter"></i> twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-xl">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="container mx-auto px-6 text-center">
          <p className="text-sm mb-2">© 2023 Riset Operasi. All rights reserved.</p>
          <p className="text-xs">Made by Fajar</p>
      </div>
    </>
  );
}
export default Footer;
