'use client';

import { usePathname } from 'next/navigation';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="md:ml-56 min-h-screen bg-gray-50 pb-16 md:pb-0">
      {children}
    </div>
  );
}
