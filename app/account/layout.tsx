import React from 'react';

// This layout component is needed for the route group to work.
// It will eventually contain a shared sidebar for account pages.
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
