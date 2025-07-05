import { notFound } from 'next/navigation';
import EventDetail from '@/components/events/EventDetail';
import Breadcrumb from '@/components/layout/Breadcrumb';

interface EventDetailPageProps {
  params: {
    eventId: string;
  };
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  // You could fetch the event title here for proper SEO
  // For now, using generic metadata
  return {
    title: 'Event Details - TownLoop',
    description: 'View event details and information',
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-4 pb-2">
        <Breadcrumb eventTitle="Loading..." />
      </div>
      <EventDetail eventId={params.eventId} />
    </main>
  );
}
