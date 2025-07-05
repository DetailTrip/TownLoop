import Image from 'next/image';
import Link from 'next/link';

const spotlightEvent = {
  title: 'The Annual Cochrane Polar Bear Dip',
  description: "Join hundreds of brave souls for the annual tradition. All proceeds support the local food bank. It's the coolest event of the year!",
  imageUrl: 'https://picsum.photos/id/241/800/600',
  link: '#',
};

export default function EditorialSpotlight() {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64">
        <Image src={spotlightEvent.imageUrl} width={700} height={256} alt={spotlightEvent.title} className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-white text-2xl font-bold">{spotlightEvent.title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-700 mb-4">{spotlightEvent.description}</p>
        <Link href={spotlightEvent.link} className="font-bold text-blue-600 hover:underline">
          Learn More &rarr;
        </Link>
      </div>
    </div>
  );
}
