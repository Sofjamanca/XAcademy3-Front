export interface Payment {
    id: number;
    course_id: number;
    student_id: number;
    price: number;
    status: string;
    created_at: Date;
    updated_at: Date;
}
