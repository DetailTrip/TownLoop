import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { UserProvider } from '@/lib/context/UserContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TownLoop",
  description: "The heartbeat of Cochrane District. Discover local events, connect with your community, and never miss what's happening in Timmins, Kapuskasing & beyond.",
  keywords: "local events, community, Timmins, Kapuskasing, Cochrane District, Ontario events",
  authors: [{ name: "TownLoop" }],
  openGraph: {
    title: "TownLoop - The Heartbeat of Cochrane District",
    description: "Your guide to local events and community happenings",
    type: "website",
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#3B82F6',
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