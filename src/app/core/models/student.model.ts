import { User } from "./user.model";

export interface Student {
    id: number;
    name: string;
    email: string;
    inscription_id?: number;
    user_id?: number;
    student_id?: number;
    studentCondition?: string;
    payment_status?: string;
    qualification?: string | number | null;
    attendance?: {
      present: boolean;
      date: string;
      classId?: number;
    }[];
    payments?: {
      amount: number;
      date: string;
      status: 'paid' | 'pending' | 'overdue';
    }[];
  }

  export interface StudentData {
    id: number;
    user_id: number;
    course_id: number;
    qualification: string | null;
    studentCondition: string;
    payment_status: string;
    createdAt: string;
    updatedAt: string;
    user: User;
  }
  