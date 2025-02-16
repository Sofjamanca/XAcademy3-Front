export interface Course {
  id?: number;
  title: string;
  description: string;
  image_url?: string;
  price?: number;
  quota?: number;
  startDate?: Date;
  endDate?: Date;
  hours?: number;
  modalidad?: string;
  status?: string;
  teacher_id?: number;
  category_id?: number
  createAt?: Date;
  updateAt?: Date;
}

export interface Category {
  id?: number;
  title: string;
}


