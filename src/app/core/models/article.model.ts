export interface Article {
  id: number;
  title: string;
  description: string;
  content?: string;
  image?: string;
  image_url?: string;
  status?: string;
  user_id: number;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    id: number;
    name: string;
    lastname?: string;
    email?: string;
  };
} 