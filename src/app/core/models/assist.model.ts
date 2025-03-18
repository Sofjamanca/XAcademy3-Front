export interface Assist {
    id: number;
    class_id: number;
    student_id: number;
    attendance: boolean;
    created_at: Date;
    updated_at: Date;
    // Propiedades alternativas que vienen de la API
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

