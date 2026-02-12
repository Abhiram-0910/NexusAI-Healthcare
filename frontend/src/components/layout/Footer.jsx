import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white mt-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <p>&copy; 2024 Seva AI • AI Healthcare Hackathon</p>
        <p className="text-[11px]">
          Multi-modal diagnosis • Explainable • Fair • Works on low-resource devices
        </p>
      </div>
    </footer>
  );
};

export default Footer;

