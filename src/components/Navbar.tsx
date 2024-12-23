"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { MdOutlineSettings, MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 relative">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="" width={14} height={14} />
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src="/message.png" alt="" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src="/announcement.png" alt="" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">Administrateur</span>
            <span className="text-[10px] text-gray-500 text-right">
              Admin
            </span>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <Image 
              src="/avatar.png" 
              alt="Avatar" 
              width={36} 
              height={36} 
              className="object-cover"
            />
          </div>
        </div>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div className="absolute top-full right-4 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <Link 
              href="/profile" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <CgProfile className="text-lg" />
              <span>Profil</span>
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <MdOutlineSettings className="text-lg" />
              <span>Paramètres</span>
            </Link>
            <div className="h-[1px] bg-gray-200 my-2" />
            <button 
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              onClick={() => {
                // Ajoutez ici la logique de déconnexion
                console.log("Déconnexion");
              }}
            >
              <MdLogout className="text-lg" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
