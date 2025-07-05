import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { UserProvider } from '@/lib/context/UserContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TownLoop",
  description: "The heartbeat of Cochrane District.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}