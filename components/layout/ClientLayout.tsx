'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileFloatingAction from '@/components/layout/MobileFloatingAction';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <MobileFloatingAction />
    </div>
  );
}
