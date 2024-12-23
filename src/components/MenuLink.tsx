"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuLink = ({ item }: { item: { title: string; path: string; icon: React.ReactNode } }) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;

  return (
    <Link
      href={item.path}
      className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg mb-1 transition-colors ${
        isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600"
      }`}
    >
      <div className={`text-xl ${isActive ? "text-indigo-600" : "text-gray-400"}`}>
        {item.icon}
      </div>
      <span className={`text-sm hidden lg:block ${isActive ? "font-medium" : ""}`}>
        {item.title}
      </span>
    </Link>
  );
};

export default MenuLink;
