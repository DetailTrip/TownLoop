import Hero from '@/components/layout/Hero';
import UpcomingEvents from '@/components/events/UpcomingEvents';
import CommunityHub from '@/components/community/CommunityHub';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <UpcomingEvents />
      <CommunityHub />
      {/* The rest of the homepage modules will go here */}
    </main>
  );
}
