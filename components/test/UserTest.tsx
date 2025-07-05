'use client';

import { useUser } from '@/lib/context/UserContext';

export default function UserTest() {
  const { user, loading } = useUser();
  
  return (
    <div>
      <p>User test: {loading ? 'Loading...' : (user ? user.email : 'No user')}</p>
    </div>
  );
}
