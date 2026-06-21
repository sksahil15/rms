'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Truck, Plus, LogOut, Search, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  if (pathname === '/' || loading) return null;

  const isActive = (path) => path !== '/' && pathname?.startsWith(path);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Distribution', path: '/distribution', icon: Truck },
    { label: 'Add Family', path: '/family/add', icon: Plus },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 h-screen bg-gray-50 border-r border-gray-200 fixed left-0 top-0 z-50 overflow-y-auto">
        {/* User / Brand */}
        <div className="px-3 pt-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">{userInitial}</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm truncate">{userName}</span>
            <ChevronDown size={14} className="text-gray-400 flex-shrink-0 ml-auto" />
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-400">Search...</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-white shadow-sm text-gray-900 border border-gray-200'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <Icon
                  size={16}
                  className={active ? 'text-blue-600' : 'text-gray-400'}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-gray-200 space-y-1">
          <div className="px-3 py-1.5 text-xs text-gray-500 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={15} className="text-gray-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-50 flex items-end px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex-1 flex flex-col items-center gap-1 pt-2 pb-3 transition-colors relative ${
                active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
              )}
              <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
              <span className={`text-[10px] font-semibold ${active ? 'text-blue-600' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center gap-1 pt-2 pb-3 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={22} strokeWidth={1.75} />
          <span className="text-[10px] font-semibold">Logout</span>
        </button>
      </nav>
    </>
  );
}
