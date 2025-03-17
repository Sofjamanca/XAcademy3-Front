import { StudentData } from "./student.model";

export interface Inscription {
    id: number;
    course_id: number;
    student_id: number;
    regirationDate: string;
    createdAt: string;
    updatedAt: string;
    student: StudentData;
  }