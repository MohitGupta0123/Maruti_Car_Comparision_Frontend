// src/components/Header.tsx
import React from 'react';
import logo from '../Images/amlgolabslogowhite.png'; // adjust path if needed

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-300 border-b border-slate-200 h-16 flex items-center px-4 md:px-8 sticky top-0 z-30 shadow-lg">
      
      {/* LEFT SIDE: LOGO + TITLE */}
      <div className="flex items-center gap-3">

        {/* White Logo Card */}
        <div className="bg-white rounded-xl px-3 py-1 shadow flex items-center justify-center">
          <div className="h-10 w-32 overflow-hidden flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full object-cover object-center"
            />
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold text-black">
            Automobile Comparison Platform
          </h1>
          <span className="text-xs text-black">
            Compare variants side-by-side in seconds
          </span>
        </div>

      </div>

      {/* RIGHT SIDE: HELP BUTTON */}
      {/* <div className="ml-auto">
        <button className="inline-flex items-center px-4 py-1.5 text-xs md:text-sm font-medium rounded-full border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 hover:text-blue-700 transition-colors">
          Help
        </button>
      </div> */}

    </header>
  );
};

export default Header;

