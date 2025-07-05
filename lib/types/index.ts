export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  tags: string[];
  town: string;
}

export interface Flyer {
  id: number;
  url: string;
  alt: string;
  link: string;
  town?: string;
  title?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  // Add more user properties as needed
}

export interface Town {
  slug: string;
  name: string;
  // Add more town properties as needed
}
