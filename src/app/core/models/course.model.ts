export interface Course {
id?: number;
  title: string;
  description: string;
  image_url?: string;
  price?: number;
  quota?: number;
  startDate?: string;
  endDate?: string;
  hours?: number;
  modalidad?: string;
  status?: string;
  isActive?: boolean;
  teacher_id?: number;
  category_id?: number;
  categoryTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  title: string;
}

export interface CourseResponse {
  courses: Course[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}


