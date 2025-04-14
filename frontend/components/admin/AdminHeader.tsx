import React from 'react';
import Image from "next/image";
import dseu from "@/public/dseulogo.png";

const AdminHeader: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-white p-1.5 sm:p-3 rounded-full">
              <Image
                src={dseu}
                alt="DSEU Logo"
                width={40}
                height={40}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
            </div>
            <h1 className="text-base sm:text-xl font-bold truncate">
              Admin Student Result Portal
            </h1>
          </div>

          <button className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors">
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
