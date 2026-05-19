export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  _id: string;
  user: string;
  caption: string;
  image?: string;
  scheduledTime: string;
  status: 'scheduled' | 'published';
  createdAt: string;
}