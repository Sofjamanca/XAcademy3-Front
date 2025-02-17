export interface Course {
  id?: number;
  title: string;
  description: string;
  image?: string;
  price: number;
  quota?: number;
  startDate?: Date;
  endDate?: Date;
  hours?: number;
  createAt?: Date;
  updatedAt: string;
}
