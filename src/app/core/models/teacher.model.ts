interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  dni: string | null;
  uuid: string;
  userRole: string;
  birthday: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

import { Course } from './course.model';

export interface Teacher {
  id: number;
  user_id: number;
  specialty: string;
  user: User;
  courses: Course[];
}